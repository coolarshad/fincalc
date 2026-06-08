import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import HomeClient from './HomeClient';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('home');
  }

  return {
    title: cmsData?.seoTitle || "FinanceToolsLab.com - Free Online Financial & Health Calculators",
    description: cmsData?.seoDescription || "Access a comprehensive suite of free, accurate online calculators for finance, health, and business. Mobile-first and lightweight for maximum performance.",
    keywords: cmsData?.seoKeywords || "financetoolslab, loan calculator, mortgage calculator, bmi calculator, salary calculator, interest calculator, sip calculator",
    alternates: {
      canonical: 'https://financetoolslab.com/',
    },
  };
}

export default async function Page() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('home');
  }

  return <HomeClient cmsData={cmsData} />;
}
