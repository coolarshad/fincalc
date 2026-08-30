import { MetadataRoute } from 'next';
import { SEO_DATA, SITE_CONFIG } from '@/lib/seo-config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = Object.keys(SEO_DATA).map((key) => {
    const page = SEO_DATA[key];
    const isHome = key === 'home';
    const isMainCalc = !['home', 'about', 'contact', 'privacy'].includes(key);

    return {
      url: page.canonical,
      lastModified: currentDate,
      changeFrequency: isHome ? ('daily' as const) : isMainCalc ? ('weekly' as const) : ('monthly' as const),
      priority: isHome ? 1.0 : isMainCalc ? 0.9 : 0.7,
    };
  });

  return routes;
}
