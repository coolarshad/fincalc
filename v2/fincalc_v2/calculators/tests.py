import shutil
import unittest

from django.test import Client, SimpleTestCase, TestCase
from django.urls import reverse
from wagtail.models import Page, Site
from home.models import HomePage
from categories.models import CategoryIndexPage
from calculators.models import CALCULATOR_CHOICES, CalculatorPage, load_default_results
from core.management.commands.seo_content import CALCULATORS, CATEGORIES, HOME
from core.management.commands.snapshot_results import build_snapshot, run_engine


class CalculatorEngineTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.root_page = Page.objects.get(id=1)

        # Setup Home
        self.home = HomePage(
            title="FinCalc",
            slug="home-test",
            hero_title="Smart Financial Calculators"
        )
        self.root_page.add_child(instance=self.home)

        # Update Default Site to point to self.home
        site = Site.objects.filter(is_default_site=True).first()
        if site:
            site.root_page = self.home
            site.save()
        else:
            Site.objects.create(
                hostname="localhost",
                port=80,
                root_page=self.home,
                is_default_site=True,
                site_name="FinCalc"
            )

        # Setup Category
        self.category = CategoryIndexPage(
            title="Personal Finance",
            slug="finance-test",
            category_slug_name="finance",
            icon_name="banknote",
            badge_color="blue",
            description="Personal finance tools"
        )
        self.home.add_child(instance=self.category)

        # Setup Calculator
        self.calc = CalculatorPage(
            title="Loan Calculator",
            slug="loan-test",
            calculator_type="loan",
            badge_tag="Popular",
            short_summary="Calculate monthly payment and interest",
            body=[
                (
                    "faqs",
                    {
                        "heading": "Frequently Asked Questions",
                        "faqs": [
                            {"question": "How is loan interest calculated?", "answer": "<p>Using standard amortized compound formulas.</p>"}
                        ]
                    }
                )
            ]
        )
        self.category.add_child(instance=self.calc)

    def test_calculator_page_renders_200(self):
        response = self.client.get(self.calc.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Loan Calculator")
        self.assertContains(response, "WebApplication")
        self.assertContains(response, "FAQPage")
        self.assertContains(response, "BreadcrumbList")

    def test_sitemap_renders_200(self):
        response = self.client.get("/sitemap.xml")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["content-type"], "application/xml")

    def test_robots_txt_renders_200(self):
        response = self.client.get("/robots.txt")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "User-agent: *")
        self.assertContains(response, "Sitemap:")


@unittest.skipUnless(shutil.which("node"), "Node.js is needed to run the calculator engine")
class WorkedExampleTests(TestCase):
    """Run the real JS engine with each published example's inputs."""

    # (type, inputs, {result id: value printed on the page})
    CASES = [
        ("loan", {"input-amount": 30000, "input-rate": 6.5, "input-term": 5}, {"res-primary": "$586.98", "res-stat-2": "$5,219.07", "res-stat-3": "$35,219.07"}),
        ("loan", {"input-amount": 30000, "input-rate": 6.5, "input-term": 3}, {"res-primary": "$919.47", "res-stat-2": "$3,100.92"}),
        ("loan", {"input-amount": 30000, "input-rate": 6.5, "input-term": 4}, {"res-primary": "$711.45", "res-stat-2": "$4,149.53"}),
        ("loan", {"input-amount": 30000, "input-rate": 6.5, "input-term": 7}, {"res-primary": "$445.48", "res-stat-2": "$7,420.58"}),
        ("mortgage", {"input-home-price": 400000, "input-down-pct": 20, "input-rate": 6.75, "input-tax": 4800, "input-insurance": 1200, "input-hoa": 0}, {"res-primary": "$2,575.51", "res-stat-1": "$2,075.51"}),
        ("sip", {"input-monthly": 500, "input-rate": 12, "input-years": 15, "input-step-up": 0}, {"res-primary": "₹252,288.00", "res-stat-3": "₹162,288.00"}),
        ("fd", {"input-fd-amount": 25000, "input-fd-rate": 7.25, "input-fd-years": 5, "select-fd-freq": 4}, {"res-primary": "₹35,806.51", "res-stat-2": "₹10,806.51"}),
        ("salary", {"input-wage": 35, "input-hours": 40}, {"res-primary": "$72,800.00", "res-stat-1": "$6,066.67", "res-stat-2": "$2,800.00"}),
        ("interest", {"input-principal": 10000, "input-contrib": 0, "input-rate": 6, "input-years": 5, "select-freq": 12}, {"res-primary": "$13,488.50"}),
        ("interest", {"input-principal": 10000, "input-contrib": 0, "input-rate": 6, "input-years": 5, "select-freq": 4}, {"res-primary": "$13,468.55"}),
        ("interest", {"input-principal": 10000, "input-contrib": 0, "input-rate": 6, "input-years": 5, "select-freq": 1}, {"res-primary": "$13,382.26"}),
        ("investment", {"input-initial": 10000, "input-monthly-inv": 500, "input-inv-years": 20, "input-return-rate": 8, "input-inflation": 0}, {"res-primary": "$343,778.24", "res-stat-3": "$213,778.24"}),
        ("credit_card", {"input-balance": 5000, "input-apr": 21.99, "input-payment": 150}, {"res-primary": "52 Months", "res-stat-2": "$2,795.69"}),
        ("credit_card", {"input-balance": 5000, "input-apr": 21.99, "input-payment": 200}, {"res-primary": "34 Months", "res-stat-2": "$1,748.69"}),
        ("credit_card", {"input-balance": 5000, "input-apr": 21.99, "input-payment": 300}, {"res-primary": "21 Months", "res-stat-2": "$1,021.00"}),
        ("currency", {"input-amount": 1000, "input-rate": 0.92, "input-fee": 0.5}, {"res-primary": "915.40"}),
        ("inflation", {"input-amount": 50000, "input-rate": 3, "input-years": 20}, {"res-primary": "$90,305.56"}),
        ("loan_eligibility", {"select-loan-preset": "custom", "input-income": 8000, "input-existing-debts": 800, "input-foir": 45, "input-elig-rate": 6.5, "input-elig-tenure": 20}, {"res-primary": "$375,550.01", "res-stat-1": "$2,800.00"}),
        ("cagr", {"input-start-val": 20000, "input-end-val": 45000, "input-years": 6}, {"res-primary": "14.47% CAGR", "res-stat-3": "+125.0%"}),
        ("bmi", {"input-height": 175, "input-weight": 72}, {"res-primary": "23.5", "res-stat-2": "56.7 - 76.3 kg", "res-stat-3": "0.94"}),
        ("calorie", {"select-gender": "male", "input-age": 28, "input-height": 178, "input-weight": 78, "select-activity": 1.55}, {"res-primary": "2,724 kcal/day", "res-stat-2": "2,224 kcal"}),
        ("calorie", {"select-gender": "female", "input-age": 30, "input-height": 165, "input-weight": 62, "select-activity": 1.55}, {"res-primary": "2,077 kcal/day", "res-stat-1": "1,340 kcal"}),
        ("body_fat", {"select-gender": "male", "input-height": 180, "input-weight": 80, "input-neck": 38, "input-waist": 84}, {"res-primary": "15.3%", "res-stat-3": "12.3 kg", "res-stat-1": "67.7 kg"}),
        ("pregnancy", {"input-lmp": "2026-01-15", "input-cycle-len": 28}, {"res-primary": "October 22, 2026"}),
        ("pregnancy", {"input-lmp": "2026-01-15", "input-cycle-len": 32}, {"res-primary": "October 26, 2026"}),
        ("margin", {"input-cost": 60, "input-revenue": 100}, {"res-primary": "40.00%", "res-stat-2": "$40.00", "res-stat-3": "66.67%"}),
        ("gst", {"input-amount": 10000, "input-rate": 18}, {"res-primary": "₹11,800.00", "res-stat-2": "₹1,800.00"}),
        ("gst", {"input-amount": 11800, "input-rate": 18, "select-type": "inclusive"}, {"res-stat-1": "₹10,000.00", "res-stat-2": "₹1,800.00"}),
        ("break_even", {"input-fixed-costs": 15000, "input-unit-price": 50, "input-var-cost": 20}, {"res-primary": "500 Units", "res-stat-1": "$25,000.00"}),
        ("cash_flow", {"input-inflows": 45000, "input-operating-exp": 28000, "input-debt-exp": 5000}, {"res-primary": "$12,000.00", "res-stat-2": "$33,000.00"}),
    ]

    def test_every_calculator_has_a_case(self):
        self.assertEqual({c[0] for c in self.CASES}, {t for t, _ in CALCULATOR_CHOICES})

    def test_examples_match_engine(self):
        results = run_engine([(t, i) for t, i, _ in self.CASES])
        for (calc, inputs, expected), res in zip(self.CASES, results):
            with self.subTest(calc=calc, inputs=inputs):
                self.assertEqual({k: res["text"].get(k) for k in expected}, expected)
                self.assertEqual(res["missing"], [], "engine reads ids the template does not have")

    def test_default_results_are_current(self):
        self.assertEqual(load_default_results(), build_snapshot(), "run: manage.py snapshot_results")


class SeoContentTests(SimpleTestCase):
    def test_meta_descriptions_fit(self):
        for group in (CALCULATORS, CATEGORIES, {"home": HOME}):
            for slug, data in group.items():
                with self.subTest(slug=slug):
                    self.assertLessEqual(len(data["search_description"]), 160)
