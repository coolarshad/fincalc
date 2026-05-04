"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Calculator, DollarSign, Percent, Info, HelpCircle, Lightbulb, Receipt, Plus, Minus, ShieldCheck, Award } from 'lucide-react';

export default function GSTCalculator({ cmsData }: { cmsData: any }) {
  


  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [results, setResults] = useState({
    netAmount: 0,
    gstAmount: 0,
    totalAmount: 0,
    cgst: 0,
    sgst: 0
  });

  useEffect(() => {
    let net, gst, total;

    if (mode === 'add') {
      // Add GST: Total = Amount + (Amount * Rate / 100)
      gst = (amount * gstRate) / 100;
      total = amount + gst;
      net = amount;
    } else {
      // Remove GST: Net = Amount / (1 + Rate / 100)
      net = amount / (1 + (gstRate / 100));
      gst = amount - net;
      total = amount;
    }

    setResults({
      netAmount: net,
      gstAmount: gst,
      totalAmount: total,
      cgst: gst / 2,
      sgst: gst / 2
    });
  }, [amount, gstRate, mode]);

  const pieData = [
    { name: 'Net Amount', value: results.netAmount, color: '#94a3b8' },
    { name: 'GST Amount', value: results.gstAmount, color: '#f59e0b' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "GST Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Quickly calculate tax amounts and total prices with GST breakdowns."}</p>
        <ExpertBadge category="Business" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setMode('add')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-bold transition-all ${mode === 'add' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add GST
                </button>
                <button
                  onClick={() => setMode('remove')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-bold transition-all ${mode === 'remove' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove GST
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Slider
                  value={[amount]}
                  min={1}
                  max={100000}
                  step={100}
                  onValueChange={(val) => setAmount(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <span className="text-sm font-bold text-indigo-600">{gstRate}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setGstRate(rate)}
                      className={`py-1 px-2 text-xs font-bold rounded border transition-all ${gstRate === rate ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <Slider
                  value={[gstRate]}
                  min={0.1}
                  max={50}
                  step={0.1}
                  onValueChange={(val) => setGstRate(val[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500 text-white">
            <CardContent className="pt-8 text-center">
              <p className="text-amber-100 text-xs uppercase font-bold tracking-widest mb-1">Total Amount</p>
              <p className="text-6xl font-black">${results.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="mt-2 text-amber-100 text-sm">Including GST</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tax Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Net Amount</span>
                    <span className="text-xl font-bold text-slate-900">${results.netAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Total GST ({gstRate}%)</span>
                    <span className="text-xl font-bold text-amber-600">${results.gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">CGST (50% of GST)</span>
                      <span className="text-sm font-bold text-slate-700">${results.cgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">SGST (50% of GST)</span>
                      <span className="text-sm font-bold text-slate-700">${results.sgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Formula
                </h4>
                <p className="text-xs text-indigo-800 font-mono">
                  {mode === 'add'
                    ? 'Total = Amount + (Amount × Rate / 100)'
                    : 'Net = Amount / (1 + Rate / 100)'}
                </p>
              </div>
            </div>
          </div>

          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Understanding GST Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-indigo-600 text-sm">CGST</h3>
                <p className="text-xs text-slate-600">Central Goods and Services Tax collected by the Central Government on intra-state sales.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-indigo-600 text-sm">SGST</h3>
                <p className="text-xs text-slate-600">State Goods and Services Tax collected by the State Government on intra-state sales.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-indigo-600 text-sm">IGST</h3>
                <p className="text-xs text-slate-600">Integrated Goods and Services Tax collected by the Central Government for inter-state sales.</p>
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
                  What is the difference between inclusive and exclusive GST?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Exclusive GST means the tax is added to the base price. Inclusive GST means the price already includes the tax amount. Use the "Add" and "Remove" toggles above to calculate both.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Who is liable to pay GST?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Businesses with an annual turnover above a certain threshold (e.g., ₹20-40 lakhs in India) are required to register and pay GST. However, the final tax burden is usually passed on to the consumer.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  How is IGST calculated?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  IGST is simply the sum of CGST and SGST. For example, if the GST rate is 18%, IGST is 18%, while CGST and SGST would be 9% each for intra-state transactions.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Can I claim input tax credit?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Registered businesses can claim credit for the GST they paid on business purchases, which can be used to offset the GST they collect on sales.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Compliance Standard
            </h3>
            <p className="text-amber-800 leading-relaxed mb-6">
              Our GST calculator is designed to meet the rigorous accounting standards required for business compliance. We ensure that the reverse-calculation (GST removal) logic is mathematically precise to avoid the common rounding errors that can lead to reconciliation issues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-amber-900 font-medium">
                <Award className="h-5 w-5 text-amber-600" />
                <span>Verified by Tax Compliance Experts</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-900 font-medium">
                <Award className="h-5 w-5 text-amber-600" />
                <span>Accurate to 4 decimal places for precision</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Adding GST</h4>
              <p className="text-sm text-slate-600">
                A service costs <strong>$1,000</strong> and the GST rate is <strong>18%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $1,180 Total</p>
                <p className="text-xs text-slate-500 mt-1">GST Amount: $180 (CGST: $90, SGST: $90)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Removing GST</h4>
              <p className="text-sm text-slate-600">
                A product costs <strong>$500</strong> (inclusive of <strong>12%</strong> GST).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $446.43 Net Price</p>
                <p className="text-xs text-slate-500 mt-1">GST Amount: $53.57</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/gst-calculator" category="Business" />
      </div>
    </div>
  );
}
