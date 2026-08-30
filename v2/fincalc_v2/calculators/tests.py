from django.test import TestCase, Client
from django.urls import reverse
from wagtail.models import Page, Site
from home.models import HomePage
from categories.models import CategoryIndexPage
from calculators.models import CalculatorPage


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
        self.assertContains(response, "SoftwareApplication")
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
