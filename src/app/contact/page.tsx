import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import ContactClient from './ContactClient';
import { SEO_DATA } from '@/lib/seo-config';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('contact');
  }

  const seo = SEO_DATA['contact'];
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

export default async function ContactPage() {
  let cmsData = null;
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('contact');
  }

  return (
    <>
      <JsonLd seo={SEO_DATA['contact']} />
      <ContactClient cmsData={cmsData} />
    </>
  );
}
