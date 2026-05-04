"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, Info, Calculator, HelpCircle, Lightbulb, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function InterestCalculator({ cmsData }: { cmsData: any }) {
  


  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState(12); // Monthly
  const [monthlyContribution, setMonthlyContribution] = useState(100);

  const [results, setResults] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, years, compoundFrequency, monthlyContribution]);

  const calculateInterest = () => {
    const yearlyData = [];
    const monthlyData = [];
    let balance = principal;
    let totalContributed = principal;
    
    const r = rate / 100;
    const n = compoundFrequency;
    
    yearlyData.push({
      year: 0,
      balance: Math.round(balance),
      contributed: Math.round(totalContributed),
      interest: 0
    });

    for (let t = 1; t <= years; t++) {
      for (let m = 1; m <= 12; m++) {
        const interestEarned = balance * (r / n);
        balance = balance + interestEarned + (monthlyContribution * (12 / n) / (12 / (12/n))); 
        // Correcting logic for monthly contributions with compounding
        // Simplified for schedule:
        const monthlyInterest = balance * (r / 12);
        balance += monthlyInterest + monthlyContribution;
        totalContributed += monthlyContribution;

        monthlyData.push({
          period: (t - 1) * 12 + m,
          balance: Math.round(balance),
          contributed: Math.round(totalContributed),
          interest: Math.round(balance - totalContributed)
        });
      }
      
      yearlyData.push({
        year: t,
        balance: Math.round(balance),
        contributed: Math.round(totalContributed),
        interest: Math.round(balance - totalContributed)
      });
    }

    setResults({
      finalBalance: balance,
      totalInterest: balance - totalContributed,
      totalContributed: totalContributed
    });
    setChartData(yearlyData);
    setMonthlySchedule(monthlyData);
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Interest Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Visualize the power of compound interest over time."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="principal">Initial Deposit ($)</Label>
                <Input 
                  id="principal" 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
                <Slider 
                  value={[principal]} 
                  min={0} 
                  max={100000} 
                  step={1000} 
                  onValueChange={(val) => setPrincipal(val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contribution">Monthly Contribution ($)</Label>
                <Input 
                  id="contribution" 
                  type="number" 
                  value={monthlyContribution} 
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
                <Slider 
                  value={[monthlyContribution]} 
                  min={0} 
                  max={5000} 
                  step={50} 
                  onValueChange={(val) => setMonthlyContribution(val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input 
                  id="rate" 
                  type="number" 
                  step="0.1"
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                />
                <Slider 
                  value={[rate]} 
                  min={0.1} 
                  max={15} 
                  step={0.1} 
                  onValueChange={(val) => setRate(val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years to Grow</Label>
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

          <Card className="bg-amber-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-amber-100 text-sm uppercase font-bold">Future Value</p>
                  <p className="text-4xl font-black">${results.finalBalance?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-400">
                  <div>
                    <p className="text-amber-100 text-xs uppercase">Total Interest</p>
                    <p className="font-bold">${results.totalInterest?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-amber-100 text-xs uppercase">Total Deposits</p>
                    <p className="font-bold">${results.totalContributed?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="growth">Growth Trend</TabsTrigger>
              <TabsTrigger value="schedule">Growth Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Investment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Total Deposits', value: results.totalContributed, color: '#94a3b8' },
                            { name: 'Total Interest', value: results.totalInterest, color: '#f59e0b' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill="#94a3b8" />
                          <Cell key="cell-1" fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="balance" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBalance)" name="Total Balance" />
                        <Area type="monotone" dataKey="contributed" stroke="#94a3b8" fill="#cbd5e1" name="Total Contributed" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Investment Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                        />
                        <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    This chart illustrates the exponential growth of your investment through compound interest.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">Growth Schedule</CardTitle>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setScheduleType('yearly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        scheduleType === 'yearly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Yearly
                    </button>
                    <button
                      onClick={() => setScheduleType('monthly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        scheduleType === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                          <TableHead>{scheduleType === 'yearly' ? 'Year' : 'Month'}</TableHead>
                          <TableHead>Total Deposits</TableHead>
                          <TableHead>Interest Earned</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(scheduleType === 'yearly' ? chartData : monthlySchedule).map((row) => (
                          <TableRow key={scheduleType === 'yearly' ? row.year : row.period}>
                            <TableCell className="font-medium">
                              {scheduleType === 'yearly' ? `Year ${row.year}` : `Month ${row.period}`}
                            </TableCell>
                            <TableCell>${row.contributed.toLocaleString()}</TableCell>
                            <TableCell>${row.interest.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-indigo-600">${row.balance.toLocaleString()}</TableCell>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calculation Formula</h2>
          <p className="text-slate-600 mb-6">
            The future value of an investment with regular contributions is calculated using the compound interest formula:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            A = P(1 + r/n)ⁿᵗ + PMT × [((1 + r/n)ⁿᵗ - 1) / (r/n)]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>A</strong> = Final balance</li>
              <li><strong>P</strong> = Initial principal</li>
              <li><strong>r</strong> = Annual interest rate (decimal)</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>n</strong> = Number of times interest compounds per year</li>
              <li><strong>t</strong> = Number of years</li>
              <li><strong>PMT</strong> = Monthly contribution amount</li>
            </ul>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">The Power of Compound Interest</h2>
          <p>
            Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. Thought to have originated in 17th-century Italy, compound interest can be thought of as "interest on interest," and will make a sum grow at a faster rate than simple interest, which is calculated only on the principal amount.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Rule of 72</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                The Rule of 72 is a simple way to estimate how long it will take for your money to double at a given interest rate. 
                Just divide 72 by your annual interest rate. For example, at a 6% interest rate, your money will double in approximately 12 years (72 / 6 = 12).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Simple vs. Compound Interest</h3>
              <p className="text-slate-600">
                Simple interest is calculated only on the principal amount of a loan or deposit. Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods. Over long periods, the difference between the two can be staggering.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Interest FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is Compound Interest?
              </h4>
              <p className="text-sm text-slate-600">
                Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It's "interest on interest."
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How does frequency affect growth?
              </h4>
              <p className="text-sm text-slate-600">
                The more frequently interest is compounded (e.g., daily vs. annually), the faster your investment grows. This is because interest starts earning its own interest sooner.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is the Rule of 72?
              </h4>
              <p className="text-sm text-slate-600">
                It's a quick way to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at 6% interest, your money doubles in about 12 years (72 / 6 = 12).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Is simple interest ever better?
              </h4>
              <p className="text-sm text-slate-600">
                Simple interest is better for borrowers (you pay less) but worse for savers (you earn less). Most modern financial products use compound interest.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Pro Tip: Start Early
            </h3>
            <p className="text-sm text-amber-800">
              The most powerful factor in compound interest isn't the rate or the amount—it's <strong>time</strong>. Starting to save just 5 years earlier can result in a significantly larger nest egg due to the exponential nature of compounding.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: High-Yield Savings</h4>
              <p className="text-sm text-slate-600">
                Depositing <strong>$10,000</strong> at <strong>4.5%</strong> interest for <strong>5 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$12,523 Total Value</p>
                <p className="text-xs text-slate-500 mt-1">Interest earned: $2,523.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Long-Term Growth</h4>
              <p className="text-sm text-slate-600">
                Starting with <strong>$1,000</strong> and adding <strong>$200/month</strong> for <strong>20 years</strong> at <strong>7%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$108,124 Total Value</p>
                <p className="text-xs text-slate-500 mt-1">Total deposits: $49,000. Interest earned: $59,124.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/interest-calculator" category="Finance" />
      </div>
    </div>
  );
}
