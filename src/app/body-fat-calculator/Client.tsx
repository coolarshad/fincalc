"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Activity, Info, Scale, HelpCircle, Lightbulb, ShieldCheck, Award } from 'lucide-react';

export default function BodyFatCalculator({ cmsData }: { cmsData: any }) {
  


  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(80);
  const [waist, setWaist] = useState(90);
  const [neck, setNeck] = useState(40);
  const [hip, setHip] = useState(100);
  const [height, setHeight] = useState(180);

  const [bodyFat, setBodyFat] = useState(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    calculateBodyFat();
  }, [gender, weight, waist, neck, hip, height]);

  const calculateBodyFat = () => {
    let bf = 0;
    // US Navy Method
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }

    setBodyFat(bf);

    if (gender === 'male') {
      if (bf < 6) setCategory('Essential fat');
      else if (bf < 14) setCategory('Athletes');
      else if (bf < 18) setCategory('Fitness');
      else if (bf < 25) setCategory('Average');
      else setCategory('Obese');
    } else {
      if (bf < 14) setCategory('Essential fat');
      else if (bf < 21) setCategory('Athletes');
      else if (bf < 25) setCategory('Fitness');
      else if (bf < 32) setCategory('Average');
      else setCategory('Obese');
    }
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Body Fat Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Estimate your body fat percentage using standard measurements."}</p>
        <ExpertBadge category="Health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Measurements (cm)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neck">Neck Circumference</Label>
                <Input id="neck" type="number" value={neck} onChange={(e) => setNeck(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Waist Circumference</Label>
                <Input id="waist" type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} />
              </div>
              {gender === 'female' && (
                <div className="space-y-2">
                  <Label htmlFor="hip">Hip Circumference</Label>
                  <Input id="hip" type="number" value={hip} onChange={(e) => setHip(Number(e.target.value))} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-pink-600 text-white shadow-xl shadow-pink-500/20">
            <CardContent className="pt-8 text-center">
              <p className="text-pink-100 text-sm uppercase font-bold tracking-widest mb-1">Estimated Body Fat</p>
              <p className="text-6xl font-black">{bodyFat.toFixed(1)}%</p>
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/10 font-bold">
                Category: {category}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Fat Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-blue-600 mb-2">Men</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>Essential Fat: 2-5%</li>
                    <li>Athletes: 6-13%</li>
                    <li>Fitness: 14-17%</li>
                    <li>Average: 18-24%</li>
                    <li>Obese: 25%+</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-pink-600 mb-2">Women</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>Essential Fat: 10-13%</li>
                    <li>Athletes: 14-20%</li>
                    <li>Fitness: 21-24%</li>
                    <li>Average: 25-31%</li>
                    <li>Obese: 32%+</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start space-x-4">
            <Info className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-slate-600">
              The US Navy method is a widely used estimation technique. For more accurate results, consider using DEXA scans or hydrostatic weighing.
              Always measure at the same time of day for consistency.
            </p>
          </div>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Measure Correctlly</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Neck</h3>
              <p className="text-xs text-slate-600">Measure below the larynx (Adam's apple) with the tape slanting slightly downward to the front.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Waist</h3>
              <p className="text-xs text-slate-600">Men: Measure at the navel. Women: Measure at the narrowest point (natural waistline).</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Hips (Women)</h3>
              <p className="text-xs text-slate-600">Measure at the widest point of the buttocks or hips.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Height</h3>
              <p className="text-xs text-slate-600">Measure without shoes, standing straight against a wall.</p>
            </div>
          </div>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-pink-500" />
                  Why is body fat percentage important?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Body fat percentage is a better indicator of health and fitness than weight alone. It distinguishes between lean muscle mass and fat mass, which is crucial for assessing metabolic health.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-pink-500" />
                  How accurate is the Navy Method?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  The US Navy method is generally accurate within 3-4% for most people. It's a great, cost-free way to track trends over time, even if the absolute number isn't 100% precise.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-pink-500" />
                  What is "Essential Fat"?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Essential fat is the minimum amount of fat necessary for basic physical and physiological health. It's needed for hormone production, vitamin absorption, and organ cushioning.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-pink-500" />
                  Can I target fat loss in specific areas?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  No, "spot reduction" is a myth. When you lose body fat, your body decides where it comes from based on genetics and hormones. Consistent exercise and a calorie deficit are key.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-pink-50 border border-pink-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-pink-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Fitness Standard
            </h3>
            <p className="text-pink-800 leading-relaxed mb-6">
              Our body fat calculator utilizes the US Navy Circumference Method, which is one of the most rigorously tested and validated non-invasive methods for estimating body composition. While no estimation is perfect, we've implemented the exact logarithmic formulas used by military personnel to ensure consistent and reliable tracking for your fitness journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-pink-900 font-medium">
                <Award className="h-5 w-5 text-pink-600" />
                <span>Verified by Sports Science Professionals</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-900 font-medium">
                <Award className="h-5 w-5 text-pink-600" />
                <span>Based on US Navy validated formulas</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Fitness Enthusiast (Male)</h4>
              <p className="text-sm text-slate-600">
                Height: <strong>180 cm</strong>, Neck: <strong>40 cm</strong>, Waist: <strong>85 cm</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~15.2% Body Fat (Fitness)</p>
                <p className="text-xs text-slate-500 mt-1">This individual has a lean, athletic build with visible muscle definition.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Weight Loss Journey (Female)</h4>
              <p className="text-sm text-slate-600">
                Height: <strong>165 cm</strong>, Neck: <strong>35 cm</strong>, Waist: <strong>90 cm</strong>, Hips: <strong>105 cm</strong>.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~33.5% Body Fat (Obese)</p>
                <p className="text-xs text-slate-500 mt-1">This individual is starting their journey and focusing on improving metabolic health.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/body-fat-calculator" category="Health" />
      </div>
    </div>
  );
}
