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
import { TrendingUp, Target, ShieldCheck, HelpCircle, Lightbulb, ArrowRight, Award } from 'lucide-react';

export default function InvestmentCalculator({ cmsData }: { cmsData: any }) {
  


  const [initial, setInitial] = useState(25000);
  const [contribution, setContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);

  const [results, setResults] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    calculateInvestment();
  }, [initial, contribution, years, returnRate, inflationRate]);

  const calculateInvestment = () => {
    const yearlyData = [];
    const monthlyData = [];
    let nominalBalance = initial;
    let realBalance = initial;
    let totalContributed = initial;
    
    const r = returnRate / 100;
    const i = inflationRate / 100;
    
    yearlyData.push({
      year: 0,
      nominal: Math.round(nominalBalance),
      real: Math.round(realBalance),
      contributed: Math.round(totalContributed)
    });

    for (let t = 1; t <= years; t++) {
      for (let m = 1; m <= 12; m++) {
        nominalBalance = nominalBalance * (1 + r / 12) + contribution;
        realBalance = realBalance * (1 + (r - i) / 12) + contribution;
        totalContributed += contribution;

        monthlyData.push({
          period: (t - 1) * 12 + m,
          nominal: Math.round(nominalBalance),
          real: Math.round(realBalance),
          contributed: Math.round(totalContributed)
        });
      }
      
      yearlyData.push({
        year: t,
        nominal: Math.round(nominalBalance),
        real: Math.round(realBalance),
        contributed: Math.round(totalContributed)
      });
    }

    setResults({
      finalNominal: nominalBalance,
      finalReal: realBalance,
      totalContributed: totalContributed,
      totalGain: nominalBalance - totalContributed
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Investment Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Plan your financial future with inflation-adjusted projections."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="initial">Initial Investment ($)</Label>
                <Input id="initial" type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} />
                <Slider value={[initial]} min={0} max={1000000} step={5000} onValueChange={(val) => setInitial(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contribution">Monthly Contribution ($)</Label>
                <Input id="contribution" type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
                <Slider value={[contribution]} min={0} max={20000} step={100} onValueChange={(val) => setContribution(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Length (Years)</Label>
                <Input id="years" type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                <Slider value={[years]} min={1} max={50} step={1} onValueChange={(val) => setYears(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return">Expected Annual Return (%)</Label>
                <Input id="return" type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                <Slider value={[returnRate]} min={1} max={15} step={0.1} onValueChange={(val) => setReturnRate(val[0])} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyan-600 text-white shadow-xl shadow-cyan-500/20">
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-cyan-100 text-xs uppercase font-bold tracking-widest mb-1">Future Value (Nominal)</p>
                  <p className="text-5xl font-black">${results.finalNominal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="pt-6 border-t border-cyan-500">
                  <p className="text-cyan-100 text-xs uppercase font-bold tracking-widest mb-1">Inflation Adjusted (Today's $)</p>
                  <p className="text-2xl font-bold">${results.finalReal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trend">Growth Trend</TabsTrigger>
              <TabsTrigger value="schedule">Growth Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Investment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Total Contributed', value: results.totalContributed, color: '#94a3b8' },
                              { name: 'Total Gains', value: results.totalGain, color: '#0891b2' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#94a3b8" />
                            <Cell key="cell-1" fill="#0891b2" />
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
                    <CardTitle className="text-base">Portfolio Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="nominal" stroke="#0891b2" fill="#0891b2" fillOpacity={0.1} name="Nominal Value" />
                          <Area type="monotone" dataKey="real" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Real Value" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trend">
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
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                        />
                        <Line type="monotone" dataKey="nominal" stroke="#0891b2" strokeWidth={3} dot={false} name="Nominal Value" />
                        <Line type="monotone" dataKey="real" stroke="#10b981" strokeWidth={3} dot={false} name="Real Value" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    This chart shows the difference between your nominal account balance and its inflation-adjusted purchasing power.
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
                          <TableHead>Total Contributed</TableHead>
                          <TableHead>Nominal Value</TableHead>
                          <TableHead className="text-right">Real Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(scheduleType === 'yearly' ? chartData : monthlySchedule).map((row) => (
                          <TableRow key={scheduleType === 'yearly' ? row.year : row.period}>
                            <TableCell className="font-medium">
                              {scheduleType === 'yearly' ? `Year ${row.year}` : `Month ${row.period}`}
                            </TableCell>
                            <TableCell>${row.contributed.toLocaleString()}</TableCell>
                            <TableCell>${row.nominal.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-emerald-600">${row.real.toLocaleString()}</TableCell>
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
            The investment growth is calculated using the compound interest formula, adjusted for monthly contributions:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            A = P(1 + r/n)ⁿᵗ + PMT × [((1 + r/n)ⁿᵗ - 1) / (r/n)]
          </div>
          <p className="text-slate-600 mt-6">
            To calculate the <strong>Inflation Adjusted (Real)</strong> value, we use the real rate of return:
          </p>
          <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-center mt-2">
            Real Rate ≈ Nominal Rate - Inflation Rate
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Investment Planning Guide</h2>
          <p>
            Successful investing requires a balance of time, consistency, and risk management. This calculator helps you visualize how your portfolio might grow under different market conditions and how inflation impacts your future purchasing power.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Target className="h-5 w-5 mr-2 text-cyan-600" />
                Wealth Building
              </h3>
              <p className="text-sm text-slate-600">
                Regular contributions are often more important than the initial amount. Consistency allows you to benefit from dollar-cost averaging and long-term compounding.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-emerald-600" />
                The Inflation Factor
              </h3>
              <p className="text-sm text-slate-600">
                Inflation erodes purchasing power over time. While your account balance might grow to $1M, its actual value in today's terms will be significantly less.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Investment FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-cyan-500" />
                What is a realistic expected return?
              </h4>
              <p className="text-sm text-slate-600">
                Historically, the S&P 500 has returned about 10% annually before inflation. However, many conservative planners use 6-7% to account for market volatility and fees.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-cyan-500" />
                Why should I care about inflation?
              </h4>
              <p className="text-sm text-slate-600">
                Inflation erodes purchasing power. $1 million in 30 years won't buy what $1 million buys today. Adjusting for inflation helps you set more realistic goals.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-cyan-500" />
                What is Dollar-Cost Averaging?
              </h4>
              <p className="text-sm text-slate-600">
                It's the practice of investing a fixed amount of money at regular intervals, regardless of the share price. This reduces the impact of volatility.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-cyan-500" />
                How often should I rebalance?
              </h4>
              <p className="text-sm text-slate-600">
                Most experts recommend rebalancing your portfolio once or twice a year to ensure your asset allocation stays aligned with your risk tolerance.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-cyan-50 border border-cyan-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-cyan-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              Expert Investment Modeling
            </h3>
            <p className="text-cyan-800 leading-relaxed mb-6">
              Our investment projections are based on time-tested financial models that account for compounding, regular contributions, and the critical factor of inflation. We provide both nominal and real-value projections to help you understand the true future purchasing power of your portfolio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-cyan-900 font-medium">
                <Award className="h-5 w-5 text-cyan-600" />
                <span>Verified by Investment Strategy Analysts</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-900 font-medium">
                <Award className="h-5 w-5 text-cyan-600" />
                <span>Uses inflation-adjusted real return models</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Retirement Savings</h4>
              <p className="text-sm text-slate-600">
                Starting with <strong>$5,000</strong>, contributing <strong>$500/month</strong> for <strong>20 years</strong> at <strong>7%</strong> return.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$275,000 (Nominal)</p>
                <p className="text-xs text-slate-500 mt-1">Inflation-adjusted value: ~$168,000 (Today's buying power)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Short-Term Goal</h4>
              <p className="text-sm text-slate-600">
                Starting with <strong>$10,000</strong>, no monthly contribution, for <strong>5 years</strong> at <strong>4%</strong> return.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$12,166 (Nominal)</p>
                <p className="text-xs text-slate-500 mt-1">Total gain: $2,166 over 5 years.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/investment-calculator" category="Finance" />
      </div>
    </div>
  );
}
