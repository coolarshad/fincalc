import fs from 'fs';
import path from 'path';

// Mapping extracted from App.tsx
const calculators = [
  { file: 'LoanCalculator.tsx', slug: 'loan-calculator' },
  { file: 'BMICalculator.tsx', slug: 'bmi-calculator' },
  { file: 'SalaryCalculator.tsx', slug: 'salary-calculator' },
  { file: 'InterestCalculator.tsx', slug: 'interest-calculator' },
  { file: 'InvestmentCalculator.tsx', slug: 'investment-calculator' },
  { file: 'MortgageCalculator.tsx', slug: 'mortgage-calculator' },
  { file: 'CalorieCalculator.tsx', slug: 'calorie-calculator' },
  { file: 'InflationCalculator.tsx', slug: 'inflation-calculator' },
  { file: 'CurrencyConverter.tsx', slug: 'currency-calculator' },
  { file: 'BodyFatCalculator.tsx', slug: 'body-fat-calculator' },
  { file: 'PregnancyCalculator.tsx', slug: 'pregnancy-calculator' },
  { file: 'CreditCardCalculator.tsx', slug: 'credit-card-calculator' },
  { file: 'MarginCalculator.tsx', slug: 'margin-calculator' },
  { file: 'BreakEvenCalculator.tsx', slug: 'break-even-calculator' },
  { file: 'CashFlowCalculator.tsx', slug: 'cash-flow-calculator' },
  { file: 'FDCalculator.tsx', slug: 'fd-calculator' },
  { file: 'LoanEligibilityCalculator.tsx', slug: 'loan-eligibility-calculator' },
  { file: 'SIPCalculator.tsx', slug: 'sip-calculator' },
  { file: 'CAGRCalculator.tsx', slug: 'cagr-calculator' },
  { file: 'GSTCalculator.tsx', slug: 'gst-calculator' }
];

const srcDir = path.resolve('src/pages/calculators');
const destDir = path.resolve('src/app');

for (const calc of calculators) {
  const fileSrc = path.join(srcDir, calc.file);
  const slugDir = path.join(destDir, calc.slug);

  if (!fs.existsSync(fileSrc)) {
    console.log(`Missing file: ${fileSrc}`);
    continue;
  }

  // Create directory
  if (!fs.existsSync(slugDir)) {
    fs.mkdirSync(slugDir, { recursive: true });
  }

  // Generate Server page.tsx
  const serverPageCode = `import { Metadata } from 'next';
import { getPageContent, firebaseConfig } from '@/lib/firebase';
import Client from './Client';

export async function generateMetadata(): Promise<Metadata> {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('calculators/${calc.slug}');
  }
  
  return {
    title: cmsData?.seoTitle || "FinanceToolsLab.com - Calculator",
    description: cmsData?.seoDescription || "Calculate and estimate precisely with FinanceToolsLab.",
    keywords: cmsData?.seoKeywords || "calculator, finance, tools",
    alternates: {
      canonical: \`https://financetoolslab.com/${calc.slug}\`,
    },
  };
}

export default async function Page() {
  let cmsData = null;
  if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
    cmsData = await getPageContent('calculators/${calc.slug}');
  }

  return <Client cmsData={cmsData} />;
}
`;

  fs.writeFileSync(path.join(slugDir, 'page.tsx'), serverPageCode, 'utf8');

  // Read original file and modify it for Client Component
  let content = fs.readFileSync(fileSrc, 'utf8');

  // Add "use client";
  content = `"use client";\n\n` + content;

  // Replace import { useState, useEffect } with React's
  // Actually, we can just replace the signature
  const componentNameMatch = content.match(/export default function ([a-zA-Z0-9_]+)\(/);
  if (componentNameMatch) {
    const compName = componentNameMatch[1];
    content = content.replace(`export default function ${compName}() {`, `export default function ${compName}({ cmsData }: { cmsData: any }) {`);
  }

  // Remove SEO import
  content = content.replace(/import SEO from '@\/components\/SEO';\n?/g, '');
  
  // Remove getPageContent from firebase import
  content = content.replace(/getPageContent,\s*/g, '');

  // Remove firebase fetch effect block
  const effectRegex = /const \[cmsData, setCmsData\][^;]+;[\s\n]*useEffect\(\(\) => \{[\s\n]*async function fetchCms\(\) \{[\s\n]*if \(firebaseConfig\.projectId === 'YOUR_PROJECT_ID'\) return;[\s\n]*const data = await getPageContent\('[^']+'\);[\s\n]*setCmsData\(data\);[\s\n]*\}[\s\n]*fetchCms\(\);[\s\n]*\}, \[\]\);/s;
  content = content.replace(effectRegex, '');

  // Remove <SEO /> block
  const seoRegex = /<SEO[\s\S]*?\/>/g;
  content = content.replace(seoRegex, '{/* SEO handled by parent server component */}');

  fs.writeFileSync(path.join(slugDir, 'Client.tsx'), content, 'utf8');
  console.log(`Migrated ${calc.slug}`);
}

console.log('Done migrating calculators.');
