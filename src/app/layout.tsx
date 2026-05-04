import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  metadataBase: new URL('https://financetoolslab.com'),
  title: 'FinanceToolsLab.com - Free Online Financial & Health Calculators',
  description: 'Access a comprehensive suite of free, accurate online calculators for finance, health, and business. Mobile-first and lightweight for maximum performance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
