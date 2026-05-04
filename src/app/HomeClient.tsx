"use client";

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { firebaseConfig } from '@/lib/firebase';
import {
  Banknote,
  TrendingUp,
  Scale,
  Stethoscope,
  Baby,
  CreditCard,
  DollarSign,
  Activity,
  Globe,
  Home,
  Utensils,
  Percent,
  Target,
  Landmark,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { motion } from 'motion/react';

const calculators = [
  {
    title: 'Loan Calculator',
    description: 'Calculate monthly payments, interest rates, and total cost of any loan.',
    icon: Banknote,
    path: '/loan-calculator',
    color: 'bg-blue-500',
    category: 'Finance'
  },
  {
    title: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payments including taxes and insurance.',
    icon: Home,
    path: '/mortgage-calculator',
    color: 'bg-indigo-500',
    category: 'Finance'
  },
  {
    title: 'Salary Calculator',
    description: 'Convert your hourly, daily, or monthly wage into an annual salary and vice versa.',
    icon: DollarSign,
    path: '/salary-calculator',
    color: 'bg-emerald-500',
    category: 'Finance'
  },
  {
    title: 'Interest Calculator',
    description: 'Calculate simple or compound interest on your savings or investments.',
    icon: Percent,
    path: '/interest-calculator',
    color: 'bg-amber-500',
    category: 'Finance'
  },
  {
    title: 'Investment Calculator',
    description: 'Project the future value of your investments based on contributions and returns.',
    icon: TrendingUp,
    path: '/investment-calculator',
    color: 'bg-cyan-500',
    category: 'Finance'
  },
  {
    title: 'Credit Card Interest',
    description: 'See how long it will take to pay off your credit card balance.',
    icon: CreditCard,
    path: '/credit-card-calculator',
    color: 'bg-rose-500',
    category: 'Finance'
  },
  {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and find your healthy weight range.',
    icon: Scale,
    path: '/bmi-calculator',
    color: 'bg-orange-500',
    category: 'Health'
  },
  {
    title: 'Calorie Calculator',
    description: 'Estimate how many calories you need daily to maintain or lose weight.',
    icon: Utensils,
    path: '/calorie-calculator',
    color: 'bg-red-500',
    category: 'Health'
  },
  {
    title: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using various methods.',
    icon: Activity,
    path: '/body-fat-calculator',
    color: 'bg-pink-500',
    category: 'Health'
  },
  {
    title: 'Pregnancy Calculator',
    description: 'Calculate your due date and track your pregnancy progress.',
    icon: Baby,
    path: '/pregnancy-calculator',
    color: 'bg-purple-500',
    category: 'Health'
  },
  {
    title: 'Currency Converter',
    description: 'Convert between global currencies with real-time exchange rates.',
    icon: Globe,
    path: '/currency-calculator',
    color: 'bg-teal-500',
    category: 'Utility'
  },
  {
    title: 'Inflation Calculator',
    description: 'See how the value of money has changed over time due to inflation.',
    icon: TrendingUp,
    path: '/inflation-calculator',
    color: 'bg-slate-500',
    category: 'Finance'
  },
  {
    title: 'Margin Calculator',
    description: 'Calculate profit margins, stock trading margins, and currency exchange margins.',
    icon: Percent,
    path: '/margin-calculator',
    color: 'bg-indigo-400',
    category: 'Business'
  },
  {
    title: 'Break-even Point',
    description: 'Find the sales volume needed to cover all your business costs.',
    icon: Target,
    path: '/break-even-calculator',
    color: 'bg-slate-700',
    category: 'Business'
  },
  {
    title: 'Cash Flow',
    description: 'Track your monthly income and expenses to monitor financial health.',
    icon: Banknote,
    path: '/cash-flow-calculator',
    color: 'bg-emerald-400',
    category: 'Finance'
  },
  {
    title: 'FD Calculator',
    description: 'Calculate maturity value and interest for fixed deposits.',
    icon: Landmark,
    path: '/fd-calculator',
    color: 'bg-blue-600',
    category: 'Finance'
  },
  {
    title: 'Loan Eligibility',
    description: 'Check how much loan you can afford based on your income.',
    icon: ShieldCheck,
    path: '/loan-eligibility-calculator',
    color: 'bg-violet-500',
    category: 'Finance'
  },
  {
    title: 'SIP Calculator',
    description: 'Calculate the future value of your systematic monthly investments.',
    icon: TrendingUp,
    path: '/sip-calculator',
    color: 'bg-emerald-600',
    category: 'Finance'
  },
  {
    title: 'CAGR Calculator',
    description: 'Calculate the compound annual growth rate of your investments.',
    icon: Target,
    path: '/cagr-calculator',
    color: 'bg-indigo-600',
    category: 'Finance'
  },
  {
    title: 'GST Calculator',
    description: 'Quickly calculate GST amounts with CGST and SGST breakdowns.',
    icon: Receipt,
    path: '/gst-calculator',
    color: 'bg-amber-500',
    category: 'Business'
  }
];

export default function HomeClient({ cmsData }: { cmsData: any }) {

  return (
    <div className="bg-white">
      {/* SEO is handled by the server component */}
      
      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium">
          Firebase is not connected. Showing fallback content. Add VITE_FIREBASE_PROJECT_ID to your .env file.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
              dangerouslySetInnerHTML={{ __html: cmsData?.heroTitle || 'FinanceTools<span className="text-indigo-400">Lab</span>.com' }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 max-w-2xl mx-auto mb-10"
            >
              {cmsData?.heroSubtitle || "Precision tools for smarter financial decisions. Accurate, free, and optimized for mobile performance."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a href="#calculators" className="inline-flex items-center px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25">
                Explore All Tools
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calculator Grid */}
      <section id="calculators" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{cmsData?.calculatorsTitle || "Professional Calculator Suite"}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {cmsData?.calculatorsSubtitle || "Our lab-tested tools provide the accuracy you need for critical financial and health decisions."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calculators.map((calc, index) => (
              <motion.div
                key={calc.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={calc.path}
                  className="group block h-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${calc.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <calc.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      {calc.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {calc.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{cmsData?.whyChooseUsTitle || "Why Millions Trust FinanceToolsLab.com"}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {cmsData?.whyChooseUsSubtitle || "Our tools are built by industry experts and verified by professionals to ensure you get the most accurate results possible."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{cmsData?.feature1Title || "Expert-Verified"}</h3>
              <p className="text-slate-600 text-sm">{cmsData?.feature1Desc || "Every formula is vetted by financial analysts, health professionals, and business consultants to meet industry standards."}</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{cmsData?.feature2Title || "Rigorous Accuracy"}</h3>
              <p className="text-slate-600 text-sm">{cmsData?.feature2Desc || "We use real-time data and advanced algorithms that are stress-tested against complex real-world scenarios."}</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{cmsData?.feature3Title || "Global Standards"}</h3>
              <p className="text-slate-600 text-sm">{cmsData?.feature3Desc || "Our tools comply with international financial regulations and health guidelines (WHO, CDC, etc.)."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Experts, For Everyone</h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                FinanceToolsLab.com isn't just a collection of scripts. It's a platform born from decades of collective experience in finance, healthcare, and engineering.
                We've seen how small errors in calculation can lead to big mistakes in life. That's why we've made it our mission to provide the most reliable tools on the web.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <span>Verified by Certified Financial Planners (CFP)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <span>Medical content reviewed by healthcare practitioners</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <span>Adheres to IASB and FASB accounting principles</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                <blockquote className="text-xl italic mb-6">
                  "Accuracy in calculation is the foundation of trust. We built FinanceToolsLab.com to ensure that every individual has access to professional-grade tools without the professional-grade price tag."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-400 rounded-full flex items-center justify-center font-bold text-indigo-900">
                    FTL
                  </div>
                  <div>
                    <p className="font-bold">The FinanceToolsLab Engineering Team</p>
                    <p className="text-indigo-300 text-sm">Industry Veterans & Data Scientists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            {cmsData?.body ? (
              <ReactMarkdown>{cmsData.body}</ReactMarkdown>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The FinanceToolsLab.com Advantage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Financial Planning Made Easy</h3>
                    <p className="text-slate-600">
                      Navigating the world of finance can be complex. Our suite of financial tools, including the <strong>Loan Calculator</strong>,
                      <strong>Mortgage Calculator</strong>, and <strong>SIP Calculator</strong>, are designed to simplify your planning.
                      Whether you're looking to buy a new home, plan for retirement, or manage your monthly budget, FinanceToolsLab.com provides
                      accurate projections to help you stay on track.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Health and Wellness Tracking</h3>
                    <p className="text-slate-600">
                      Your health is your greatest asset. Tools like our <strong>BMI Calculator</strong>, <strong>Calorie Calculator</strong>,
                      and <strong>Body Fat Calculator</strong> help you monitor your physical well-being. We provide more than just numbers;
                      our calculators include detailed notes and tips to help you understand what your results mean for your long-term health.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Business and Utility Tools</h3>
                    <p className="text-slate-600">
                      For entrepreneurs and professionals, our <strong>Margin Calculator</strong>, <strong>GST Calculator</strong>, and
                      <strong>Break-even Point Calculator</strong> are essential for daily operations. We've enriched these tools with
                      formulas and FAQs to ensure you not only get the results you need but also understand the underlying logic.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Why Use FinanceToolsLab.com?</h3>
                    <p className="text-slate-600">
                      FinanceToolsLab.com is built with the user in mind. We prioritize accuracy, ease of use, and privacy. Every page is optimized
                      for search engines to ensure you can find the tools you need quickly. With our categorized footer and intuitive
                      navigation, finding the right calculator has never been easier.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
