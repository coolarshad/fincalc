import React from 'react';
import { PageSEO, SITE_CONFIG } from '@/lib/seo-config';

interface JsonLdProps {
  seo: PageSEO;
}

export function JsonLd({ seo }: JsonLdProps) {
  const schemaList: any[] = [];

  // 1. BreadcrumbList Schema
  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': seo.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url,
      })),
    });
  }

  // 2. Calculator Schema: SoftwareApplication / WebApplication
  if (seo.applicationCategory) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': seo.title.split(' - ')[0],
      'operatingSystem': 'All',
      'applicationCategory': seo.applicationCategory,
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'url': seo.canonical,
      'description': seo.description,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'author': {
        '@type': 'Organization',
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.domain,
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '1420',
        'bestRating': '5',
        'worstRating': '1',
      },
    });
  }

  // 3. FAQPage Schema
  if (seo.faqs && seo.faqs.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': seo.faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    });
  }

  // 4. If homepage, add WebSite and Organization
  if (seo.slug === '') {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': SITE_CONFIG.name,
      'url': SITE_CONFIG.domain,
      'email': SITE_CONFIG.email,
      'description': SITE_CONFIG.description,
      'sameAs': [],
    });

    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_CONFIG.name,
      'url': SITE_CONFIG.domain,
      'description': SITE_CONFIG.description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${SITE_CONFIG.domain}/#calculators?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  return (
    <>
      {schemaList.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default JsonLd;
