from django.http import HttpResponse


def robots_txt(request):
    """
    Generate dynamic robots.txt with search crawler permissions
    and direct reference to dynamic sitemap.xml.
    """
    sitemap_url = request.build_absolute_uri('/sitemap.xml')
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin/",
        "Disallow: /django-admin/",
        "Disallow: /documents/",
        "",
        f"Sitemap: {sitemap_url}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
