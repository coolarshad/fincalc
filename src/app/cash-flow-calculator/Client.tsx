"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, PieChart, Pie } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { ArrowUpRight, ArrowDownRight, Wallet, HelpCircle, Lightbulb, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CashFlowCalculator({ cmsData }: { cmsData: any }) {
  


  const [inflow, setInflow] = useState(5000);
  const [outflow, setOutflow] = useState(3500);
  
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const net = inflow - outflow;
    const ratio = outflow > 0 ? inflow / outflow : 0;

    setResults({
      net,
      ratio
    });
  }, [inflow, outflow]);

  const chartData = [
    { name: 'Inflow', value: inflow, color: '#10b981' },
    { name: 'Outflow', value: outflow, color: '#f43f5e' },
    { name: 'Net Cash', value: results.net, color: results.net >= 0 ? '#4f46e5' : '#f43f5e' }
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Cash Flow Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Monitor the movement of money in and out of your accounts."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inflow">Total Inflow ($)</Label>
                <Input id="inflow" type="number" value={inflow} onChange={(e) => setInflow(Number(e.target.value))} />
                <Slider value={[inflow]} min={0} max={20000} step={100} onValueChange={(val) => setInflow(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outflow">Total Outflow ($)</Label>
                <Input id="outflow" type="number" value={outflow} onChange={(e) => setOutflow(Number(e.target.value))} />
                <Slider value={[outflow]} min={0} max={20000} step={100} onValueChange={(val) => setOutflow(val[0])} />
              </div>
            </CardContent>
          </Card>

          <Card className={`${results.net >= 0 ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
            <CardContent className="pt-8 text-center">
              <p className="text-white/80 text-xs uppercase font-bold tracking-widest mb-1">Net Cash Flow</p>
              <p className="text-5xl font-black">${results.net?.toLocaleString()}</p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                {results.net >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                <span className="font-bold">{results.net >= 0 ? 'Surplus' : 'Deficit'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inflow vs Outflow Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-indigo-600" />
                    Coverage Ratio
                  </h3>
                  <p className="text-2xl font-black text-slate-900">{results.ratio?.toFixed(2)}x</p>
                  <p className="text-xs text-slate-500 mt-1">Income covers expenses {results.ratio?.toFixed(2)} times over.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="font-bold mb-2">Savings Rate</h3>
                  <p className="text-2xl font-black text-slate-900">
                    {inflow > 0 ? ((results.net / inflow) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Percentage of income remaining after all expenses.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Flow Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Expenses', value: outflow, color: '#f43f5e' },
                            { name: 'Savings', value: results.net > 0 ? results.net : 0, color: '#10b981' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill="#f43f5e" />
                          <Cell key="cell-1" fill="#10b981" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    This chart shows how your total inflow is split between expenses and potential savings.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
            Cash flow is a simple but powerful measure of financial health, calculated as:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            Net Cash Flow = Total Inflow - Total Outflow
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>Inflow:</strong> All income, including salary, dividends, and gifts.</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>Outflow:</strong> All expenses, including rent, food, and debt payments.</li>
            </ul>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h3 className="text-xl font-bold mt-12 mb-4">Cash Flow FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is "Positive" Cash Flow?
              </h4>
              <p className="text-sm text-slate-600">
                Positive cash flow means your inflow (income) is greater than your outflow (expenses). This surplus can be used for savings, investments, or debt repayment.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How often should I check?
              </h4>
              <p className="text-sm text-slate-600">
                A monthly review is ideal. It helps you spot trends, identify unnecessary expenses, and adjust your budget before small issues become big problems.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What if my flow is negative?
              </h4>
              <p className="text-sm text-slate-600">
                A negative flow (deficit) means you're spending more than you earn. This usually leads to debt. Focus on reducing discretionary spending or finding ways to increase income.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Is "Net Worth" the same?
              </h4>
              <p className="text-sm text-slate-600">
                No. Net worth is a snapshot of what you own minus what you owe. Cash flow is the movement of money over a specific period. You can have a high net worth but poor cash flow (e.g., owning a house but having no cash).
              </p>
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Pro Tip: Pay Yourself First
            </h3>
            <p className="text-sm text-emerald-800">
              Treat your savings as a mandatory monthly expense. Set up an automatic transfer to your savings or investment account on the day you get paid. This ensures you save before you have a chance to spend.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Young Professional</h4>
              <p className="text-sm text-slate-600">
                Inflow: <strong>$4,500</strong>. Outflow: <strong>$3,200</strong> (Rent, Food, Utils).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: +$1,300 Surplus</p>
                <p className="text-xs text-slate-500 mt-1">Savings rate: 28.9%.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Family Budget</h4>
              <p className="text-sm text-slate-600">
                Inflow: <strong>$8,000</strong>. Outflow: <strong>$8,500</strong> (Mortgage, Kids, Debt).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-rose-600">Result: -$500 Deficit</p>
                <p className="text-xs text-slate-500 mt-1">Action: Need to cut expenses or increase income.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">Strategies to Improve Cash Flow</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Increasing Inflow
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                  <li><strong>Negotiate a Raise:</strong> Research market rates for your role and present your achievements.</li>
                  <li><strong>Side Hustles:</strong> Explore freelance work, tutoring, or selling unused items.</li>
                  <li><strong>Passive Income:</strong> Invest in dividend-paying stocks or rental properties.</li>
                  <li><strong>Tax Optimization:</strong> Ensure you're claiming all eligible deductions and credits.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5" />
                  Reducing Outflow
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                  <li><strong>Audit Subscriptions:</strong> Cancel unused streaming services, gym memberships, or apps.</li>
                  <li><strong>Meal Planning:</strong> Reduce dining out and impulse grocery purchases.</li>
                  <li><strong>Refinance Debt:</strong> Look for lower interest rates on loans or credit cards.</li>
                  <li><strong>Energy Efficiency:</strong> Lower utility bills by being mindful of electricity and water usage.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/cash-flow-calculator" category="Finance" />
      </div>
    </div>
  );
}
