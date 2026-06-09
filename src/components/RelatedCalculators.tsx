import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Banknote, 
  TrendingUp, 
  Scale, 
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

const allCalculators = [
  {
    title: 'Loan Calculator',
    path: '/loan-calculator/',
    icon: Banknote,
    color: 'bg-blue-500',
    category: 'Finance'
  },
  {
    title: 'Mortgage Calculator',
    path: '/mortgage-calculator/',
    icon: Home,
    color: 'bg-indigo-500',
    category: 'Finance'
  },
  {
    title: 'Salary Calculator',
    path: '/salary-calculator/',
    icon: DollarSign,
    color: 'bg-emerald-500',
    category: 'Finance'
  },
  {
    title: 'Interest Calculator',
    path: '/interest-calculator/',
    icon: Percent,
    color: 'bg-amber-500',
    category: 'Finance'
  },
  {
    title: 'Investment Calculator',
    path: '/investment-calculator/',
    icon: TrendingUp,
    color: 'bg-cyan-500',
    category: 'Finance'
  },
  {
    title: 'Credit Card Interest',
    path: '/credit-card-calculator/',
    icon: CreditCard,
    color: 'bg-rose-500',
    category: 'Finance'
  },
  {
    title: 'BMI Calculator',
    path: '/bmi-calculator/',
    icon: Scale,
    color: 'bg-orange-500',
    category: 'Health'
  },
  {
    title: 'Calorie Calculator',
    path: '/calorie-calculator/',
    icon: Utensils,
    color: 'bg-red-500',
    category: 'Health'
  },
  {
    title: 'Body Fat Calculator',
    path: '/body-fat-calculator/',
    icon: Activity,
    color: 'bg-pink-500',
    category: 'Health'
  },
  {
    title: 'Pregnancy Calculator',
    path: '/pregnancy-calculator/',
    icon: Baby,
    color: 'bg-purple-500',
    category: 'Health'
  },
  {
    title: 'Currency Converter',
    path: '/currency-calculator/',
    icon: Globe,
    color: 'bg-teal-500',
    category: 'Utility'
  },
  {
    title: 'Inflation Calculator',
    path: '/inflation-calculator/',
    icon: TrendingUp,
    color: 'bg-slate-500',
    category: 'Finance'
  },
  {
    title: 'Margin Calculator',
    path: '/margin-calculator/',
    icon: Percent,
    color: 'bg-indigo-400',
    category: 'Business'
  },
  {
    title: 'Break-even Point',
    path: '/break-even-calculator/',
    icon: Target,
    color: 'bg-slate-700',
    category: 'Business'
  },
  {
    title: 'Cash Flow',
    path: '/cash-flow-calculator/',
    icon: Banknote,
    color: 'bg-emerald-400',
    category: 'Finance'
  },
  {
    title: 'FD Calculator',
    path: '/fd-calculator/',
    icon: Landmark,
    color: 'bg-blue-600',
    category: 'Finance'
  },
  {
    title: 'Loan Eligibility',
    path: '/loan-eligibility-calculator/',
    icon: ShieldCheck,
    color: 'bg-violet-500',
    category: 'Finance'
  },
  {
    title: 'SIP Calculator',
    path: '/sip-calculator/',
    icon: TrendingUp,
    color: 'bg-emerald-600',
    category: 'Finance'
  },
  {
    title: 'CAGR Calculator',
    path: '/cagr-calculator/',
    icon: Target,
    color: 'bg-indigo-600',
    category: 'Finance'
  },
  {
    title: 'GST Calculator',
    path: '/gst-calculator/',
    icon: Receipt,
    color: 'bg-amber-500',
    category: 'Business'
  }
];

interface RelatedCalculatorsProps {
  currentPath: string;
  category: string;
}

export default function RelatedCalculators({ currentPath, category }: RelatedCalculatorsProps) {
  // Filter calculators by category and exclude the current one
  const related = allCalculators
    .filter(calc => calc.category === category && calc.path !== currentPath)
    .slice(0, 3);

  // If we don't have enough in the same category, pick some others
  if (related.length < 3) {
    const others = allCalculators
      .filter(calc => calc.path !== currentPath && !related.find(r => r.path === calc.path))
      .slice(0, 3 - related.length);
    related.push(...others);
  }

  return (
    <section className="mt-20 pt-12 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Calculators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((calc, index) => (
          <motion.div
            key={calc.path}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={calc.path}
              className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                <calc.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {calc.category} Tool
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
