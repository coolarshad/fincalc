"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, DollarSign, Calendar, Info, HelpCircle, Lightbulb, ArrowUpRight, Target, ShieldCheck, Award } from 'lucide-react';

export default function CAGRCalculator({ cmsData }: { cmsData: any }) {
  


  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);
  const [cagr, setCagr] = useState(0);

  useEffect(() => {
    if (initialValue > 0 && finalValue > 0 && years > 0) {
      // CAGR Formula: [(Ending Value / Beginning Value)^(1 / Number of Years)] - 1
      const result = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
      setCagr(result);
    } else {
      setCagr(0);
    }
  }, [initialValue, finalValue, years]);

  const chartData = [
    { name: 'Initial', value: initialValue, color: '#94a3b8' },
    { name: 'Final', value: finalValue, color: '#6366f1' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "CAGR Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Calculate the average annual growth rate of your investment over time."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="initialValue">Initial Investment ($)</Label>
                <Input
                  id="initialValue"
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Number(e.target.value))}
                />
                <Slider
                  value={[initialValue]}
                  min={100}
                  max={1000000}
                  step={1000}
                  onValueChange={(val) => setInitialValue(val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalValue">Final Investment Value ($)</Label>
                <Input
                  id="finalValue"
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(Number(e.target.value))}
                />
                <Slider
                  value={[finalValue]}
                  min={100}
                  max={2000000}
                  step={1000}
                  onValueChange={(val) => setFinalValue(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="years">Duration (Years)</Label>
                  <span className="text-sm font-bold text-indigo-600">{years} Years</span>
                </div>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
                <Slider
                  value={[years]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white">
            <CardContent className="pt-8 text-center">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-1">Compound Annual Growth Rate</p>
              <p className="text-6xl font-black">{cagr.toFixed(2)}%</p>
              <p className="mt-2 text-indigo-200 text-sm">Per Year</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Value Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                      <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ArrowUpRight className="h-5 w-5 text-emerald-600 mr-2" />
                      <span className="text-sm font-medium text-slate-600">Absolute Returns</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{(((finalValue - initialValue) / initialValue) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-slate-600">Total Profit</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">${(finalValue - initialValue).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  CAGR Formula
                </h4>
                <p className="text-xs text-indigo-800 font-mono leading-relaxed">
                  CAGR = [(Final Value / Initial Value)^(1 / Years)] - 1
                </p>
                <p className="text-[10px] text-indigo-600 mt-2 italic">
                  *CAGR is a useful measure of growth because it smooths out the returns of an investment over a period of time.
                </p>
              </div>
            </div>
          </div>

          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Why CAGR Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">Smoothing Volatility</h3>
                <p className="text-xs text-slate-600">
                  Investments rarely grow at a steady rate. CAGR provides a single, consistent rate that represents the average growth, making it easier to compare different assets.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">Performance Benchmarking</h3>
                <p className="text-xs text-slate-600">
                  Use CAGR to compare your portfolio's performance against market benchmarks like the S&P 500 or to evaluate the historical growth of a company's revenue.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-16 space-y-12">
        {cmsData?.body ? (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{cmsData.body}</ReactMarkdown>
          </div>
        ) : (
          <>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is the difference between CAGR and IRR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  CAGR is used for a single investment with a beginning and ending value. IRR (Internal Rate of Return) is more complex and accounts for multiple cash inflows and outflows over time.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Does CAGR account for risk?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  No. CAGR only measures the rate of return. It does not tell you how much volatility or risk was taken to achieve that return. Two investments could have the same CAGR but very different risk profiles.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  When should I NOT use CAGR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Don't use CAGR for short-term investments (less than a year) or for investments with frequent additions or withdrawals, as it assumes a single lump sum was invested at the start.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is a "good" CAGR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  A "good" CAGR depends on the asset class. For stocks, a 10-12% CAGR is historically strong. For real estate, 4-7% is common. Always compare CAGR against inflation and risk-free rates.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Analytical Standard
            </h3>
            <p className="text-indigo-800 leading-relaxed mb-6">
              Our CAGR calculator is built using the standard geometric mean formula used by financial analysts to evaluate investment performance. We ensure that the time-weighted return calculations are mathematically sound, providing you with a reliable metric to compare the growth of disparate assets over any time horizon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Verified by Financial Data Analysts</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Uses standard geometric mean modeling</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Stock Investment</h4>
              <p className="text-sm text-slate-600">
                You bought shares for <strong>$10,000</strong> and sold them <strong>5 years</strong> later for <strong>$18,000</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 12.47% CAGR</p>
                <p className="text-xs text-slate-500 mt-1">This is the average annual growth rate over the 5-year period.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Business Revenue</h4>
              <p className="text-sm text-slate-600">
                A startup's revenue grew from <strong>$50,000</strong> to <strong>$500,000</strong> in <strong>3 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 115.44% CAGR</p>
                <p className="text-xs text-slate-500 mt-1">Reflects explosive year-over-year growth.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/cagr-calculator" category="Finance" />
      </div>
    </div>
  );
}
