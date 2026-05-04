"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import RelatedCalculators from '@/components/RelatedCalculators';
import { CheckCircle2, XCircle, Info, ShieldCheck, Landmark, Car, User, TrendingUp, HelpCircle, Lightbulb } from 'lucide-react';

const LOAN_TYPES = {
  home: { label: 'Home Loan', foir: 0.5, defaultRate: 8.5, icon: Landmark },
  car: { label: 'Car Loan', foir: 0.4, defaultRate: 10.5, icon: Car },
  personal: { label: 'Personal Loan', foir: 0.35, defaultRate: 14.0, icon: User },
};

export default function LoanEligibilityCalculator({ cmsData }: { cmsData: any }) {
  


  const [loanType, setLoanType] = useState<keyof typeof LOAN_TYPES>('home');
  const [income, setIncome] = useState(80000);
  const [incomeType, setIncomeType] = useState<'annual' | 'monthly'>('annual');
  const [existingEmi, setExistingEmi] = useState(500);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [foir, setFoir] = useState(50);
  const [applyFoir, setApplyFoir] = useState(true);
  
  const [results, setResults] = useState<any>({});
  const [schedule, setSchedule] = useState<any[]>([]);
  const [monthlySchedule, setMonthlySchedule] = useState<any[]>([]);
  const [scheduleType, setScheduleType] = useState<'monthly' | 'yearly'>('yearly');
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);

  // Update default rate and FOIR when loan type changes
  useEffect(() => {
    setRate(LOAN_TYPES[loanType].defaultRate);
    setFoir(LOAN_TYPES[loanType].foir * 100);
  }, [loanType]);

  useEffect(() => {
    const monthlyIncome = incomeType === 'annual' ? income / 12 : income;
    const foirDecimal = foir / 100;
    
    // Available EMI is capped by FOIR if enabled, otherwise just income minus existing debts
    const availableEmi = applyFoir 
      ? (monthlyIncome * foirDecimal) - existingEmi
      : monthlyIncome - existingEmi;

    const r = rate / 100 / 12;
    const n = tenure * 12;

    // Loan Amount Formula from EMI: P = EMI * [((1+r)^n - 1) / (r * (1+r)^n)]
    let eligibleAmount = 0;
    if (availableEmi > 0 && r > 0) {
      eligibleAmount = availableEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    } else if (availableEmi > 0 && r === 0) {
      eligibleAmount = availableEmi * n;
    }

    setResults({
      eligibleAmount: Math.ceil(Math.max(0, eligibleAmount) + 0.5),
      availableEmi: Math.max(0, availableEmi),
      isEligible: availableEmi > 0,
      appliedRate: rate,
      foirUsed: applyFoir ? foir : 100
    });

    // Generate potential schedule
    if (eligibleAmount > 0) {
      const yearlyData = [];
      const monthlyData = [];
      let balance = eligibleAmount;
      const monthlyPayment = availableEmi;
      
      for (let y = 1; y <= tenure; y++) {
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        
        for (let m = 1; m <= 12; m++) {
          const interest = balance * r;
          const principal = Math.min(balance, monthlyPayment - interest);
          
          yearlyInterest += interest;
          yearlyPrincipal += principal;
          balance -= principal;
          
          monthlyData.push({
            period: (y - 1) * 12 + m,
            payment: monthlyPayment,
            interest: interest,
            principal: principal,
            balance: Math.max(0, balance)
          });
        }
        
        yearlyData.push({
          year: y,
          payment: monthlyPayment * 12,
          interest: yearlyInterest,
          principal: yearlyPrincipal,
          balance: Math.max(0, balance)
        });
      }
      setSchedule(yearlyData);
      setMonthlySchedule(monthlyData);

      // Generate sensitivity data (Interest Rate vs Eligibility)
      const sensitivity = [];
      for (let i = -3; i <= 3; i++) {
        const testRate = Math.max(1, rate + i);
        const testR = testRate / 100 / 12;
        let testAmount = 0;
        if (availableEmi > 0 && testR > 0) {
          testAmount = availableEmi * (Math.pow(1 + testR, n) - 1) / (testR * Math.pow(1 + testR, n));
        }
        sensitivity.push({
          rate: `${testRate}%`,
          amount: Math.round(testAmount),
          isCurrent: i === 0
        });
      }
      setSensitivityData(sensitivity);
    } else {
      setSchedule([]);
      setMonthlySchedule([]);
      setSensitivityData([]);
    }
  }, [loanType, income, existingEmi, tenure, rate, foir, applyFoir]);

  const SelectedIcon = LOAN_TYPES[loanType].icon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Loan Eligibility Checker</h1>
        <p className="text-slate-600">Estimate your borrowing capacity based on your financial profile and interest rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan & Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loan Type</Label>
                <Select value={loanType} onValueChange={(val: any) => setLoanType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LOAN_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="income">{incomeType === 'annual' ? 'Annual Gross Income' : 'Monthly Income'} ($)</Label>
                  <button 
                    onClick={() => setIncomeType(incomeType === 'annual' ? 'monthly' : 'annual')}
                    className="text-[10px] text-indigo-600 font-bold uppercase hover:underline"
                  >
                    Switch to {incomeType === 'annual' ? 'Monthly' : 'Annual'}
                  </button>
                </div>
                <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                <Slider 
                  value={[income]} 
                  min={incomeType === 'annual' ? 10000 : 1000} 
                  max={incomeType === 'annual' ? 1000000 : 100000} 
                  step={incomeType === 'annual' ? 5000 : 500} 
                  onValueChange={(val) => setIncome(val[0])} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emi">Existing Monthly EMIs ($)</Label>
                <Input id="emi" type="number" value={existingEmi} onChange={(e) => setExistingEmi(Number(e.target.value))} />
                <Slider value={[existingEmi]} min={0} max={10000} step={100} onValueChange={(val) => setExistingEmi(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <Slider value={[rate]} min={1} max={25} step={0.1} onValueChange={(val) => setRate(val[0])} />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Label htmlFor="apply-foir" className="cursor-pointer">Apply FOIR Limit</Label>
                  <input 
                    id="apply-foir"
                    type="checkbox" 
                    checked={applyFoir} 
                    onChange={(e) => setApplyFoir(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>

                {applyFoir && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Label htmlFor="foir">FOIR (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="foir" type="number" value={foir} onChange={(e) => setFoir(Number(e.target.value))} />
                      <span className="text-xs text-slate-500 whitespace-nowrap">Max Debt Ratio</span>
                    </div>
                    <Slider value={[foir]} min={10} max={90} step={1} onValueChange={(val) => setFoir(val[0])} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Desired Tenure (Years)</Label>
                <Input id="tenure" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                <Slider value={[tenure]} min={1} max={30} step={1} onValueChange={(val) => setTenure(val[0])} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className={`${results.isEligible ? 'bg-indigo-600' : 'bg-rose-600'} text-white shadow-xl transition-colors duration-500`}>
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <SelectedIcon className="h-12 w-12" />
                </div>
              </div>
              <p className="text-white/80 text-xs uppercase font-bold tracking-widest mb-1">Estimated {LOAN_TYPES[loanType].label} Eligibility</p>
              <p className="text-6xl font-black">${results.eligibleAmount?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/10 px-4 py-3 rounded-xl">
                  <p className="text-[10px] text-white/70 uppercase font-bold">Max Monthly EMI</p>
                  <p className="text-xl font-bold">${results.availableEmi?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-xl">
                  <p className="text-[10px] text-white/70 uppercase font-bold">Applied Interest Rate</p>
                  <p className="text-xl font-bold">{results.appliedRate?.toFixed(1)}%</p>
                </div>
              </div>

              {!results.isEligible && (
                <div className="mt-6 flex items-center justify-center space-x-2 text-rose-100 bg-black/20 py-2 rounded-lg">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Low eligibility based on current profile</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="sensitivity" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sensitivity">Rate Sensitivity</TabsTrigger>
              <TabsTrigger value="schedule">Potential Repayment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sensitivity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
                    Eligibility vs. Interest Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sensitivityData}>
                        <XAxis dataKey="rate" />
                        <YAxis hide />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Eligible Amount']}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                          {sensitivityData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.isCurrent ? '#4f46e5' : '#e2e8f0'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center italic">
                    This chart shows how your borrowing power changes as interest rates fluctuate.
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
                  <div className="max-h-[400px] overflow-auto">
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
                            <TableCell className="text-right font-bold text-indigo-600">
                              ${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
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
            Loan eligibility is determined by calculating the maximum EMI you can afford and then deriving the principal amount from that EMI:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto space-y-4">
            <div>Available EMI = ({incomeType === 'annual' ? 'Annual Income / 12' : 'Monthly Income'} × FOIR) - Existing EMIs</div>
            <div className="text-slate-400 text-sm">then</div>
            <div>Eligible Principal = EMI × [((1+r)ⁿ - 1) / (r × (1+r)ⁿ)]</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
            <ul className="space-y-2">
              <li><strong>FOIR:</strong> Fixed Obligation to Income Ratio (e.g., 50%)</li>
              <li><strong>r:</strong> Monthly interest rate (Annual Rate / 12)</li>
            </ul>
            <ul className="space-y-2">
              <li><strong>n:</strong> Total number of months (Tenure × 12)</li>
              <li><strong>EMI:</strong> Equated Monthly Installment</li>
            </ul>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Understanding Your Borrowing Power</h2>
          <p>
            Lenders use complex algorithms to determine how much they are willing to lend you. The primary factor is your ability to repay the loan without financial distress. This calculator helps you estimate that capacity by looking at your income and existing debt obligations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-3 flex items-center text-slate-900">
                <Info className="h-5 w-5 mr-2 text-indigo-600" />
                Eligibility Factors
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span><strong>FOIR ({results.foirUsed}%):</strong> {applyFoir ? "The percentage of income lenders allow for debt. You can disable this to see your raw borrowing power." : "FOIR is currently disabled. You are seeing eligibility based on your full income minus existing debts."}</span>
                </li>
                <li className="flex items-start text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span><strong>Interest Rate:</strong> Higher rates reduce the principal amount you can borrow for the same EMI.</span>
                </li>
                <li className="flex items-start text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
                  <span><strong>Existing Debts:</strong> Current EMIs directly reduce your new loan capacity.</span>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="font-bold mb-3 flex items-center text-indigo-900">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                How to Boost Eligibility
              </h3>
              <div className="space-y-4">
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-900 mb-1">Clear Existing Debts</p>
                  <p className="text-[11px] text-indigo-700">Reducing current EMIs is the fastest way to increase borrowing power.</p>
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-900 mb-1">Add a Co-Applicant</p>
                  <p className="text-[11px] text-indigo-700">Including a spouse's income can significantly raise the eligible amount.</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Common Questions (FAQ)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                What is FOIR?
              </h4>
              <p className="text-sm text-slate-600">
                FOIR stands for Fixed Obligation to Income Ratio. It's a parameter used by lenders to determine your repayment capacity. Usually, lenders don't want your total debt (including the new loan) to exceed 40-60% of your monthly income.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Does a higher tenure increase eligibility?
              </h4>
              <p className="text-sm text-slate-600">
                Yes. A longer tenure reduces the monthly EMI for the same loan amount, which means you can borrow a larger principal for the same "available EMI" capacity. However, you'll pay more in total interest over the life of the loan.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                How do existing EMIs affect me?
              </h4>
              <p className="text-sm text-slate-600">
                Existing EMIs are subtracted directly from your "available EMI" capacity. If you have a $500 car loan EMI and your total capacity is $2000, you only have $1500 left for a new home loan.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-indigo-500" />
                Can I get a loan if my eligibility is low?
              </h4>
              <p className="text-sm text-slate-600">
                You might still get a loan by providing additional collateral, adding a co-applicant with a good income, or opting for a lender with more flexible FOIR requirements.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Pro Tip: The "Step-Up" Strategy
            </h3>
            <p className="text-sm text-amber-800">
              Some lenders offer "Step-Up" loans where the EMI starts low and increases as your income grows. This can help you qualify for a higher loan amount today based on your future earning potential. Always check with multiple banks as their eligibility criteria vary significantly.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Home Loan Eligibility</h4>
              <p className="text-sm text-slate-600">
                Annual Income: <strong>$100,000</strong>. Existing EMI: <strong>$500</strong>. Tenure: <strong>20 Years</strong>. Rate: <strong>7.5%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$445,000 Eligible Amount</p>
                <p className="text-xs text-slate-500 mt-1">Based on 50% FOIR limit.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Personal Loan Capacity</h4>
              <p className="text-sm text-slate-600">
                Monthly Income: <strong>$5,000</strong>. Existing EMI: <strong>$0</strong>. Tenure: <strong>5 Years</strong>. Rate: <strong>12%</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~$78,000 Eligible Amount</p>
                <p className="text-xs text-slate-500 mt-1">Based on 35% FOIR limit.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/loan-eligibility-calculator" category="Finance" />
      </div>
    </div>
  );
}
