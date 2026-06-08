import { Metadata } from 'next';

import { Info, Target, Shield, Users } from 'lucide-react';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('about');
  }
  return {
    title: cmsData?.seoTitle || "About FinanceToolsLab.com - Our Mission & Expertise",
    description: cmsData?.seoDescription || "Learn about FinanceToolsLab.com, our commitment to accuracy, and why we are the trusted choice for millions of users worldwide.",
    keywords: cmsData?.seoKeywords || "about financetoolslab, financial tools mission, expert verified calculators, accurate finance tools",
    alternates: {
      canonical: 'https://financetoolslab.com/about/',
    },
  };
}

export default async function AboutPage() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('about');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 
          className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          dangerouslySetInnerHTML={{ __html: cmsData?.missionTitle || 'Empowering Your <span class="text-indigo-600">Financial Future</span>' }}
        />
        <div className="text-xl text-slate-600 leading-relaxed mb-10 max-w-3xl mx-auto">
          {cmsData?.missionText ? (
            <ReactMarkdown>{cmsData.missionText}</ReactMarkdown>
          ) : (
            <p>
              FinanceToolsLab.com was established with a singular vision: to democratize high-precision financial analysis.
              We bridge the gap between complex financial modeling and everyday decision-making.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{cmsData?.labStandardTitle || "The Lab Standard"}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {cmsData?.labStandardText || "Our \"Lab Standard\" ensures that every tool is built on verified mathematical models used by top-tier financial institutions. We don't just provide numbers; we provide confidence."}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                <span>{cmsData?.labBullet1 || "Verified by Certified Financial Planners (CFP)"}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                <span>{cmsData?.labBullet2 || "Real-time Data Integration for Accuracy"}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                <span>{cmsData?.labBullet3 || "Stress-tested Algorithms"}</span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{cmsData?.whyChooseUsTitle || "Why Choose Us?"}</h2>
            <p className="text-indigo-100 leading-relaxed mb-6">
              {cmsData?.whyChooseUsText || "In an era of misinformation, FinanceToolsLab.com stands as a beacon of reliability. Our tools are designed to be the fastest, most accurate, and most user-friendly on the web."}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm font-medium text-indigo-50">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>{cmsData?.whyBullet1 || "100% Free & No Registration Required"}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm font-medium text-indigo-50">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>{cmsData?.whyBullet2 || "Mobile-First, Lightweight Design"}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm font-medium text-indigo-50">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>{cmsData?.whyBullet3 || "Privacy-First: No Data Storage"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
        <div className="text-center group">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <Target className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">{cmsData?.feature1Title || "Precision Engineering"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{cmsData?.feature1Desc || "Our calculators use high-precision floating-point arithmetic to ensure results are accurate to the last cent."}</p>
        </div>
        <div className="text-center group">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">{cmsData?.feature2Title || "Bank-Level Security"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{cmsData?.feature2Desc || "We employ strict client-side processing. Your financial data never touches our servers, ensuring total privacy."}</p>
        </div>
        <div className="text-center group">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">{cmsData?.feature3Title || "User-Centric Design"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{cmsData?.feature3Desc || "Built for speed and accessibility. Our tools load in milliseconds and work perfectly on any device or screen size."}</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none bg-slate-50 p-12 rounded-3xl border border-slate-200">
        {cmsData?.body ? (
          <ReactMarkdown>{cmsData.body}</ReactMarkdown>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The FinanceToolsLab.com Advantage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-indigo-600">SEO Optimized & Lightweight</h3>
                <p className="text-slate-600">
                  We understand that time is money. That's why FinanceToolsLab.com is optimized for core web vitals.
                  Our lightweight architecture ensures that you get your results instantly, even on slow mobile connections.
                  This commitment to performance also makes us a favorite for search engines, ensuring our tools are always just a search away.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-indigo-600">Comprehensive Feature Set</h3>
                <p className="text-slate-600">
                  From the <strong>SIP Calculator</strong> for long-term wealth to the <strong>GST Calculator</strong> for business compliance,
                  our suite covers the entire spectrum of financial needs. We continuously update our tools to reflect the latest tax laws,
                  interest rates, and economic trends.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
