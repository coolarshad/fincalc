"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, ArrowDownRight, Info, HelpCircle, Lightbulb, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function InflationCalculator({ cmsData }: { cmsData: any }) {
  


  const [amount, setAmount] = useState(1000);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2024);
  const [avgRate, setAvgRate] = useState(2.5);

  const [results, setResults] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    calculateInflation();
  }, [amount, startYear, endYear, avgRate]);

  const calculateInflation = () => {
    const years = endYear - startYear;
    const rate = avgRate / 100;
    const futureValue = amount * Math.pow(1 + rate, years);
    const purchasingPower = amount / Math.pow(1 + rate, years);

    const data = [];
    const monthlyData = [];
    
    for (let i = 0; i <= years; i++) {
      const yearValue = Math.round(amount * Math.pow(1 + rate, i));
      const yearPower = Math.round(amount / Math.pow(1 + rate, i));
      
      data.push({
        year: startYear + i,
        value: yearValue,
        power: yearPower
      });

      if (i < years) {
        const monthlyRate = Math.pow(1 + rate, 1/12) - 1;
        for (let m = 1; m <= 12; m++) {
          const totalMonths = i * 12 + m;
          monthlyData.push({
            period: `${startYear + i} - M${m}`,
            value: Math.round(amount * Math.pow(1 + monthlyRate, totalMonths)),
            power: Math.round(amount / Math.pow(1 + monthlyRate, totalMonths))
          });
        }
      }
    }

    setResults({
      futureValue,
      purchasingPower,
      totalIncrease: ((futureValue - amount) / amount) * 100
    });
    setChartData(data);
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Inflation Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Understand how the value of money changes over time."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Year</Label>
                  <Input id="start" type="number" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">End Year</Label>
                  <Input id="end" type="number" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Avg. Annual Inflation (%)</Label>
                <Input id="rate" type="number" step="0.1" value={avgRate} onChange={(e) => setAvgRate(Number(e.target.value))} />
                <Slider value={[avgRate]} min={0} max={20} step={0.1} onValueChange={(val) => setAvgRate(val[0])} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white">
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Value in {endYear}</p>
                  <p className="text-4xl font-black">${results.futureValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-emerald-400 mt-1">+{results.totalIncrease?.toFixed(1)}% Total Increase</p>
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Purchasing Power in {endYear}</p>
                  <p className="text-2xl font-bold text-rose-400">${results.purchasingPower?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-[10px] text-slate-500 mt-1">What ${amount} in {startYear} is worth in {endYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trend">Value Trend</TabsTrigger>
              <TabsTrigger value="schedule">Breakdown Table</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Impact Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Initial Value', value: amount, color: '#4f46e5' },
                              { name: 'Inflation Impact', value: results.futureValue - amount, color: '#f43f5e' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#4f46e5" />
                            <Cell key="cell-1" fill="#f43f5e" />
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
                    <CardTitle className="text-base">Purchasing Power Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="power" stroke="#f43f5e" strokeWidth={3} dot={false} name="Value of $1" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle>Value vs. Purchasing Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} name="Cost of Goods" />
                        <Line type="monotone" dataKey="power" stroke="#f43f5e" strokeWidth={3} name="Value of $1" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">Inflation Breakdown</CardTitle>
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
                          <TableHead>Cost of Goods</TableHead>
                          <TableHead className="text-right">Purchasing Power</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(scheduleType === 'yearly' ? chartData : monthlySchedule).map((row) => (
                          <TableRow key={scheduleType === 'yearly' ? row.year : row.period}>
                            <TableCell className="font-medium">
                              {scheduleType === 'yearly' ? row.year : row.period}
                            </TableCell>
                            <TableCell>${row.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-rose-600">${row.power.toLocaleString()}</TableCell>
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
            The impact of inflation on the future value of money is calculated using the following formulas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Future Value</p>
              <code className="text-lg font-mono">FV = PV × (1 + r)ⁿ</code>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Purchasing Power</p>
              <code className="text-lg font-mono">PP = PV / (1 + r)ⁿ</code>
            </div>
          </div>
          <div className="mt-6 text-sm text-slate-600 text-center">
            Where <strong>PV</strong> is present value, <strong>r</strong> is annual inflation rate, and <strong>n</strong> is number of years.
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Why Inflation Matters</h2>
          <p>
            Inflation is a silent force that gradually reduces the value of your money. While a $100 bill remains a $100 bill, what that bill can buy changes significantly over decades. Understanding this concept is vital for retirement planning and long-term investing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Did you know?
              </h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                Inflation is the rate at which the general level of prices for goods and services is rising. 
                As inflation rises, every dollar you own buys a smaller percentage of a good or service. 
                Central banks usually target an inflation rate of around 2% to maintain a healthy economy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How to Beat Inflation</h3>
              <p className="text-slate-600">
                To maintain your purchasing power, your income or investment returns must at least match the rate of inflation. Assets like stocks, real estate, and inflation-protected securities (TIPS) are traditionally used as "hedges" against rising prices.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Inflation FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is CPI?
              </h4>
              <p className="text-sm text-slate-600">
                The Consumer Price Index (CPI) is a measure that examines the weighted average of prices of a basket of consumer goods and services. It is one of the most frequently used statistics for identifying periods of inflation or deflation.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How does inflation affect debt?
              </h4>
              <p className="text-sm text-slate-600">
                Inflation can actually benefit borrowers. If you have a fixed-rate loan, you're paying back the debt with dollars that are worth less than when you borrowed them.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is Hyperinflation?
              </h4>
              <p className="text-sm text-slate-600">
                Hyperinflation is a term used to describe rapid, excessive, and out-of-control general price increases in an economy. It's usually defined as inflation exceeding 50% per month.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How can I protect my savings?
              </h4>
              <p className="text-sm text-slate-600">
                Investing in assets that tend to appreciate over time, such as stocks or real estate, can help your wealth keep pace with or exceed inflation.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-rose-50 border border-rose-200 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-rose-900 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Pro Tip: The "Real" Interest Rate
            </h3>
            <p className="text-sm text-rose-800">
              Always calculate your "real" return on investment by subtracting the inflation rate from your nominal return. If your savings account earns 1% but inflation is 3%, you are effectively losing 2% of your purchasing power every year.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Historical Comparison</h4>
              <p className="text-sm text-slate-600">
                What <strong>$1,000</strong> in <strong>1990</strong> would be worth in <strong>2024</strong> at <strong>2.5%</strong> avg inflation.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$2,315</p>
                <p className="text-xs text-slate-500 mt-1">Prices have more than doubled in 34 years.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Purchasing Power Loss</h4>
              <p className="text-sm text-slate-600">
                The value of <strong>$10,000</strong> after <strong>10 years</strong> of <strong>5%</strong> inflation.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$6,139 Purchasing Power</p>
                <p className="text-xs text-slate-500 mt-1">You've lost nearly 40% of your value.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/inflation-calculator" category="Finance" />
      </div>
    </div>
  );
}
