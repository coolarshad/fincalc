import json
from django import template
from django.utils.safestring import mark_safe
from wagtail.models import Page

register = template.Library()


@register.simple_tag(takes_context=True)
def render_json_ld_schema(context, page):
    """
    Generate valid JSON-LD structured data for Google Rich Results.
    Outputs WebSite, SoftwareApplication, FAQPage, BreadcrumbList, and Organization.
    """
    request = context.get('request')
    if not request or not page:
        return ""

    site_url = request.build_absolute_uri('/')[:-1]
    current_url = request.build_absolute_uri()

    schema_graph = []

    # 1. Base Organization & WebSite
    schema_graph.append({
        "@type": "Organization",
        "@id": f"{site_url}/#organization",
        "name": "FinCalc",
        "url": site_url,
        "logo": f"{site_url}/static/images/logo.png",
        "sameAs": []
    })

    schema_graph.append({
        "@type": "WebSite",
        "@id": f"{site_url}/#website",
        "url": site_url,
        "name": "FinCalc - Free Financial & Health Calculators",
        "description": "Free online calculators for loans, mortgages, investments, salary, and health.",
        "publisher": {"@id": f"{site_url}/#organization"},
        "potentialAction": {
            "@type": "SearchAction",
            "target": f"{site_url}/search/?query={{search_term_string}}",
            "query-input": "required name=search_term_string"
        }
    })

    # 2. BreadcrumbList for all pages
    ancestors = page.get_ancestors(inclusive=True).live().filter(depth__gte=2)
    breadcrumb_elements = []
    for idx, ancestor in enumerate(ancestors, start=1):
        breadcrumb_elements.append({
            "@type": "ListItem",
            "position": idx,
            "name": ancestor.title,
            "item": ancestor.get_full_url(request)
        })

    if breadcrumb_elements:
        schema_graph.append({
            "@type": "BreadcrumbList",
            "@id": f"{current_url}#breadcrumb",
            "itemListElement": breadcrumb_elements
        })

    # 3. Calculator-specific schema: SoftwareApplication + FAQPage
    page_type = getattr(page, 'specific_class', type(page)).__name__
    if page_type == 'CalculatorPage':
        # SoftwareApplication
        calc_category = "FinanceApplication"
        if getattr(page, 'calculator_type', '') in ['bmi', 'calorie', 'body_fat', 'pregnancy']:
            calc_category = "HealthApplication"
        elif getattr(page, 'calculator_type', '') in ['margin', 'break_even', 'cash_flow']:
            calc_category = "BusinessApplication"

        schema_graph.append({
            "@type": "SoftwareApplication",
            "@id": f"{current_url}#software",
            "name": page.title,
            "description": getattr(page, 'short_summary', page.search_description or page.title),
            "applicationCategory": calc_category,
            "operatingSystem": "All",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "url": current_url,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "author": {
                "@type": "Organization",
                "name": getattr(page, 'author_name', 'FinCalc Review Board')
            }
        })

        # FAQPage schema
        faq_items = getattr(page.specific, 'get_faq_items', lambda: [])()
        if faq_items:
            faq_entities = []
            for item in faq_items:
                faq_entities.append({
                    "@type": "Question",
                    "name": item.get('question', ''),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.get('answer', '')
                    }
                })
            if faq_entities:
                schema_graph.append({
                    "@type": "FAQPage",
                    "@id": f"{current_url}#faq",
                    "mainEntity": faq_entities
                })

    structured_data = {
        "@context": "https://schema.org",
        "@graph": schema_graph
    }

    return mark_safe(f'<script type="application/ld+json">\n{json.dumps(structured_data, indent=2)}\n</script>')


@register.simple_tag(takes_context=True)
def render_breadcrumbs(context, page):
    """
    Render mobile-responsive, accessible HTML breadcrumbs.
    """
    request = context.get('request')
    if not request or not page:
        return ""

    ancestors = page.get_ancestors(inclusive=True).live().filter(depth__gte=2)
    if len(ancestors) <= 1:
        return ""

    html = ['<nav aria-label="Breadcrumb" class="breadcrumbs-nav"><ol class="breadcrumbs-list">']
    for idx, ancestor in enumerate(ancestors):
        is_last = (idx == len(ancestors) - 1)
        if is_last:
            html.append(f'<li class="breadcrumb-item active" aria-current="page"><span>{ancestor.title}</span></li>')
        else:
            url = ancestor.get_url(request)
            html.append(f'<li class="breadcrumb-item"><a href="{url}">{ancestor.title}</a><span class="separator">/</span></li>')
    html.append('</ol></nav>')

    return mark_safe("".join(html))


@register.simple_tag
def render_icon(icon_name, extra_class=""):
    """
    Render clean, fast, inline SVGs for UI icons with zero network requests.
    """
    icons = {
        "banknote": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
        "home": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        "trending-up": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
        "percent": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
        "activity": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>',
        "heart-pulse": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27"/></svg>',
        "scale": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
        "briefcase": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        "calculator": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
        "credit-card": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
        "dollar-sign": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        "shield-check": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
        "search": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        "sun": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        "moon": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
        "chevron-right": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        "check": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
        "arrow-right": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
        "baby": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>',
        "utensils": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v19"/><path d="M5 2v8a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"/><path d="M8 2v19"/></svg>',
        "globe": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        "sparkles": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
        "award": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
        "file-check": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>',
        "lock": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        "cpu": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
        "users": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        "book-open": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        "mail": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        "map-pin": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
        "clock": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        "help-circle": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        "send": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
        "alert-circle": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
        "eye": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
        "server-off": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5"/><path d="M10 10 2.5 2.5"/><path d="M22 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
        "cookie": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>',
        "file-text": '<svg class="icon ' + extra_class + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="10" x2="14" y1="13" y2="13"/><line x1="10" x2="14" y1="17" y2="17"/></svg>',
    }
    return mark_safe(icons.get(icon_name, icons["calculator"]))
