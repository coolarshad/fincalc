"""
Apply the SEO / E-E-A-T fixes from the Nov 2026 audit to existing pages.

    python manage.py apply_seo_content            # apply and publish
    python manage.py apply_seo_content --dry-run  # show what would change

Idempotent: it rebuilds each calculator body from the page's current
formula / worked-example blocks plus the data in seo_content.py, so it is
safe to run more than once.
"""
import copy
import datetime

from django.core.management.base import BaseCommand
from django.db import transaction

from calculators.models import CalculatorPage
from categories.models import CategoryIndexPage
from core.models import StandardPage
from home.models import HomePage

from .seo_content import CALCULATORS, CATEGORIES, HOME


OLD_ABOUT_P = '<p>Every equation, from loan amortization to body composition formulas, is reviewed by certified professionals and backed by transparent mathematical steps.</p>'
NEW_ABOUT_P = '<p>Every calculator uses a standard published method, links to its primary source and includes a worked example that we check by hand against the calculator.</p>'


# Seed-era FAQs that are superseded by an audited question or overstate accuracy.
DROP_FAQS = {
    "why is paying only the minimum balance dangerous?",
    "what is a realistic long-term rate of return for stock index funds?",
    "what formula does this calculator use?",
    "how accurate is the us navy circumference method?",
    "what is the mid-market exchange rate?",
    "is fixed deposit interest taxable?",
    "what is the recommended debt-to-income (dti) ratio for mortgage lenders?",
    "why is sip better than lump-sum investing?",
    "why is cagr preferred over average annual return?",
    "how do i calculate gst-inclusive reverse pricing?",
    "what are the standard who bmi categories?",
    "should i choose a 15-year or 30-year mortgage?",
    "is fixed deposit interest subject to taxation?",
    "does bmi distinguish between muscle mass and body fat?",
    "what is the difference between profit margin and markup?",
    "what is the rule of 72 for inflation?",
}


def _unwrap(obj):
    """Strip ListBlock's {"type": "item", "value": ..., "id": ...} wrappers."""
    if isinstance(obj, list):
        return [_unwrap(x) for x in obj]
    if isinstance(obj, dict):
        if set(obj) == {"type", "value", "id"} and obj.get("type") == "item":
            return _unwrap(obj["value"])
        return {k: _unwrap(v) for k, v in obj.items()}
    return obj


def _raw(value):
    """StreamField block value -> plain python (dicts/lists) for re-saving."""
    return _unwrap(value.block.get_prep_value(value)) if hasattr(value, "block") else value


class Command(BaseCommand):
    help = "Apply audited SEO titles, meta descriptions, intro answers, corrected examples, FAQs, tables and sources."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, dry_run=False, **options):
        with transaction.atomic():
            self._home(dry_run)
            self._categories(dry_run)
            self._about(dry_run)
            for slug, data in CALCULATORS.items():
                self._calculator(slug, data, dry_run)
            if dry_run:
                transaction.set_rollback(True)
                self.stdout.write(self.style.WARNING("Dry run: nothing saved."))
            else:
                self.stdout.write(self.style.SUCCESS("SEO content applied and published."))

    # ------------------------------------------------------------------
    def _publish(self, page, dry_run):
        if not dry_run:
            page.save_revision().publish()

    def _home(self, dry_run):
        home = HomePage.objects.first()
        if not home:
            return
        home.seo_title = HOME["seo_title"]
        home.search_description = HOME["search_description"]
        self._publish(home, dry_run)
        self.stdout.write(f"home: {home.seo_title}")

    def _about(self, dry_run):
        page = StandardPage.objects.filter(slug="about").first()
        if not page:
            return
        page.subtitle = "Transparent Formulas, Cited Sources, Free Tools"
        page.seo_title = "About FinanceToolsLab.com: How Our Calculators Are Checked"
        page.search_description = "Who builds FinanceToolsLab.com, how each calculator's formula and worked example are checked, and which primary sources we cite."
        body = []
        for block in page.body:
            val = _raw(block.value)
            if hasattr(val, "source"):
                val = val.source
            if isinstance(val, str):
                val = val.replace(OLD_ABOUT_P, NEW_ABOUT_P)
            body.append((block.block_type, val))
        page.body = body
        self._publish(page, dry_run)
        self.stdout.write("about: removed 'reviewed by certified professionals' claim")

    def _categories(self, dry_run):
        for slug, data in CATEGORIES.items():
            page = CategoryIndexPage.objects.filter(slug=slug).first()
            if not page:
                continue
            page.seo_title = data["seo_title"]
            page.search_description = data["search_description"]
            self._publish(page, dry_run)
            self.stdout.write(f"category {slug}: {page.seo_title}")

    def _calculator(self, slug, data, dry_run):
        page = CalculatorPage.objects.filter(slug=slug).first()
        if not page:
            self.stdout.write(self.style.WARNING(f"missing calculator: {slug}"))
            return
        page = page.get_latest_revision_as_object() if page.has_unpublished_changes else page

        page.seo_title = data["seo_title"]
        page.search_description = data["search_description"]
        if data.get("summary"):
            page.short_summary = data["summary"]
        page.intro_question = data["intro_question"]
        page.intro_answer = data["intro_answer"]
        page.author_name = "FinanceToolsLab Editorial Team"
        page.author_role = "Editorial Team"

        existing = {}
        old_faqs = []
        for block in page.body:
            raw = copy.deepcopy(_raw(block.value))
            if block.block_type == "faqs":
                old_faqs.extend(raw.get("faqs", []))
            elif block.block_type in ("formula", "worked_example"):
                existing.setdefault(block.block_type, raw)

        body = []

        # Formula
        formula = existing.get("formula")
        if formula:
            f = data.get("formula", {})
            if f.get("expression"):
                formula["formula_expression"] = f["expression"]
            if f.get("explanation"):
                formula["explanation"] = f["explanation"]
            if "notes" in f:
                formula["notes"] = f["notes"]
            formula["title"] = "Formula & How It Works"
            for v in formula.get("variables", []):
                if v.get("symbol") in f.get("var_desc", {}):
                    v["description"] = f["var_desc"][v["symbol"]]
            have = {v.get("symbol") for v in formula.get("variables", [])}
            for v in f.get("extra_vars", []):
                if v["symbol"] not in have:
                    formula.setdefault("variables", []).append(v)
            body.append(("formula", formula))

        # Worked example
        example = existing.get("worked_example")
        if example:
            for key, val in data.get("example_patch", {}).items():
                example[key] = val
            example["title"] = f"Worked Example: {page.title}"
            body.append(("worked_example", example))

        # Reference table
        t = data.get("table")
        if t:
            body.append(("comparison_table", {
                "title": t["title"],
                "intro": t.get("intro", ""),
                "headers": t["headers"],
                "rows": [{"column_values": r} for r in t["rows"]],
                "takeaway": t.get("takeaway", ""),
            }))

        # FAQs: keep original questions, replace/append audited ones (dedupe by question)
        faqs = {}
        for item in old_faqs:
            q = item.get("question", "").strip()
            if q and q.lower() not in DROP_FAQS:
                faqs[q.lower()] = {"question": q, "answer": item.get("answer", "")}
        for item in data.get("faqs", []):
            faqs[item["q"].strip().lower()] = {"question": item["q"], "answer": item["a"]}
        body.append(("faqs", {"heading": f"{page.title}: Frequently Asked Questions", "faqs": list(faqs.values())}))

        # Sources
        if data.get("sources"):
            body.append(("sources", {"heading": "Sources & References", "sources": data["sources"]}))

        # Honest review attribution with a real per-page date
        body.append(("expert_review", {
            "reviewer_name": "FinanceToolsLab Editorial Team",
            "reviewer_title": "Editorial Team",
            "reviewer_url": "https://financetoolslab.com/about/",
            "reviewed_date": datetime.date.today(),
            "methodology_note": data["review"],
        }))

        page.body = body
        self._publish(page, dry_run)
        self.stdout.write(f"{slug}: {len(faqs)} FAQs, table={'yes' if t else 'no'}, sources={len(data.get('sources', []))}")
