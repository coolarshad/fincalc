import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import Client from './Client';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('calculators/bmi-calculator');
  }
  
  return {
    title: cmsData?.seoTitle || "FinanceToolsLab.com - Calculator",
    description: cmsData?.seoDescription || "Calculate and estimate precisely with FinanceToolsLab.",
    keywords: cmsData?.seoKeywords || "calculator, finance, tools",
    alternates: {
      canonical: `https://financetoolslab.com/bmi-calculator/`,
    },
  };
}

export default async function Page() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('calculators/bmi-calculator');
  }

  return <Client cmsData={cmsData} />;
}
