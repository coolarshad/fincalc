"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Info, AlertCircle, Scale, HelpCircle, Lightbulb, ShieldCheck, BookOpen } from 'lucide-react';

export default function BMICalculator({ cmsData }: { cmsData: any }) {
  


  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi);

    if (calculatedBmi < 18.5) {
      setCategory('Underweight');
      setColor('text-blue-400');
    } else if (calculatedBmi < 25) {
      setCategory('Normal weight');
      setColor('text-emerald-400');
    } else if (calculatedBmi < 30) {
      setCategory('Overweight');
      setColor('text-amber-400');
    } else {
      setCategory('Obese');
      setColor('text-red-400');
    }
  }, [height, weight]);

  const chartData = [
    { name: 'Underweight', value: 18.5, color: '#60a5fa' },
    { name: 'Normal', value: 6.5, color: '#34d399' },
    { name: 'Overweight', value: 5, color: '#fbbf24' },
    { name: 'Obese', value: 10, color: '#f87171' },
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "BMI Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Assess your body weight relative to your height."}</p>
        <ExpertBadge category="Health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="height">Height (cm)</Label>
                  <span className="text-sm font-bold text-indigo-600">{height} cm</span>
                </div>
                <Input 
                  id="height" 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
                <Slider 
                  value={[height]} 
                  min={100} 
                  max={250} 
                  step={1} 
                  onValueChange={(val) => setHeight(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <span className="text-sm font-bold text-indigo-600">{weight} kg</span>
                </div>
                <Input 
                  id="weight" 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
                <Slider 
                  value={[weight]} 
                  min={30} 
                  max={200} 
                  step={1} 
                  onValueChange={(val) => setWeight(val[0])}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Scale className="h-24 w-24" />
            </div>
            <CardContent className="pt-8 relative z-10">
              <div className="text-center space-y-4">
                <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Your BMI</p>
                <p className="text-6xl font-black">{bmi.toFixed(1)}</p>
                <div className={`text-xl font-bold px-4 py-2 rounded-full inline-block bg-white/10 ${color}`}>
                  {category}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>BMI Categories</CardTitle>
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
                        startAngle={180}
                        endAngle={0}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b border-slate-100">
                    <span className="text-sm">Underweight</span>
                    <span className="text-sm font-bold">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-slate-100 bg-emerald-50 text-emerald-700 font-semibold rounded">
                    <span className="text-sm">Normal weight</span>
                    <span className="text-sm font-bold">18.5 – 24.9</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-slate-100">
                    <span className="text-sm">Overweight</span>
                    <span className="text-sm font-bold">25 – 29.9</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-sm">Obese</span>
                    <span className="text-sm font-bold">30 or more</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-amber-900 font-bold mb-1">Important Note</h3>
              <p className="text-amber-800 text-sm">
                BMI is a useful measure of overweight and obesity, but it does not directly measure body fat. 
                It may not be accurate for athletes, elderly people, or those with high muscle mass.
              </p>
            </div>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calculation Formula</h2>
          <p className="text-slate-600 mb-6">
            BMI is calculated by dividing your weight in kilograms by the square of your height in meters.
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-lg text-center overflow-x-auto">
            BMI = weight (kg) / [height (m)]²
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center italic">
            Note: For imperial units, the formula is: BMI = 703 × weight (lbs) / [height (in)]²
          </p>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">Understanding Body Mass Index (BMI)</h2>
          <p>
            Body Mass Index (BMI) is a person's weight in kilograms divided by the square of height in meters. 
            A high BMI can be an indicator of high body fatness. BMI can be used to screen for weight categories 
            that may lead to health problems but it is not diagnostic of the body fatness or health of an individual.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Why BMI Matters</h3>
              <p className="text-slate-600">
                Maintaining a healthy BMI is associated with a lower risk of developing chronic conditions such as:
              </p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>Type 2 Diabetes</li>
                <li>Heart Disease</li>
                <li>High Blood Pressure</li>
                <li>Certain types of cancer</li>
                <li>Sleep apnea</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-indigo-600" />
                How to improve your BMI
              </h3>
              <p className="text-sm text-slate-600">
                If your BMI is outside the normal range, focus on a balanced diet rich in whole foods and regular physical activity. 
                Always consult with a healthcare professional before making significant changes to your diet or exercise routine.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Limitations of BMI</h3>
          <p className="text-slate-600">
            While BMI is a widely used screening tool, it has several limitations:
          </p>
          <ul className="space-y-2 text-slate-600">
            <li><strong>Muscle Mass:</strong> Muscle is denser than fat. Athletes or very muscular individuals may have a high BMI but low body fat.</li>
            <li><strong>Age:</strong> Older adults tend to have more body fat than younger adults with the same BMI.</li>
            <li><strong>Ethnicity:</strong> The relationship between BMI and body fat can vary among different ethnic groups.</li>
            <li><strong>Fat Distribution:</strong> BMI doesn't account for where fat is stored (e.g., belly fat vs. hip fat), which is an important health indicator.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Is BMI accurate for children?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  For children and teens, BMI is interpreted differently using age-and-sex-specific percentiles. This is because the amount of body fat changes with age and differs between girls and boys.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Can I use BMI to track weight loss?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes, BMI is a simple way to track your progress as you lose weight. However, it's also important to track other metrics like waist circumference and body fat percentage for a more complete picture.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  What is a "healthy" BMI range?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  A healthy BMI for most adults is between 18.5 and 24.9. Falling within this range is associated with a lower risk of weight-related health issues.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  Does BMI apply to the elderly?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  For adults over 65, a slightly higher BMI (between 23 and 27) may actually be protective against frailty and bone loss. Consult a doctor for personalized advice.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-emerald-50 border border-emerald-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              Pro Tip: Focus on Habits, Not Just the Number
            </h3>
            <p className="text-emerald-800 leading-relaxed">
              While BMI is a useful benchmark, it's just one piece of the puzzle. Focus on building sustainable habits like eating more vegetables, staying hydrated, getting enough sleep, and moving your body daily. These changes will improve your health regardless of what the scale says.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Average Adult</h4>
              <p className="text-sm text-slate-600">
                A person who is <strong>175 cm</strong> (5'9") tall and weighs <strong>75 kg</strong> (165 lbs).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: BMI 24.5 (Normal Weight)</p>
                <p className="text-xs text-slate-500 mt-1">This individual falls within the healthy range for their height.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Athletic Build</h4>
              <p className="text-sm text-slate-600">
                A person who is <strong>180 cm</strong> (5'11") tall and weighs <strong>95 kg</strong> (209 lbs) with high muscle mass.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: BMI 29.3 (Overweight)</p>
                <p className="text-xs text-slate-500 mt-1">Note: BMI may overestimate body fat in muscular individuals.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/bmi-calculator" category="Health" />
      </div>
    </div>
  );
}
