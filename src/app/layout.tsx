import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Layout from '@/components/Layout';
import { SITE_CONFIG } from '@/lib/seo-config';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'FinanceToolsLab.com - Free Online Financial, Health & Business Calculators',
    template: '%s',
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    'financial calculators',
    'free online calculators',
    'loan calculator',
    'mortgage calculator',
    'sip calculator',
    'investment calculator',
    'salary calculator',
    'bmi calculator',
    'gst calculator',
    'margin calculator',
    'interest calculator',
    'financetoolslab'
  ],
  authors: [{ name: 'FinanceToolsLab Team', url: SITE_CONFIG.domain }],
  creator: 'FinanceToolsLab.com',
  publisher: 'FinanceToolsLab.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    title: 'FinanceToolsLab.com - Free Online Financial, Health & Business Calculators',
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceToolsLab.com - Free Online Financial, Health & Business Calculators',
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
