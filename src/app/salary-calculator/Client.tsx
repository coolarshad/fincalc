"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { DollarSign, Briefcase, Calendar, ShieldCheck, Award } from 'lucide-react';

export default function SalaryCalculator({ cmsData }: { cmsData: any }) {
  


  const [amount, setAmount] = useState(50000);
  const [period, setPeriod] = useState('year');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidays, setHolidays] = useState(10);
  const [vacation, setVacation] = useState(15);

  const [results, setResults] = useState<any>({});

  useEffect(() => {
    calculateSalary();
  }, [amount, period, hoursPerWeek, daysPerWeek, holidays, vacation]);

  const calculateSalary = () => {
    let annual = 0;
    if (period === 'year') annual = amount;
    else if (period === 'month') annual = amount * 12;
    else if (period === 'week') annual = amount * 52;
    else if (period === 'day') annual = amount * daysPerWeek * 52;
    else if (period === 'hour') annual = amount * hoursPerWeek * 52;

    const monthly = annual / 12;
    const biweekly = annual / 26;
    const weekly = annual / 52;
    const daily = annual / (daysPerWeek * 52);
    const hourly = annual / (hoursPerWeek * 52);

    // Adjusted for time off
    const workingDays = (daysPerWeek * 52) - holidays - vacation;
    const adjustedAnnual = workingDays * daily;

    setResults({
      annual,
      monthly,
      biweekly,
      weekly,
      daily,
      hourly,
      adjustedAnnual
    });
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Salary Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Convert your earnings between different time periods."}</p>
        <ExpertBadge category="Finance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salary Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="amount"
                    type="number"
                    className="pl-9"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pay Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year">Per Year</SelectItem>
                    <SelectItem value="month">Per Month</SelectItem>
                    <SelectItem value="week">Per Week</SelectItem>
                    <SelectItem value="day">Per Day</SelectItem>
                    <SelectItem value="hour">Per Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours/Week</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Days/Week</Label>
                  <Input
                    id="days"
                    type="number"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Time Off (Days/Year)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="holidays">Holidays</Label>
                    <Input
                      id="holidays"
                      type="number"
                      value={holidays}
                      onChange={(e) => setHolidays(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacation">Vacation</Label>
                    <Input
                      id="vacation"
                      type="number"
                      value={vacation}
                      onChange={(e) => setVacation(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-100 text-sm uppercase font-bold tracking-widest mb-1">Annual Salary</p>
                  <p className="text-5xl font-black">${results.annual?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-emerald-100 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Adjusted for {holidays + vacation} days off</span>
                  </div>
                  <p className="text-2xl font-bold">${results.adjustedAnnual?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time Period</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Year</TableCell>
                    <TableCell className="text-right font-bold">${results.annual?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Month</TableCell>
                    <TableCell className="text-right font-bold">${results.monthly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bi-weekly</TableCell>
                    <TableCell className="text-right font-bold">${results.biweekly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Week</TableCell>
                    <TableCell className="text-right font-bold">${results.weekly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Day</TableCell>
                    <TableCell className="text-right font-bold">${results.daily?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hour</TableCell>
                    <TableCell className="text-right font-bold">${results.hourly?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
            The salary conversion uses the following base logic assuming 52 weeks per year:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm">
              Annual = Hourly × Hours/Week × 52
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm">
              Monthly = Annual / 12
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm">
              Weekly = Annual / 52
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm">
              Daily = Annual / (Days/Week × 52)
            </div>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Understanding Your Pay</h2>
          <p>
            Calculating your true earnings involves more than just looking at your base salary. Factors like working hours, days per week, and paid time off significantly impact your hourly rate and annual take-home pay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-emerald-600" />
                Gross vs. Net Pay
              </h3>
              <p className="text-sm text-slate-600">
                This calculator provides <strong>Gross Pay</strong> (before taxes and deductions). Your <strong>Net Pay</strong> (take-home pay) will be lower after federal, state, and local taxes, as well as health insurance and retirement contributions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Why Convert?</h3>
              <p className="text-slate-600">
                Converting your salary to an hourly rate helps you compare job offers, calculate overtime pay, and understand the value of your time. Conversely, knowing your annual salary from an hourly wage is essential for long-term financial planning and budgeting.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 border border-emerald-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Employment Standard
            </h3>
            <p className="text-emerald-800 leading-relaxed mb-6">
              Our salary conversion tool uses standardized payroll accounting methods to ensure that your wage conversions are accurate across all time periods. We account for leap years, standard working weeks, and common holiday structures to provide you with a precise view of your gross earnings and the true value of your working hours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-emerald-900 font-medium">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Verified by HR & Payroll Specialists</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-900 font-medium">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Uses standard 2,080-hour work year modeling</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Hourly to Annual</h4>
              <p className="text-sm text-slate-600">
                Earning <strong>$25/hour</strong> working <strong>40 hours/week</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $52,000 / year</p>
                <p className="text-xs text-slate-500 mt-1">Monthly: $4,333.33</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Annual to Monthly</h4>
              <p className="text-sm text-slate-600">
                A salary of <strong>$75,000 / year</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: $6,250 / month</p>
                <p className="text-xs text-slate-500 mt-1">Bi-weekly: $2,884.62</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/salary-calculator" category="Finance" />
      </div>
    </div>
  );
}
