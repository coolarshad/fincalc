import { Metadata } from 'next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('privacy');
  }
  return {
    title: cmsData?.seoTitle || "Privacy Policy - FinanceToolsLab.com",
    description: cmsData?.seoDescription || "Read our privacy policy to understand how we protect your data. At FinanceToolsLab.com, your privacy is our top priority.",
    keywords: cmsData?.seoKeywords || "privacy policy, data protection, financetoolslab privacy",
    alternates: {
      canonical: 'https://financetoolslab.com/privacy',
    },
  };
}

export default async function PrivacyPage() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('privacy');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">{cmsData?.title || "Privacy Policy"}</h1>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{cmsData?.commitmentTitle || "Privacy First Commitment"}</h2>
              <p className="text-sm text-slate-500">{cmsData?.lastUpdated || "Last Updated: April 12, 2026"}</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {cmsData?.commitmentText || "At FinanceToolsLab.com, we believe that your financial and health data is yours and yours alone. Our platform is engineered with a \"Privacy-First\" architecture, meaning we prioritize your anonymity and data security in every line of code we write."}
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-5 w-5 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">{cmsData?.section1Title || "1. Data Collection"}</h2>
            </div>
            {cmsData?.section1Text ? (
              <div className="prose prose-slate text-slate-600 max-w-none">
                <ReactMarkdown>{cmsData.section1Text}</ReactMarkdown>
              </div>
            ) : (
              <>
                <p className="text-slate-600 leading-relaxed mb-4">
                  FinanceToolsLab.com does <strong>not</strong> collect, store, or share any personal financial or health data
                  entered into our calculators. All calculations are performed locally on your device using JavaScript.
                  Once you close your browser tab, all data entered during that session is cleared.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600">
                  <li>No registration or account creation required.</li>
                  <li>No storage of loan amounts, salaries, or health metrics.</li>
                  <li>No tracking of individual calculation results.</li>
                </ul>
              </>
            )}
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-5 w-5 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">{cmsData?.section2Title || "2. Cookies and Analytics"}</h2>
            </div>
            {cmsData?.section2Text ? (
              <div className="prose prose-slate text-slate-600 max-w-none">
                <ReactMarkdown>{cmsData.section2Text}</ReactMarkdown>
              </div>
            ) : (
              <>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We use minimal, privacy-compliant analytics to understand general site traffic and improve our tools.
                  This data is aggregated and anonymized, meaning it cannot be used to identify you personally.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We may use essential cookies to remember your preferences (such as dark mode or currency selection)
                  to provide a better user experience. These cookies do not contain any sensitive information.
                </p>
              </>
            )}
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">{cmsData?.section3Title || "3. Third-Party Links"}</h2>
            </div>
            {cmsData?.section3Text ? (
              <div className="prose prose-slate text-slate-600 max-w-none">
                <ReactMarkdown>{cmsData.section3Text}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-600 leading-relaxed">
                Our website may contain links to other websites of interest. However, once you have used these links
                to leave our site, you should note that we do not have any control over that other website.
                Therefore, we cannot be responsible for the protection and privacy of any information which you
                provide whilst visiting such sites.
              </p>
            )}
          </section>

          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{cmsData?.contactSectionTitle || "Contact Us Regarding Privacy"}</h2>
            <p className="text-slate-600 mb-4">
              {cmsData?.contactSectionText || "If you have any questions about this Privacy Policy or our data practices, please contact us at:"}
            </p>
            <p className="font-bold text-indigo-600">{cmsData?.contactEmail || "support@financetoolslab.com"}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
