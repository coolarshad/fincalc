import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import Client from './Client';
import { SEO_DATA } from '@/lib/seo-config';
import JsonLd from '@/components/JsonLd';

const SLUG = 'pregnancy-calculator';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent(`calculators/${SLUG}`);
  }

  const seo = SEO_DATA[SLUG];
  const title = cmsData?.seoTitle || seo.title;
  const description = cmsData?.seoDescription || seo.description;
  const keywords = cmsData?.seoKeywords ? cmsData.seoKeywords.split(',').map((k: string) => k.trim()) : seo.keywords;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title,
      description,
      url: seo.canonical,
      type: 'website',
      siteName: 'FinanceToolsLab.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Page() {
  let cmsData = null;
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent(`calculators/${SLUG}`);
  }

  return (
    <>
      <JsonLd seo={SEO_DATA[SLUG]} />
      <Client cmsData={cmsData} />
    </>
  );
}
