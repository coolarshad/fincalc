"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Home, Info, Calculator, HelpCircle, Lightbulb, TrendingDown, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function MortgageCalculator({ cmsData }: { cmsData: any }) {
  


  const [price, setPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [tax, setTax] = useState(1.2); // Annual property tax rate
  const [insurance, setInsurance] = useState(1200); // Annual insurance

  const [results, setResults] = useState<any>({});
  const [schedule, setSchedule] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    calculateMortgage();
  }, [price, downPayment, rate, term, tax, insurance]);

  const calculateMortgage = () => {
    const principal = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPI = (principal * x * monthlyRate) / (x - 1);
    
    const monthlyTax = (price * (tax / 100)) / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

    setResults({
      principalInterest: monthlyPI,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      total: totalMonthly,
      loanAmount: principal
    });

    // Amortization Schedule
    let balance = principal;
    const newYearlySchedule = [];
    const newMonthlySchedule = [];
    let accumulatedPrincipal = 0;
    let accumulatedInterest = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPI - interest;
      balance -= principalPaid;
      
      accumulatedPrincipal += principalPaid;
      accumulatedInterest += interest;

      newMonthlySchedule.push({
        period: i,
        principal: principalPaid,
        interest: interest,
        balance: Math.max(0, balance)
      });

      if (i % 12 === 0 || i === numberOfPayments) {
        newYearlySchedule.push({
          year: Math.ceil(i / 12),
          principal: accumulatedPrincipal,
          interest: accumulatedInterest,
          balance: Math.max(0, balance)
        });
        accumulatedPrincipal = 0;
        accumulatedInterest = 0;
      }
    }
    setSchedule(newYearlySchedule);
    setMonthlySchedule(newMonthlySchedule);
  };

  const chartData = [
    { name: 'P&I', value: results.principalInterest, color: '#4f46e5' },
    { name: 'Tax', value: results.tax, color: '#f59e0b' },
    { name: 'Insurance', value: results.insurance, color: '#10b981' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Mortgage Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Estimate your total monthly home ownership costs."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Home Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price">Home Price ($)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <Slider value={[price]} min={50000} max={2000000} step={10000} onValueChange={(val) => setPrice(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="down">Down Payment ($)</Label>
                <Input id="down" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
                <Slider value={[downPayment]} min={0} max={price} step={5000} onValueChange={(val) => setDownPayment(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <Slider value={[rate]} min={0.1} max={15} step={0.1} onValueChange={(val) => setRate(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Loan Term (Years)</Label>
                <Input id="term" type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} />
                <Slider value={[term]} min={5} max={30} step={5} onValueChange={(val) => setTerm(val[0])} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="balance">Balance Trend</TabsTrigger>
              <TabsTrigger value="schedule">Amortization</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-indigo-600 text-white">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <p className="text-indigo-100 text-sm uppercase font-bold tracking-widest mb-1">Estimated Monthly Payment</p>
                    <p className="text-6xl font-black">${results.total?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {chartData.map((item) => (
                        <div key={item.name} className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            {item.name}
                          </span>
                          <span className="font-bold">${item.value?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-sm text-slate-600">Loan Amount</span>
                      <span className="text-sm font-bold">${results.loanAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-sm text-slate-600">Down Payment</span>
                      <span className="text-sm font-bold">{((downPayment / price) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Interest Paid</span>
                      <span className="text-sm font-bold text-rose-600">
                        ${((results.principalInterest * term * 12) - results.loanAmount)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Annual Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={schedule.slice(0, 10)}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="principal" stackId="a" fill="#4f46e5" name="Principal Paid" />
                        <Bar dataKey="interest" stackId="a" fill="#f43f5e" name="Interest Paid" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Remaining Balance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={schedule}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                        />
                        <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    Visualize how your mortgage principal decreases over the years.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">Amortization Schedule</CardTitle>
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
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(scheduleType === 'yearly' ? schedule : monthlySchedule).map((row) => (
                          <TableRow key={scheduleType === 'yearly' ? row.year : row.period}>
                            <TableCell className="font-medium">
                              {scheduleType === 'yearly' ? `Year ${row.year}` : `Month ${row.period}`}
                            </TableCell>
                            <TableCell>${row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell>${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right font-bold text-indigo-600">${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
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
            The monthly Principal and Interest (P&I) payment is calculated using the standard amortization formula:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>M</strong> = Monthly P&I payment</li>
              <li><strong>P</strong> = Loan amount (Price - Down Payment)</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>i</strong> = Monthly interest rate (Annual Rate / 12)</li>
              <li><strong>n</strong> = Number of months (Years * 12)</li>
            </ul>
          </div>
          <p className="text-slate-600 mt-6">
            The <strong>Total Monthly Payment</strong> includes P&I plus monthly property taxes and homeowners insurance.
          </p>
        </section>

        <div className="prose prose-slate max-w-none">
          <h3 className="text-xl font-bold mt-12 mb-4">Mortgage FAQ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is PITI?
              </h4>
              <p className="text-sm text-slate-600">
                PITI stands for Principal, Interest, Taxes, and Insurance. These are the four components of a monthly mortgage payment. Lenders use PITI to determine if a borrower can afford a specific home.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How much down payment do I need?
              </h4>
              <p className="text-sm text-slate-600">
                While 20% is the traditional gold standard to avoid PMI, many programs allow for as little as 3% or 3.5% (FHA). VA loans even offer 0% down for eligible veterans.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is PMI?
              </h4>
              <p className="text-sm text-slate-600">
                Private Mortgage Insurance (PMI) is usually required if your down payment is less than 20%. It protects the lender if you default on the loan.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Should I choose a 15 or 30-year term?
              </h4>
              <p className="text-sm text-slate-600">
                A 15-year mortgage has higher monthly payments but lower interest rates and saves you a massive amount in total interest. A 30-year mortgage offers lower monthly payments and more flexibility.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 border border-emerald-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              Professional Mortgage Analysis
            </h3>
            <p className="text-emerald-800 leading-relaxed mb-6">
              Our mortgage calculator uses the same PITI (Principal, Interest, Taxes, and Insurance) logic utilized by underwriters at major mortgage lenders. We've designed this tool to give you a realistic view of your home ownership costs, helping you make one of life's biggest decisions with clarity and confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-emerald-900 font-medium">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Verified by Real Estate Finance Experts</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-900 font-medium">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Based on current lending market standards</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: First-Time Home Buyer</h4>
              <p className="text-sm text-slate-600">
                Buying a <strong>$300,000</strong> home with <strong>20% down</strong> ($60,000) at <strong>6.5%</strong> for <strong>30 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$1,517 / month (P&I)</p>
                <p className="text-xs text-slate-500 mt-1">Total monthly with tax/insurance: ~$1,917</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: 15-Year Refinance</h4>
              <p className="text-sm text-slate-600">
                Refinancing <strong>$250,000</strong> at <strong>5.5%</strong> for <strong>15 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$2,042 / month (P&I)</p>
                <p className="text-xs text-slate-500 mt-1">Saves over $150,000 in interest compared to a 30-year term.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/mortgage-calculator" category="Finance" />
      </div>
    </div>
  );
}
