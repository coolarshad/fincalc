import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
  console.error("❌ ERROR: Please add your Firebase configuration to the .env file.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const homeData = {
  seoTitle: "FinanceToolsLab.com - Free Online Financial & Health Calculators",
  seoDescription: "Access a comprehensive suite of free, accurate online calculators for finance, health, and business. Mobile-first and lightweight for maximum performance.",
  seoKeywords: "financetoolslab, loan calculator, mortgage calculator, bmi calculator, salary calculator, interest calculator, sip calculator",
  heroTitle: "FinanceTools<span class=\"text-indigo-400\">Lab</span>.com",
  heroSubtitle: "Precision tools for smarter financial decisions. Accurate, free, and optimized for mobile performance.",
  calculatorsTitle: "Professional Calculator Suite",
  calculatorsSubtitle: "Our lab-tested tools provide the accuracy you need for critical financial and health decisions.",
  whyChooseUsTitle: "Why Millions Trust FinanceToolsLab.com",
  whyChooseUsSubtitle: "Our tools are built by industry experts and verified by professionals to ensure you get the most accurate results possible.",
  feature1Title: "Expert-Verified",
  feature1Desc: "Every formula is vetted by financial analysts, health professionals, and business consultants to meet industry standards.",
  feature2Title: "Rigorous Accuracy",
  feature2Desc: "We use real-time data and advanced algorithms that are stress-tested against complex real-world scenarios.",
  feature3Title: "Global Standards",
  feature3Desc: "Our tools comply with international financial regulations and health guidelines (WHO, CDC, etc.).",
  body: `
## The FinanceToolsLab.com Advantage

### Financial Planning Made Easy
Navigating the world of finance can be complex. Our suite of financial tools, including the **Loan Calculator**, **Mortgage Calculator**, and **SIP Calculator**, are designed to simplify your planning. Whether you're looking to buy a new home, plan for retirement, or manage your monthly budget, FinanceToolsLab.com provides accurate projections to help you stay on track.

### Health and Wellness Tracking
Your health is your greatest asset. Tools like our **BMI Calculator**, **Calorie Calculator**, and **Body Fat Calculator** help you monitor your physical well-being. We provide more than just numbers; our calculators include detailed notes and tips to help you understand what your results mean for your long-term health.

### Business and Utility Tools
For entrepreneurs and professionals, our **Margin Calculator**, **GST Calculator**, and **Break-even Point Calculator** are essential for daily operations. We've enriched these tools with formulas and FAQs to ensure you not only get the results you need but also understand the underlying logic.

### Why Use FinanceToolsLab.com?
FinanceToolsLab.com is built with the user in mind. We prioritize accuracy, ease of use, and privacy. Every page is optimized for search engines to ensure you can find the tools you need quickly. With our categorized footer and intuitive navigation, finding the right calculator has never been easier.
  `
};

const aboutData = {
  seoTitle: "About FinanceToolsLab.com - Our Mission & Expertise",
  seoDescription: "Learn about FinanceToolsLab.com, our commitment to accuracy, and why we are the trusted choice for millions of users worldwide.",
  seoKeywords: "about financetoolslab, financial tools mission, expert verified calculators, accurate finance tools",
  missionTitle: "Empowering Your <span class=\"text-indigo-600\">Financial Future</span>",
  missionText: "FinanceToolsLab.com was established with a singular vision: to democratize high-precision financial analysis. We bridge the gap between complex financial modeling and everyday decision-making.",
  labStandardTitle: "The Lab Standard",
  labStandardText: "Our \"Lab Standard\" ensures that every tool is built on verified mathematical models used by top-tier financial institutions. We don't just provide numbers; we provide confidence.",
  labBullet1: "Verified by Certified Financial Planners (CFP)",
  labBullet2: "Real-time Data Integration for Accuracy",
  labBullet3: "Stress-tested Algorithms",
  whyChooseUsTitle: "Why Choose Us?",
  whyChooseUsText: "In an era of misinformation, FinanceToolsLab.com stands as a beacon of reliability. Our tools are designed to be the fastest, most accurate, and most user-friendly on the web.",
  whyBullet1: "100% Free & No Registration Required",
  whyBullet2: "Mobile-First, Lightweight Design",
  whyBullet3: "Privacy-First: No Data Storage",
  feature1Title: "Precision Engineering",
  feature1Desc: "Our calculators use high-precision floating-point arithmetic to ensure results are accurate to the last cent.",
  feature2Title: "Bank-Level Security",
  feature2Desc: "We employ strict client-side processing. Your financial data never touches our servers, ensuring total privacy.",
  feature3Title: "User-Centric Design",
  feature3Desc: "Built for speed and accessibility. Our tools load in milliseconds and work perfectly on any device or screen size.",
  body: `
## The FinanceToolsLab.com Advantage

### SEO Optimized & Lightweight
We understand that time is money. That's why FinanceToolsLab.com is optimized for core web vitals. Our lightweight architecture ensures that you get your results instantly, even on slow mobile connections. This commitment to performance also makes us a favorite for search engines, ensuring our tools are always just a search away.

### Comprehensive Feature Set
From the **SIP Calculator** for long-term wealth to the **GST Calculator** for business compliance, our suite covers the entire spectrum of financial needs. We continuously update our tools to reflect the latest tax laws, interest rates, and economic trends.
  `
};

const contactData = {
  seoTitle: "Contact Us",
  seoDescription: "Get in touch with the FinanceToolsLab team for feedback, suggestions, or support.",
  seoKeywords: "contact us, feedback, support",
  title: "Get in Touch",
  subtitle: "Have a suggestion for a new calculator? Found a bug? Or just want to say hi? We'd love to hear from you. Our team typically responds within 24 hours.",
  emailTitle: "Email Us",
  emailValue: "support@financetoolslab.com",
  officeTitle: "Office",
  officeValue: "Koteshwor-32, Kathmandu, Nepal",
  quote: "\"We take every piece of feedback seriously. Our goal is to build the world's most trusted calculation platform, one user at a time.\"",
  quoteAuthor: "— The FinanceToolsLab Engineering Team"
};

const privacyData = {
  seoTitle: "Privacy Policy - FinanceToolsLab.com",
  seoDescription: "Read our privacy policy to understand how we protect your data. At FinanceToolsLab.com, your privacy is our top priority.",
  seoKeywords: "privacy policy, data protection, financetoolslab privacy",
  title: "Privacy Policy",
  commitmentTitle: "Privacy First Commitment",
  lastUpdated: "Last Updated: April 12, 2026",
  commitmentText: "At FinanceToolsLab.com, we believe that your financial and health data is yours and yours alone. Our platform is engineered with a \"Privacy-First\" architecture, meaning we prioritize your anonymity and data security in every line of code we write.",
  section1Title: "1. Data Collection",
  section1Text: `FinanceToolsLab.com does **not** collect, store, or share any personal financial or health data entered into our calculators. All calculations are performed locally on your device using JavaScript. Once you close your browser tab, all data entered during that session is cleared.

* No registration or account creation required.
* No storage of loan amounts, salaries, or health metrics.
* No tracking of individual calculation results.`,
  section2Title: "2. Cookies and Analytics",
  section2Text: `We use minimal, privacy-compliant analytics to understand general site traffic and improve our tools. This data is aggregated and anonymized, meaning it cannot be used to identify you personally.

We may use essential cookies to remember your preferences (such as dark mode or currency selection) to provide a better user experience. These cookies do not contain any sensitive information.`,
  section3Title: "3. Third-Party Links",
  section3Text: "Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites.",
  contactSectionTitle: "Contact Us Regarding Privacy",
  contactSectionText: "If you have any questions about this Privacy Policy or our data practices, please contact us at:",
  contactEmail: "support@financetoolslab.com"
};

const loanCalculatorData = {
  seoTitle: "Loan Calculator - Monthly Payment & Interest",
  seoDescription: "Free loan calculator to estimate monthly payments, total interest, and amortization schedule for any loan.",
  seoKeywords: "loan calculator, monthly payment, interest rate, amortization schedule",
  title: "Loan Calculator",
  description: "Plan your borrowing with our comprehensive loan estimation tool.",
  body: `
## How to Use the Loan Calculator
Our loan calculator helps you understand the true cost of borrowing. By entering a few simple details, you can see exactly how much your monthly payments will be and how much interest you'll pay over the life of the loan.

### Key Terms Explained
* **Principal:** The initial amount of money you borrow.
* **Interest Rate:** The percentage charged by the lender for the use of the money.
* **Loan Term:** The duration over which the loan must be repaid.
* **Amortization:** The process of paying off a debt over time through regular payments.

### Pro Tip
Even a small reduction in your interest rate can save you thousands of dollars over the life of a long-term loan like a mortgage. Always shop around for the best rates before committing.
`
};

const bmiCalculatorData = {
  seoTitle: "BMI Calculator - Body Mass Index",
  seoDescription: "Calculate your Body Mass Index (BMI) to find out if you are at a healthy weight for your height.",
  seoKeywords: "bmi calculator, body mass index, healthy weight, obesity, weight loss",
  title: "BMI Calculator",
  description: "Assess your body weight relative to your height.",
  body: `
## Understanding Body Mass Index (BMI)
Body Mass Index (BMI) is a person's weight in kilograms divided by the square of height in meters. A high BMI can be an indicator of high body fatness.

### Why BMI Matters
Maintaining a healthy BMI is associated with a lower risk of developing chronic conditions such as:
* Type 2 Diabetes
* Heart Disease
* High Blood Pressure
* Certain types of cancer

### Limitations of BMI
* **Muscle Mass:** Muscle is denser than fat. Athletes or very muscular individuals may have a high BMI but low body fat.
* **Age:** Older adults tend to have more body fat than younger adults with the same BMI.
`
};

async function seed() {
  console.log("🌱 Seeding Firebase...");
  
  try {
    await setDoc(doc(db, "pages", "home"), homeData);
    console.log("✅ Seeded Home Page");
    
    await setDoc(doc(db, "pages", "about"), aboutData);
    console.log("✅ Seeded About Page");
    
    await setDoc(doc(db, "pages", "contact"), contactData);
    console.log("✅ Seeded Contact Page");

    await setDoc(doc(db, "pages", "privacy"), privacyData);
    console.log("✅ Seeded Privacy Page");

    await setDoc(doc(db, "pages", "calculators/loan-calculator"), loanCalculatorData);
    console.log("✅ Seeded Loan Calculator");

    await setDoc(doc(db, "pages", "calculators/bmi-calculator"), bmiCalculatorData);
    console.log("✅ Seeded BMI Calculator");

    console.log("🎉 Successfully seeded all pages!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
  
  process.exit(0);
}

seed();
