from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel


class CategoryIndexPage(Page):
    """
    Category Hub Page (e.g. /finance/, /health/, /business/)
    Acts as a high-authority topic silo for Google Indexing & Breadcrumbs.
    """
    category_slug_name = models.CharField(
        max_length=50,
        help_text="Machine identifier, e.g. finance, health, business"
    )
    icon_name = models.CharField(
        max_length=50,
        default="trending-up",
        help_text="Lucide icon name (e.g. banknote, heart-pulse, briefcase, percent, scale)"
    )
    badge_color = models.CharField(
        max_length=50,
        default="blue",
        help_text="Accent color theme (blue, emerald, violet, amber, rose, cyan)"
    )
    description = models.TextField(
        help_text="Overview of calculators available in this category for SEO and users."
    )
    detailed_intro = RichTextField(
        blank=True,
        help_text="Comprehensive educational introduction establishing topic authority."
    )

    content_panels = Page.content_panels + [
        FieldPanel('category_slug_name'),
        FieldPanel('icon_name'),
        FieldPanel('badge_color'),
        FieldPanel('description'),
        FieldPanel('detailed_intro'),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        # Fetch all child calculator pages
        from calculators.models import CalculatorPage
        context['calculators'] = CalculatorPage.objects.child_of(self).live().order_by('title')
        return context

    class Meta:
        verbose_name = "Category Hub Page"
        verbose_name_plural = "Category Hub Pages"
