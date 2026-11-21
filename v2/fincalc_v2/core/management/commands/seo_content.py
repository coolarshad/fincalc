"""
Page-level SEO / E-E-A-T content for every calculator, applied by
`python manage.py apply_seo_content`.

Every number in a worked example here was recalculated to match the
formula used by calculators/static/js/calculator-engine.js.
"""

# ---------------------------------------------------------------------------
# Shared source links
# ---------------------------------------------------------------------------
SRC = {
    "cfpb_mortgage": ("Owning a Home: tools and guides", "Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/owning-a-home/"),
    "cfpb_pmi": ("What is private mortgage insurance?", "Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/"),
    "cfpb_dti": ("What is a debt-to-income ratio?", "Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"),
    "cfpb_cards": ("Credit cards: consumer tools", "Consumer Financial Protection Bureau", "https://www.consumerfinance.gov/consumer-tools/credit-cards/"),
    "investor_ci": ("Compound interest calculator and explanation", "Investor.gov (U.S. SEC)", "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"),
    "sebi": ("SEBI investor education portal", "Securities and Exchange Board of India", "https://investor.sebi.gov.in/"),
    "rbi": ("Reserve Bank of India", "RBI", "https://www.rbi.org.in/"),
    "dicgc": ("Deposit insurance coverage", "Deposit Insurance and Credit Guarantee Corporation (India)", "https://www.dicgc.org.in/"),
    "bls_cpi": ("Consumer Price Index (CPI)", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/cpi/"),
    "bls_calc": ("CPI Inflation Calculator", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/data/inflation_calculator.htm"),
    "damodaran": ("Historical returns on stocks, bonds and bills (1928 onward)", "Aswath Damodaran, NYU Stern", "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html"),
    "dol_ot": ("Overtime pay under the FLSA", "U.S. Department of Labor", "https://www.dol.gov/agencies/whd/overtime"),
    "ecb_fx": ("Euro foreign exchange reference rates", "European Central Bank", "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"),
    "who_bmi": ("Body mass index (BMI)", "World Health Organization", "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index"),
    "cdc_bmi": ("Adult BMI categories", "U.S. Centers for Disease Control and Prevention", "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html"),
    "mifflin": ("Mifflin MD, St Jeor ST et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/2305711/"),
    "navy": ("Hodgdon JA, Beckett MB. Prediction of percent body fat for U.S. Navy men and women from body circumferences and height (Reports 84-11 and 84-29)", "Naval Health Research Center via DTIC", "https://apps.dtic.mil/sti/"),
    "acog": ("Methods for Estimating the Due Date (Committee Opinion No. 700)", "American College of Obstetricians and Gynecologists", "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date"),
    "cbic_gst": ("GST rates for goods and services", "Central Board of Indirect Taxes and Customs (India)", "https://cbic-gst.gov.in/gst-goods-services-rates.html"),
    "gst_portal": ("GST portal", "Goods and Services Tax Network (India)", "https://www.gst.gov.in/"),
    "sba_fin": ("Manage your finances", "U.S. Small Business Administration", "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances"),
}


def sources(*keys):
    return [{"title": SRC[k][0], "publisher": SRC[k][1], "url": SRC[k][2]} for k in keys]


# ---------------------------------------------------------------------------
# Site-level pages
# ---------------------------------------------------------------------------
HOME = {
    "seo_title": "Free Finance, Health & Business Calculators | FinanceToolsLab",
    "search_description": "Free loan, mortgage, SIP, investment, BMI, calorie and GST calculators. Every tool shows its formula and a worked example, and runs privately in your browser.",
}

CATEGORIES = {
    "finance": {
        "seo_title": "Finance Calculators: Loan, Mortgage, SIP & More | FinanceToolsLab",
        "search_description": "13 free personal finance calculators: loan EMI, mortgage, SIP, FD, investment, CAGR, inflation, credit card payoff and more, each with formula and worked example.",
    },
    "health": {
        "seo_title": "Health Calculators: BMI, Calories, Body Fat & Due Date",
        "search_description": "Free BMI, calorie (TDEE), body fat and pregnancy due date calculators based on WHO categories, the Mifflin-St Jeor equation, the US Navy method and Naegele's rule.",
    },
    "business": {
        "seo_title": "Business Calculators: Margin, GST, Break-Even & Cash Flow",
        "search_description": "Free business calculators for profit margin and markup, India GST, break-even units and monthly cash flow, with the formula and a worked example on every page.",
    },
}

# ---------------------------------------------------------------------------
# Calculator pages (keyed by slug)
# ---------------------------------------------------------------------------
FIN_REVIEW = "The formula, variable definitions and worked example on this page were recalculated by hand and checked against the calculator output."
HEALTH_REVIEW = "This tool applies the published method cited in the sources below. It gives a population-level estimate, not a clinical assessment."
BIZ_REVIEW = FIN_REVIEW

CALCULATORS = {
    # ------------------------------------------------------------------ LOAN
    "loan-calculator": {
        "seo_title": "Loan Calculator: Monthly EMI, Interest & Amortization",
        "search_description": "Calculate your monthly loan payment (EMI), total interest and full amortization schedule for personal and auto loans. Free, private and shows every step.",
        "summary": "Calculate monthly loan payments, total interest and a full amortization schedule for personal and auto loans.",
        "intro_question": "What is a loan calculator?",
        "intro_answer": "<p>A loan calculator works out the fixed monthly payment (EMI) needed to repay a loan of a given amount, interest rate and term. It uses the standard amortization formula, so you can see the payment, the total interest over the life of the loan and how each payment splits between principal and interest.</p>",
        "formula": {
            "explanation": "<p>Each monthly payment is the same. Early payments are mostly interest because interest is charged on a large outstanding balance; as the balance falls, more of each payment goes to principal. The formula solves for the single payment that brings the balance to exactly zero after <em>n</em> months.</p>",
            "notes": "Assumes a fixed rate, monthly payments and no fees. Origination fees and insurance are not included.",
        },
        "example_patch": {
            "result_highlight": "Monthly EMI: $586.98 | Total Interest: $5,218.80 | Total Repayment: $35,218.80",
            "key_observation": "A 4-year term on the same loan raises the payment to $711.45 but cuts total interest to about $4,150, a saving of roughly $1,070.",
        },
        "table": {
            "title": "How the Loan Term Changes Cost ($30,000 at 6.5%)",
            "intro": "Shorter terms mean higher payments but much less interest.",
            "headers": ["Term", "Monthly Payment", "Total Interest", "Total Repaid"],
            "rows": [
                ["3 years", "$919.47", "$3,100.92", "$33,100.92"],
                ["4 years", "$711.45", "$4,149.60", "$34,149.60"],
                ["5 years", "$586.98", "$5,218.80", "$35,218.80"],
                ["7 years", "$445.48", "$7,420.32", "$37,420.32"],
            ],
            "takeaway": "Pick the shortest term whose payment you can comfortably afford every month.",
        },
        "faqs": [
            {"q": "How is a loan EMI calculated?", "a": "<p>EMI = P × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1), where P is the amount borrowed, r is the annual rate divided by 12 and by 100, and n is the number of monthly payments. For $30,000 at 6.5% over 60 months, r = 0.0054167 and the EMI is $586.98.</p>"},
            {"q": "Does this calculator work for student loans?", "a": "<p>It works for any fixed-rate loan with equal monthly payments, including many private student loans. It does not model income-driven repayment plans, deferment or interest that capitalises while you study, so check those terms with your servicer.</p>"},
            {"q": "Why do I pay more interest at the start of a loan?", "a": "<p>Interest each month is the monthly rate times the balance still owed. The balance is highest at the start, so the interest share is highest too. On the $30,000 example, the first payment includes about $162.50 of interest and $424.48 of principal.</p>"},
        ],
        "sources": sources("cfpb_mortgage", "investor_ci"),
        "review": FIN_REVIEW,
    },
    # -------------------------------------------------------------- MORTGAGE
    "mortgage-calculator": {
        "seo_title": "Mortgage Calculator with Taxes, Insurance, PMI & HOA",
        "search_description": "Estimate your full monthly mortgage payment including principal, interest, property tax, home insurance and HOA dues. See how down payment and rate change the cost.",
        "intro_question": "What is a mortgage calculator?",
        "intro_answer": "<p>A mortgage calculator estimates your total monthly housing payment. It adds the principal and interest on the loan to one-twelfth of your annual property tax and homeowner's insurance, plus any HOA dues. Lenders call this full figure PITI, and it is the number they compare with your income.</p>",
        "formula": {
            "explanation": "<p>The principal-and-interest part uses the standard amortization formula on the loan amount (home price minus down payment). Property tax and insurance are usually collected monthly into an escrow account, so they are divided by 12 and added on top. HOA dues are added as charged.</p>",
            "notes": "Assumes a fixed-rate loan. PMI, if your down payment is under 20%, is not included in the example below.",
        },
        "example_patch": {
            "steps": [
                {"step_number": 1, "step_title": "Calculate Loan Principal", "step_math": "$400,000 - $80,000 = $320,000", "description": "Determine the net financed amount."},
                {"step_number": 2, "step_title": "Compute Principal & Interest", "step_math": "$320,000 @ 6.75% over 360 months = $2,075.51/mo", "description": "Base mortgage repayment from the amortization formula."},
                {"step_number": 3, "step_title": "Add Escrow (Tax + Insurance)", "step_math": "($4,800 / 12) + ($1,200 / 12) = $500.00/mo", "description": "Monthly escrow allocation for taxes and homeowner insurance."},
            ],
            "result_highlight": "Total Monthly Mortgage Payment: $2,575.51",
            "key_observation": "With 20% down there is no PMI. On a conventional loan with less than 20% down, PMI typically adds roughly 0.3% to 1.5% of the loan amount per year.",
        },
        "faqs": [
            {"q": "How is a mortgage payment calculated?", "a": "<p>Principal and interest = P × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1), with r as the monthly rate and n as the number of months. Then add annual property tax ÷ 12, annual insurance ÷ 12 and any monthly HOA fee.</p>"},
            {"q": "How much house can I afford?", "a": "<p>A common guide is to keep total housing costs below about 28% of gross monthly income and all debt payments below about 36%. On an $8,000 monthly income that is about $2,240 for housing. Lenders may approve more, so treat these as starting points.</p>"},
            {"q": "Is a 15-year or 30-year mortgage better?", "a": "<p>A 15-year loan has a higher payment but usually a lower rate and far less total interest. A 30-year loan has a lower payment that leaves more room in your budget. Compare both in the calculator using the rates you are actually quoted.</p>"},
        ],
        "sources": sources("cfpb_mortgage", "cfpb_pmi", "cfpb_dti"),
        "review": FIN_REVIEW,
    },
    # ---------------------------------------------------------------- SALARY
    "salary-calculator": {
        "seo_title": "Salary Calculator: Hourly to Annual, Monthly & Weekly Pay",
        "search_description": "Convert an hourly wage to annual, monthly, bi-weekly and weekly gross pay, or work back from salary to hourly. Includes an overtime example and a pay frequency table.",
        "intro_question": "How do you convert an hourly wage to an annual salary?",
        "intro_answer": "<p>Multiply your hourly rate by the hours you work each week, then by 52 weeks. At $35 an hour and 40 hours a week that is $72,800 a year before tax. Divide by 12 for monthly pay or by 26 for bi-weekly pay. The result is gross pay; take-home pay depends on your taxes and deductions.</p>",
        "formula": {
            "explanation": "<p>A full-time year is usually 52 weeks of 40 hours, or 2,080 hours. Annual pay divided by 12 gives a monthly figure, by 26 gives bi-weekly and by 52 gives weekly. Paid holidays and unpaid leave change the real number of hours worked.</p>",
            "notes": "Gross pay only. The take-home split shown in the results tab is illustrative and assumes a flat 25% deduction.",
        },
        "example_patch": {
            "key_observation": "Five hours of overtime a week at 1.5× ($52.50/hour) adds $262.50 a week, or exactly $13,650 a year.",
        },
        "faqs": [
            {"q": "How much is $20 an hour annually?", "a": "<p>$20 × 40 hours × 52 weeks = $41,600 a year before tax, or about $3,467 a month.</p>"},
            {"q": "How is overtime pay calculated?", "a": "<p>In the US, non-exempt employees must be paid at least 1.5 times their regular rate for hours over 40 in a workweek under the Fair Labor Standards Act. At $35 an hour, overtime is $52.50 an hour.</p>"},
            {"q": "Why is my take-home pay lower than this result?", "a": "<p>This calculator shows gross pay. Income tax, social security or provident fund contributions, health insurance and retirement deductions are taken out before you are paid, and they vary by country, state and personal situation.</p>"},
        ],
        "sources": sources("dol_ot"),
        "review": FIN_REVIEW,
    },
    # -------------------------------------------------------------- INTEREST
    "interest-calculator": {
        "seo_title": "Compound Interest Calculator: Daily, Monthly & Yearly",
        "search_description": "Calculate compound interest on savings or deposits with monthly, quarterly or yearly compounding. Includes the formula, a worked example and simple interest comparison.",
        "summary": "Calculate compound interest on savings and deposits over any period, with monthly, quarterly or annual compounding.",
        "intro_question": "What is compound interest?",
        "intro_answer": "<p>Compound interest is interest earned on both your original deposit and on interest already added to the account. Because the balance grows each period, the interest grows too. $10,000 at 6% compounded monthly becomes $13,488.50 after 5 years, compared with $13,000 under simple interest.</p>",
        "formula": {
            "explanation": "<p>The rate per period is r ÷ n and the number of periods is n × t. The more often interest compounds, the higher the ending balance, although the gain from moving monthly to daily compounding is small.</p>",
            "notes": "Assumes a constant rate and no further deposits or withdrawals.",
        },
        "table": {
            "title": "Simple vs Compound Interest ($10,000 at 6% for 5 years)",
            "headers": ["Method", "Ending Balance", "Interest Earned"],
            "rows": [
                ["Simple interest", "$13,000.00", "$3,000.00"],
                ["Compounded annually", "$13,382.26", "$3,382.26"],
                ["Compounded quarterly", "$13,468.55", "$3,468.55"],
                ["Compounded monthly", "$13,488.50", "$3,488.50"],
            ],
        },
        "faqs": [
            {"q": "How do I calculate simple interest?", "a": "<p>Simple interest = P × r × t. For $10,000 at 6% for 5 years: 10,000 × 0.06 × 5 = $3,000. Simple interest never earns interest on interest, so it is always lower than compound interest at the same rate.</p>"},
            {"q": "What does compounding frequency mean?", "a": "<p>It is how often earned interest is added to the balance: yearly (n = 1), quarterly (n = 4), monthly (n = 12) or daily (n = 365). More frequent compounding gives a slightly higher effective annual yield.</p>"},
            {"q": "What is the difference between APR and APY?", "a": "<p>APR is the stated annual rate without compounding. APY includes the effect of compounding. A 6% APR compounded monthly equals an APY of about 6.17%.</p>"},
        ],
        "sources": sources("investor_ci"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------ INVESTMENT
    "investment-calculator": {
        "seo_title": "Investment Calculator: Future Value with Monthly Contributions",
        "search_description": "Project the future value of a lump sum plus monthly contributions at an expected return, and see the inflation-adjusted real value. Formula and worked example included.",
        "intro_question": "How does an investment calculator work?",
        "intro_answer": "<p>An investment calculator projects how a starting amount and regular monthly contributions could grow at an assumed annual return. It compounds the balance monthly, adds each contribution and shows how much of the final value comes from your deposits versus growth. Real returns vary year to year, so treat the result as an estimate.</p>",
        "formula": {
            "expression": "FV = P × (1 + r/12)^(12t) + PMT × [ ((1 + r/12)^(12t) − 1) / (r/12) ]",
            "explanation": "<p>The first term grows your starting balance P for 12t months at the monthly rate r/12. The second term is the future value of a monthly contribution PMT made at the end of each month. Here t is the number of years and r the expected annual return as a decimal.</p>",
            "notes": "Interest is compounded monthly and contributions are made at the end of each month, matching the calculator above.",
            "extra_vars": [{"symbol": "t", "name": "Years Invested", "description": "Number of years the money stays invested"}],
        },
        "example_patch": {
            "scenario_description": "Starting with $10,000 and contributing $500 at the end of each month for 20 years at an 8% expected annual return, compounded monthly.",
            "steps": [
                {"step_number": 1, "step_title": "Grow the Initial Lump Sum", "step_math": "$10,000 × (1 + 0.08/12)^240 = $49,268.03", "description": "Monthly compounding of the starting balance."},
                {"step_number": 2, "step_title": "Grow the Monthly Contributions", "step_math": "$500 × [((1.006667)^240 − 1) / 0.006667] = $294,510.21", "description": "Future value of 240 monthly deposits."},
                {"step_number": 3, "step_title": "Add Both Parts", "step_math": "$49,268.03 + $294,510.21 = $343,778.24", "description": "Projected portfolio value."},
            ],
            "result_highlight": "Total Portfolio: $343,778.24 | Total Invested: $130,000.00 | Total Growth: $213,778.24",
            "key_observation": "About 62% of the ending balance comes from investment growth rather than your own deposits.",
        },
        "faqs": [
            {"q": "What return should I assume?", "a": "<p>US large-company stocks returned roughly 10% a year on average in nominal terms over long periods (see the NYU Stern data in the sources), with large swings between years. Many planners use a lower figure such as 6% to 8% to stay conservative.</p>"},
            {"q": "What is the difference between nominal and real value?", "a": "<p>Nominal value is the number of dollars in your account. Real value adjusts for inflation to show what those dollars would buy in today's prices. The calculator shows both when you enter an inflation rate.</p>"},
            {"q": "Does this include taxes and fees?", "a": "<p>No. Fund expense ratios, advisory fees and taxes on gains reduce real-world returns. Lower the expected return to approximate their effect.</p>"},
        ],
        "sources": sources("investor_ci", "damodaran", "bls_cpi"),
        "review": FIN_REVIEW,
    },
    # ----------------------------------------------------------- CREDIT CARD
    "credit-card-calculator": {
        "seo_title": "Credit Card Payoff Calculator: Months & Interest to Debt-Free",
        "search_description": "See how many months it takes to pay off a credit card balance and the total interest you will pay at a fixed monthly payment. Compare payment amounts side by side.",
        "intro_question": "How long will it take to pay off my credit card?",
        "intro_answer": "<p>It depends on your balance, APR and monthly payment. Each month interest is added at APR ÷ 12 and your payment is subtracted. A $5,000 balance at 21.99% APR takes 52 months to clear at $150 a month and costs about $2,796 in interest. Paying $200 a month cuts that to 34 months.</p>",
        "formula": {
            "explanation": "<p>The formula gives the number of months N needed for a fixed payment PMT to clear balance B at monthly rate r. If the payment is not larger than the first month's interest (B × r), the balance never falls.</p>",
            "notes": "Assumes no new purchases, no fees and a constant APR.",
        },
        "example_patch": {
            "steps": [
                {"step_number": 1, "step_title": "Monthly Interest Rate", "step_math": "21.99% / 12 = 1.8325% per month", "description": "First month's interest on $5,000 is $91.63."},
                {"step_number": 2, "step_title": "Payoff Timeline", "step_math": "N = −ln(1 − (5,000 × 0.018325) / 150) / ln(1.018325) ≈ 51.2 → 52 months", "description": "The final, 52nd payment is smaller than $150."},
                {"step_number": 3, "step_title": "Total Interest Paid", "step_math": "≈ $2,795.69", "description": "Cost of carrying the balance."},
            ],
            "result_highlight": "Payoff Time: 52 Months | Total Interest: about $2,796 | Total Paid: about $7,796",
            "key_observation": "Raising the payment by $50 to $200 a month clears the card in 34 months and saves about $1,047 in interest.",
        },
        "table": {
            "title": "Payment Amount vs Payoff Time ($5,000 at 21.99% APR)",
            "headers": ["Monthly Payment", "Months to Pay Off", "Total Interest"],
            "rows": [
                ["$150", "52", "$2,795.69"],
                ["$200", "34", "$1,748.69"],
                ["$300", "21", "$1,021.00"],
            ],
        },
        "faqs": [
            {"q": "Why is paying only the minimum so expensive?", "a": "<p>Minimum payments are often around 1% to 3% of the balance plus interest, so most of each payment covers interest. Repayment can stretch over many years and cost far more than the original balance.</p>"},
            {"q": "Should I use the avalanche or snowball method?", "a": "<p>The avalanche method pays extra toward the highest-APR card first and saves the most interest. The snowball method clears the smallest balance first for quicker wins. Both work if you keep paying more than the minimum.</p>"},
            {"q": "Does a balance transfer help?", "a": "<p>A 0% balance transfer can cut interest, but transfer fees of 3% to 5% are common and the rate rises when the promotion ends. Run both scenarios here before you switch.</p>"},
        ],
        "sources": sources("cfpb_cards"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------------- BMI
    "bmi-calculator": {
        "seo_title": "BMI Calculator: Body Mass Index with WHO Categories",
        "search_description": "Calculate your adult BMI from height and weight and see your WHO weight category and healthy weight range. Includes the formula, BMI table and limitations of BMI.",
        "intro_question": "What is BMI?",
        "intro_answer": "<p>Body mass index (BMI) is your weight in kilograms divided by your height in metres squared. The World Health Organization uses it to screen adults for underweight (below 18.5), healthy weight (18.5 to 24.9), overweight (25 to 29.9) and obesity (30 or more). It does not measure body fat directly.</p>",
        "formula": {
            "explanation": "<p>BMI scales weight by height so people of different heights can be compared. In imperial units, BMI = 703 × weight (lb) ÷ height (in)². The same adult categories apply to men and women aged 20 and over.</p>",
            "notes": "Adult categories only. Children and teens use age- and sex-specific BMI percentiles.",
        },
        "table": {
            "title": "WHO Adult BMI Categories",
            "headers": ["BMI", "Category"],
            "rows": [
                ["Below 18.5", "Underweight"],
                ["18.5 – 24.9", "Healthy weight"],
                ["25.0 – 29.9", "Overweight (pre-obesity)"],
                ["30.0 – 34.9", "Obesity class I"],
                ["35.0 – 39.9", "Obesity class II"],
                ["40.0 and above", "Obesity class III"],
            ],
            "takeaway": "Some populations, including many Asian groups, may have higher health risk at lower BMI values.",
        },
        "faqs": [
            {"q": "Is BMI accurate for athletes?", "a": "<p>Not always. BMI cannot tell muscle from fat, so muscular people can be classed as overweight while having low body fat. A waist measurement or the body fat calculator can add context.</p>"},
            {"q": "What is a healthy weight for my height?", "a": "<p>Multiply your height in metres squared by 18.5 and by 24.9. For 1.75 m: 3.0625 × 18.5 = 56.7 kg and 3.0625 × 24.9 = 76.3 kg.</p>"},
            {"q": "Can I use this BMI calculator for children?", "a": "<p>No. For ages 2 to 19, BMI must be compared with growth charts for the child's age and sex. Use a paediatric BMI-for-age tool or ask a doctor.</p>"},
        ],
        "sources": sources("who_bmi", "cdc_bmi"),
        "review": HEALTH_REVIEW,
    },
    # --------------------------------------------------------------- CALORIE
    "calorie-calculator": {
        "seo_title": "Calorie Calculator: TDEE & BMR (Mifflin-St Jeor)",
        "search_description": "Estimate your BMR and total daily calories (TDEE) using the Mifflin-St Jeor equation for men and women, with activity multipliers and weight loss targets.",
        "intro_question": "How many calories do I need a day?",
        "intro_answer": "<p>Your daily calorie need is your basal metabolic rate (BMR) multiplied by an activity factor. This calculator estimates BMR with the Mifflin-St Jeor equation, then multiplies by 1.2 for sedentary up to 1.9 for very active. The result, called TDEE, is the intake that roughly maintains your current weight.</p>",
        "formula": {
            "expression": "BMR (men) = 10W + 6.25H − 5A + 5 | BMR (women) = 10W + 6.25H − 5A − 161 | TDEE = BMR × Activity Factor",
            "explanation": "<p>W is weight in kg, H is height in cm and A is age in years. The Mifflin-St Jeor equation was published in 1990 and is widely used by dietitians to estimate resting energy needs in healthy adults.</p>",
            "notes": "An estimate for healthy adults. Pregnancy, breastfeeding, medical conditions and some medicines change energy needs.",
        },
        "table": {
            "title": "Activity Multipliers",
            "headers": ["Activity Level", "Description", "Multiplier"],
            "rows": [
                ["Sedentary", "Little or no exercise", "1.2"],
                ["Lightly active", "Exercise 1–3 days/week", "1.375"],
                ["Moderately active", "Exercise 3–5 days/week", "1.55"],
                ["Very active", "Hard exercise 6–7 days/week", "1.725"],
                ["Extra active", "Physical job plus training", "1.9"],
            ],
        },
        "faqs": [
            {"q": "What is the calorie formula for women?", "a": "<p>BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age − 161. A 30-year-old woman who is 165 cm and 62 kg has a BMR of about 1,340 kcal, or about 2,077 kcal a day when moderately active (× 1.55).</p>"},
            {"q": "How many calories should I eat to lose weight?", "a": "<p>A deficit of about 500 kcal a day below your TDEE is a common starting point and is often linked to roughly 0.5 kg (1 lb) of loss a week, though real results vary. Very low intakes should only be followed with medical supervision.</p>"},
            {"q": "What is the difference between BMR and TDEE?", "a": "<p>BMR is the energy your body uses at complete rest. TDEE adds the energy used by daily movement, exercise and digestion, so it is always higher.</p>"},
        ],
        "sources": sources("mifflin"),
        "review": HEALTH_REVIEW,
    },
    # -------------------------------------------------------------- BODY FAT
    "body-fat-calculator": {
        "seo_title": "Body Fat Calculator: US Navy Method for Men & Women",
        "search_description": "Estimate body fat percentage, fat mass and lean mass from height, neck, waist and hip measurements using the US Navy circumference method for men and women.",
        "intro_question": "How do you calculate body fat percentage?",
        "intro_answer": "<p>The US Navy method estimates body fat from tape measurements. Men use height, neck and waist; women also add hip circumference. The values go into a logarithmic equation developed by Hodgdon and Beckett in 1984. It is quick and free, but typically differs from lab methods such as DEXA by a few percentage points.</p>",
        "formula": {
            "expression": "Men: %BF = 495 / (1.0324 − 0.19077 × log10(waist − neck) + 0.15456 × log10(height)) − 450 | Women: %BF = 495 / (1.29579 − 0.35004 × log10(waist + hip − neck) + 0.22100 × log10(height)) − 450",
            "explanation": "<p>All measurements are in centimetres. Waist is measured at the navel for men and at the narrowest point for women; hip is measured at the widest point. Fat mass = weight × %BF; lean mass = weight − fat mass.</p>",
            "notes": "Measure on bare skin, relaxed, and take the average of three readings for each site.",
        },
        "example_patch": {
            "steps": [
                {"step_number": 1, "step_title": "Waist minus Neck", "step_math": "84 cm − 38 cm = 46 cm", "description": "log10(46) = 1.6628; log10(180) = 2.2553."},
                {"step_number": 2, "step_title": "Denominator", "step_math": "1.0324 − 0.19077 × 1.6628 + 0.15456 × 2.2553 = 1.0638", "description": "Body density term."},
                {"step_number": 3, "step_title": "Body Fat Percentage", "step_math": "495 / 1.0638 − 450 = 15.3%", "description": "Estimated percent body fat."},
            ],
            "result_highlight": "Body Fat: 15.3% | Fat Mass: 12.3 kg | Lean Mass: 67.7 kg",
            "key_observation": "15.3% falls in the commonly cited 14–17% 'fitness' range for men.",
        },
        "table": {
            "title": "Body Fat Ranges (American Council on Exercise)",
            "headers": ["Category", "Men", "Women"],
            "rows": [
                ["Essential fat", "2–5%", "10–13%"],
                ["Athletes", "6–13%", "14–20%"],
                ["Fitness", "14–17%", "21–24%"],
                ["Average", "18–24%", "25–31%"],
                ["Obese", "25% and above", "32% and above"],
            ],
        },
        "faqs": [
            {"q": "How accurate is the US Navy body fat method?", "a": "<p>Studies generally find it within about 3 to 4 percentage points of reference methods for most people, with larger errors at very low or very high body fat. Consistent measuring technique matters more than the formula.</p>"},
            {"q": "Where should women measure waist and hips?", "a": "<p>Measure the waist at its narrowest point, usually just above the navel, and the hips at the widest point of the buttocks, keeping the tape level.</p>"},
            {"q": "Is body fat percentage better than BMI?", "a": "<p>Body fat percentage separates fat from muscle, which BMI cannot. BMI is still useful as a quick screen. Using both gives a fuller picture.</p>"},
        ],
        "sources": sources("navy"),
        "review": HEALTH_REVIEW,
    },
    # ------------------------------------------------------------- PREGNANCY
    "pregnancy-calculator": {
        "seo_title": "Pregnancy Due Date Calculator: Naegele's Rule & Weeks",
        "search_description": "Estimate your due date from the first day of your last period using Naegele's rule, and see your current week of pregnancy, trimester and key milestones.",
        "intro_question": "How is a due date calculated?",
        "intro_answer": "<p>The standard method, Naegele's rule, adds 280 days (40 weeks) to the first day of your last menstrual period. That is the same as adding one year, subtracting three months and adding seven days. It assumes a 28-day cycle. An early ultrasound is more accurate, and doctors may update your date after one.</p>",
        "formula": {
            "explanation": "<p>Pregnancy is dated from the first day of the last period, about two weeks before conception, so a full-term pregnancy is counted as 40 weeks. Cycles longer or shorter than 28 days shift ovulation and therefore the due date.</p>",
            "notes": "An estimate only. Your care provider's dating, especially from a first-trimester ultrasound, takes priority.",
        },
        "table": {
            "title": "Pregnancy Trimesters",
            "headers": ["Trimester", "Weeks"],
            "rows": [
                ["First", "Weeks 1 – 13"],
                ["Second", "Weeks 14 – 27"],
                ["Third", "Weeks 28 – 40+"],
            ],
            "takeaway": "Full term is 39 weeks 0 days to 40 weeks 6 days.",
        },
        "faqs": [
            {"q": "How accurate is a due date?", "a": "<p>It is an estimate. Only about 4% to 5% of babies are born on their due date, and most arrive within two weeks either side. That uncertainty is why no calculator can promise an exact date.</p>"},
            {"q": "What if my cycle is not 28 days?", "a": "<p>Add the extra days to the estimate for a longer cycle, or subtract them for a shorter one. For example, a 32-day cycle moves the estimate about 4 days later.</p>"},
            {"q": "Is ultrasound dating more accurate?", "a": "<p>Yes. ACOG advises that a first-trimester ultrasound measurement is the most accurate way to confirm or set the due date.</p>"},
        ],
        "sources": sources("acog"),
        "review": HEALTH_REVIEW,
    },
    # -------------------------------------------------------------- CURRENCY
    "currency-calculator": {
        "seo_title": "Currency Converter with Transfer Fee Calculator",
        "search_description": "Convert an amount between currencies at the exchange rate you are quoted, and see how bank fees and spreads reduce the amount received. Includes the formula and example.",
        "summary": "Convert between currencies at the exchange rate your bank or provider quotes, and see how transfer fees reduce what you receive.",
        "intro_question": "How do you calculate a currency conversion?",
        "intro_answer": "<p>Multiply the amount you send by the exchange rate, after taking off any percentage fee. Sending $1,000 at 0.92 EUR per USD with a 0.5% fee converts $995 and delivers €915.40. Enter the rate your provider actually quotes; the sample rates in the table are illustrative, not live market rates.</p>",
        "formula": {
            "expression": "Amount Received = (Amount Sent − Fee) × Exchange Rate",
            "explanation": "<p>Banks often add a spread to the mid-market rate as well as charging a stated fee. Compare the rate you are offered with a reference rate such as the ECB's daily euro rates to see the hidden cost.</p>",
            "notes": "Rates are entered by you. This tool does not fetch live exchange rates.",
        },
        "example_patch": {
            "scenario_description": "Converting $1,000 USD to EUR at a quoted rate of 0.92 with a 0.5% transfer fee.",
            "steps": [
                {"step_number": 1, "step_title": "Subtract the Fee", "step_math": "$1,000 × 0.5% = $5.00; $1,000 − $5 = $995", "description": "Amount actually converted."},
                {"step_number": 2, "step_title": "Apply the Exchange Rate", "step_math": "$995 × 0.92 = €915.40", "description": "Amount received."},
            ],
            "result_highlight": "1,000 USD → €915.40 after a 0.5% fee",
        },
        "faqs": [
            {"q": "Are these exchange rates live?", "a": "<p>No. You enter the rate you are quoted, and the cross-rate table uses fixed sample rates for illustration. Check a current reference rate before you transfer money.</p>"},
            {"q": "What is the mid-market rate?", "a": "<p>It is the midpoint between the buy and sell prices of two currencies. Many banks quote a worse rate and keep the difference as a hidden fee, known as the spread.</p>"},
            {"q": "How do I find the true cost of a transfer?", "a": "<p>Compare the amount received with what you would get at the mid-market rate with no fee. The difference, as a percentage of the amount sent, is your total cost.</p>"},
        ],
        "sources": sources("ecb_fx"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------- INFLATION
    "inflation-calculator": {
        "seo_title": "Inflation Calculator: Future Cost & Purchasing Power",
        "search_description": "See how inflation raises future costs and erodes the purchasing power of money over time. Enter an amount, rate and years; includes formula, example and Rule of 72.",
        "intro_question": "How does inflation affect the value of money?",
        "intro_answer": "<p>Inflation is the rise in prices over time, so each unit of money buys less. To keep the same lifestyle, the money you need grows by (1 + inflation rate) every year. At 3% inflation, $50,000 of spending today would cost about $90,306 in 20 years, and today's dollar would buy about 55 cents' worth.</p>",
        "formula": {
            "explanation": "<p>Future cost = today's cost × (1 + i)<sup>t</sup>. Purchasing power of today's money in t years = amount ÷ (1 + i)<sup>t</sup>. Use an official CPI series, such as the BLS CPI in the US, to choose a realistic rate.</p>",
            "notes": "Assumes a constant inflation rate. Actual CPI inflation varies from year to year.",
        },
        "faqs": [
            {"q": "What is the Rule of 72?", "a": "<p>Divide 72 by the annual inflation rate to estimate how many years it takes for prices to double, or for money's purchasing power to halve. At 3%, that is about 24 years.</p>"},
            {"q": "What inflation rate should I use?", "a": "<p>Many central banks target about 2% a year. Long-run US CPI inflation has averaged a little above 3%. For planning, test a range such as 2% to 4%.</p>"},
            {"q": "How do I adjust past prices for inflation?", "a": "<p>Divide the CPI for the later year by the CPI for the earlier year and multiply by the old price. The BLS CPI Inflation Calculator does this with official US data.</p>"},
        ],
        "sources": sources("bls_cpi", "bls_calc"),
        "review": FIN_REVIEW,
    },
    # ---------------------------------------------------------------- MARGIN
    "margin-calculator": {
        "seo_title": "Profit Margin Calculator: Gross Margin & Markup",
        "search_description": "Calculate gross profit, profit margin and markup from cost and selling price, or find the price needed for a target margin. Includes formula, example and margin table.",
        "summary": "Calculate gross profit, profit margin and markup from cost and selling price, or find the price that hits a target margin.",
        "intro_question": "How do you calculate profit margin?",
        "intro_answer": "<p>Profit margin is profit as a percentage of the selling price: (price − cost) ÷ price × 100. Markup is profit as a percentage of cost: (price − cost) ÷ cost × 100. An item that costs $60 and sells for $100 has a $40 gross profit, a 40% margin and a 66.7% markup.</p>",
        "formula": {
            "explanation": "<p>To find the price for a target margin, divide cost by (1 − margin). For a 40% margin on a $60 cost: 60 ÷ 0.6 = $100. Margin can never reach 100%, but markup has no upper limit.</p>",
            "notes": "Gross margin only. It excludes overheads such as rent, salaries and marketing.",
        },
        "table": {
            "title": "Margin vs Markup Conversion",
            "headers": ["Gross Margin", "Equivalent Markup"],
            "rows": [["20%", "25%"], ["25%", "33.3%"], ["33.3%", "50%"], ["40%", "66.7%"], ["50%", "100%"]],
        },
        "faqs": [
            {"q": "What is the difference between margin and markup?", "a": "<p>Margin divides profit by the selling price; markup divides profit by the cost. The same $40 profit on a $60 item is a 40% margin but a 66.7% markup.</p>"},
            {"q": "What is a good profit margin?", "a": "<p>It depends on the industry. Grocery retail often runs on low single-digit net margins, while software can exceed 70% gross margin. Compare yourself with businesses in your own sector.</p>"},
            {"q": "How do I convert markup to margin?", "a": "<p>Margin = markup ÷ (1 + markup). A 50% markup gives 0.5 ÷ 1.5 = 33.3% margin.</p>"},
        ],
        "sources": sources("sba_fin"),
        "review": BIZ_REVIEW,
    },
    # ------------------------------------------------------------ BREAK-EVEN
    "break-even-calculator": {
        "seo_title": "Break-Even Calculator: Units & Revenue to Cover Costs",
        "search_description": "Find the number of units and the sales revenue needed to cover fixed and variable costs. Includes the contribution margin formula, a worked example and a sensitivity table.",
        "intro_question": "What is a break-even point?",
        "intro_answer": "<p>The break-even point is the sales level at which revenue exactly covers all costs, so profit is zero. Divide fixed costs by the contribution margin per unit (price minus variable cost). With $15,000 of monthly fixed costs, a $50 price and $20 variable cost, you break even at 500 units, or $25,000 of sales.</p>",
        "formula": {
            "explanation": "<p>Each unit sold contributes (price − variable cost) toward fixed costs. Once enough units are sold to cover fixed costs, every extra unit adds its full contribution margin to profit. Break-even revenue = break-even units × price, or fixed costs ÷ contribution margin ratio.</p>",
            "notes": "Assumes a constant price and variable cost per unit across the volume range.",
        },
        "table": {
            "title": "Profit at Different Sales Volumes",
            "headers": ["Units Sold", "Revenue", "Total Costs", "Profit"],
            "rows": [
                ["300", "$15,000", "$21,000", "−$6,000"],
                ["500", "$25,000", "$25,000", "$0"],
                ["700", "$35,000", "$29,000", "$6,000"],
                ["1,000", "$50,000", "$35,000", "$15,000"],
            ],
        },
        "faqs": [
            {"q": "What is the contribution margin ratio?", "a": "<p>It is (price − variable cost) ÷ price. In the example, $30 ÷ $50 = 60%, so 60 cents of every sales dollar goes toward fixed costs and profit.</p>"},
            {"q": "How can I lower my break-even point?", "a": "<p>Raise prices, cut variable cost per unit or reduce fixed costs. Small changes to contribution margin often have a large effect on the break-even volume.</p>"},
            {"q": "What counts as a fixed cost?", "a": "<p>Costs that do not change with sales volume in the short term, such as rent, salaried staff, insurance and software subscriptions.</p>"},
        ],
        "sources": sources("sba_fin"),
        "review": BIZ_REVIEW,
    },
    # ------------------------------------------------------------- CASH FLOW
    "cash-flow-calculator": {
        "seo_title": "Cash Flow Calculator: Monthly Net Cash for Businesses",
        "search_description": "Calculate monthly net cash flow from cash receipts, operating expenses and debt payments, and project your cash reserve. Includes the formula and a worked example.",
        "intro_question": "What is net cash flow?",
        "intro_answer": "<p>Net cash flow is the cash that comes into a business in a period minus the cash that goes out. If you collect $45,000 from customers and pay $28,000 in operating costs and $5,000 in loan repayments, net cash flow is +$12,000 for the month. Negative cash flow drains your reserves even if you are profitable on paper.</p>",
        "formula": {
            "explanation": "<p>Count cash only when it actually moves: customer payments received, not invoices sent; bills paid, not bills received. Loan principal repayments are cash outflows even though they are not expenses on the income statement.</p>",
            "notes": "A simple direct-method view. It does not separate operating, investing and financing activities.",
        },
        "faqs": [
            {"q": "How does cash flow differ from net profit?", "a": "<p>Net profit follows accrual accounting. It counts sales when invoiced, even before customers pay, and deducts non-cash expenses such as depreciation. Cash flow only counts money that actually enters or leaves the bank, so the two can differ widely.</p>"},
            {"q": "How can a profitable business run out of cash?", "a": "<p>If customers pay slowly, inventory ties up cash or large loan repayments fall due, cash can run out while the income statement still shows a profit.</p>"},
            {"q": "How much cash reserve should a small business keep?", "a": "<p>A common rule of thumb is three to six months of operating expenses, depending on how seasonal and predictable your income is.</p>"},
        ],
        "sources": sources("sba_fin"),
        "review": BIZ_REVIEW,
    },
    # -------------------------------------------------------------------- FD
    "fd-calculator": {
        "seo_title": "FD Calculator: Fixed Deposit Maturity & Interest",
        "search_description": "Calculate fixed deposit maturity value and interest earned with quarterly, monthly or annual compounding. Includes the FD formula, a worked example and a TDS note.",
        "intro_question": "How is fixed deposit interest calculated?",
        "intro_answer": "<p>Most bank fixed deposits use compound interest, usually compounded quarterly. Maturity value A = P × (1 + r/n)<sup>n×t</sup>, where n is the number of compounding periods per year. A 25,000 deposit at 7.25% for 5 years, compounded quarterly, matures at about 35,806.51, earning 10,806.51 in interest.</p>",
        "formula": {
            "explanation": "<p>The rate per period is r/n (annual rate ÷ periods per year) and the number of periods is n × t. Many Indian banks compound FDs quarterly; some short deposits pay simple interest at maturity.</p>",
            "notes": "Pre-tax. Interest on FDs is usually taxable and may be subject to TDS in India.",
        },
        "example_patch": {
            "steps": [
                {"step_number": 1, "step_title": "Rate per Quarter", "step_math": "0.0725 / 4 = 0.018125", "description": "Interest rate applied each quarter."},
                {"step_number": 2, "step_title": "Number of Quarters", "step_math": "5 years × 4 = 20 quarters", "description": "Total compounding periods."},
                {"step_number": 3, "step_title": "Maturity Value", "step_math": "25,000 × (1.018125)^20 = 25,000 × 1.43226 = 35,806.51", "description": "Principal plus compounded interest."},
            ],
            "result_highlight": "Principal: 25,000 | Interest: 10,806.51 | Maturity: 35,806.51",
            "key_observation": "The same deposit at 7.25% simple interest would earn 9,062.50, so quarterly compounding adds about 1,744.",
        },
        "faqs": [
            {"q": "Is FD interest taxable?", "a": "<p>In most countries, yes. In India, FD interest is added to your income and taxed at your slab rate, and banks deduct TDS when interest crosses the annual threshold. Check current limits with your bank or the Income Tax Department.</p>"},
            {"q": "Are fixed deposits insured?", "a": "<p>In India, DICGC insures bank deposits up to ₹5 lakh per depositor per bank, including principal and interest. Other countries have their own schemes, such as FDIC insurance in the US.</p>"},
            {"q": "What happens if I break an FD early?", "a": "<p>Banks usually pay a lower rate for the time the money was held and may charge a penalty, often 0.5% to 1%. Check the bank's premature withdrawal terms.</p>"},
        ],
        "sources": sources("rbi", "dicgc"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------ LOAN ELIGIBILITY
    "loan-eligibility-calculator": {
        "seo_title": "Loan Eligibility Calculator: How Much Can I Borrow (DTI)?",
        "search_description": "Estimate the maximum loan you can qualify for from your income, existing debts, interest rate and term using a debt-to-income (DTI) limit. Formula and example included.",
        "intro_question": "How much loan am I eligible for?",
        "intro_answer": "<p>Lenders cap your total monthly debt payments at a share of gross income, called the debt-to-income (DTI) ratio. Multiply income by the DTI limit, subtract existing debt payments, and the remainder is the most you can pay on a new loan. That payment, at the loan's rate and term, sets your maximum loan amount.</p>",
        "formula": {
            "explanation": "<p>Once the maximum EMI is known, the loan amount is its present value: Loan = EMI × (1 − (1 + r)<sup>−n</sup>) ÷ r, where r is the monthly rate and n the number of months.</p>",
            "notes": "Lenders also look at credit score, employment history, assets and the property itself.",
        },
        "example_patch": {
            "steps": [
                {"step_number": 1, "step_title": "Calculate Allowable Total Debt", "step_math": "$8,000 × 45% = $3,600 / month", "description": "Maximum total debt capacity."},
                {"step_number": 2, "step_title": "Compute Max Eligible Loan EMI", "step_math": "$3,600 - $800 = $2,800 / month", "description": "Surplus available for new loan."},
                {"step_number": 3, "step_title": "Convert to Loan Principal", "step_math": "$2,800 × (1 − 1.0054167^−240) / 0.0054167 ≈ $375,550", "description": "Based on 6.5% interest over 20 years."},
            ],
            "result_highlight": "Max Eligible Loan: about $375,550 | Max Monthly Payment: $2,800.00",
        },
        "table": {
            "title": "Common DTI Benchmarks",
            "intro": "Exact limits depend on the lender, loan type and your credit profile.",
            "headers": ["Total DTI", "What it usually means"],
            "rows": [
                ["36% or less", "Comfortable; qualifies for the best terms with most lenders"],
                ["37% – 43%", "Often acceptable; 43% is a widely used ceiling for many mortgages"],
                ["44% – 50%", "Possible with strong credit or certain loan programs"],
                ["Above 50%", "Most lenders will decline"],
            ],
        },
        "faqs": [
            {"q": "What DTI ratio do lenders want?", "a": "<p>Many lenders prefer a total DTI of 36% or less and treat 43% as a common upper limit for mortgages. Some programs allow up to about 50% with strong credit or large reserves. This calculator lets you set the limit your lender uses.</p>"},
            {"q": "Is DTI based on gross or net income?", "a": "<p>Usually gross monthly income, before tax and deductions.</p>"},
            {"q": "How can I increase my loan eligibility?", "a": "<p>Pay off small debts, add a co-borrower's income, choose a longer term or improve your credit score to get a lower rate. In the example, clearing a $300 monthly payment raises the maximum loan by about $40,200.</p>"},
        ],
        "sources": sources("cfpb_dti", "cfpb_mortgage"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------------- SIP
    "sip-calculator": {
        "seo_title": "SIP Calculator: Mutual Fund SIP Returns & Maturity Value",
        "search_description": "Calculate the future value of a monthly SIP in mutual funds from amount, expected return and years, with optional annual step-up. Formula and worked example included.",
        "intro_question": "What is a SIP?",
        "intro_answer": "<p>A systematic investment plan (SIP) invests a fixed amount in a mutual fund at regular intervals, usually monthly. Because each instalment compounds from the date it is invested, small monthly amounts can grow substantially over time. A SIP calculator estimates the maturity value from your monthly amount, expected annual return and investment period.</p>",
        "formula": {
            "explanation": "<p>P is the monthly instalment, i is the expected annual return ÷ 12 and n is the number of months. The final × (1 + i) term assumes each instalment is invested at the start of the month (annuity due), which is how the calculator above works.</p>",
            "notes": "Returns from equity funds are not guaranteed and vary from year to year. With step-up, each year's instalment rises by the chosen percentage.",
        },
        "example_patch": {
            "scenario_description": "Investing 500 per month for 15 years (180 months) at an expected annual return of 12%, invested at the start of each month.",
            "steps": [
                {"step_number": 1, "step_title": "Total Capital Invested", "step_math": "500 × 180 = 90,000", "description": "Your direct contributions."},
                {"step_number": 2, "step_title": "Apply the SIP Formula", "step_math": "500 × [(1.01)^180 − 1] / 0.01 × 1.01 = 252,288", "description": "Monthly rate i = 12% / 12 = 1%."},
            ],
            "result_highlight": "Invested: 90,000 | Estimated Gains: 162,288 | Maturity Value: 252,288",
            "key_observation": "About 64% of the final value comes from compounding rather than your own deposits.",
        },
        "faqs": [
            {"q": "How is SIP return calculated?", "a": "<p>M = P × [(1 + i)<sup>n</sup> − 1] ÷ i × (1 + i). For 500 a month at 12% for 15 years, i = 0.01 and n = 180, giving about 252,288.</p>"},
            {"q": "Is SIP better than a lump sum?", "a": "<p>A SIP spreads purchases over time (rupee- or dollar-cost averaging), which reduces the risk of investing everything at a market peak. A lump sum invested early can earn more if markets rise steadily. Neither is always better.</p>"},
            {"q": "What is a step-up SIP?", "a": "<p>A step-up SIP raises the monthly instalment by a set percentage each year, for example 10%, so contributions keep pace with salary growth.</p>"},
        ],
        "sources": sources("sebi", "investor_ci"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------------ CAGR
    "cagr-calculator": {
        "seo_title": "CAGR Calculator: Compound Annual Growth Rate Formula",
        "search_description": "Calculate the compound annual growth rate (CAGR) of an investment or revenue from start value, end value and years. Includes the formula, example and benchmarks.",
        "intro_question": "What is CAGR?",
        "intro_answer": "<p>CAGR (compound annual growth rate) is the constant yearly rate at which a value would have to grow to go from its starting value to its ending value over a given number of years. It smooths out ups and downs. $20,000 growing to $45,000 over 6 years is a CAGR of 14.47%.</p>",
        "formula": {
            "explanation": "<p>Divide the ending value by the starting value, raise the result to the power of 1 ÷ years, then subtract 1. CAGR shows the smoothed path only; the actual year-by-year returns may have been very different.</p>",
            "notes": "CAGR ignores deposits and withdrawals made during the period. Use an XIRR calculation for irregular cash flows.",
        },
        "faqs": [
            {"q": "What is a good CAGR?", "a": "<p>It depends on the asset and risk. For context, US large-company stocks have averaged roughly 10% a year nominally over the long run, with high volatility. A good CAGR beats inflation and a comparable low-cost index fund over the same period.</p>"},
            {"q": "Why is CAGR better than average annual return?", "a": "<p>Average return can mislead. A 50% gain followed by a 50% loss averages 0%, yet you end with 75% of your money. CAGR captures this correctly: −13.4% a year.</p>"},
            {"q": "Can CAGR be negative?", "a": "<p>Yes. If the ending value is lower than the starting value, CAGR is negative.</p>"},
        ],
        "sources": sources("damodaran", "investor_ci"),
        "review": FIN_REVIEW,
    },
    # ------------------------------------------------------------------- GST
    "gst-calculator": {
        "seo_title": "GST Calculator India: Add or Remove GST with CGST & SGST",
        "search_description": "Add or remove India GST at 5%, 18% or 40% and see the CGST/SGST split for intra-state sales and IGST for inter-state sales. Formula and worked example included.",
        "summary": "Add or remove India GST at the current rates and see the CGST, SGST and IGST split for any amount.",
        "intro_question": "How do you calculate GST?",
        "intro_answer": "<p>To add GST, multiply the pre-tax amount by the GST rate. To remove GST from an inclusive price, divide by (1 + rate). For an intra-state sale in India the tax is split equally between CGST and SGST; inter-state sales carry IGST instead. ₹10,000 at 18% means ₹1,800 GST: ₹900 CGST and ₹900 SGST.</p>",
        "formula": {
            "explanation": "<p>GST-exclusive: GST = amount × rate ÷ 100; total = amount + GST. GST-inclusive: pre-tax amount = total ÷ (1 + rate ÷ 100); GST = total − pre-tax amount. Intra-state: CGST = SGST = GST ÷ 2. Inter-state: IGST = full GST.</p>",
            "notes": "From 22 September 2025 India moved to main GST rates of 5% and 18%, with 40% for selected demerit goods. Older 12% and 28% slabs remain available in the calculator for past invoices. Always confirm an item's rate on the CBIC rate schedule.",
            "var_desc": {"Rate": "GST rate in percent (in India: 5%, 18% or 40% from 22 Sep 2025)"},
        },
        "example_patch": {
            "scenario_description": "Invoicing a service worth ₹10,000 at the 18% GST rate to a customer in the same state.",
            "steps": [
                {"step_number": 1, "step_title": "Calculate GST", "step_math": "₹10,000 × 0.18 = ₹1,800", "description": "Total tax payable."},
                {"step_number": 2, "step_title": "Split CGST and SGST", "step_math": "₹1,800 ÷ 2 = ₹900 CGST + ₹900 SGST", "description": "Intra-state sale. For an inter-state sale, charge ₹1,800 IGST."},
                {"step_number": 3, "step_title": "Gross Invoice Total", "step_math": "₹10,000 + ₹1,800 = ₹11,800", "description": "Total payable by the client."},
            ],
            "result_highlight": "Net: ₹10,000 | CGST 9%: ₹900 | SGST 9%: ₹900 | Total: ₹11,800",
            "key_observation": "To extract GST from ₹11,800 inclusive at 18%, divide by 1.18: ₹10,000 base and ₹1,800 tax.",
        },
        "table": {
            "title": "India GST Rates (from 22 September 2025)",
            "intro": "Simplified overview. Specific goods may carry special rates such as 0.25% or 3%.",
            "headers": ["Rate", "Applies to (examples)", "CGST + SGST"],
            "rows": [
                ["0% (exempt)", "Fresh food staples, some essential services", "0% + 0%"],
                ["5%", "Many everyday goods and essentials", "2.5% + 2.5%"],
                ["18%", "Most goods and services (standard rate)", "9% + 9%"],
                ["40%", "Selected luxury and demerit goods", "20% + 20%"],
            ],
            "takeaway": "Check the CBIC rate schedule for your HSN or SAC code before invoicing.",
        },
        "faqs": [
            {"q": "How do I remove GST from a price?", "a": "<p>Pre-tax price = GST-inclusive price ÷ (1 + rate ÷ 100). At 18%, ₹1,180 ÷ 1.18 = ₹1,000, so the GST is ₹180.</p>"},
            {"q": "What is the difference between CGST, SGST and IGST?", "a": "<p>For a sale within one state, GST is split equally into Central GST (CGST) and State GST (SGST). For a sale between states, a single Integrated GST (IGST) at the full rate is charged.</p>"},
            {"q": "Can I use this for VAT or US sales tax?", "a": "<p>Yes. The add and remove maths is the same for any percentage sales tax or VAT; just ignore the CGST/SGST split.</p>"},
        ],
        "sources": sources("cbic_gst", "gst_portal"),
        "review": BIZ_REVIEW,
    },
}
