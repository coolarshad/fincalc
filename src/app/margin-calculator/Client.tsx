"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import RelatedCalculators from '@/components/RelatedCalculators';
import { TrendingUp, DollarSign, Percent, Briefcase, BarChart3, Globe, Info, HelpCircle, Lightbulb, Wallet } from 'lucide-react';

export default function MarginCalculator({ cmsData }: { cmsData: any }) {
  


  // Profit Margin State
  const [cost, setCost] = useState(100);
  const [revenue, setRevenue] = useState(150);
  const [profitResults, setProfitResults] = useState({ profit: 0, margin: 0, markup: 0 });

  // Stock Trading Margin State
  const [stockPrice, setStockPrice] = useState(150);
  const [quantity, setQuantity] = useState(100);
  const [marginReq, setMarginReq] = useState(50); // 50% initial margin
  const [stockResults, setStockResults] = useState({ totalValue: 0, requiredMargin: 0, loanAmount: 0 });

  // Forex Margin State
  const [lotSize, setLotSize] = useState(100000); // Standard lot
  const [leverage, setLeverage] = useState(50); // 1:50
  const [exchangeRate, setExchangeRate] = useState(1.1); // EUR/USD
  const [forexResults, setForexResults] = useState({ requiredMargin: 0 });

  // Currency Exchange Margin State (Spread/Markup)
  const [exchangeAmount, setExchangeAmount] = useState(1000);
  const [midMarketRate, setMidMarketRate] = useState(1.08);
  const [bankRate, setBankRate] = useState(1.12);
  const [exchangeResults, setExchangeResults] = useState({ marginAmount: 0, marginPercent: 0, totalCost: 0 });

  useEffect(() => {
    // Profit Margin Calculation
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    setProfitResults({ profit, margin, markup });

    // Stock Margin Calculation
    const totalValue = stockPrice * quantity;
    const requiredMargin = (totalValue * marginReq) / 100;
    const loanAmount = totalValue - requiredMargin;
    setStockResults({ totalValue, requiredMargin, loanAmount });

    // Forex Margin Calculation
    const forexMargin = (lotSize * exchangeRate) / leverage;
    setForexResults({ requiredMargin: forexMargin });

    // Currency Exchange Margin Calculation
    const midValue = exchangeAmount * midMarketRate;
    const bankValue = exchangeAmount * bankRate;
    const marginAmount = Math.abs(bankValue - midValue);
    const marginPercent = midValue > 0 ? (marginAmount / midValue) * 100 : 0;
    setExchangeResults({ marginAmount, marginPercent, totalCost: bankValue });
  }, [cost, revenue, stockPrice, quantity, marginReq, lotSize, leverage, exchangeRate, exchangeAmount, midMarketRate, bankRate]);

  const profitChartData = [
    { name: 'Cost', value: cost, color: '#94a3b8' },
    { name: 'Profit', value: profitResults.profit > 0 ? profitResults.profit : 0, color: '#10b981' },
  ];

  const stockChartData = [
    { name: 'Your Equity', value: stockResults.requiredMargin, color: '#6366f1' },
    { name: 'Borrowed (Margin)', value: stockResults.loanAmount, color: '#94a3b8' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Margin Calculator</h1>
        <p className="text-slate-600">Comprehensive tools for business, stock trading, and currency exchange margins.</p>
      </div>

      <Tabs defaultValue="profit" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto p-1 bg-slate-100">
          <TabsTrigger value="profit" className="py-3">
            <Briefcase className="h-4 w-4 mr-2" />
            Profit Margin
          </TabsTrigger>
          <TabsTrigger value="stock" className="py-3">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stock Margin
          </TabsTrigger>
          <TabsTrigger value="forex" className="py-3">
            <Globe className="h-4 w-4 mr-2" />
            Forex Margin
          </TabsTrigger>
          <TabsTrigger value="exchange" className="py-3">
            <DollarSign className="h-4 w-4 mr-2" />
            Exchange Margin
          </TabsTrigger>
        </TabsList>

        {/* Profit Margin Section */}
        <TabsContent value="profit" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Financials</CardTitle>
                  <CardDescription>Enter your cost and revenue to find margins.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost of Goods Sold ($)</Label>
                    <Input id="cost" type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
                    <Slider value={[cost]} min={1} max={10000} step={10} onValueChange={(val) => setCost(val[0])} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Revenue ($)</Label>
                    <Input id="revenue" type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} />
                    <Slider value={[revenue]} min={1} max={20000} step={10} onValueChange={(val) => setRevenue(val[0])} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-emerald-600 text-white">
                <CardContent className="pt-8 text-center">
                  <p className="text-emerald-100 text-xs uppercase font-bold tracking-widest mb-1">Gross Profit Margin</p>
                  <p className="text-6xl font-black">{profitResults.margin.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profit Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={profitChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {profitChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-emerald-600 mr-2" />
                          <span className="text-sm font-medium text-slate-600">Gross Profit</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">${profitResults.profit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Percent className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-slate-600">Markup</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">{profitResults.markup.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Formula
                    </h4>
                    <p className="text-xs text-blue-800 font-mono">
                      Margin = ((Revenue - Cost) / Revenue) × 100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Stock Trading Margin Section */}
        <TabsContent value="stock" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trade Details</CardTitle>
                  <CardDescription>Calculate initial margin for stock positions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stockPrice">Stock Price ($)</Label>
                    <Input id="stockPrice" type="number" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (Shares)</Label>
                    <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marginReq">Initial Margin Requirement (%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider value={[marginReq]} min={10} max={100} step={1} onValueChange={(val) => setMarginReq(val[0])} className="flex-1" />
                      <span className="text-sm font-bold w-12">{marginReq}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-indigo-600 text-white">
                <CardContent className="pt-8 text-center">
                  <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-1">Required Margin</p>
                  <p className="text-5xl font-black">${stockResults.requiredMargin.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Leverage Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={stockChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {stockChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Total Position Value</span>
                        <span className="text-xl font-bold text-slate-900">${stockResults.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Margin Loan (Debt)</span>
                        <span className="text-xl font-bold text-slate-900">${stockResults.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Leverage Ratio</span>
                          <span className="text-xl font-bold text-indigo-600">{(stockResults.totalValue / stockResults.requiredMargin).toFixed(2)}x</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Formula
                    </h4>
                    <p className="text-xs text-indigo-800 font-mono">
                      Required Margin = (Price × Quantity) × Margin %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Forex Margin Section */}
        <TabsContent value="forex" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Forex Parameters</CardTitle>
                  <CardDescription>Calculate margin for currency pairs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="lotSize">Lot Size (Units)</Label>
                    <Select value={lotSize.toString()} onValueChange={(val) => setLotSize(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Lot Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100000">Standard Lot (100,000)</SelectItem>
                        <SelectItem value="10000">Mini Lot (10,000)</SelectItem>
                        <SelectItem value="1000">Micro Lot (1,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leverage">Leverage (1:X)</Label>
                    <Input id="leverage" type="number" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} />
                    <Slider value={[leverage]} min={1} max={500} step={1} onValueChange={(val) => setLeverage(val[0])} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exchangeRate">Exchange Rate (Base/Quote)</Label>
                    <Input id="exchangeRate" type="number" step="0.0001" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-600 text-white">
                <CardContent className="pt-8 text-center">
                  <p className="text-blue-100 text-xs uppercase font-bold tracking-widest mb-1">Required Margin</p>
                  <p className="text-5xl font-black">${forexResults.requiredMargin.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Forex Margin Explained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Position Value</h4>
                      <p className="text-3xl font-bold text-blue-600">${(lotSize * exchangeRate).toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1">Total exposure in quote currency</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Margin Percentage</h4>
                      <p className="text-3xl font-bold text-blue-600">{(100 / leverage).toFixed(2)}%</p>
                      <p className="text-xs text-slate-500 mt-1">Percentage of total value required</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Forex Margin Formula
                    </h4>
                    <p className="text-lg font-mono text-blue-800 text-center">
                      Margin = (Lot Size × Exchange Rate) / Leverage
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Currency Exchange Margin Section */}
        <TabsContent value="exchange" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exchange Details</CardTitle>
                  <CardDescription>Calculate the hidden markup in currency exchange.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exchangeAmount">Amount to Exchange</Label>
                    <Input id="exchangeAmount" type="number" value={exchangeAmount} onChange={(e) => setExchangeAmount(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="midMarketRate">Mid-Market Rate</Label>
                    <Input id="midMarketRate" type="number" step="0.0001" value={midMarketRate} onChange={(e) => setMidMarketRate(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankRate">Bank/Service Rate</Label>
                    <Input id="bankRate" type="number" step="0.0001" value={bankRate} onChange={(e) => setBankRate(Number(e.target.value))} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-600 text-white">
                <CardContent className="pt-8 text-center">
                  <p className="text-amber-100 text-xs uppercase font-bold tracking-widest mb-1">Exchange Margin (%)</p>
                  <p className="text-5xl font-black">{exchangeResults.marginPercent.toFixed(2)}%</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Hidden Margin Cost</p>
                      <p className="text-2xl font-bold text-amber-600">${exchangeResults.marginAmount.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total You Pay</p>
                      <p className="text-2xl font-bold text-slate-900">${exchangeResults.totalCost.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-slate-50 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-sm">What is Exchange Margin?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Banks and exchange services rarely give you the "mid-market" rate. Instead, they add a markup (margin) to the rate. This is a hidden fee that makes the exchange more expensive for you.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Formula
                    </h4>
                    <p className="text-xs text-amber-800 font-mono">
                      Margin % = ((Bank Rate - Mid Rate) / Mid Rate) × 100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Educational Content Section */}
      <div className="mt-16 space-y-12">
        {cmsData?.body ? (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{cmsData.body}</ReactMarkdown>
          </div>
        ) : (
          <>

        <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Margins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="bg-emerald-100 p-3 rounded-lg w-fit">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold">Profit Margin</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Used in business to measure how much of every dollar of sales a company actually keeps in earnings. It's a key indicator of pricing power and operational efficiency.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold">Trading Margin</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In stock trading, margin is the money borrowed from a broker to purchase an investment. It represents the difference between the total value of an investment and the loan amount.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-100 p-3 rounded-lg w-fit">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">Forex Margin</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A good faith deposit required to maintain open positions. It's not a cost or a fee, but a portion of your account equity set aside as a margin deposit.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is a Margin Call?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  A margin call occurs when the value of an investor's margin account falls below the broker's required amount. The investor must either deposit more money or sell assets to cover the shortfall.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Is Margin the same as Markup?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  No. Margin is profit as a percentage of the selling price, while markup is profit as a percentage of the cost. Margin can never exceed 100%, but markup can.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  How does leverage affect margin?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Higher leverage means a lower margin requirement. For example, 1:100 leverage requires only 1% margin, while 1:50 leverage requires 2%. However, higher leverage also increases risk.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is Initial vs. Maintenance Margin?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Initial margin is the amount required to open a position. Maintenance margin is the minimum amount of equity that must be maintained in the account to keep the position open.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              Pro Tip: The Double-Edged Sword of Leverage
            </h3>
            <p className="text-amber-800 leading-relaxed">
              Leverage allows you to control a large position with a small amount of capital, which can magnify your profits. However, it equally magnifies your losses. A small price movement against your position can result in a significant loss of your initial margin deposit. Always use stop-loss orders and manage your risk carefully when trading on margin.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2 text-center">Retail Product</h4>
              <p className="text-sm text-slate-600 text-center">
                Cost: <strong>$50</strong>. Selling Price: <strong>$100</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <p className="text-sm font-semibold text-slate-900">Result: 50% Margin / 100% Markup</p>
                <p className="text-xs text-slate-500 mt-1">Profit: $50 per unit.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2 text-center">Stock Purchase</h4>
              <p className="text-sm text-slate-600 text-center">
                Buying <strong>$10,000</strong> of stock with <strong>50%</strong> margin.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <p className="text-sm font-semibold text-slate-900">Result: $5,000 Required Equity</p>
                <p className="text-xs text-slate-500 mt-1">Broker lends you the other $5,000.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/margin-calculator" category="Business" />
      </div>
    </div>
  );
}
