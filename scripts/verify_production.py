import os
import re
import json
from html.parser import HTMLParser

out_dir = 'out'

class HTMLMetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.in_title = False
        self.meta_tags = {}
        self.canonical = None
        self.json_ld_schemas = []
        self.in_script_ld = False
        self.current_script_content = ""

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = attr_dict.get('name') or attr_dict.get('property')
            content = attr_dict.get('content')
            if name and content:
                self.meta_tags[name.lower()] = content
        elif tag == 'link':
            rel = attr_dict.get('rel')
            href = attr_dict.get('href')
            if rel == 'canonical' and href:
                self.canonical = href
        elif tag == 'script':
            stype = attr_dict.get('type', '')
            if stype == 'application/ld+json':
                self.in_script_ld = True
                self.current_script_content = ""

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'script' and self.in_script_ld:
            self.in_script_ld = False
            try:
                parsed = json.loads(self.current_script_content.strip())
                self.json_ld_schemas.append(parsed)
            except Exception as e:
                self.json_ld_schemas.append({'error': str(e), 'raw': self.current_script_content})

    def handle_data(self, data):
        if self.in_title:
            self.title = (self.title or "") + data
        elif self.in_script_ld:
            self.current_script_content += data


def verify_all_pages():
    if not os.path.exists(out_dir):
        print(f"Error: {out_dir} directory does not exist! Run npm run build first.")
        return False

    pages_audited = 0
    titles = set()
    errors = []
    warnings = []

    for root, _, files in os.walk(out_dir):
        if 'index.html' in files:
            html_path = os.path.join(root, 'index.html')
            rel_path = os.path.relpath(root, out_dir)
            route = '/' if rel_path == '.' else f'/{rel_path}/'

            # Skip 404 or Next internal pages if any
            if route == '/404/' or route == '/_not-found/':
                continue

            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()

            parser = HTMLMetadataParser()
            parser.feed(content)

            pages_audited += 1

            # 1. Check Title
            title = parser.title.strip() if parser.title else None
            if not title:
                errors.append(f"[{route}] Missing <title> tag!")
            elif title == "FinanceToolsLab.com - Calculator":
                errors.append(f"[{route}] Title is still generic placeholder: '{title}'")
            elif title in titles:
                errors.append(f"[{route}] Duplicate title detected: '{title}'")
            else:
                titles.add(title)

            # 2. Check Description
            desc = parser.meta_tags.get('description')
            if not desc:
                errors.append(f"[{route}] Missing meta description!")
            elif len(desc) < 60:
                warnings.append(f"[{route}] Short meta description ({len(desc)} chars): '{desc}'")
            elif "Calculate and estimate precisely with FinanceToolsLab." in desc:
                errors.append(f"[{route}] Generic placeholder description detected: '{desc}'")

            # 3. Check Canonical
            canon = parser.canonical
            if not canon:
                errors.append(f"[{route}] Missing canonical link tag!")
            elif not canon.endswith('/') and not canon.endswith('.com'):
                errors.append(f"[{route}] Canonical missing trailing slash: '{canon}'")

            # 4. Check JSON-LD Schemas
            schemas = parser.json_ld_schemas
            schema_types = []
            for s in schemas:
                if isinstance(s, dict):
                    st = s.get('@type')
                    if st:
                        schema_types.append(st)

            if not schemas:
                errors.append(f"[{route}] No JSON-LD structured data found!")
            else:
                if 'BreadcrumbList' not in schema_types:
                    warnings.append(f"[{route}] Missing BreadcrumbList schema (found: {schema_types})")
                
                # If calculator page, check SoftwareApplication / FAQPage
                if 'calculator' in route:
                    if 'SoftwareApplication' not in schema_types:
                        errors.append(f"[{route}] Missing SoftwareApplication schema (found: {schema_types})")
                    if 'FAQPage' not in schema_types:
                        warnings.append(f"[{route}] Missing FAQPage schema (found: {schema_types})")

            # 5. Check for dev warning banner in HTML
            if "Firebase is not connected" in content:
                errors.append(f"[{route}] Contains 'Firebase is not connected' warning banner!")

    print(f"\n=======================================================")
    print(f" AUDIT REPORT: {pages_audited} Pages Checked in '{out_dir}/'")
    print(f"=======================================================\n")

    if errors:
        print(f"❌ Found {len(errors)} Critical Errors:")
        for err in errors:
            print(f"   - {err}")
    else:
        print("✅ ZERO Critical Errors Found! All titles, descriptions, canonicals, and schemas are valid.")

    if warnings:
        print(f"\n⚠️ Found {len(warnings)} Warnings:")
        for w in warnings:
            print(f"   - {w}")
    else:
        print("✅ ZERO Warnings!")

    # Check robots.txt and sitemap.xml in out/
    robots_path = os.path.join(out_dir, 'robots.txt')
    sitemap_path = os.path.join(out_dir, 'sitemap.xml')

    if os.path.exists(robots_path):
        print("✅ robots.txt is present in production output.")
    else:
        print("❌ robots.txt is missing from production output!")

    if os.path.exists(sitemap_path):
        print("✅ sitemap.xml is present in production output.")
    else:
        print("❌ sitemap.xml is missing from production output!")

    print(f"\nAudit complete. Success = {len(errors) == 0}\n")
    return len(errors) == 0

if __name__ == '__main__':
    verify_all_pages()
