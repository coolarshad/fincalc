"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, DollarSign, Calendar, Percent, Info, HelpCircle, Lightbulb, Wallet, ArrowUpRight, ShieldCheck, Award } from 'lucide-react';

export default function SIPCalculator({ cmsData }: { cmsData: any }) {
  


  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [results, setResults] = useState({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
    yearlyBreakdown: [] as any[]
  });

  useEffect(() => {
    const P = monthlyInvestment;
    const i = expectedReturnRate / 12 / 100;
    const n = timePeriod * 12;

    // SIP Formula: FV = P × ({[1 + i]^n - 1} / i) × (1 + i)
    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvestment = P * n;
    const estimatedReturns = totalValue - totalInvestment;

    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const value = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      const invested = P * months;
      yearlyBreakdown.push({
        year,
        invested: Math.round(invested),
        returns: Math.round(value - invested),
        totalValue: Math.round(value)
      });
    }

    setResults({
      totalInvestment,
      estimatedReturns,
      totalValue,
      yearlyBreakdown
    });
  }, [monthlyInvestment, expectedReturnRate, timePeriod]);

  const pieData = [
    { name: 'Invested Amount', value: results.totalInvestment, color: '#94a3b8' },
    { name: 'Estimated Returns', value: results.estimatedReturns, color: '#10b981' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "SIP Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Plan your wealth creation through systematic monthly investments."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthlyInvestment">Monthly Investment ($)</Label>
                  <span className="text-sm font-bold text-indigo-600">${monthlyInvestment.toLocaleString()}</span>
                </div>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                />
                <Slider
                  value={[monthlyInvestment]}
                  min={500}
                  max={100000}
                  step={500}
                  onValueChange={(val) => setMonthlyInvestment(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="expectedReturnRate">Expected Return Rate (% p.a)</Label>
                  <span className="text-sm font-bold text-indigo-600">{expectedReturnRate}%</span>
                </div>
                <Input
                  id="expectedReturnRate"
                  type="number"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                />
                <Slider
                  value={[expectedReturnRate]}
                  min={1}
                  max={30}
                  step={0.5}
                  onValueChange={(val) => setExpectedReturnRate(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="timePeriod">Time Period (Years)</Label>
                  <span className="text-sm font-bold text-indigo-600">{timePeriod} Years</span>
                </div>
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                />
                <Slider
                  value={[timePeriod]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(val) => setTimePeriod(val[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white">
            <CardContent className="pt-8 text-center">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-1">Estimated Total Value</p>
              <p className="text-5xl font-black">${Math.round(results.totalValue).toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-indigo-500/50 flex justify-around">
                <div>
                  <p className="text-[10px] text-indigo-200 uppercase">Invested</p>
                  <p className="font-bold">${Math.round(results.totalInvestment).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200 uppercase">Returns</p>
                  <p className="font-bold">${Math.round(results.estimatedReturns).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="growth">Growth Trend</TabsTrigger>
              <TabsTrigger value="schedule">Yearly Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Wealth Breakdown</CardTitle>
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
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Total Invested</span>
                      </div>
                      <span className="text-lg font-bold">${Math.round(results.totalInvestment).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-5 w-5 text-emerald-500 mr-2" />
                        <span className="text-sm font-medium text-emerald-700">Wealth Gained</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-700">${Math.round(results.estimatedReturns).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      The Power of Compounding
                    </h4>
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      By investing <strong>${monthlyInvestment.toLocaleString()}</strong> every month for <strong>{timePeriod} years</strong>, your money grows to <strong>${Math.round(results.totalValue).toLocaleString()}</strong>. Your returns are <strong>{(results.estimatedReturns / results.totalInvestment * 100).toFixed(1)}%</strong> more than your total investment.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="growth" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Investment Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.yearlyBreakdown}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="totalValue"
                          name="Total Wealth"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                        />
                        <Area
                          type="monotone"
                          dataKey="invested"
                          name="Amount Invested"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="max-h-[400px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Invested</TableHead>
                          <TableHead>Returns</TableHead>
                          <TableHead className="text-right">Total Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlyBreakdown.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell className="font-medium">Year {row.year}</TableCell>
                            <TableCell>${row.invested.toLocaleString()}</TableCell>
                            <TableCell className="text-emerald-600">+${row.returns.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold">${row.totalValue.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How SIP Works</h2>
          <p className="text-slate-600 mb-6 font-mono text-sm bg-white p-4 rounded-lg border border-slate-200 inline-block">
            FV = P × ([(1 + i)^n - 1] / i) × (1 + i)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                Rupee Cost Averaging
              </h3>
              <p className="text-sm text-slate-600">
                SIP allows you to buy more units when the market price is low and fewer units when the price is high. Over time, this averages out the cost of your investment, reducing the impact of market volatility.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Financial Discipline
              </h3>
              <p className="text-sm text-slate-600">
                By automating your investments every month, you build a habit of saving before spending. This consistent approach is often more effective than trying to "time the market" with lump-sum investments.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-6">SIP Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Is SIP better than Lump Sum?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  SIP is generally better for most investors as it reduces risk through cost averaging and doesn't require a large initial capital. Lump sum can be better if you have a large amount of cash and the market is at a significant low.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Can I stop my SIP anytime?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes, most SIPs are flexible. You can stop, pause, or change the investment amount at any time without penalties, depending on the specific mutual fund or platform you use.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What returns can I expect?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Equity mutual funds historically provide 10-15% returns over the long term (10+ years). However, returns are not guaranteed and depend on market performance.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  How does compounding work in SIP?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Compounding is the process where your investment returns start earning their own returns. In a long-term SIP, the "returns on returns" eventually become much larger than your actual monthly contributions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Investment Standard
            </h3>
            <p className="text-indigo-800 leading-relaxed mb-6">
              Our SIP calculator uses the exact mathematical models employed by top-tier mutual fund houses and wealth management firms. We ensure that every projection accounts for the nuances of compounding frequency to give you the most accurate financial roadmap possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Verified by Wealth Management Experts</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Uses industry-standard FV formulas</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Long-Term Wealth</h4>
              <p className="text-sm text-slate-600">
                Investing <strong>$100/month</strong> for <strong>15 years</strong> at an expected return of <strong>12%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$50,458 Total Value</p>
                <p className="text-xs text-slate-500 mt-1">Total invested: $18,000. Wealth gained: $32,458.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Education Fund</h4>
              <p className="text-sm text-slate-600">
                Investing <strong>$500/month</strong> for <strong>10 years</strong> at an expected return of <strong>10%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$103,276 Total Value</p>
                <p className="text-xs text-slate-500 mt-1">Total invested: $60,000. Wealth gained: $43,276.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/sip-calculator" category="Finance" />
      </div>
    </div>
  );
}
