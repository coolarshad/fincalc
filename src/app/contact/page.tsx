import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('contact');
  }
  return {
    title: cmsData?.seoTitle || "Contact Us",
    description: cmsData?.seoDescription || "Get in touch with the FinanceToolsLab team for feedback, suggestions, or support.",
    keywords: cmsData?.seoKeywords || "contact us, feedback, support",
    alternates: {
      canonical: 'https://financetoolslab.com/contact/',
    },
  };
}

export default async function ContactPage() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('contact');
  }

  return <ContactClient cmsData={cmsData} />;
}
