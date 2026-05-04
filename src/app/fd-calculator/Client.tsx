"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Landmark, ShieldCheck, HelpCircle, Lightbulb, ArrowRight } from 'lucide-react';

export default function FDCalculator({ cmsData }: { cmsData: any }) {
  


  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [tenure, setTenure] = useState(5);
  const [frequency, setFrequency] = useState('4'); // Quarterly compounding

  const [results, setResults] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    const n = Number(frequency);
    const r = rate / 100;
    const t = tenure;
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityValue = principal * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityValue - principal;

    setResults({
      maturityValue,
      interestEarned
    });

    // Chart data and schedules
    const data = [];
    const monthlyData = [];
    
    data.push({
      year: 0,
      value: principal,
      interest: 0
    });

    for (let i = 1; i <= t; i++) {
      const yearValue = Math.round(principal * Math.pow(1 + r / n, n * i));
      data.push({
        year: i,
        value: yearValue,
        interest: yearValue - principal
      });

      for (let m = 1; m <= 12; m++) {
        const totalMonths = (i - 1) * 12 + m;
        const monthValue = Math.round(principal * Math.pow(1 + r / n, n * (totalMonths / 12)));
        monthlyData.push({
          period: `${i} - M${m}`,
          value: monthValue,
          interest: monthValue - principal
        });
      }
    }
    setChartData(data);
    setMonthlySchedule(monthlyData);
  }, [principal, rate, tenure, frequency]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">FD Calculator</h1>
        <p className="text-slate-600">Estimate the returns on your low-risk fixed deposit investments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deposit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount ($)</Label>
                <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                <Slider value={[principal]} min={1000} max={1000000} step={5000} onValueChange={(val) => setPrincipal(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <Slider value={[rate]} min={1} max={15} step={0.1} onValueChange={(val) => setRate(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input id="tenure" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                <Slider value={[tenure]} min={1} max={20} step={1} onValueChange={(val) => setTenure(val[0])} />
              </div>

              <div className="space-y-2">
                <Label>Compounding Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="2">Half-Yearly</SelectItem>
                    <SelectItem value="1">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white">
            <CardContent className="pt-8 text-center space-y-4">
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Maturity Value</p>
                <p className="text-4xl font-black">${results.maturityValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-emerald-400">${results.interestEarned?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
                    <CardTitle className="text-base">Maturity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Principal', value: principal, color: '#94a3b8' },
                              { name: 'Total Interest', value: results.interestEarned, color: '#4f46e5' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#94a3b8" />
                            <Cell key="cell-1" fill="#4f46e5" />
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
                    <CardTitle className="text-base">Maturity Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} name="Balance" />
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
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                        />
                        <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={false} name="Balance" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    This chart illustrates the steady growth of your fixed deposit over the chosen tenure.
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
                          <TableHead>{scheduleType === 'yearly' ? 'Year' : 'Period'}</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest Earned</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(scheduleType === 'yearly' ? chartData : monthlySchedule).map((row) => (
                          <TableRow key={scheduleType === 'yearly' ? row.year : row.period}>
                            <TableCell className="font-medium">
                              {scheduleType === 'yearly' ? `Year ${row.year}` : row.period}
                            </TableCell>
                            <TableCell>${principal.toLocaleString()}</TableCell>
                            <TableCell>${row.interest.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-indigo-600">${row.value.toLocaleString()}</TableCell>
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
            The maturity value of a Fixed Deposit is calculated using the compound interest formula:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            A = P(1 + r/n)ⁿᵗ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>A</strong> = Maturity Value</li>
              <li><strong>P</strong> = Principal Amount</li>
              <li><strong>r</strong> = Annual Interest Rate (decimal)</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>n</strong> = Compounding frequency per year</li>
              <li><strong>t</strong> = Tenure in years</li>
            </ul>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Why Choose Fixed Deposits?</h2>
          <p>
            Fixed Deposits (FDs) are a cornerstone of conservative financial planning. They offer a guaranteed rate of return over a fixed period, making them an excellent choice for preserving capital while earning interest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-emerald-600" />
                Key Advantages
              </h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li><strong>Guaranteed Returns:</strong> Unlike market-linked investments, your returns are locked in at the time of deposit.</li>
                <li><strong>Flexible Tenure:</strong> Choose a period that fits your goals, from a few months to several years.</li>
                <li><strong>Loan Facility:</strong> Most banks allow you to take a loan against your FD in case of emergencies.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Compounding Frequency Matters</h3>
              <p className="text-slate-600">
                The more frequently interest is compounded, the higher your effective yield will be. For example, quarterly compounding will result in a slightly higher maturity value than annual compounding for the same interest rate and tenure.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">FD FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Is my money safe in an FD?
              </h4>
              <p className="text-sm text-slate-600">
                Yes, Fixed Deposits are considered one of the safest investment options. In many countries, deposits up to a certain limit are insured by the government or central bank.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Can I withdraw early?
              </h4>
              <p className="text-sm text-slate-600">
                Most banks allow premature withdrawal, but they usually charge a penalty (e.g., 0.5% to 1% reduction in interest rate).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is TDS on FD?
              </h4>
              <p className="text-sm text-slate-600">
                Tax Deducted at Source (TDS) is the tax collected by the bank on the interest earned if it exceeds a certain threshold. You can often submit forms to avoid this if your total income is below the taxable limit.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is a "Sweep-in" FD?
              </h4>
              <p className="text-sm text-slate-600">
                It's a facility where surplus funds in your savings account are automatically moved to an FD to earn higher interest, while remaining available for withdrawal if needed.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-indigo-50 border border-indigo-200 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Pro Tip: Laddering Strategy
            </h3>
            <p className="text-sm text-indigo-800">
              Instead of putting all your money into one large FD, split it into multiple FDs with different maturity dates (e.g., 1-year, 2-year, 3-year). This provides regular liquidity and helps you average out interest rate fluctuations.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Short-Term Deposit</h4>
              <p className="text-sm text-slate-600">
                Depositing <strong>$50,000</strong> at <strong>6.0%</strong> for <strong>1 year</strong> (Quarterly compounding).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$53,068 Maturity Value</p>
                <p className="text-xs text-slate-500 mt-1">Interest earned: $3,068.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Long-Term Savings</h4>
              <p className="text-sm text-slate-600">
                Depositing <strong>$100,000</strong> at <strong>7.5%</strong> for <strong>5 years</strong> (Quarterly compounding).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$144,995 Maturity Value</p>
                <p className="text-xs text-slate-500 mt-1">Interest earned: $44,995.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">Factors Affecting FD Interest Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Central Bank Policies</h4>
                <p className="text-sm text-slate-600">When the central bank (like the Fed or RBI) changes interest rates, commercial banks usually follow suit, affecting the rates offered on new FDs.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Inflation Rates</h4>
                <p className="text-sm text-slate-600">High inflation often leads to higher interest rates as lenders demand more compensation for the loss of purchasing power.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Bank's Liquidity Needs</h4>
                <p className="text-sm text-slate-600">If a bank needs to raise more capital, it might offer higher interest rates to attract more depositors.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Economic Conditions</h4>
                <p className="text-sm text-slate-600">In a growing economy, demand for credit is high, which can push interest rates upward.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/fd-calculator" category="Finance" />
      </div>
    </div>
  );
}
