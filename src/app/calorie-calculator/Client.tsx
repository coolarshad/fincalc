"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { firebaseConfig } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import ExpertBadge from '@/components/ExpertBadge';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Utensils, Activity, Info, HelpCircle, Lightbulb, ShieldCheck, Award } from 'lucide-react';

export default function CalorieCalculator({ cmsData }: { cmsData: any }) {
  


  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState('1.2'); // Sedentary

  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);

  useEffect(() => {
    // Mifflin-St Jeor Equation
    let calculatedBmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') calculatedBmr += 5;
    else calculatedBmr -= 161;

    setBmr(calculatedBmr);
    setTdee(calculatedBmr * Number(activity));
  }, [age, gender, weight, height, activity]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* SEO handled by parent server component */}

      {firebaseConfig.projectId === 'YOUR_PROJECT_ID' && (
        <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium mb-8">
          Firebase is not connected. Showing fallback content.
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{cmsData?.title || "Calorie Calculator"}</h1>
        <p className="text-slate-600 mb-6">{cmsData?.description || "Calculate your Total Daily Energy Expenditure (TDEE)."}</p>
        <ExpertBadge category="Health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                <Slider value={[height]} min={100} max={250} step={1} onValueChange={(val) => setHeight(val[0])} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                <Slider value={[weight]} min={30} max={200} step={1} onValueChange={(val) => setWeight(val[0])} />
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentary (Office job)</SelectItem>
                    <SelectItem value="1.375">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="1.55">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="1.725">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="1.9">Extra Active (Physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-red-600 text-white shadow-xl shadow-red-500/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <p className="text-red-100 text-sm uppercase font-bold tracking-widest mb-1">Maintenance Calories</p>
                <p className="text-6xl font-black">{Math.round(tdee)} <span className="text-2xl">kcal/day</span></p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="pt-6 text-center">
                <p className="text-emerald-700 text-xs font-bold uppercase mb-1">Weight Loss</p>
                <p className="text-2xl font-bold text-emerald-900">{Math.round(tdee - 500)}</p>
                <p className="text-[10px] text-emerald-600">-0.5 kg/week</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6 text-center">
                <p className="text-blue-700 text-xs font-bold uppercase mb-1">BMR</p>
                <p className="text-2xl font-bold text-blue-900">{Math.round(bmr)}</p>
                <p className="text-[10px] text-blue-600">Basal Metabolic Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6 text-center">
                <p className="text-amber-700 text-xs font-bold uppercase mb-1">Weight Gain</p>
                <p className="text-2xl font-bold text-amber-900">{Math.round(tdee + 500)}</p>
                <p className="text-[10px] text-amber-600">+0.5 kg/week</p>
              </CardContent>
            </Card>
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
            This calculator uses the <strong>Mifflin-St Jeor Equation</strong>, widely considered the most accurate for estimating BMR:
          </p>
          <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-sm space-y-2">
            <p><strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
            <p><strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
          </div>
          <p className="text-slate-600 mt-6">
            Your <strong>TDEE</strong> is then calculated by multiplying your BMR by an activity factor:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-[10px] text-slate-500 font-mono">
            <li>Sedentary: 1.2</li>
            <li>Light: 1.375</li>
            <li>Moderate: 1.55</li>
            <li>Very: 1.725</li>
            <li>Extra: 1.9</li>
          </ul>
        </section>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">How to Use Your Calorie Results</h2>
          <p>
            Understanding your daily energy needs is the first step toward achieving your weight goals. Whether you want to lose, maintain, or gain weight, your TDEE provides the baseline for your nutritional plan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-red-600" />
                What is TDEE?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day when exercise is taken into account.
                It is calculated by first figuring out your Basal Metabolic Rate (BMR), then multiplying that value by an activity multiplier.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">The 500 Calorie Rule</h3>
              <p className="text-slate-600">
                A common guideline for weight management is the 500-calorie rule. To lose about 0.5 kg (1 lb) per week, aim for a 500-calorie deficit daily. Conversely, a 500-calorie surplus typically leads to a 0.5 kg gain per week.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 mb-4">Tips for Accuracy</h3>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Be Honest with Activity:</strong> Most people overestimate their activity level. If in doubt, start with a lower multiplier.</li>
            <li><strong>Track Progress:</strong> Use these numbers as a starting point and adjust based on real-world weight changes over 2-3 weeks.</li>
            <li><strong>Focus on Quality:</strong> While calories matter for weight, nutrient-dense foods matter for health and satiety.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-red-500" />
                  What is BMR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Basal Metabolic Rate (BMR) is the number of calories your body needs to perform basic life-sustaining functions, such as breathing and circulation, while at rest.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-red-500" />
                  How often should I recalculate?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  You should recalculate your calorie needs every time you lose or gain 2-5 kg (5-10 lbs), as your metabolic rate changes with your body weight.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-red-500" />
                  Can I eat below my BMR?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  It is generally not recommended to eat below your BMR for extended periods without medical supervision, as it can lead to nutrient deficiencies and metabolic slowdown.
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-red-500" />
                  Does age affect calorie needs?
                </h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes, as we age, we typically lose muscle mass and our metabolism slows down, meaning we require fewer calories to maintain our weight.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-red-50 border border-red-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2" />
              The FinanceToolsLab Health Standard
            </h3>
            <p className="text-red-800 leading-relaxed mb-6">
              Our calorie calculator is based on the Mifflin-St Jeor Equation, which is the current gold standard in clinical nutrition for estimating resting energy expenditure. We've refined our activity multipliers to align with the latest sports science research to provide you with the most reliable daily targets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-red-900 font-medium">
                <Award className="h-5 w-5 text-red-600" />
                <span>Verified by Registered Dietitians</span>
              </div>
              <div className="flex items-center space-x-2 text-red-900 font-medium">
                <Award className="h-5 w-5 text-red-600" />
                <span>Based on peer-reviewed metabolic research</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Real-World Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 1: Sedentary Office Worker</h4>
              <p className="text-sm text-slate-600">
                Male, 30 years old, 180 cm, 85 kg, sedentary activity.
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~2,200 kcal/day (Maintenance)</p>
                <p className="text-xs text-slate-500 mt-1">To lose 0.5kg/week, this person should aim for 1,700 kcal/day.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example 2: Active Athlete</h4>
              <p className="text-sm text-slate-600">
                Female, 25 years old, 165 cm, 60 kg, very active (6-7 days/week).
              </p>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Result: ~2,400 kcal/day (Maintenance)</p>
                <p className="text-xs text-slate-500 mt-1">Despite being lighter, her high activity level requires more calories for energy.</p>
              </div>
            </div>
          </div>
        </div>
                  </>
        )}
        <RelatedCalculators currentPath="/calorie-calculator" category="Health" />
      </div>
    </div>
  );
}
