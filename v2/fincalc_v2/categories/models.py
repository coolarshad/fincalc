from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel


# Primary sources shown on each hub (title, publisher, url)
HUB_SOURCES = {
    slug: [{'title': t, 'publisher': p, 'url': u} for t, p, u in rows]
    for slug, rows in {
        'finance': [
            ('Owning a Home', 'Consumer Financial Protection Bureau', 'https://www.consumerfinance.gov/owning-a-home/'),
            ('Compound interest calculator', 'Investor.gov (U.S. SEC)', 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator'),
            ('Consumer Price Index', 'U.S. Bureau of Labor Statistics', 'https://www.bls.gov/cpi/'),
        ],
        'health': [
            ('Body mass index', 'World Health Organization', 'https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index'),
            ('Mifflin-St Jeor equation (1990)', 'PubMed', 'https://pubmed.ncbi.nlm.nih.gov/2305711/'),
            ('Methods for Estimating the Due Date', 'American College of Obstetricians and Gynecologists', 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date'),
        ],
        'business': [
            ('Manage your finances', 'U.S. Small Business Administration', 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances'),
            ('GST portal', 'Goods and Services Tax Network (India)', 'https://www.gst.gov.in/'),
        ],
    }.items()
}


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
        context['hub_sources'] = HUB_SOURCES.get(self.slug, [])
        return context

    class Meta:
        verbose_name = "Category Hub Page"
        verbose_name_plural = "Category Hub Pages"
