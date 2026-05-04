"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CreditCard, AlertTriangle, Info, HelpCircle, Lightbulb, ShieldCheck, Award } from 'lucide-react';

export default function CreditCardCalculator({ cmsData }: { cmsData: any }) {
  


  const [balance, setBalance] = useState(5000);
  const [rate, setRate] = useState(19.99);
  const [payment, setPayment] = useState(200);

  const [months, setMonths] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateCreditCard();
  }, [balance, rate, payment]);

  const calculateCreditCard = () => {
    const monthlyRate = rate / 100 / 12;
    let currentBalance = balance;
    let totalInt = 0;
    let m = 0;

    if (payment <= balance * monthlyRate) {
      setMonths(-1); // Infinite
      return;
    }

    while (currentBalance > 0 && m < 600) {
      const interest = currentBalance * monthlyRate;
      totalInt += interest;
      currentBalance = currentBalance + interest - payment;
      m++;
    }

    setMonths(m);
    setTotalInterest(totalInt);
  };

  const chartData = [
    { name: 'Balance', value: balance, color: '#4f46e5' },
    { name: 'Interest', value: totalInterest, color: '#f43f5e' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Credit Card Interest Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Calculate the time and cost to clear your credit card debt."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance ($)</Label>
                <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
                <Slider value={[balance]} min={100} max={50000} step={100} onValueChange={(val) => setBalance(val[0])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (APR %)</Label>
                <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <Slider value={[rate]} min={1} max={35} step={0.1} onValueChange={(val) => setRate(val[0])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Monthly Payment ($)</Label>
                <Input id="payment" type="number" value={payment} onChange={(e) => setPayment(Number(e.target.value))} />
                <Slider value={[payment]} min={50} max={5000} step={10} onValueChange={(val) => setPayment(val[0])} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {months === -1 ? (
            <Card className="bg-rose-50 border-rose-200">
              <CardContent className="pt-8 text-center">
                <AlertTriangle className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-rose-900 mb-2">Warning: Payment Too Low</h3>
                <p className="text-rose-800">
                  Your monthly payment is less than the interest being charged. Your balance will never be paid off and will continue to grow.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-rose-600 text-white shadow-xl shadow-rose-500/20">
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-rose-100 text-xs uppercase font-bold tracking-widest mb-1">Time to Pay Off</p>
                    <p className="text-5xl font-black">{months} <span className="text-2xl">Months</span></p>
                    <p className="text-xs text-rose-200 mt-1">({(months / 12).toFixed(1)} Years)</p>
                  </div>
                  <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-rose-500 pt-6 md:pt-0">
                    <p className="text-rose-100 text-xs uppercase font-bold tracking-widest mb-1">Total Interest Paid</p>
                    <p className="text-3xl font-bold">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2 text-indigo-600" />
              Debt Payoff Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-bold text-sm mb-1">Snowball Method</h4>
                <p className="text-xs text-slate-600">Pay off smallest balances first to gain psychological momentum.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Avalanche Method</h4>
                <p className="text-xs text-slate-600">Pay off highest interest rates first to save the most money over time.</p>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Credit Card Interest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Daily Periodic Rate</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most credit cards calculate interest daily. They divide your APR by 365 to get a daily rate, which is then applied to your average daily balance.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Compounding</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interest is typically compounded monthly. This means you pay interest on your original balance plus the interest that has already accumulated.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Grace Period</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you pay your statement balance in full every month, most cards offer a grace period where no interest is charged on new purchases.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  What is APR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Annual Percentage Rate (APR) is the yearly interest rate you pay on your credit card balance. It's the primary factor in determining the cost of your debt.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  Why is my balance not going down?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  If you only make the minimum payment, most of that money goes toward interest rather than the principal balance, causing the debt to linger for years.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  Can I negotiate my interest rate?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes, you can often call your credit card issuer and ask for a lower rate, especially if you have a history of on-time payments and a good credit score.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  What is a balance transfer?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  A balance transfer involves moving debt from a high-interest card to one with a lower rate (often 0% for an introductory period) to save on interest.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-rose-50 border border-rose-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              Pro Tip: Pay More Than the Minimum
            </h3>
            <p className="text-rose-800 leading-relaxed">
              Even adding an extra $20 or $50 to your monthly payment can shave months or even years off your payoff time and save you hundreds in interest. Use this calculator to see how increasing your monthly payment by just a small amount changes your "Time to Pay Off" and "Total Interest Paid."
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Small Balance, High Rate</h4>
              <p className="text-sm text-slate-600">
                Balance of <strong>$2,000</strong> at <strong>24% APR</strong>, paying <strong>$100/month</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 26 Months to Pay Off</p>
                <p className="text-xs text-slate-500 mt-1">Total interest: ~$580</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Large Balance, Aggressive Payoff</h4>
              <p className="text-sm text-slate-600">
                Balance of <strong>$10,000</strong> at <strong>18% APR</strong>, paying <strong>$500/month</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 24 Months to Pay Off</p>
                <p className="text-xs text-slate-500 mt-1">Total interest: ~$1,978</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/credit-card-calculator" category="Finance" />
      </div>
    </div>
  );
}
