"use client";

import React from 'react';
import { Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function ContactClient({ cmsData }: { cmsData: any }) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* SEO handled by parent server component */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">{cmsData?.title || "Get in Touch"}</h1>
          <p className="text-lg text-slate-600 mb-10">
            {cmsData?.subtitle || "Have a suggestion for a new calculator? Found a bug? Or just want to say hi? We'd love to hear from you. Our team typically responds within 24 hours."}
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{cmsData?.emailTitle || "Email Us"}</h3>
                <p className="text-slate-600">{cmsData?.emailValue || "support@financetoolslab.com"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{cmsData?.officeTitle || "Office"}</h3>
                <p className="text-slate-600">{cmsData?.officeValue || "Koteshwor-32, Kathmandu, Nepal"}</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-slate-200 overflow-hidden">
          <CardContent className="pt-8 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first">First Name</Label>
                      <Input id="first" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last">Last Name</Label>
                      <Input id="last" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      required
                      className="w-full min-h-[150px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold transition-all"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you for reaching out. We've received your message and will get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full px-8"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSubmitted && (
              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 italic">
                  {cmsData?.quote || "\"We take every piece of feedback seriously. Our goal is to build the world's most trusted calculation platform, one user at a time.\""}
                </p>
                <p className="text-xs font-bold text-slate-900 mt-2">{cmsData?.quoteAuthor || "— The FinanceToolsLab Engineering Team"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
