from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.contrib.settings.models import BaseGenericSetting, register_setting
from wagtail import blocks


class StandardPage(Page):
    """
    Standard informational page (About, Contact, Privacy, Terms, Disclaimer)
    """
    subtitle = models.CharField(max_length=255, blank=True, help_text="Short subheading below the title")
    intro = models.TextField(blank=True, help_text="Introductory paragraph")
    body = StreamField([
        ('heading', blocks.CharBlock(form_classname="title", icon="title")),
        ('paragraph', blocks.RichTextBlock(icon="pilcrow")),
        ('faq', blocks.StructBlock([
            ('question', blocks.CharBlock()),
            ('answer', blocks.RichTextBlock()),
        ], icon="help")),
    ], use_json_field=True, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('intro'),
        FieldPanel('body'),
    ]

    def get_template(self, request, *args, **kwargs):
        if self.slug == 'about':
            return "core/about_page.html"
        elif self.slug == 'contact':
            return "core/contact_page.html"
        elif self.slug == 'privacy':
            return "core/privacy_page.html"
        elif self.slug == 'terms':
            return "core/terms_page.html"
        return "core/standard_page.html"

    class Meta:
        verbose_name = "Standard Page"
        verbose_name_plural = "Standard Pages"


@register_setting
class SiteSettings(BaseGenericSetting):
    """
    Global site configuration, SEO defaults, and branding
    """
    site_name = models.CharField(max_length=100, default="FinCalc")
    site_tagline = models.CharField(max_length=255, default="Free Online Financial & Health Calculators")
    site_description = models.TextField(
        default="Access free, accurate, and instant financial, business, and health calculators. Mobile-first, transparent formulas, and expert-reviewed tools."
    )
    contact_email = models.EmailField(blank=True, default="support@fincalc.org")
    google_search_console_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Google Search Console verification meta tag (e.g. google-site-verification token)"
    )
    google_analytics_id = models.CharField(
        max_length=50,
        blank=True,
        help_text="GA4 Measurement ID (e.g. G-XXXXXXXXXX)"
    )
    copyright_text = models.CharField(
        max_length=255,
        default="© 2026 FinCalc. All rights reserved. Calculations are for estimation purposes only."
    )

    panels = [
        MultiFieldPanel([
            FieldPanel('site_name'),
            FieldPanel('site_tagline'),
            FieldPanel('site_description'),
            FieldPanel('contact_email'),
            FieldPanel('copyright_text'),
        ], heading="General Settings"),
        MultiFieldPanel([
            FieldPanel('google_search_console_id'),
            FieldPanel('google_analytics_id'),
        ], heading="SEO & Analytics Integrations"),
    ]
