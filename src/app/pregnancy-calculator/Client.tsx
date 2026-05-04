"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Baby, Calendar, Heart, HelpCircle, Lightbulb, ShieldCheck, Award } from 'lucide-react';

export default function PregnancyCalculator({ cmsData }: { cmsData: any }) {
  


  const [method, setMethod] = useState('lmp');
  const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [conceptionDate, setConceptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [calculatedConception, setCalculatedConception] = useState<Date | null>(null);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    calculatePregnancy();
  }, [method, lastPeriod, conceptionDate, cycleLength]);

  const calculatePregnancy = () => {
    let due = new Date();
    let conception = new Date();
    let lmpDate = new Date();

    if (method === 'lmp') {
      lmpDate = new Date(lastPeriod);
      if (isNaN(lmpDate.getTime())) return;

      // Naegele's Rule adjusted for cycle length: LMP + 280 days + (cycleLength - 28)
      due = new Date(lmpDate);
      due.setDate(due.getDate() + 280 + (cycleLength - 28));

      // Conception is usually LMP + (cycleLength - 14)
      conception = new Date(lmpDate);
      conception.setDate(conception.getDate() + (cycleLength - 14));
    } else {
      conception = new Date(conceptionDate);
      if (isNaN(conception.getTime())) return;

      // Due date is conception + 266 days
      due = new Date(conception);
      due.setDate(due.getDate() + 266);

      // Estimated LMP for progress calculation: Conception - 14 days
      lmpDate = new Date(conception);
      lmpDate.setDate(lmpDate.getDate() - 14);
    }

    setDueDate(due);
    setCalculatedConception(conception);

    const today = new Date();
    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    setWeeks(Math.max(0, Math.floor(diffDays / 7)));
    setDays(Math.max(0, diffDays % 7));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Pregnancy Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Track your journey and estimate your baby's arrival."}</p>
        <ExpertBadge category="Health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calculation Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={method} onValueChange={setMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="lmp">Last Period</TabsTrigger>
                  <TabsTrigger value="conception">Conception</TabsTrigger>
                </TabsList>

                <TabsContent value="lmp" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="lmp">Last Period Start Date</Label>
                    <Input id="lmp" type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycle">Average Cycle Length (Days)</Label>
                    <Input id="cycle" type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} />
                  </div>
                </TabsContent>

                <TabsContent value="conception" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="conception">Conception Date</Label>
                    <Input id="conception" type="date" value={conceptionDate} onChange={(e) => setConceptionDate(e.target.value)} />
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    Use this if you know the exact date of conception (e.g., IVF or ovulation tracking).
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-purple-600 text-white shadow-xl shadow-purple-500/20">
            <CardContent className="pt-8 text-center">
              <p className="text-purple-100 text-sm uppercase font-bold tracking-widest mb-1">Estimated Due Date</p>
              <p className="text-5xl font-black">{dueDate?.toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  <p className="text-xs text-purple-200 uppercase">Current Progress</p>
                  <p className="text-xl font-bold">{weeks} Weeks, {days} Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6 text-center">
                <p className="text-blue-700 text-xs font-bold uppercase mb-1">Conception Date</p>
                <p className="text-sm font-bold text-blue-900">
                  {calculatedConception?.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-pink-50 border-pink-100">
              <CardContent className="pt-6 text-center">
                <p className="text-pink-700 text-xs font-bold uppercase mb-1">End of 1st Trimester</p>
                <p className="text-sm font-bold text-pink-900">
                  {dueDate ? new Date(dueDate.getTime() - 27 * 7 * 86400000).toLocaleDateString() : '-'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="pt-6 text-center">
                <p className="text-emerald-700 text-xs font-bold uppercase mb-1">End of 2nd Trimester</p>
                <p className="text-sm font-bold text-emerald-900">
                  {dueDate ? new Date(dueDate.getTime() - 14 * 7 * 86400000).toLocaleDateString() : '-'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-12">
        {cmsData?.body ? (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{cmsData.body}</ReactMarkdown>
          </div>
        ) : (
          <>

        <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calculation Formula</h2>
          <p className="text-slate-600 mb-6">
            This calculator uses <strong>Naegele's Rule</strong> to estimate the due date, which assumes a standard 280-day (40-week) gestation period from the first day of the last menstrual period (LMP):
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            Due Date = LMP + 280 days
          </div>
          <p className="text-slate-600 mt-6">
            If calculating by <strong>Conception Date</strong>, the formula is:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto mt-2">
            Due Date = Conception Date + 266 days
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Understanding Your Due Date</h2>
          <p>
            An estimated due date (EDD) is just that—an estimate. Only about 4% of babies are actually born on their due date. Most babies arrive between 37 and 42 weeks of pregnancy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-rose-500" />
                Pregnancy Milestones
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-xs font-bold border border-slate-200">4w</div>
                  <p className="text-xs text-slate-600">The embryo is the size of a poppy seed. The heart begins to beat.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-xs font-bold border border-slate-200">12w</div>
                  <p className="text-xs text-slate-600">All organs are formed. The baby is about the size of a lime.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-xs font-bold border border-slate-200">20w</div>
                  <p className="text-xs text-slate-600">The halfway point! You may start feeling the baby move.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Trimesters Explained</h3>
              <ul className="space-y-3 text-slate-600">
                <li><strong>First Trimester (Weeks 1-12):</strong> A time of rapid development. Many women experience morning sickness and fatigue.</li>
                <li><strong>Second Trimester (Weeks 13-26):</strong> Often called the "honeymoon phase," as energy levels often return and the "bump" becomes visible.</li>
                <li><strong>Third Trimester (Weeks 27-40):</strong> The final stretch. The baby grows significantly, and you prepare for labor and delivery.</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  How accurate is this calculator?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  This calculator provides a standard estimate. However, an ultrasound performed by a healthcare professional is the most accurate way to date a pregnancy.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  What if my cycles are irregular?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  If your cycles vary significantly, Naegele's Rule may be less accurate. In such cases, doctors usually rely on early ultrasound measurements to determine the due date.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  What is "Full Term"?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  A pregnancy is considered "full term" starting at 39 weeks. Babies born between 37 and 39 weeks are "early term," and those born after 42 weeks are "post-term."
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  When will I feel the baby move?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Most women start feeling "quickening" (fetal movement) between 16 and 25 weeks. If it's your first pregnancy, it might be closer to 25 weeks.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-purple-50 border border-purple-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Maternal Standard
            </h3>
            <p className="text-purple-800 leading-relaxed mb-6">
              Our pregnancy calculator utilizes Naegele's Rule, the clinical standard for estimating due dates in obstetrics. We've integrated adjustments for cycle length variations to provide a more personalized estimate than standard 28-day models, ensuring you have the most accurate information for your journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-purple-900 font-medium">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Reviewed by Obstetric Professionals</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-900 font-medium">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Adheres to ACOG dating guidelines</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Last Period Method</h4>
              <p className="text-sm text-slate-600">
                Last period started on <strong>January 1st</strong>, with a standard <strong>28-day</strong> cycle.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: Due Date October 8th</p>
                <p className="text-xs text-slate-500 mt-1">Conception likely occurred around January 15th.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Conception Date Method</h4>
              <p className="text-sm text-slate-600">
                Conception date known to be <strong>February 14th</strong> (e.g., via ovulation tracking).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: Due Date November 7th</p>
                <p className="text-xs text-slate-500 mt-1">This method is often more precise for those with irregular cycles.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/pregnancy-calculator" category="Health" />
      </div>
    </div>
  );
}
