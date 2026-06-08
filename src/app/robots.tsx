export const dynamic = 'force-static';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://financetoolslab.com'; // Ensure this matches your actual production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Disallow API routes from being crawled
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
