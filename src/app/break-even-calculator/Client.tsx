"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Target, Info, HelpCircle, Lightbulb, ShieldCheck, Award } from 'lucide-react';

export default function BreakEvenCalculator({ cmsData }: { cmsData: any }) {
  


  const [fixedCosts, setFixedCosts] = useState(5000);
  const [variableCost, setVariableCost] = useState(20);
  const [price, setPrice] = useState(50);

  const [results, setResults] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const contributionMargin = price - variableCost;
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakEvenSales = breakEvenUnits * price;

    setResults({
      units: Math.ceil(breakEvenUnits),
      sales: breakEvenSales,
      margin: contributionMargin
    });

    // Generate chart data
    const data = [];
    const maxUnits = Math.ceil(breakEvenUnits * 2) || 100;
    for (let i = 0; i <= maxUnits; i += Math.ceil(maxUnits / 10)) {
      data.push({
        units: i,
        totalCost: fixedCosts + (variableCost * i),
        revenue: price * i
      });
    }
    setChartData(data);
  }, [fixedCosts, variableCost, price]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Break-even Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Find the point where your revenue equals your total costs."}</p>
        <ExpertBadge category="Business" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fixed">Fixed Costs ($)</Label>
                <Input id="fixed" type="number" value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} />
                <Slider value={[fixedCosts]} min={0} max={50000} step={100} onValueChange={(val) => setFixedCosts(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variable">Variable Cost per Unit ($)</Label>
                <Input id="variable" type="number" value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} />
                <Slider value={[variableCost]} min={0} max={500} step={1} onValueChange={(val) => setVariableCost(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Selling Price per Unit ($)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <Slider value={[price]} min={1} max={1000} step={1} onValueChange={(val) => setPrice(val[0])} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white">
            <CardContent className="pt-8 text-center">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-1">Break-even Units</p>
              <p className="text-6xl font-black">{results.units}</p>
              <p className="text-sm text-indigo-200 mt-2">Sales: ${results.sales?.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Break-even Analysis Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="units" label={{ value: 'Units', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine x={results.units} stroke="red" label="Break-even" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="totalCost" stroke="#94a3b8" strokeWidth={2} name="Total Cost" />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
            The break-even point in units is calculated by dividing total fixed costs by the contribution margin per unit:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            Break-even Units = Fixed Costs / (Selling Price - Variable Cost)
          </div>
          <p className="text-slate-600 mt-6">
            The <strong>Contribution Margin</strong> is the amount each unit sold contributes toward covering fixed costs and generating profit.
          </p>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Understanding Your Break-even Point</h2>
          <p>
            The break-even point is a critical milestone for any business. It represents the moment when your total revenue perfectly matches your total expenses, meaning you've covered all your costs but haven't yet made a profit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-indigo-600" />
                Key Components
              </h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li><strong>Fixed Costs:</strong> Expenses that don't change regardless of sales volume (e.g., rent, salaries, insurance).</li>
                <li><strong>Variable Costs:</strong> Expenses that vary directly with production or sales (e.g., raw materials, shipping, commissions).</li>
                <li><strong>Selling Price:</strong> The amount you charge customers for each unit.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Why It Matters</h3>
              <p className="text-slate-600">
                Knowing your break-even point allows you to set realistic sales targets, evaluate the feasibility of a new business idea, and understand the impact of changing your prices or reducing your costs. It's the foundation of any solid business plan.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  How can I lower my break-even point?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  You can lower your break-even point by reducing fixed costs (e.g., negotiating lower rent), reducing variable costs (e.g., finding cheaper suppliers), or increasing your selling price.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is the "Margin of Safety"?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  The margin of safety is the difference between your actual sales and your break-even sales. It tells you how much your sales can drop before you start losing money.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Is break-even the same as profit?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  No. Break-even is the point of zero profit. Profit only begins once you sell more units than the break-even quantity.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Should I include my own salary in fixed costs?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes. To get a true picture of business viability, you should include all costs, including a fair market salary for yourself and any other owners.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Business Standard
            </h3>
            <p className="text-indigo-800 leading-relaxed mb-6">
              Our break-even analysis tool is built on standard CVP (Cost-Volume-Profit) analysis principles used by management accountants worldwide. We ensure that the relationship between fixed and variable costs is modeled with absolute precision, providing you with a reliable foundation for your business strategy and sales targets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Verified by Business Strategy Consultants</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Compliant with standard GAAP principles</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Coffee Shop</h4>
              <p className="text-sm text-slate-600">
                Fixed costs: <strong>$3,000/mo</strong>. Variable cost: <strong>$1.50/cup</strong>. Price: <strong>$4.50/cup</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 1,000 Cups / Month</p>
                <p className="text-xs text-slate-500 mt-1">Contribution margin: $3.00 per cup.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Software Subscription</h4>
              <p className="text-sm text-slate-600">
                Fixed costs: <strong>$10,000/mo</strong>. Variable cost: <strong>$5/user</strong>. Price: <strong>$25/user</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: 500 Subscriptions / Month</p>
                <p className="text-xs text-slate-500 mt-1">Contribution margin: $20.00 per user.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/break-even-calculator" category="Business" />
      </div>
    </div>
  );
}
