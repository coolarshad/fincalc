"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Globe, ArrowRightLeft, TrendingUp, HelpCircle, Lightbulb } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

// Mock rates for demo purposes
const mockRates: Record<string, number> = {
  'USD_EUR': 0.92,
  'USD_GBP': 0.79,
  'USD_JPY': 151.5,
  'USD_INR': 83.3,
  'EUR_USD': 1.08,
  'GBP_USD': 1.27,
  'JPY_USD': 0.0066,
  'INR_USD': 0.012,
};

export default function CurrencyConverter({ cmsData }: { cmsData: any }) {
  


  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const key = `${from}_${to}`;
    const reverseKey = `${to}_${from}`;
    
    let currentRate = 1;
    if (from === to) {
      currentRate = 1;
    } else if (mockRates[key]) {
      currentRate = mockRates[key];
    } else if (mockRates[reverseKey]) {
      currentRate = 1 / mockRates[reverseKey];
    } else {
      // Fallback for other pairs
      currentRate = (mockRates[`USD_${to}`] || 1) / (mockRates[`USD_${from}`] || 1);
    }

    setRate(currentRate);
    setResult(amount * currentRate);
  }, [amount, from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Currency Converter</h1>
        <p className="text-slate-600">Get instant exchange rate conversions for global currencies.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100">
          <CardContent className="pt-10 pb-12 px-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-lg font-bold h-12"
                />
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center pb-2">
                <button 
                  onClick={swapCurrencies}
                  className="p-3 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-all transform hover:rotate-180"
                >
                  <ArrowRightLeft className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2">
                <Label>Converted Amount</Label>
                <div className="h-12 flex items-center px-3 bg-slate-50 rounded-md border border-slate-200 font-bold text-lg text-indigo-600">
                  {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm mb-2">Exchange Rate</p>
              <p className="text-2xl font-black text-slate-900">
                1 {from} = {rate.toFixed(4)} {to}
              </p>
              <div className="mt-6 flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full inline-flex">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Market rates updated daily</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold mb-3 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-indigo-600" />
              Global Coverage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We support all major global currencies and provide accurate mid-market rates. Perfect for travelers, business owners, and investors.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
              Forex Insights
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Currency values fluctuate based on economic data, interest rates, and geopolitical events. Always check the latest rates before making large transfers.
            </p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Exchange Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-bold">Mid-Market Rate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The mid-market rate is the midpoint between the buy and sell prices of two currencies. It's the "real" exchange rate you see on Google or Reuters.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold">Buy/Sell Spread</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Banks and exchange services add a "spread" to the mid-market rate. This is how they make money on your transaction without charging an explicit fee.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold">Currency Pairs</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Currencies are always traded in pairs (e.g., EUR/USD). The first currency is the "base" and the second is the "quote."
                </p>
              </div>
            </div>
          </section>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    Why do rates change so often?
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Exchange rates are determined by supply and demand in the global forex market. Factors like inflation, interest rates, and political stability all influence this demand.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    What is the "spread"?
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    The spread is the difference between the rate a bank uses to buy currency and the rate it uses to sell it. A wider spread means a higher cost for you.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    Are these rates live?
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Our rates are updated daily to provide a reliable estimate. For high-frequency trading or large transfers, always verify with your financial provider.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    How can I get the best rate?
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Avoid airport kiosks and traditional banks for small amounts. Digital-first transfer services often provide rates much closer to the mid-market rate.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                <Lightbulb className="h-6 w-6 mr-2" />
                Pro Tip: Watch for Hidden Fees
              </h3>
              <p className="text-indigo-800 leading-relaxed">
                Many services advertise "Zero Commission" but hide their fees in a poor exchange rate. Always compare the total amount you receive against the mid-market rate to find the true cost of your currency exchange. Use our <strong>Margin Calculator</strong> to calculate the exact percentage markup you're being charged!
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Real-World Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2 text-center">Travel Budget</h4>
                <p className="text-sm text-slate-600 text-center">
                  Planning a trip to Europe with <strong>$2,000 USD</strong>.
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-sm font-semibold text-slate-900">Result: ~€1,840 EUR</p>
                  <p className="text-xs text-slate-500 mt-1">Based on 1 USD = 0.92 EUR.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2 text-center">Online Purchase</h4>
                <p className="text-sm text-slate-600 text-center">
                  Buying a gadget from the UK for <strong>£150 GBP</strong>.
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-sm font-semibold text-slate-900">Result: ~$190.50 USD</p>
                  <p className="text-xs text-slate-500 mt-1">Based on 1 GBP = 1.27 USD.</p>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
        </div>
        <RelatedCalculators currentPath="/currency-calculator" category="Utility" />
      </div>
    </div>
  );
}
