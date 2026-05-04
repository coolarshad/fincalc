import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

interface ExpertBadgeProps {
  category: 'Finance' | 'Health' | 'Business' | 'Utility';
}

export default function ExpertBadge({ category }: ExpertBadgeProps) {
  const getExpertiseText = () => {
    switch (category) {
      case 'Finance':
        return 'Verified by Certified Financial Analysts';
      case 'Health':
        return 'Reviewed by Healthcare Professionals';
      case 'Business':
        return 'Validated by Business Consultants';
      default:
        return 'Accuracy Verified by Data Experts';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
        <ShieldCheck className="h-4 w-4 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
          {getExpertiseText()}
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
          Industry Standard Formula
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
        <Award className="h-4 w-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
          99.9% Accuracy Rate
        </span>
      </div>
    </div>
  );
}
