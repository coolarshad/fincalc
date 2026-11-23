import json
from functools import lru_cache
from pathlib import Path

from django.db import models
from django.utils.html import strip_tags
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail import blocks

from .blocks import (
    FormulaBlock,
    WorkedExampleBlock,
    ComparisonTableBlock,
    FAQBlock,
    ExpertReviewBlock,
    KeyTakeawaysBlock,
    SourcesBlock,
)


CALCULATOR_CHOICES = [
    # Finance
    ('loan', 'Loan EMI Calculator'),
    ('mortgage', 'Mortgage & Home Loan Calculator'),
    ('sip', 'SIP (Systematic Investment Plan) Calculator'),
    ('fd', 'Fixed Deposit (FD) Calculator'),
    ('investment', 'Investment & Compound Growth Calculator'),
    ('interest', 'Simple & Compound Interest Calculator'),
    ('cagr', 'CAGR (Compound Annual Growth Rate) Calculator'),
    ('salary', 'Salary & Hourly Wage Calculator'),
    ('inflation', 'Inflation & Purchasing Power Calculator'),
    ('credit_card', 'Credit Card Payoff Calculator'),
    ('currency', 'Currency & Purchasing Power Calculator'),
    ('gst', 'GST & Sales Tax Calculator'),
    ('loan_eligibility', 'Loan Eligibility & DTI Calculator'),
    
    # Business
    ('margin', 'Profit Margin & Markup Calculator'),
    ('break_even', 'Break-Even Analysis Calculator'),
    ('cash_flow', 'Cash Flow & Working Capital Calculator'),
    
    # Health
    ('bmi', 'BMI (Body Mass Index) Calculator'),
    ('calorie', 'Calorie & TDEE Calculator'),
    ('body_fat', 'Body Fat Percentage (US Navy) Calculator'),
    ('pregnancy', 'Pregnancy Due Date & Milestone Calculator'),
]


HEALTH_TYPES = ['bmi', 'calorie', 'body_fat', 'pregnancy']
BUSINESS_TYPES = ['margin', 'break_even', 'cash_flow', 'gst']

# India-specific tools show rupees; everything else shows dollars.
INR_TYPES = ['gst', 'sip', 'fd']

_DEFAULTS_PATH = Path(__file__).with_name('default_results.json')


@lru_cache(maxsize=1)
def load_default_results():
    """Engine output for each tool's default inputs (see snapshot_results command)."""
    try:
        return json.loads(_DEFAULTS_PATH.read_text(encoding='utf-8'))
    except FileNotFoundError:
        return {}


class CalculatorPage(Page):
    """
    High-Performance Calculator Page Model with StreamField CMS support
    and automated JSON-LD structured schema.
    """
    calculator_type = models.CharField(
        max_length=50,
        choices=CALCULATOR_CHOICES,
        default='loan',
        help_text="Selects the interactive calculation engine and UI controls."
    )
    badge_tag = models.CharField(
        max_length=50,
        default="Popular",
        help_text="Badge label (e.g. Popular, Financial, Health, Essential)"
    )
    short_summary = models.TextField(
        help_text="1-2 sentence description shown in category listings, search, and meta description."
    )
    
    intro_question = models.CharField(
        max_length=160, blank=True,
        help_text='Question-style H2 shown above the calculator, e.g. "What is a mortgage calculator?"'
    )
    intro_answer = RichTextField(
        blank=True,
        help_text="40-60 word direct answer shown under the intro question (featured-snippet target)."
    )

    # Author / E-E-A-T credentials for Google
    author_name = models.CharField(max_length=100, default="FinanceToolsLab.com")
    author_role = models.CharField(max_length=150, default="Publisher")
    last_updated_date = models.DateField(auto_now=True)

    # Modular editorial content for ranking & indexing
    body = StreamField([
        ('rich_text', blocks.RichTextBlock(icon="pilcrow")),
        ('formula', FormulaBlock()),
        ('worked_example', WorkedExampleBlock()),
        ('comparison_table', ComparisonTableBlock()),
        ('faqs', FAQBlock()),
        ('expert_review', ExpertReviewBlock()),
        ('key_takeaways', KeyTakeawaysBlock()),
        ('sources', SourcesBlock()),
    ], use_json_field=True, blank=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('calculator_type'),
            FieldPanel('badge_tag'),
            FieldPanel('short_summary'),
        ], heading="Calculator Configuration"),
        MultiFieldPanel([
            FieldPanel('intro_question'),
            FieldPanel('intro_answer'),
        ], heading="Direct Answer (snippet target)"),
        MultiFieldPanel([
            FieldPanel('author_name'),
            FieldPanel('author_role'),
        ], heading="Author / E-E-A-T Metadata"),
        FieldPanel('body'),
    ]

    def get_faq_items(self):
        """Extract all FAQ items from StreamField for JSON-LD schema generation."""
        faq_items = []
        for block in self.body:
            if block.block_type == 'faqs':
                for item in block.value.get('faqs', []):
                    q = item.get('question', '')
                    # Extract plain text or rendered HTML string from RichText
                    a = item.get('answer', '')
                    if hasattr(a, 'source'):
                        a = a.source
                    a = strip_tags(str(a)).strip()
                    if q and a:
                        faq_items.append({'question': q, 'answer': a})
        return faq_items

    def get_formula_data(self):
        """Extract formula metadata if present."""
        for block in self.body:
            if block.block_type == 'formula':
                return block.value
        return None

    def get_context(self, request):
        context = super().get_context(request)
        context['faq_items'] = self.get_faq_items()
        context['formula_data'] = self.get_formula_data()
        
        # Get parent category for breadcrumbs & related tools
        parent = self.get_parent().specific
        context['category_page'] = parent
        context['health_types'] = HEALTH_TYPES
        context['currency'] = '₹' if self.calculator_type in INR_TYPES else '$'
        context['defaults'] = load_default_results().get(self.calculator_type, {})
        
        # Related tools in the same category
        context['related_calculators'] = (
            CalculatorPage.objects.child_of(parent)
            .live()
            .exclude(id=self.id)[:6]
        )
        return context

    class Meta:
        verbose_name = "Calculator Page"
        verbose_name_plural = "Calculator Pages"
