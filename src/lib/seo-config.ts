export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface PageSEO {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  category: string;
  applicationCategory?: 'FinanceApplication' | 'HealthApplication' | 'BusinessApplication';
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQItem[];
}

export const SITE_CONFIG = {
  name: 'FinanceToolsLab.com',
  domain: 'https://financetoolslab.com',
  tagline: 'Precision Tools for Smarter Financial & Health Decisions',
  description: 'Access a comprehensive suite of free, accurate online calculators for personal finance, health, and business. Instant calculations, transparent formulas, and mobile-first performance.',
  email: 'support@financetoolslab.com',
};

export const SEO_DATA: Record<string, PageSEO> = {
  'home': {
    slug: '',
    title: 'FinanceToolsLab.com - Free Online Financial, Health & Business Calculators',
    description: 'Access 20+ free, accurate online calculators for mortgages, personal loans, investments, SIP returns, salary take-home, BMI, and business profit margins.',
    keywords: [
      'financial calculators',
      'free online calculators',
      'loan calculator',
      'mortgage calculator',
      'sip calculator',
      'investment calculator',
      'salary calculator',
      'bmi calculator',
      'calorie calculator',
      'gst calculator',
      'margin calculator',
      'interest calculator',
      'financetoolslab'
    ],
    canonical: 'https://financetoolslab.com/',
    category: 'Home',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' }
    ]
  },
  'about': {
    slug: 'about',
    title: 'About Us - Mission, Precision Standards & Financial Expertise | FinanceToolsLab',
    description: 'Learn about FinanceToolsLab.com, our mission to democratize financial calculation tools, our CFP mathematical review standards, and privacy-first client-side design.',
    keywords: [
      'about financetoolslab',
      'financial tools mission',
      'certified financial tools',
      'financial calculator standards',
      'privacy-first financial calculators',
      'accurate calculation tools'
    ],
    canonical: 'https://financetoolslab.com/about/',
    category: 'Company',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'About Us', url: 'https://financetoolslab.com/about/' }
    ]
  },
  'contact': {
    slug: 'contact',
    title: 'Contact Us - Support, Feedback & Inquiries | FinanceToolsLab',
    description: 'Have questions, suggestions, or feedback for FinanceToolsLab.com? Reach out to our support team for tool assistance, feature requests, and inquiries.',
    keywords: [
      'contact financetoolslab',
      'financial calculator support',
      'calculator feedback',
      'customer support',
      'contact finance tools'
    ],
    canonical: 'https://financetoolslab.com/contact/',
    category: 'Company',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Contact', url: 'https://financetoolslab.com/contact/' }
    ]
  },
  'privacy': {
    slug: 'privacy',
    title: 'Privacy Policy - Client-Side Security & Data Protection | FinanceToolsLab',
    description: 'FinanceToolsLab.com Privacy Policy. We process calculations 100% client-side in your browser and never store, track, or sell your private financial data.',
    keywords: [
      'privacy policy',
      'client-side privacy',
      'data protection',
      'gdpr compliance',
      'secure financial tools',
      'no data collection calculator'
    ],
    canonical: 'https://financetoolslab.com/privacy/',
    category: 'Legal',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Privacy Policy', url: 'https://financetoolslab.com/privacy/' }
    ]
  },

  // PERSONAL FINANCE CALCULATORS
  'loan-calculator': {
    slug: 'loan-calculator',
    title: 'Loan Calculator - Calculate Monthly Payment (EMI) & Amortization | FinanceToolsLab',
    description: 'Free online loan calculator with instant monthly payment (EMI) estimation, total interest breakdown, and complete amortization schedule. Accurate, fast, and easy to use.',
    keywords: [
      'loan calculator',
      'emi calculator',
      'monthly payment calculator',
      'personal loan calculator',
      'auto loan calculator',
      'loan interest calculator',
      'amortization schedule',
      'loan payment breakdown'
    ],
    canonical: 'https://financetoolslab.com/loan-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Loan Calculator', url: 'https://financetoolslab.com/loan-calculator/' }
    ],
    faqs: [
      {
        question: 'What is an Amortization Schedule?',
        answer: 'An amortization schedule is a comprehensive table detailing each periodic payment on an amortizing loan. It breaks down each payment into interest and principal portions and tracks the remaining loan balance.'
      },
      {
        question: 'How does interest change over the loan term?',
        answer: 'During the early stages of a loan, a higher percentage of each monthly payment goes towards interest because the principal balance is at its highest. As principal decreases, interest charges shrink and more money goes toward paying off the loan.'
      },
      {
        question: 'Can I save money by making extra principal payments?',
        answer: 'Yes. Making additional principal payments reduces the outstanding balance faster, which reduces future compounding interest and shortens the total term of your loan.'
      },
      {
        question: 'What is the difference between fixed and floating interest rates?',
        answer: 'A fixed rate remains constant throughout the loan term, ensuring predictable monthly payments. A floating (or variable) rate fluctuates based on benchmark market rates, causing payments to adjust periodically.'
      }
    ]
  },

  'mortgage-calculator': {
    slug: 'mortgage-calculator',
    title: 'Mortgage Calculator - Monthly Payment, Taxes, Insurance & Amortization | FinanceToolsLab',
    description: 'Calculate monthly mortgage payments including principal, interest, property taxes, and home insurance. View 15-year and 30-year amortization tables and payoff graphs.',
    keywords: [
      'mortgage calculator',
      'home loan calculator',
      'monthly mortgage payment',
      'mortgage amortization schedule',
      'mortgage with property taxes and insurance',
      '30 year mortgage calculator',
      '15 year mortgage calculator',
      'house payment calculator'
    ],
    canonical: 'https://financetoolslab.com/mortgage-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Mortgage Calculator', url: 'https://financetoolslab.com/mortgage-calculator/' }
    ],
    faqs: [
      {
        question: 'What is included in a monthly mortgage payment (PITI)?',
        answer: 'A standard mortgage payment includes Principal (repaying borrowed funds), Interest (lender charge), Taxes (local property taxes), and Insurance (homeowners and private mortgage insurance).'
      },
      {
        question: 'Should I choose a 15-year or 30-year mortgage?',
        answer: 'A 15-year mortgage offers lower interest rates and saves substantial interest over time with higher monthly payments. A 30-year mortgage provides lower monthly payments for greater budget flexibility.'
      },
      {
        question: 'What is Private Mortgage Insurance (PMI)?',
        answer: 'PMI is an insurance policy lenders require if your down payment is less than 20% of the home purchase price, protecting the lender in case of loan default.'
      },
      {
        question: 'How do property taxes affect my monthly payment?',
        answer: 'Property taxes are usually collected monthly by your mortgage servicer into an escrow account and paid to your local municipality on your behalf.'
      }
    ]
  },

  'investment-calculator': {
    slug: 'investment-calculator',
    title: 'Investment Calculator - Compound Interest & Wealth Growth Projections | FinanceToolsLab',
    description: 'Calculate future investment growth with compound interest, regular monthly contributions, and customizable compounding frequencies. Visual graphs and tables included.',
    keywords: [
      'investment calculator',
      'compound interest calculator',
      'return on investment calculator',
      'portfolio growth calculator',
      'compound growth calculator',
      'future value calculator',
      'wealth accumulation calculator'
    ],
    canonical: 'https://financetoolslab.com/investment-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Investment Calculator', url: 'https://financetoolslab.com/investment-calculator/' }
    ],
    faqs: [
      {
        question: 'How does compound interest accelerate wealth building?',
        answer: 'Compound interest earns interest on both your initial principal and previous accumulated interest, creating an exponential growth curve over time.'
      },
      {
        question: 'How does contribution frequency affect returns?',
        answer: 'Investing regular monthly amounts allows your money to begin compounding sooner and takes advantage of dollar-cost averaging in fluctuating markets.'
      },
      {
        question: 'What is the Rule of 72?',
        answer: 'The Rule of 72 is a quick estimation shortcut: divide 72 by your annual interest rate to determine approximately how many years it will take to double your investment.'
      },
      {
        question: 'How does inflation affect my investment returns?',
        answer: 'Real return equals your nominal rate of return minus inflation. Ensuring your portfolio outperforms inflation protects your long-term purchasing power.'
      }
    ]
  },

  'sip-calculator': {
    slug: 'sip-calculator',
    title: 'SIP Calculator - Systematic Investment Plan Returns & Growth | FinanceToolsLab',
    description: 'Calculate future wealth and expected maturity values for monthly Systematic Investment Plans (SIP) in mutual funds. Accurate compound interest growth projections.',
    keywords: [
      'sip calculator',
      'systematic investment plan',
      'mutual fund sip calculator',
      'sip return calculator',
      'monthly investment calculator',
      'sip wealth calculator',
      'sip compounding calculator'
    ],
    canonical: 'https://financetoolslab.com/sip-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'SIP Calculator', url: 'https://financetoolslab.com/sip-calculator/' }
    ],
    faqs: [
      {
        question: 'What is a Systematic Investment Plan (SIP)?',
        answer: 'A SIP is an investment method where an investor commits a fixed sum of money at regular intervals (usually monthly) into a mutual fund scheme or index fund.'
      },
      {
        question: 'What are the benefits of Rupee Cost Averaging in SIP?',
        answer: 'When markets drop, your fixed monthly allocation buys more units; when markets rise, it buys fewer units. This averages out purchase costs over market cycles.'
      },
      {
        question: 'Can I change my SIP amount or pause it?',
        answer: 'Most fund platforms allow you to increase (step-up SIP), decrease, pause, or terminate your monthly SIP installments without penalties.'
      },
      {
        question: 'How is SIP return calculated?',
        answer: 'SIP returns are calculated using compounding formulas where each installment compounds for the specific number of months it remains invested until maturity.'
      }
    ]
  },

  'fd-calculator': {
    slug: 'fd-calculator',
    title: 'FD Calculator - Fixed Deposit Maturity Value & Interest Calculator | FinanceToolsLab',
    description: 'Calculate Fixed Deposit (FD) maturity amount, total interest earned, and quarterly compound returns accurately with our free online FD calculator.',
    keywords: [
      'fd calculator',
      'fixed deposit calculator',
      'fd maturity calculator',
      'fixed deposit interest rate',
      'term deposit calculator',
      'fd interest calculator',
      'bank fd returns'
    ],
    canonical: 'https://financetoolslab.com/fd-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'FD Calculator', url: 'https://financetoolslab.com/fd-calculator/' }
    ],
    faqs: [
      {
        question: 'How is Fixed Deposit interest calculated?',
        answer: 'Banks generally calculate fixed deposit interest compounded on a quarterly basis using the formula A = P * (1 + r/n)^(n*t).'
      },
      {
        question: 'What is the difference between cumulative and non-cumulative FD?',
        answer: 'In a cumulative FD, interest is reinvested and paid at maturity. In a non-cumulative FD, interest is paid out periodically (monthly, quarterly, or annually).'
      },
      {
        question: 'Is Fixed Deposit interest taxable?',
        answer: 'Yes, interest earned on fixed deposits is taxable according to your income tax bracket, and banks may deduct Tax Deducted at Source (TDS) if interest exceeds statutory limits.'
      },
      {
        question: 'Can I withdraw my Fixed Deposit before maturity?',
        answer: 'Yes, premature withdrawal is usually permitted, though banks may charge a nominal penalty reduction on the applicable interest rate.'
      }
    ]
  },

  'interest-calculator': {
    slug: 'interest-calculator',
    title: 'Interest Calculator - Simple & Compound Interest Calculator | FinanceToolsLab',
    description: 'Calculate simple and compound interest instantly. Compare compounding frequencies from daily to annual with detailed interest schedules and growth tables.',
    keywords: [
      'interest calculator',
      'simple interest calculator',
      'compound interest calculator',
      'interest payment calculator',
      'calculate interest rate',
      'annual compound interest'
    ],
    canonical: 'https://financetoolslab.com/interest-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Interest Calculator', url: 'https://financetoolslab.com/interest-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the difference between simple and compound interest?',
        answer: 'Simple interest is calculated only on the principal amount, whereas compound interest is calculated on the principal plus previously accumulated interest.'
      },
      {
        question: 'How does compounding frequency impact total interest?',
        answer: 'More frequent compounding (such as daily or monthly vs annually) increases effective annual yield and total accumulated interest over time.'
      },
      {
        question: 'What is Annual Percentage Yield (APY)?',
        answer: 'APY reflects the real rate of return on an investment taking into account the effect of compounding interest over a one-year period.'
      },
      {
        question: 'What is the simple interest formula?',
        answer: 'The simple interest formula is I = P * r * t, where P is principal, r is annual interest rate (in decimal), and t is time in years.'
      }
    ]
  },

  'cagr-calculator': {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator - Compound Annual Growth Rate Calculator | FinanceToolsLab',
    description: 'Calculate the Compound Annual Growth Rate (CAGR) of your investments, business revenue, or asset values over multiple years with detailed formula insights.',
    keywords: [
      'cagr calculator',
      'compound annual growth rate',
      'annualized return calculator',
      'investment cagr formula',
      'business growth rate calculator',
      'cagr formula calculation'
    ],
    canonical: 'https://financetoolslab.com/cagr-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'CAGR Calculator', url: 'https://financetoolslab.com/cagr-calculator/' }
    ],
    faqs: [
      {
        question: 'What does CAGR measure?',
        answer: 'CAGR measures the mean annual growth rate of an investment over a specified time period longer than one year, smoothing out intermittent market volatility.'
      },
      {
        question: 'What is the mathematical formula for CAGR?',
        answer: 'The CAGR formula is: CAGR = (Ending Value / Beginning Value)^(1 / Number of Years) - 1.'
      },
      {
        question: 'What are the limitations of CAGR?',
        answer: 'CAGR assumes steady, constant growth and ignores year-to-year volatility and capital injections or withdrawals made during the investment tenure.'
      },
      {
        question: 'When should I use CAGR instead of Absolute Return?',
        answer: 'Use CAGR whenever evaluating performance across multi-year investments to provide an annualized benchmark for fair comparison across asset classes.'
      }
    ]
  },

  'salary-calculator': {
    slug: 'salary-calculator',
    title: 'Salary Calculator - Take-Home Pay & Net Income Calculator | FinanceToolsLab',
    description: 'Convert your annual salary to hourly, weekly, bi-weekly, or monthly take-home pay after standard tax deductions, benefits, and retirement withholdings.',
    keywords: [
      'salary calculator',
      'take home pay calculator',
      'net pay calculator',
      'paycheck calculator',
      'hourly to salary',
      'gross to net salary',
      'income tax deductions calculator'
    ],
    canonical: 'https://financetoolslab.com/salary-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Salary Calculator', url: 'https://financetoolslab.com/salary-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the difference between Gross Pay and Net Pay?',
        answer: 'Gross pay is your total earned compensation before any deductions, while net pay (take-home pay) is the actual amount deposited into your bank account after taxes and deductions.'
      },
      {
        question: 'How do pre-tax deductions benefit my salary?',
        answer: 'Pre-tax deductions (like 401(k), pension contributions, and health insurance) reduce your taxable income, lowering your overall income tax liability.'
      },
      {
        question: 'How do I convert an hourly wage to an annual salary?',
        answer: 'Assuming a standard 40-hour work week and 52 weeks per year (2,080 hours), multiply your hourly rate by 2,080 to find your annual gross salary.'
      },
      {
        question: 'What standard deductions typically reduce take-home pay?',
        answer: 'Common deductions include federal/state income taxes, social security/FICA, medical/dental insurance premiums, and retirement contributions.'
      }
    ]
  },

  'inflation-calculator': {
    slug: 'inflation-calculator',
    title: 'Inflation Calculator - Future Value & Purchasing Power Calculator | FinanceToolsLab',
    description: 'Calculate how inflation erodes the purchasing power of your money over time. See future equivalent costs and real value depreciation with customizable rates.',
    keywords: [
      'inflation calculator',
      'purchasing power calculator',
      'cost of living calculator',
      'future value of money',
      'inflation rate calculator',
      'money depreciation calculator'
    ],
    canonical: 'https://financetoolslab.com/inflation-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Inflation Calculator', url: 'https://financetoolslab.com/inflation-calculator/' }
    ],
    faqs: [
      {
        question: 'What is inflation and how does it affect purchasing power?',
        answer: 'Inflation is the general increase in prices and fall in the purchasing value of money over time. As prices rise, each unit of currency buys fewer goods and services.'
      },
      {
        question: 'How is future value adjusted for inflation calculated?',
        answer: 'Future value is calculated using the formula: FV = PV * (1 + i)^n, where PV is current value, i is average annual inflation rate, and n is number of years.'
      },
      {
        question: 'How can investors protect their wealth against inflation?',
        answer: 'Investors combat inflation by allocating funds into growth assets such as equities, real estate, inflation-protected bonds (TIPS), and commodities.'
      },
      {
        question: 'What is the Consumer Price Index (CPI)?',
        answer: 'CPI measures the average change over time in prices paid by urban consumers for a representative market basket of consumer goods and services.'
      }
    ]
  },

  'credit-card-calculator': {
    slug: 'credit-card-calculator',
    title: 'Credit Card Payoff Calculator - Debt-Free Date & Interest Savings | FinanceToolsLab',
    description: 'Calculate how long it takes to pay off credit card debt with minimum payments vs fixed monthly payments. See total interest costs and savings.',
    keywords: [
      'credit card calculator',
      'credit card payoff calculator',
      'credit card interest calculator',
      'debt payoff calculator',
      'credit card debt calculator',
      'debt free date calculator'
    ],
    canonical: 'https://financetoolslab.com/credit-card-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Credit Card Calculator', url: 'https://financetoolslab.com/credit-card-calculator/' }
    ],
    faqs: [
      {
        question: 'Why does paying only the minimum credit card payment take so long?',
        answer: 'Credit card minimum payments are usually set very low (around 1% to 2% of principal plus interest), meaning the majority of your payment goes to interest rather than reducing balance.'
      },
      {
        question: 'How is daily credit card interest calculated?',
        answer: 'Interest is calculated by dividing your Annual Percentage Rate (APR) by 365 to find the Daily Periodic Rate, then multiplying by your average daily balance.'
      },
      {
        question: 'What is the debt avalanche method?',
        answer: 'The debt avalanche strategy involves paying off debts in order of highest interest rate first, minimizing the total interest paid across all debts.'
      },
      {
        question: 'How does credit utilization affect credit scores?',
        answer: 'Maintaining credit card balances below 30% (and ideally below 10%) of your credit limit improves your credit utilization ratio and overall credit score.'
      }
    ]
  },

  'currency-calculator': {
    slug: 'currency-calculator',
    title: 'Currency Converter - Live Foreign Exchange Rate Calculator | FinanceToolsLab',
    description: 'Convert world currencies instantly with up-to-date foreign exchange rates. Supports USD, EUR, GBP, JPY, CAD, AUD, INR, and other major global currencies.',
    keywords: [
      'currency converter',
      'currency exchange calculator',
      'forex converter',
      'money converter',
      'exchange rate calculator',
      'usd to eur converter',
      'foreign exchange calculator'
    ],
    canonical: 'https://financetoolslab.com/currency-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Currency Calculator', url: 'https://financetoolslab.com/currency-calculator/' }
    ],
    faqs: [
      {
        question: 'What determines foreign exchange currency rates?',
        answer: 'Foreign exchange rates are determined by foreign exchange market supply and demand, influenced by interest rates, inflation, economic stability, and geopolitical events.'
      },
      {
        question: 'What is the difference between mid-market rate and retail rate?',
        answer: 'The mid-market rate is the real midpoint between buy and sell prices on global currency markets. Retail exchange providers typically add a markup margin to this rate.'
      },
      {
        question: 'How often do currency exchange rates fluctuate?',
        answer: 'Currency rates fluctuate continuously 24 hours a day, 5 days a week across global financial centers from London and New York to Tokyo and Sydney.'
      },
      {
        question: 'How can I avoid high currency exchange conversion fees?',
        answer: 'To minimize fees, use digital multi-currency accounts or low-fee debit cards that provide transparent mid-market exchange rates rather than airport kiosks.'
      }
    ]
  },

  'loan-eligibility-calculator': {
    slug: 'loan-eligibility-calculator',
    title: 'Loan Eligibility Calculator - Borrowing Capacity & DTI Calculator | FinanceToolsLab',
    description: 'Check your maximum borrowing power and loan eligibility based on monthly income, existing debt commitments, and Debt-to-Income (DTI) ratio.',
    keywords: [
      'loan eligibility calculator',
      'borrowing power calculator',
      'how much can i borrow',
      'debt to income ratio calculator',
      'dti calculator',
      'home loan eligibility calculator'
    ],
    canonical: 'https://financetoolslab.com/loan-eligibility-calculator/',
    category: 'Personal Finance',
    applicationCategory: 'FinanceApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Personal Finance', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Loan Eligibility Calculator', url: 'https://financetoolslab.com/loan-eligibility-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the Debt-to-Income (DTI) ratio?',
        answer: 'DTI is the percentage of your gross monthly income that goes toward paying monthly debt obligations. Lenders use DTI to measure your ability to manage monthly payments.'
      },
      {
        question: 'What is a good DTI ratio for loan approval?',
        answer: 'Most lenders prefer a DTI ratio of 36% or lower, with no more than 28% allocated to housing expenses, although some loan programs permit ratios up to 43%–50%.'
      },
      {
        question: 'How can I increase my loan eligibility limit?',
        answer: 'You can increase loan eligibility by paying down existing debts, increasing income, adding a co-signer, or selecting a longer loan tenure to lower monthly payments.'
      },
      {
        question: 'Does having existing loans reduce how much I can borrow?',
        answer: 'Yes. Existing loan payments (car loans, credit cards, student loans) increase your monthly debt burden, reducing the remaining borrowing capacity for new loans.'
      }
    ]
  },

  // BUSINESS & UTILITY CALCULATORS
  'margin-calculator': {
    slug: 'margin-calculator',
    title: 'Margin Calculator - Gross Margin, Markup & Profit Calculator | FinanceToolsLab',
    description: 'Calculate gross profit margin, markup percentage, cost of goods sold (COGS), and optimal selling price for products and services. Fast and accurate.',
    keywords: [
      'margin calculator',
      'profit margin calculator',
      'gross margin calculator',
      'markup calculator',
      'selling price calculator',
      'profit markup formula',
      'cogs calculator'
    ],
    canonical: 'https://financetoolslab.com/margin-calculator/',
    category: 'Business & Commerce',
    applicationCategory: 'BusinessApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Business & Commerce', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Margin Calculator', url: 'https://financetoolslab.com/margin-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the difference between Margin and Markup?',
        answer: 'Margin is profit expressed as a percentage of the selling price: (Profit / Revenue) * 100. Markup is profit expressed as a percentage of the cost: (Profit / Cost) * 100.'
      },
      {
        question: 'What is a healthy gross profit margin?',
        answer: 'Healthy gross profit margins vary widely by industry: retail typically ranges from 20%–40%, while software and digital services often exceed 70%–80%.'
      },
      {
        question: 'How do I calculate selling price given cost and target margin?',
        answer: 'Use the formula: Selling Price = Cost / (1 - (Target Margin % / 100)). For example, an item costing $60 with a 40% margin sells for $60 / 0.60 = $100.'
      },
      {
        question: 'Why is confusing margin and markup risky for businesses?',
        answer: 'A 50% markup yields only a 33.3% profit margin. Confusing the two can lead to pricing products too low and operating at an unintended loss.'
      }
    ]
  },

  'gst-calculator': {
    slug: 'gst-calculator',
    title: 'GST Calculator - Calculate GST Inclusive & Exclusive Price | FinanceToolsLab',
    description: 'Instant GST calculator to add or remove Goods and Services Tax with 5%, 12%, 18%, and 28% tax slabs. Accurate net price, tax amount, and gross total.',
    keywords: [
      'gst calculator',
      'goods and services tax calculator',
      'gst inclusive calculator',
      'gst exclusive calculator',
      'sales tax calculator',
      'reverse gst calculator',
      'gst tax calculation'
    ],
    canonical: 'https://financetoolslab.com/gst-calculator/',
    category: 'Business & Commerce',
    applicationCategory: 'BusinessApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Business & Commerce', url: 'https://financetoolslab.com/#calculators' },
      { name: 'GST Calculator', url: 'https://financetoolslab.com/gst-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the difference between GST inclusive and exclusive pricing?',
        answer: 'GST inclusive pricing includes the tax in the displayed product price. GST exclusive pricing adds the statutory tax on top of the base product price at checkout.'
      },
      {
        question: 'How do you remove GST from a total price (Reverse GST)?',
        answer: 'To remove GST: Base Price = Total Price / (1 + (GST Rate / 100)). The GST Amount = Total Price - Base Price.'
      },
      {
        question: 'What are standard GST tax brackets?',
        answer: 'Standard GST tax brackets commonly include 0% (exempt essential goods), 5% (basic items), 12% (standard goods), 18% (services & industrial goods), and 28% (luxury items).'
      },
      {
        question: 'What is Input Tax Credit (ITC)?',
        answer: 'Input Tax Credit allows businesses to reduce the tax they have paid on purchases from the tax they owe on final sales output, preventing tax cascading.'
      }
    ]
  },

  'break-even-calculator': {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator - Calculate Break-Even Units & Revenue | FinanceToolsLab',
    description: 'Find your business break-even point in units and sales volume based on fixed overheads, unit variable costs, and unit selling price. Visual chart included.',
    keywords: [
      'break even calculator',
      'break even point calculator',
      'bep calculator',
      'contribution margin calculator',
      'business break even analysis',
      'units to break even',
      'break even sales volume'
    ],
    canonical: 'https://financetoolslab.com/break-even-calculator/',
    category: 'Business & Commerce',
    applicationCategory: 'BusinessApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Business & Commerce', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Break-even Calculator', url: 'https://financetoolslab.com/break-even-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the Break-Even Point (BEP)?',
        answer: 'The break-even point is the production or sales level at which total revenues equal total expenses, meaning the business operates at zero profit and zero loss.'
      },
      {
        question: 'What is the formula for Break-Even Units?',
        answer: 'Break-Even Units = Total Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). The denominator is known as the unit Contribution Margin.'
      },
      {
        question: 'What is the Contribution Margin Ratio?',
        answer: 'Contribution Margin Ratio = (Contribution Margin / Selling Price). It represents the percentage of each sales dollar available to cover fixed costs and generate profit.'
      },
      {
        question: 'How can a company lower its break-even point?',
        answer: 'A company can lower its break-even point by reducing fixed overhead costs, decreasing variable production costs, or increasing unit selling prices.'
      }
    ]
  },

  'cash-flow-calculator': {
    slug: 'cash-flow-calculator',
    title: 'Cash Flow Calculator - Operating Cash Flow & Net Balance | FinanceToolsLab',
    description: 'Track and forecast your monthly business or personal cash flows with income inflows, operating expenses, and net cash balances.',
    keywords: [
      'cash flow calculator',
      'operating cash flow calculator',
      'business cash flow forecast',
      'net cash flow calculator',
      'cash flow projection',
      'monthly cash flow statement'
    ],
    canonical: 'https://financetoolslab.com/cash-flow-calculator/',
    category: 'Business & Commerce',
    applicationCategory: 'BusinessApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Business & Commerce', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Cash Flow Calculator', url: 'https://financetoolslab.com/cash-flow-calculator/' }
    ],
    faqs: [
      {
        question: 'What is the difference between Profit and Cash Flow?',
        answer: 'Profit is revenue minus total expenses on an accrual basis, while cash flow measures the actual timing of cash coming into and going out of your accounts.'
      },
      {
        question: 'What is Operating Cash Flow (OCF)?',
        answer: 'Operating cash flow measures the cash generated or consumed by a company’s normal core business operations over a specific timeframe.'
      },
      {
        question: 'Why can profitable businesses still experience cash flow shortages?',
        answer: 'Businesses can run out of cash if receivables take too long to collect, inventory ties up capital, or large upfront capital expenditures drain reserves.'
      },
      {
        question: 'How does cash flow forecasting help small businesses?',
        answer: 'Forecasting cash flow helps business owners anticipate cash deficits in advance, arrange credit lines, and make informed payroll and inventory decisions.'
      }
    ]
  },

  // HEALTH & FITNESS CALCULATORS
  'bmi-calculator': {
    slug: 'bmi-calculator',
    title: 'BMI Calculator - Body Mass Index & Ideal Weight Calculator | FinanceToolsLab',
    description: 'Calculate your Body Mass Index (BMI) using metric or imperial units. See WHO weight categories, health risks, and your healthy target weight range.',
    keywords: [
      'bmi calculator',
      'body mass index calculator',
      'calculate bmi',
      'ideal weight calculator',
      'healthy weight calculator',
      'adult bmi calculator',
      'who bmi chart'
    ],
    canonical: 'https://financetoolslab.com/bmi-calculator/',
    category: 'Health & Fitness',
    applicationCategory: 'HealthApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Health & Fitness', url: 'https://financetoolslab.com/#calculators' },
      { name: 'BMI Calculator', url: 'https://financetoolslab.com/bmi-calculator/' }
    ],
    faqs: [
      {
        question: 'What are the WHO BMI weight classifications?',
        answer: 'Underweight: BMI under 18.5 | Normal Weight: BMI 18.5 – 24.9 | Overweight: BMI 25.0 – 29.9 | Obese: BMI 30.0 and above.'
      },
      {
        question: 'What is the Body Mass Index (BMI) formula?',
        answer: 'Metric: BMI = weight (kg) / [height (m)]^2. Imperial: BMI = 703 * weight (lbs) / [height (inches)]^2.'
      },
      {
        question: 'What are the clinical limitations of BMI?',
        answer: 'BMI does not differentiate between muscle mass, bone density, and body fat. Muscular athletes may have a high BMI while possessing low body fat percentage.'
      },
      {
        question: 'What is considered a healthy waist circumference alongside BMI?',
        answer: 'Health authorities recommend a waist circumference under 40 inches (102 cm) for men and under 35 inches (88 cm) for non-pregnant women to reduce cardiovascular risk.'
      }
    ]
  },

  'calorie-calculator': {
    slug: 'calorie-calculator',
    title: 'Calorie Calculator - Daily Calorie Needs & TDEE Calculator | FinanceToolsLab',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) and BMR. Find exact calorie intake goals for weight loss, maintenance, or muscle gain.',
    keywords: [
      'calorie calculator',
      'daily calorie needs',
      'tdee calculator',
      'bmr calculator',
      'calorie deficit calculator',
      'calories to lose weight',
      'maintenance calories calculator'
    ],
    canonical: 'https://financetoolslab.com/calorie-calculator/',
    category: 'Health & Fitness',
    applicationCategory: 'HealthApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Health & Fitness', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Calorie Calculator', url: 'https://financetoolslab.com/calorie-calculator/' }
    ],
    faqs: [
      {
        question: 'What is Basal Metabolic Rate (BMR)?',
        answer: 'BMR is the baseline number of calories your body burns at rest to sustain vital life functions such as breathing, circulation, and cell production.'
      },
      {
        question: 'What is Total Daily Energy Expenditure (TDEE)?',
        answer: 'TDEE is the total calories burned in a 24-hour day, calculated by multiplying your BMR by an activity factor (sedentary, moderate, active).'
      },
      {
        question: 'What calorie deficit is recommended for sustainable weight loss?',
        answer: 'A moderate deficit of 300 to 500 calories per day typically yields a safe, sustainable fat loss rate of approximately 0.5 to 1 pound (0.25 to 0.5 kg) per week.'
      },
      {
        question: 'What macronutrient breakdown is best for fitness goals?',
        answer: 'Standard balanced guidelines suggest 45%–65% carbohydrates, 20%–35% fats, and 10%–35% protein, adjusting protein higher for resistance training.'
      }
    ]
  },

  'body-fat-calculator': {
    slug: 'body-fat-calculator',
    title: 'Body Fat Calculator - US Navy Body Fat Percentage Calculator | FinanceToolsLab',
    description: 'Estimate your body fat percentage, lean body mass, and fat mass using the validated US Navy anthropometric tape measurement method.',
    keywords: [
      'body fat calculator',
      'calculate body fat percentage',
      'navy body fat calculator',
      'lean body mass calculator',
      'body fat test',
      'body composition calculator'
    ],
    canonical: 'https://financetoolslab.com/body-fat-calculator/',
    category: 'Health & Fitness',
    applicationCategory: 'HealthApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Health & Fitness', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Body Fat Calculator', url: 'https://financetoolslab.com/body-fat-calculator/' }
    ],
    faqs: [
      {
        question: 'How does the US Navy Body Fat formula work?',
        answer: 'The US Navy formula estimates body fat percentage using body circumference measurements (neck and waist for men; neck, waist, and hips for women) combined with height.'
      },
      {
        question: 'What is an essential and healthy body fat range?',
        answer: 'Essential fat: 2–5% (men), 10–13% (women). Athletes: 6–13% (men), 14–20% (women). Fitness/Healthy: 14–24% (men), 21–31% (women).'
      },
      {
        question: 'Why is body fat percentage more informative than scale weight?',
        answer: 'Body fat percentage differentiates between lean muscle mass and adipose tissue, providing a clearer assessment of physical fitness and health risks.'
      },
      {
        question: 'How should circumference measurements be taken for accuracy?',
        answer: 'Measure neck below the larynx, waist at the narrowest point (or navel), and hips at the widest circumference without compressing the soft tissue.'
      }
    ]
  },

  'pregnancy-calculator': {
    slug: 'pregnancy-calculator',
    title: 'Pregnancy Due Date Calculator - Due Date, Weeks & Trimesters | FinanceToolsLab',
    description: 'Calculate your estimated pregnancy due date (EDD), current gestational week, developmental milestones, and trimester timeline using LMP or conception date.',
    keywords: [
      'pregnancy calculator',
      'pregnancy due date calculator',
      'due date calculator',
      'gestational age calculator',
      'pregnancy weeks calculator',
      'pregnancy trimester calculator',
      'pregnancy milestones'
    ],
    canonical: 'https://financetoolslab.com/pregnancy-calculator/',
    category: 'Health & Fitness',
    applicationCategory: 'HealthApplication',
    breadcrumbs: [
      { name: 'Home', url: 'https://financetoolslab.com/' },
      { name: 'Health & Fitness', url: 'https://financetoolslab.com/#calculators' },
      { name: 'Pregnancy Calculator', url: 'https://financetoolslab.com/pregnancy-calculator/' }
    ],
    faqs: [
      {
        question: 'How is Estimated Due Date (EDD) calculated (Naegele’s Rule)?',
        answer: 'Naegele’s Rule calculates EDD by adding 280 days (40 weeks) to the first day of your Last Menstrual Period (LMP), assuming a 28-day cycle.'
      },
      {
        question: 'What are the three pregnancy trimesters?',
        answer: 'First Trimester: Weeks 1 to 12 | Second Trimester: Weeks 13 to 27 | Third Trimester: Week 28 to Delivery (approx. Week 40).'
      },
      {
        question: 'How accurate is a pregnancy due date calculator?',
        answer: 'Only about 4% to 5% of babies are born on their exact due date; most deliveries occur within a window of two weeks before or after the estimated date.'
      },
      {
        question: 'When should you confirm your gestational age with ultrasound?',
        answer: 'A first-trimester dating ultrasound (between weeks 8 and 13) provides the most precise clinical confirmation of gestational age and fetal development.'
      }
    ]
  }
};
