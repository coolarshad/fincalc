from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail import blocks


class HomePage(Page):
    """
    Homepage for FinCalc v2 platform.
    Fast, mobile-optimized entry point highlighting all category hubs and calculators.
    """
    hero_title = models.CharField(
        max_length=200,
        default="Smart, Accurate & Free Financial Calculators",
        help_text="Primary H1 headline"
    )
    hero_subtitle = models.TextField(
        default="Make informed decisions about loans, mortgages, investments, retirement, and health with instant, expert-verified calculation engines.",
        help_text="Subheading explaining the platform value proposition"
    )

    body = StreamField([
        ('heading', blocks.CharBlock(form_classname="title")),
        ('rich_text', blocks.RichTextBlock()),
        ('faqs', blocks.StructBlock([
            ('heading', blocks.CharBlock(default="Frequently Asked Questions")),
            ('items', blocks.ListBlock(blocks.StructBlock([
                ('question', blocks.CharBlock()),
                ('answer', blocks.RichTextBlock()),
            ]))),
        ])),
    ], use_json_field=True, blank=True)

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_title'),
            FieldPanel('hero_subtitle'),
        ], heading="Hero Section"),
        FieldPanel('body'),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        from categories.models import CategoryIndexPage
        from calculators.models import CalculatorPage

        context['categories'] = CategoryIndexPage.objects.live().order_by('title')
        context['featured_calculators'] = CalculatorPage.objects.live().order_by('title')[:12]
        context['all_calculators'] = CalculatorPage.objects.live().order_by('title')
        return context

    class Meta:
        verbose_name = "Home Page"
