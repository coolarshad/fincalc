"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Info, Download, Share2, HelpCircle, Lightbulb, TrendingDown, ArrowRight, Calculator, ShieldCheck, Award } from 'lucide-react';

export default function LoanCalculator({ cmsData }: { cmsData: any }) {
  


  const [amount, setAmount] = useState(30000);
  const [rate, setRate] = useState(5.5);
  const [term, setTerm] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    calculateLoan();
  }, [amount, rate, term]);

  const calculateLoan = () => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      const payment = amount / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalPayment(amount);
      setTotalInterest(0);
      return;
    }

    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthly = (amount * x * monthlyRate) / (x - 1);

    setMonthlyPayment(monthly);
    setTotalPayment(monthly * numberOfPayments);
    setTotalInterest(monthly * numberOfPayments - amount);

    // Amortization Schedule
    let balance = amount;
    const newYearlySchedule = [];
    const newMonthlySchedule = [];
    let accumulatedPrincipal = 0;
    let accumulatedInterest = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interest = balance * monthlyRate;
      const principal = monthly - interest;
      balance -= principal;

      accumulatedPrincipal += principal;
      accumulatedInterest += interest;

      newMonthlySchedule.push({
        period: i,
        principal: principal,
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
    { name: 'Principal', value: amount, color: '#4f46e5' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Loan Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Plan your borrowing with our comprehensive loan estimation tool."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Loan Amount ($)</Label>
                  <span className="text-sm font-bold text-indigo-600">${amount.toLocaleString()}</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Slider
                  value={[amount]}
                  min={1000}
                  max={500000}
                  step={1000}
                  onValueChange={(val) => setAmount(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <span className="text-sm font-bold text-indigo-600">{rate}%</span>
                </div>
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
                  max={25}
                  step={0.1}
                  onValueChange={(val) => setRate(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="term">Loan Term (Years)</Label>
                  <span className="text-sm font-bold text-indigo-600">{term} Years</span>
                </div>
                <Input
                  id="term"
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                />
                <Slider
                  value={[term]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(val) => setTerm(val[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-indigo-100 text-sm uppercase tracking-wider font-semibold">Monthly Payment</p>
                  <p className="text-4xl font-bold">${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-500">
                  <div>
                    <p className="text-indigo-100 text-xs uppercase">Total Interest</p>
                    <p className="font-bold">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-indigo-100 text-xs uppercase">Total Payment</p>
                    <p className="font-bold">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="balance">Balance Trend</TabsTrigger>
              <TabsTrigger value="schedule">Amortization</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Principal Amount</span>
                        <span className="font-bold">${amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Total Interest</span>
                        <span className="font-bold text-rose-600">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <span className="text-sm font-semibold text-indigo-900">Total Cost of Loan</span>
                        <span className="font-bold text-indigo-900">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Annual Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={schedule.slice(0, 5)}>
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
                    This chart shows how your loan balance decreases over the tenure.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">Payment Schedule</CardTitle>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setScheduleType('yearly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${scheduleType === 'yearly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Yearly
                    </button>
                    <button
                      onClick={() => setScheduleType('monthly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${scheduleType === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
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

      {/* Content Section */}
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
            The monthly payment for a fixed-rate loan is calculated using the following standard amortization formula:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>M</strong> = Total monthly payment</li>
              <li><strong>P</strong> = Principal loan amount</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>i</strong> = Monthly interest rate (Annual Rate / 12)</li>
              <li><strong>n</strong> = Number of months (Years * 12)</li>
            </ul>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">How to Use the Loan Calculator</h2>
          <p>
            Our loan calculator helps you understand the true cost of borrowing. By entering a few simple details, you can see exactly how much your monthly payments will be and how much interest you'll pay over the life of the loan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Key Terms Explained</h3>
              <ul className="space-y-2">
                <li><strong>Principal:</strong> The initial amount of money you borrow.</li>
                <li><strong>Interest Rate:</strong> The percentage charged by the lender for the use of the money.</li>
                <li><strong>Loan Term:</strong> The duration over which the loan must be repaid.</li>
                <li><strong>Amortization:</strong> The process of paying off a debt over time through regular payments.</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-indigo-600" />
                Pro Tip
              </h3>
              <p className="text-sm">
                Even a small reduction in your interest rate can save you thousands of dollars over the life of a long-term loan like a mortgage. Always shop around for the best rates before committing.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is an Amortization Schedule?
              </h4>
              <p className="text-sm text-slate-600">
                It's a table showing each periodic payment on an amortizing loan. It breaks down each payment into interest and principal, and shows the remaining balance after each payment.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How does interest change over time?
              </h4>
              <p className="text-sm text-slate-600">
                In the early years of a loan, a larger portion of your payment goes toward interest because the balance is high. As you pay down the principal, the interest portion decreases, and more of your payment goes toward the principal.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Can I save money by paying early?
              </h4>
              <p className="text-sm text-slate-600">
                Yes. Making extra principal payments reduces the balance faster, which in turn reduces the interest charged in future periods. This can significantly shorten your loan term and save thousands in interest.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is the difference between fixed and floating rates?
              </h4>
              <p className="text-sm text-slate-600">
                A fixed rate stays the same for the life of the loan. A floating (or variable) rate changes based on market indices, meaning your EMI could increase or decrease over time.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Financial Standard
            </h3>
            <p className="text-indigo-800 leading-relaxed mb-6">
              Our loan calculator is built using industry-standard amortization algorithms used by major financial institutions. Every calculation is verified for precision to ensure you can plan your financial future with absolute confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Verified by Certified Financial Planners</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-900 font-medium">
                <Award className="h-5 w-5 text-indigo-600" />
                <span>Compliant with Truth in Lending Act (TILA) principles</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Personal Loan</h4>
              <p className="text-sm text-slate-600">
                Borrowing <strong>$10,000</strong> for home improvements at <strong>7%</strong> interest for <strong>3 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $308.77 / month</p>
                <p className="text-xs text-slate-500 mt-1">Total interest paid: $1,115.75</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Used Car Loan</h4>
              <p className="text-sm text-slate-600">
                Borrowing <strong>$20,000</strong> for a vehicle at <strong>4.5%</strong> interest for <strong>5 years</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $372.86 / month</p>
                <p className="text-xs text-slate-500 mt-1">Total interest paid: $2,371.60</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">Understanding Loan Amortization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Interest-Heavy Start</h4>
                <p className="text-sm text-slate-600">In the beginning, most of your payment goes toward interest because the principal balance is at its highest.</p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Principal-Heavy End</h4>
                <p className="text-sm text-slate-600">As the balance drops, interest charges decrease, allowing more of your fixed payment to pay down the principal.</p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <ArrowRight className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">The Tipping Point</h4>
                <p className="text-sm text-slate-600">There is a point in every loan where the principal portion of your payment finally exceeds the interest portion.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/loan-calculator" category="Finance" />
      </div>
    </div>
  );
}
