"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calculator, Home, Info, Mail, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleCalculatorsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push('/#calculators');
    } else {
      const element = document.getElementById('calculators');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Calculators', path: '/#calculators', icon: Calculator, onClick: handleCalculatorsClick },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg transition-transform group-hover:scale-105">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                FinanceTools<span className="text-indigo-600">Lab</span>.com
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`text-sm font-semibold transition-colors hover:text-indigo-600 ${(typeof window !== 'undefined' ? window.location.hash : '') === '#calculators' ? 'text-indigo-600' : 'text-slate-600'
                      }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`text-sm font-semibold transition-colors hover:text-indigo-600 ${pathname === item.path ? 'text-indigo-600' : 'text-slate-600'
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-6"
                onClick={handleCalculatorsClick}
              >
                Get Started
              </Button>
            </nav>

            <div className="flex items-center md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-b border-slate-200 shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className="flex items-center w-full space-x-3 px-3 py-3 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                ))}
                <div className="pt-4 px-3">
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-6"
                    onClick={handleCalculatorsClick}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Calculator className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-bold text-white tracking-tight">FinanceTools<span className="text-indigo-400">Lab</span></span>
              </Link>
              <p className="text-sm leading-relaxed max-w-md mb-6">
                FinanceToolsLab.com is your premier destination for accurate, free, and easy-to-use financial tools.
                We empower individuals and businesses with data-driven insights to make smarter financial decisions.
              </p>
              <div className="flex items-center space-x-2 text-indigo-400 mb-6">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Trusted by 1M+ Users Monthly</span>
              </div>
              <div className="flex space-x-4">
                <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">About</Link>
                <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">Contact</Link>
                <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">Privacy</Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Financial Tools</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/loan-calculator" className="hover:text-indigo-400 transition-colors">Loan Calculator</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-indigo-400 transition-colors">Mortgage Calculator</Link></li>
                <li><Link href="/investment-calculator" className="hover:text-indigo-400 transition-colors">Investment Calculator</Link></li>
                <li><Link href="/sip-calculator" className="hover:text-indigo-400 transition-colors">SIP Calculator</Link></li>
                <li><Link href="/fd-calculator" className="hover:text-indigo-400 transition-colors">FD Calculator</Link></li>
                <li><Link href="/interest-calculator" className="hover:text-indigo-400 transition-colors">Interest Calculator</Link></li>
                <li><Link href="/cagr-calculator" className="hover:text-indigo-400 transition-colors">CAGR Calculator</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Health & Life</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/bmi-calculator" className="hover:text-indigo-400 transition-colors">BMI Calculator</Link></li>
                <li><Link href="/calorie-calculator" className="hover:text-indigo-400 transition-colors">Calorie Calculator</Link></li>
                <li><Link href="/body-fat-calculator" className="hover:text-indigo-400 transition-colors">Body Fat Calculator</Link></li>
                <li><Link href="/pregnancy-calculator" className="hover:text-indigo-400 transition-colors">Pregnancy Calculator</Link></li>
                <li><Link href="/salary-calculator" className="hover:text-indigo-400 transition-colors">Salary Calculator</Link></li>
                <li><Link href="/inflation-calculator" className="hover:text-indigo-400 transition-colors">Inflation Calculator</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Business & Utility</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/margin-calculator" className="hover:text-indigo-400 transition-colors">Margin Calculator</Link></li>
                <li><Link href="/gst-calculator" className="hover:text-indigo-400 transition-colors">GST Calculator</Link></li>
                <li><Link href="/break-even-calculator" className="hover:text-indigo-400 transition-colors">Break-even Calculator</Link></li>
                <li><Link href="/cash-flow-calculator" className="hover:text-indigo-400 transition-colors">Cash Flow Calculator</Link></li>
                <li><Link href="/credit-card-calculator" className="hover:text-indigo-400 transition-colors">Credit Card Interest</Link></li>
                <li><Link href="/currency-calculator" className="hover:text-indigo-400 transition-colors">Currency Converter</Link></li>
                <li><Link href="/loan-eligibility-calculator" className="hover:text-indigo-400 transition-colors">Loan Eligibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} FinanceToolsLab.com. All rights reserved. Precision tools for financial success.</p>
            <p>Designed for speed, accuracy, and mobile performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
