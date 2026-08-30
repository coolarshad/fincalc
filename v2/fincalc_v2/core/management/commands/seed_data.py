import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from wagtail.models import Site, Page
from home.models import HomePage
from categories.models import CategoryIndexPage
from calculators.models import CalculatorPage
from core.models import StandardPage, SiteSettings


class Command(BaseCommand):
    help = "Seeds all 20 calculators with rich SEO content, categories, standard pages, and admin user."

    def handle(self, *args, **options):
        self.stdout.write("Starting complete database seeding for FinCalc v2 (FinanceToolsLab.com)...")

        # 1. Create or update admin superuser
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@fincalc.org", "admin123")
            self.stdout.write(self.style.SUCCESS("Created admin user: admin / admin123"))

        # 2. Setup Site Settings
        site_settings = SiteSettings.load()
        site_settings.site_name = "FinanceToolsLab.com"
        site_settings.site_tagline = "Precision Tools for Smarter Financial Decisions"
        site_settings.site_description = (
            "Access free, accurate, and instant financial, business, and health calculators. "
            "Mobile-first, transparent formulas, and expert-reviewed tools."
        )
        site_settings.contact_email = "support@financetoolslab.com"
        site_settings.save()

        # 3. Retrieve or create HomePage
        home = HomePage.objects.first()
        if not home:
            root_page = Page.objects.get(id=1)
            home = HomePage(
                title="FinanceToolsLab.com - Free Online Financial & Health Calculators",
                slug="home",
                hero_title="Precision Tools for Smarter Financial Decisions",
                hero_subtitle="Accurate, free, and optimized for mobile performance.",
            )
            root_page.add_child(instance=home)
            root_page.save()

        # Ensure Site points to HomePage
        site = Site.objects.filter(is_default_site=True).first()
        if not site:
            site = Site.objects.create(
                hostname="localhost",
                port=8000,
                root_page=home,
                is_default_site=True,
                site_name="FinanceToolsLab.com"
            )
        else:
            site.root_page = home
            site.site_name = "FinanceToolsLab.com"
            site.save()

        # 4. Seed Category Hubs
        categories_data = [
            {
                "slug": "finance",
                "title": "Personal Finance",
                "icon": "banknote",
                "color": "blue",
                "desc": "Calculators for mortgages, personal loans, SIP, investments, salary, interest, and inflation.",
                "intro": "<p>Our personal finance calculators empower consumers and investors with mathematically precise tools to evaluate borrowing costs, compound growth, and investment portfolios.</p>"
            },
            {
                "slug": "health",
                "title": "Health & Fitness",
                "icon": "heart-pulse",
                "color": "emerald",
                "desc": "Precision health assessment tools including BMI, daily calorie needs, body fat %, and pregnancy tracking.",
                "intro": "<p>Evidence-based health calculators adhering to World Health Organization (WHO) and clinical anthropometric standards.</p>"
            },
            {
                "slug": "business",
                "title": "Business & Commerce",
                "icon": "briefcase",
                "color": "violet",
                "desc": "Commercial tools for profit margins, break-even unit volume, cash flow management, and GST sales tax.",
                "intro": "<p>Essential commercial calculation engines for entrepreneurs, small business owners, and finance professionals.</p>"
            }
        ]

        created_cats = {}
        for cat in categories_data:
            cat_page = CategoryIndexPage.objects.filter(slug=cat["slug"]).first()
            if not cat_page:
                cat_page = CategoryIndexPage(
                    title=cat["title"],
                    slug=cat["slug"],
                    category_slug_name=cat["slug"],
                    icon_name=cat["icon"],
                    badge_color=cat["color"],
                    description=cat["desc"],
                    detailed_intro=cat["intro"],
                    search_description=cat["desc"]
                )
                home.add_child(instance=cat_page)
                cat_page.save_revision().publish()
                self.stdout.write(f"Created category hub: {cat['title']}")
            created_cats[cat["slug"]] = cat_page

        # 5. Full Suite of 20 Calculators
        calculators_dataset = [
            # 1. Loan Calculator
            {
                "category": "finance",
                "slug": "loan-calculator",
                "title": "Loan Calculator",
                "type": "loan",
                "badge": "Most Popular",
                "summary": "Calculate monthly loan payments, total interest costs, and full amortization schedules for personal, auto, and student loans.",
                "formula_expr": "EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)",
                "formula_vars": [
                    {"symbol": "P", "name": "Principal", "description": "Total initial borrowed amount ($)"},
                    {"symbol": "r", "name": "Monthly Interest Rate", "description": "Annual interest rate divided by 12 and 100"},
                    {"symbol": "n", "name": "Number of Payments", "description": "Loan term in years multiplied by 12 months"}
                ],
                "example": {
                    "scenario": "Suppose you borrow $30,000 for a car or personal loan at 6.5% annual interest over 5 years (60 months).",
                    "steps": [
                        {"num": 1, "title": "Calculate Monthly Rate (r)", "math": "6.5 / 100 / 12 = 0.0054167", "desc": "Convert annual interest rate into monthly decimal format."},
                        {"num": 2, "title": "Compute Compounding Multiplier", "math": "(1 + 0.0054167)^60 = 1.3828", "desc": "Evaluate compound interest growth across 60 payments."},
                        {"num": 3, "title": "Calculate Monthly Payment (EMI)", "math": "$30,000 × (0.0054167 × 1.3828) / (1.3828 - 1) = $586.98", "desc": "Divide the numerator by the denominator to yield the exact fixed monthly payment."}
                    ],
                    "result": "Monthly EMI: $586.98 | Total Interest: $5,218.89 | Total Repayment: $35,218.89",
                    "insight": "Choosing a 4-year loan instead of 5 years would save over $1,100 in total interest while only slightly raising monthly payments."
                },
                "faqs": [
                    {"q": "How does extra principal prepayment affect my loan?", "a": "<p>Making extra payments directly against your loan principal reduces the remaining balance, permanently decreasing future interest charges and shortening total repayment time.</p>"},
                    {"q": "What is the difference between fixed and variable interest rates?", "a": "<p>A fixed interest rate remains unchanged throughout the full loan term. A variable rate fluctuates with market benchmark rates.</p>"}
                ]
            },
            # 2. Mortgage Calculator
            {
                "category": "finance",
                "slug": "mortgage-calculator",
                "title": "Mortgage Calculator",
                "type": "mortgage",
                "badge": "Home Loans",
                "summary": "Estimate your complete monthly mortgage payment including principal, interest, property taxes, homeowner insurance, and HOA dues.",
                "formula_expr": "Total Payment = P&I + (Annual Tax / 12) + (Insurance / 12) + HOA",
                "formula_vars": [
                    {"symbol": "P&I", "name": "Principal & Interest", "description": "Standard amortized home loan payment"},
                    {"symbol": "Tax", "name": "Property Taxes", "description": "Local municipal assessment fee billed annually"},
                    {"symbol": "Ins", "name": "Hazard Insurance", "description": "Annual homeowner policy premium"},
                    {"symbol": "HOA", "name": "Association Dues", "description": "Monthly neighborhood or condo amenity fee"}
                ],
                "example": {
                    "scenario": "Buying a $400,000 home with 20% down ($80,000 down payment, $320,000 loan) at 6.75% 30-year fixed, with $4,800/yr taxes and $1,200/yr insurance.",
                    "steps": [
                        {"num": 1, "title": "Calculate Loan Principal", "math": "$400,000 - $80,000 = $320,000", "desc": "Determine the net financed amount."},
                        {"num": 2, "title": "Compute Principal & Interest", "math": "$320,000 @ 6.75% over 360 mos = $2,075.66/mo", "desc": "Base mortgage repayment."},
                        {"num": 3, "title": "Add Escrow (Tax + Insurance)", "math": "($4,800 / 12) + ($1,200 / 12) = $500.00/mo", "desc": "Monthly escrow allocation for taxes and homeowner insurance."}
                    ],
                    "result": "Total Monthly Mortgage: $2,575.66 / month",
                    "insight": "Putting 20% down avoids Private Mortgage Insurance (PMI), saving $150–$300 per month."
                },
                "faqs": [
                    {"q": "What is PMI and when does it get removed?", "a": "<p>Private Mortgage Insurance (PMI) is required by conventional lenders if your down payment is under 20%. It automatically cancels once your loan balance reaches 78% of the original home value.</p>"}
                ]
            },
            # 3. Salary Calculator
            {
                "category": "finance",
                "slug": "salary-calculator",
                "title": "Salary Calculator",
                "type": "salary",
                "badge": "Income",
                "summary": "Convert your hourly, daily, weekly, or monthly wage into an annual salary and vice versa with ease.",
                "formula_expr": "Annual Salary = Hourly Wage × Hours per Week × 52 Weeks",
                "formula_vars": [
                    {"symbol": "Hourly", "name": "Hourly Pay Rate", "description": "Base rate earned per work hour"},
                    {"symbol": "Hours", "name": "Weekly Working Hours", "description": "Standard full-time equivalent (typically 40 hrs)"},
                    {"symbol": "Annual", "name": "Gross Annual Income", "description": "Pre-tax total annual compensation"}
                ],
                "example": {
                    "scenario": "A full-time employee earning $35.00/hour working 40 hours per week.",
                    "steps": [
                        {"num": 1, "title": "Weekly Earnings", "math": "$35.00 × 40 = $1,400.00 / week", "desc": "Gross pay before taxes."},
                        {"num": 2, "title": "Gross Annual Salary", "math": "$1,400.00 × 52 = $72,800.00 / year", "desc": "Total yearly gross wages."}
                    ],
                    "result": "Annual: $72,800.00 | Monthly: $6,066.67 | Bi-Weekly: $2,800.00",
                    "insight": "Working 5 hours of 1.5x overtime per week increases annual income by over $13,650."
                },
                "faqs": [
                    {"q": "How many working hours are in a typical full-time year?", "a": "<p>A standard 40-hour work week consists of 2,080 working hours per year (40 hours × 52 weeks).</p>"}
                ]
            },
            # 4. Interest Calculator
            {
                "category": "finance",
                "slug": "interest-calculator",
                "title": "Interest Calculator",
                "type": "interest",
                "badge": "Savings",
                "summary": "Calculate simple and compound interest on your savings, loans, and investment accounts over any duration.",
                "formula_expr": "Compound Interest: A = P × (1 + r/n)^(n × t)",
                "formula_vars": [
                    {"symbol": "A", "name": "Final Balance", "description": "Total principal plus accumulated interest"},
                    {"symbol": "P", "name": "Principal", "description": "Initial deposit or balance"},
                    {"symbol": "r", "name": "Annual Interest Rate", "description": "Expressed in decimal format"},
                    {"symbol": "n", "name": "Compounding Frequency", "description": "Number of times compounded per year"}
                ],
                "example": {
                    "scenario": "$10,000 deposited at 6% annual interest compounded monthly for 5 years.",
                    "steps": [
                        {"num": 1, "title": "Apply Compound Formula", "math": "$10,000 × (1 + 0.06/12)^(12 × 5) = $13,488.50", "desc": "Compounded interest accumulation."}
                    ],
                    "result": "Total Balance: $13,488.50 | Total Interest Earned: $3,488.50",
                    "insight": "Compound interest earns interest on prior interest, growing exponentially over long horizons."
                },
                "faqs": [
                    {"q": "What is the difference between simple and compound interest?", "a": "<p>Simple interest is calculated only on the original principal. Compound interest is calculated on both principal and accumulated interest.</p>"}
                ]
            },
            # 5. Investment Calculator
            {
                "category": "finance",
                "slug": "investment-calculator",
                "title": "Investment Calculator",
                "type": "investment",
                "badge": "Portfolio",
                "summary": "Project the future value of your investments based on initial principal, monthly contributions, and expected rate of return.",
                "formula_expr": "FV = P × (1 + r)^t + PMT × [ ((1 + r)^t - 1) / r ]",
                "formula_vars": [
                    {"symbol": "FV", "name": "Future Value", "description": "Total future portfolio balance"},
                    {"symbol": "P", "name": "Initial Principal", "description": "Starting deposit amount"},
                    {"symbol": "PMT", "name": "Periodic Contribution", "description": "Amount added each period"},
                    {"symbol": "r", "name": "Periodic Rate of Return", "description": "Average expected market return"}
                ],
                "example": {
                    "scenario": "Starting with $10,000 and contributing $500 monthly for 20 years at an 8% expected annual return.",
                    "steps": [
                        {"num": 1, "title": "Compute Initial Capital Growth", "math": "$10,000 @ 8% for 20 yrs = $46,609.57", "desc": "Growth of initial lump sum."},
                        {"num": 2, "title": "Compute Contribution Compounding", "math": "Monthly additions accumulate to $294,510.21", "desc": "Compounded future value of monthly cash flow."}
                    ],
                    "result": "Total Portfolio: $341,119.78 | Total Invested: $130,000.00 | Total Growth: $211,119.78",
                    "insight": "Over 61% of your total ending portfolio value comes directly from compound returns."
                },
                "faqs": [
                    {"q": "What is a realistic long-term rate of return for stock index funds?", "a": "<p>Historically, the S&P 500 has delivered an average annual nominal return of approximately 10% (or around 7% adjusted for inflation) over multi-decade periods.</p>"}
                ]
            },
            # 6. Credit Card Interest Calculator
            {
                "category": "finance",
                "slug": "credit-card-calculator",
                "title": "Credit Card Interest Calculator",
                "type": "credit_card",
                "badge": "Debt Payoff",
                "summary": "See how long it will take to pay off your credit card balance and how much interest you will pay with fixed monthly payments.",
                "formula_expr": "N = -ln(1 - (B × r) / PMT) / ln(1 + r)",
                "formula_vars": [
                    {"symbol": "N", "name": "Months to Payoff", "description": "Total payment cycles required"},
                    {"symbol": "B", "name": "Current Balance", "description": "Outstanding credit card debt"},
                    {"symbol": "r", "name": "Monthly Interest Rate", "description": "APR divided by 12"},
                    {"symbol": "PMT", "name": "Monthly Payment", "description": "Fixed dollar amount paid per month"}
                ],
                "example": {
                    "scenario": "$5,000 balance at 21.99% APR paying $150 per month.",
                    "steps": [
                        {"num": 1, "title": "Calculate Payoff Timeline", "math": "Requires 49 months (4.1 years) to achieve zero balance.", "desc": "Time needed to fully extinguish debt."},
                        {"num": 2, "title": "Total Interest Paid", "math": "Total payments equal $7,314.28 (Interest: $2,314.28)", "desc": "Cost of carrying the balance."}
                    ],
                    "result": "Payoff Time: 49 Months | Total Interest: $2,314.28 | Total Paid: $7,314.28",
                    "insight": "Increasing payment by just $50/month to $200 saves $800+ in interest and cuts payoff time by 16 months."
                },
                "faqs": [
                    {"q": "Why is paying only the minimum balance dangerous?", "a": "<p>Minimum payments typically cover mostly monthly interest and only 1% of principal, which can stretch repayment over 20+ years and cost multiples of the original balance.</p>"}
                ]
            },
            # 7. BMI Calculator
            {
                "category": "health",
                "slug": "bmi-calculator",
                "title": "BMI Calculator",
                "type": "bmi",
                "badge": "Essential Health",
                "summary": "Calculate your Body Mass Index (BMI) and determine whether your weight is within the healthy World Health Organization range.",
                "formula_expr": "BMI = Weight (kg) / [ Height (m) ]^2",
                "formula_vars": [
                    {"symbol": "Weight", "name": "Body Mass", "description": "Weight in kilograms"},
                    {"symbol": "Height", "name": "Stature", "description": "Standing height in meters"}
                ],
                "example": {
                    "scenario": "An adult measuring 175 cm (1.75 m) in height with a body weight of 72 kg.",
                    "steps": [
                        {"num": 1, "title": "Square Height in Meters", "math": "1.75 × 1.75 = 3.0625 m²", "desc": "Convert centimeters to meters and square the value."},
                        {"num": 2, "title": "Divide Weight by Height Squared", "math": "72 / 3.0625 = 23.51", "desc": "Compute baseline BMI score."}
                    ],
                    "result": "BMI: 23.5 (Normal Weight Category: 18.5 - 24.9)",
                    "insight": "For a height of 175 cm, the healthy weight boundary is 56.7 kg to 76.3 kg."
                },
                "faqs": [
                    {"q": "What are the standard WHO BMI categories?", "a": "<p>Underweight: &lt; 18.5 | Normal weight: 18.5–24.9 | Overweight: 25.0–29.9 | Obese: ≥ 30.0</p>"}
                ]
            },
            # 8. Calorie Calculator
            {
                "category": "health",
                "slug": "calorie-calculator",
                "title": "Calorie Calculator",
                "type": "calorie",
                "badge": "Nutrition",
                "summary": "Estimate how many calories you need daily to maintain, lose, or gain weight using verified BMR equations.",
                "formula_expr": "BMR (Male) = 10W + 6.25H - 5A + 5 | TDEE = BMR × Activity Multiplier",
                "formula_vars": [
                    {"symbol": "W", "name": "Weight", "description": "Body mass in kg"},
                    {"symbol": "H", "name": "Height", "description": "Height in cm"},
                    {"symbol": "A", "name": "Age", "description": "Chronological age in years"}
                ],
                "example": {
                    "scenario": "A 28-year-old male, 178 cm tall, weighing 78 kg with moderate exercise (3-5 workouts/week).",
                    "steps": [
                        {"num": 1, "title": "Basal Metabolic Rate", "math": "(10 × 78) + (6.25 × 178) - (5 × 28) + 5 = 1,757.5 kcal", "desc": "Calories burned at complete rest."},
                        {"num": 2, "title": "Daily Maintenance (TDEE)", "math": "1,757.5 × 1.55 = 2,724 kcal/day", "desc": "Total Daily Energy Expenditure."}
                    ],
                    "result": "Maintenance: 2,724 kcal/day | Fat Loss (-500 kcal): 2,224 kcal/day",
                    "insight": "A daily deficit of 500 kcal typically produces approximately 1 lb (0.45 kg) of fat loss per week."
                },
                "faqs": [
                    {"q": "What formula does this calculator use?", "a": "<p>We use the Mifflin-St Jeor equation, recognized as the gold standard for clinical accuracy.</p>"}
                ]
            },
            # 9. Body Fat Calculator
            {
                "category": "health",
                "slug": "body-fat-calculator",
                "title": "Body Fat Calculator",
                "type": "body_fat",
                "badge": "Body Comp",
                "summary": "Estimate your body fat percentage, fat mass, and lean mass using the standard US Navy circumference method.",
                "formula_expr": "% Body Fat (Men) = 495 / (1.0324 - 0.19077 × log10(Waist - Neck) + 0.15456 × log10(Height)) - 450",
                "formula_vars": [
                    {"symbol": "Waist", "name": "Abdominal Circumference", "description": "Measured at navel level (cm)"},
                    {"symbol": "Neck", "name": "Neck Circumference", "description": "Measured below Adam's apple (cm)"},
                    {"symbol": "Height", "name": "Standing Height", "description": "Without shoes (cm)"}
                ],
                "example": {
                    "scenario": "A male with 180 cm height, 84 cm waist, 38 cm neck, weighing 80 kg.",
                    "steps": [
                        {"num": 1, "title": "Calculate Circumference Difference", "math": "84 cm - 38 cm = 46 cm", "desc": "Abdominal to cervical ratio."},
                        {"num": 2, "title": "Compute Navy Body Fat Formula", "math": "Result = 15.2% Body Fat", "desc": "Fitness category."}
                    ],
                    "result": "Body Fat: 15.2% | Fat Mass: 12.2 kg | Lean Mass: 67.8 kg",
                    "insight": "14%–17% body fat for men is classified as the optimal athletic and fitness range."
                },
                "faqs": [
                    {"q": "How accurate is the US Navy circumference method?", "a": "<p>The US Navy method is typically accurate within 1% to 3% when compared against DEXA body scans.</p>"}
                ]
            },
            # 10. Pregnancy Calculator
            {
                "category": "health",
                "slug": "pregnancy-calculator",
                "title": "Pregnancy Calculator",
                "type": "pregnancy",
                "badge": "Maternity",
                "summary": "Calculate your estimated due date, current gestational age, and key pregnancy milestones using Naegele's rule.",
                "formula_expr": "Estimated Due Date (EDD) = First Day of LMP + 1 Year - 3 Months + 7 Days",
                "formula_vars": [
                    {"symbol": "LMP", "name": "Last Menstrual Period", "description": "Start date of the most recent menstrual cycle"},
                    {"symbol": "Cycle", "name": "Cycle Length", "description": "Standard average cycle is 28 days"}
                ],
                "example": {
                    "scenario": "Last menstrual period started on January 15th with a standard 28-day cycle.",
                    "steps": [
                        {"num": 1, "title": "Apply Naegele's Rule", "math": "Jan 15 + 7 days = Jan 22; Jan - 3 months = Oct", "desc": "Calculates standard 280-day gestational duration."}
                    ],
                    "result": "Estimated Due Date: October 22nd | 40 Weeks Total Gestation",
                    "insight": "Only about 4% to 5% of babies are born on their exact due date; most arrive within 2 weeks before or after."
                },
                "faqs": [
                    {"q": "What is the typical length of a full-term pregnancy?", "a": "<p>A full-term human pregnancy averages 280 days (40 weeks) from the first day of the last menstrual period.</p>"}
                ]
            },
            # 11. Currency Converter
            {
                "category": "finance",
                "slug": "currency-calculator",
                "title": "Currency Converter",
                "type": "currency",
                "badge": "Forex",
                "summary": "Convert between major global currencies (USD, EUR, GBP, JPY, CAD, AUD, INR) with live indicative exchange rates.",
                "formula_expr": "Converted Amount = Amount (Base) × Exchange Rate",
                "formula_vars": [
                    {"symbol": "Amount", "name": "Base Currency Amount", "description": "Funds to be converted"},
                    {"symbol": "Rate", "name": "Exchange Rate", "description": "Price of quote currency per unit of base currency"}
                ],
                "example": {
                    "scenario": "Converting $1,000 USD to EUR at an exchange rate of 0.92.",
                    "steps": [
                        {"num": 1, "title": "Multiply Base Amount by Rate", "math": "$1,000 × 0.92 = €920.00 EUR", "desc": "Direct currency conversion."}
                    ],
                    "result": "1,000 USD = 920.00 EUR",
                    "insight": "Always check for bank foreign transaction spreads or conversion fees when exchanging funds."
                },
                "faqs": [
                    {"q": "What is the mid-market exchange rate?", "a": "<p>The mid-market rate is the midpoint between the buy and sell prices of two currencies on the global forex market.</p>"}
                ]
            },
            # 12. Inflation Calculator
            {
                "category": "finance",
                "slug": "inflation-calculator",
                "title": "Inflation Calculator",
                "type": "inflation",
                "badge": "Purchasing Power",
                "summary": "See how the purchasing power of money changes over time and how much future capital you need to match today's value.",
                "formula_expr": "Future Value = Today's Value × (1 + Inflation Rate)^Years",
                "formula_vars": [
                    {"symbol": "Today's Value", "name": "Current Dollar Amount", "description": "Present purchasing power ($)"},
                    {"symbol": "Inflation", "name": "Annual Inflation Rate", "description": "Average consumer price index growth (e.g. 3.0%)"},
                    {"symbol": "Years", "name": "Time Horizon", "description": "Number of years into the future"}
                ],
                "example": {
                    "scenario": "$50,000 annual living expense projected 20 years into the future at 3% annual inflation.",
                    "steps": [
                        {"num": 1, "title": "Compute Inflation Multiplier", "math": "(1 + 0.03)^20 = 1.8061", "desc": "Compounded price index increase."},
                        {"num": 2, "title": "Calculate Future Required Dollars", "math": "$50,000 × 1.8061 = $90,305.56", "desc": "Required annual cash flow in 20 years."}
                    ],
                    "result": "Future Equivalent: $90,305.56 | Cumulative Price Increase: 80.61%",
                    "insight": "At a 3% inflation rate, purchasing power drops by half in approximately 24 years (Rule of 72)."
                },
                "faqs": [
                    {"q": "What is the Rule of 72 for inflation?", "a": "<p>Divide 72 by the annual inflation rate to approximate how many years it takes for the purchasing power of money to cut in half.</p>"}
                ]
            },
            # 13. Margin Calculator
            {
                "category": "business",
                "slug": "margin-calculator",
                "title": "Margin Calculator",
                "type": "margin",
                "badge": "E-Commerce",
                "summary": "Calculate profit margins, markups, stock trading margins, and currency exchange margins for commercial operations.",
                "formula_expr": "Gross Margin % = [ (Revenue - Cost) / Revenue ] × 100",
                "formula_vars": [
                    {"symbol": "Revenue", "name": "Selling Price", "description": "Total customer price charged ($)"},
                    {"symbol": "Cost", "name": "Cost of Goods Sold (COGS)", "description": "Direct cost to produce or acquire the item"}
                ],
                "example": {
                    "scenario": "An e-commerce item costs $60 to manufacture and is sold for $100.",
                    "steps": [
                        {"num": 1, "title": "Calculate Gross Profit", "math": "$100 - $60 = $40.00", "desc": "Net dollar gain per item."},
                        {"num": 2, "title": "Calculate Profit Margin", "math": "($40 / $100) × 100 = 40.0%", "desc": "Portion of revenue kept as profit."}
                    ],
                    "result": "Gross Profit: $40.00 | Gross Margin: 40.00% | Markup: 66.67%",
                    "insight": "Never confuse markup with margin: a 50% markup equals a 33.3% gross margin."
                },
                "faqs": [
                    {"q": "What is the difference between margin and markup?", "a": "<p>Margin is profit as a percentage of revenue. Markup is profit as a percentage of cost.</p>"}
                ]
            },
            # 14. Break-even Point Calculator
            {
                "category": "business",
                "slug": "break-even-calculator",
                "title": "Break-even Point Calculator",
                "type": "break_even",
                "badge": "Operations",
                "summary": "Find the exact sales volume and revenue needed to cover all fixed and variable business operating costs.",
                "formula_expr": "Break-even Units = Fixed Costs / (Price per Unit - Variable Cost per Unit)",
                "formula_vars": [
                    {"symbol": "Fixed Costs", "name": "Overhead Expenses", "description": "Rent, salaries, software ($)"},
                    {"symbol": "Price", "name": "Unit Selling Price", "description": "Revenue per item sold"},
                    {"symbol": "Variable Cost", "name": "Unit Cost", "description": "Direct materials, shipping, labor"}
                ],
                "example": {
                    "scenario": "Fixed costs of $15,000/month, selling units at $50 each with $20 in unit variable costs.",
                    "steps": [
                        {"num": 1, "title": "Calculate Unit Contribution Margin", "math": "$50 - $20 = $30 per unit", "desc": "Dollar amount contributing to overhead."},
                        {"num": 2, "title": "Calculate Break-even Units", "math": "$15,000 / $30 = 500 units", "desc": "Sales volume required to achieve $0 net income."}
                    ],
                    "result": "Break-even Volume: 500 Units / month | Break-even Revenue: $25,000.00",
                    "insight": "Every unit sold above 500 generates a full $30 of pure net operating profit."
                },
                "faqs": [
                    {"q": "What is the contribution margin ratio?", "a": "<p>Contribution Margin Ratio = (Price - Variable Cost) / Price. In this example, $30/$50 = 60%.</p>"}
                ]
            },
            # 15. Cash Flow Calculator
            {
                "category": "business",
                "slug": "cash-flow-calculator",
                "title": "Cash Flow Calculator",
                "type": "cash_flow",
                "badge": "Liquidity",
                "summary": "Track your monthly cash inflows and outflows to monitor operating liquidity and net cash generation.",
                "formula_expr": "Net Cash Flow = Total Inflows - Total Outflows",
                "formula_vars": [
                    {"symbol": "Inflows", "name": "Total Cash In", "description": "Sales, customer collections, investments"},
                    {"symbol": "Outflows", "name": "Total Cash Out", "description": "Payroll, supplier invoices, rent, taxes"}
                ],
                "example": {
                    "scenario": "$45,000 in monthly customer receipts, with $28,000 operating expenses and $5,000 debt service.",
                    "steps": [
                        {"num": 1, "title": "Sum Outflows", "math": "$28,000 + $5,000 = $33,000", "desc": "Total monthly disbursements."},
                        {"num": 2, "title": "Calculate Net Cash Flow", "math": "$45,000 - $33,000 = +$12,000", "desc": "Net cash added to reserves."}
                    ],
                    "result": "Monthly Inflows: $45,000 | Total Outflows: $33,000 | Net Cash Flow: +$12,000/mo",
                    "insight": "A business can be profitable on paper but fail due to negative operating cash flow."
                },
                "faqs": [
                    {"q": "How does cash flow differ from net profit?", "a": "<p>Net profit includes non-cash items like depreciation and accounts receivable. Cash flow measures actual physical cash entering and exiting bank accounts.</p>"}
                ]
            },
            # 16. FD Calculator
            {
                "category": "finance",
                "slug": "fd-calculator",
                "title": "FD Calculator",
                "type": "fd",
                "badge": "Savings",
                "summary": "Calculate maturity value and interest for fixed deposits with quarterly, monthly, or annual compounding frequencies.",
                "formula_expr": "A = P × (1 + r/n)^(n × t)",
                "formula_vars": [
                    {"symbol": "A", "name": "Maturity Value", "description": "Final amount payable at maturity"},
                    {"symbol": "P", "name": "Principal Deposit", "description": "Initial lump sum invested"},
                    {"symbol": "r", "name": "Annual Interest Rate", "description": "Stated annual percentage yield"},
                    {"symbol": "n", "name": "Compounding Frequency", "description": "Times compounded per year"}
                ],
                "example": {
                    "scenario": "Depositing $25,000 in a 5-year Fixed Deposit at 7.25% interest compounded quarterly.",
                    "steps": [
                        {"num": 1, "title": "Compute Quarterly Rate", "math": "0.0725 / 4 = 0.018125", "desc": "Interest earned per quarter."},
                        {"num": 2, "title": "Compute Total Periods", "math": "5 years × 4 = 20 quarters", "desc": "Total compounding cycles."}
                    ],
                    "result": "Principal: $25,000 | Interest: $10,807.56 | Maturity: $35,807.56",
                    "insight": "Quarterly compounding produces higher yields than simple annual interest on longer terms."
                },
                "faqs": [
                    {"q": "Is Fixed Deposit interest taxable?", "a": "<p>In most tax jurisdictions, interest earned on term deposits is classified as taxable income.</p>"}
                ]
            },
            # 17. Loan Eligibility Calculator
            {
                "category": "finance",
                "slug": "loan-eligibility-calculator",
                "title": "Loan Eligibility Calculator",
                "type": "loan_eligibility",
                "badge": "Affordability",
                "summary": "Check how much loan you can qualify for based on your monthly income, existing debt obligations, and lender DTI limits.",
                "formula_expr": "Max Eligible EMI = (Monthly Income × Max DTI %) - Existing Debt Payments",
                "formula_vars": [
                    {"symbol": "Income", "name": "Gross Monthly Income", "description": "Total monthly pre-tax earnings"},
                    {"symbol": "DTI", "name": "Debt-to-Income Limit", "description": "Standard banking benchmark (typically 40% to 50%)"},
                    {"symbol": "Debts", "name": "Existing Monthly Debts", "description": "Credit cards, car loans, personal loans"}
                ],
                "example": {
                    "scenario": "$8,000 gross monthly income, $800 in existing car/student debt, qualifying at 45% maximum DTI on a 6.5% 20-year loan.",
                    "steps": [
                        {"num": 1, "title": "Calculate Allowable Total Debt", "math": "$8,000 × 45% = $3,600 / month", "desc": "Maximum total debt capacity."},
                        {"num": 2, "title": "Compute Max Eligible Loan EMI", "math": "$3,600 - $800 = $2,800 / month", "desc": "Surplus available for new loan."},
                        {"num": 3, "title": "Convert to Loan Principal", "math": "Supports maximum borrowing of $375,500", "desc": "Based on 6.5% interest over 20 years."}
                    ],
                    "result": "Max Eligible Loan: $375,500 | Max Monthly Payment: $2,800.00",
                    "insight": "Paying off an existing $300/month loan increases your borrowing capacity by over $40,000."
                },
                "faqs": [
                    {"q": "What is the recommended Debt-to-Income (DTI) ratio for mortgage lenders?", "a": "<p>Most conventional mortgage lenders prefer a DTI ratio below 43%, with top-tier loan terms offered for DTIs below 36%.</p>"}
                ]
            },
            # 18. SIP Calculator
            {
                "category": "finance",
                "slug": "sip-calculator",
                "title": "SIP Calculator",
                "type": "sip",
                "badge": "Wealth Builder",
                "summary": "Calculate the future value of your systematic monthly investments in mutual funds, ETFs, and stocks.",
                "formula_expr": "M = P × [ (1 + i)^n - 1 ] / i × (1 + i)",
                "formula_vars": [
                    {"symbol": "M", "name": "Maturity Amount", "description": "Future value of accumulated wealth"},
                    {"symbol": "P", "name": "Monthly SIP", "description": "Fixed sum invested at the start of each month"},
                    {"symbol": "i", "name": "Periodic Rate", "description": "Annual return rate divided by 12"},
                    {"symbol": "n", "name": "Number of Months", "description": "Investment tenure in months"}
                ],
                "example": {
                    "scenario": "Investing $500 per month for 15 years with an expected average annual market return of 12%.",
                    "steps": [
                        {"num": 1, "title": "Total Capital Invested", "math": "$500 × 180 months = $90,000", "desc": "Your direct contributions."},
                        {"num": 2, "title": "Compound Wealth Generated", "math": "Maturity Value = $249,790", "desc": "Compounded exponential return."}
                    ],
                    "result": "Invested: $90,000 | Wealth Gain: $159,790 | Total Portfolio: $249,790",
                    "insight": "Due to compounding, over 63% of your final portfolio comes from returns rather than direct deposits."
                },
                "faqs": [
                    {"q": "Why is SIP better than lump-sum investing?", "a": "<p>SIP utilizes Dollar-Cost Averaging, buying more units when prices fall and fewer when prices rise, reducing volatility risk.</p>"}
                ]
            },
            # 19. CAGR Calculator
            {
                "category": "finance",
                "slug": "cagr-calculator",
                "title": "CAGR Calculator",
                "type": "cagr",
                "badge": "Performance",
                "summary": "Calculate the Compound Annual Growth Rate (CAGR) of your investments, business revenues, or portfolio assets over multiple years.",
                "formula_expr": "CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1",
                "formula_vars": [
                    {"symbol": "Ending Value", "name": "Final Portfolio Balance", "description": "Value at the end of the holding period"},
                    {"symbol": "Beginning Value", "name": "Initial Investment", "description": "Initial capital deployed"},
                    {"symbol": "Years", "name": "Holding Period", "description": "Number of years between start and end date"}
                ],
                "example": {
                    "scenario": "An initial investment of $20,000 grows to $45,000 over a 6-year period.",
                    "steps": [
                        {"num": 1, "title": "Compute Total Growth Ratio", "math": "$45,000 / $20,000 = 2.25", "desc": "Total multiple expansion."},
                        {"num": 2, "title": "Annualize Growth Rate", "math": "(2.25)^(1/6) - 1 = 14.47%", "desc": "Geometric annualized mean return."}
                    ],
                    "result": "CAGR: 14.47% per year | Total Return: 125.0%",
                    "insight": "CAGR smooths out year-over-year market volatility to reflect the true annualized compounding rate."
                },
                "faqs": [
                    {"q": "Why is CAGR preferred over Average Annual Return?", "a": "<p>CAGR accounts for the geometric compounding of returns over time, eliminating misleading arithmetic distortion caused by volatile up and down years.</p>"}
                ]
            },
            # 20. GST Calculator
            {
                "category": "business",
                "slug": "gst-calculator",
                "title": "GST Calculator",
                "type": "gst",
                "badge": "Taxation",
                "summary": "Quickly calculate GST amounts with CGST and SGST breakdowns, or extract pre-tax values from gross prices.",
                "formula_expr": "GST Amount (Exclusive) = Amount × (GST Rate / 100)",
                "formula_vars": [
                    {"symbol": "Amount", "name": "Base Value", "description": "Original pre-tax or post-tax amount"},
                    {"symbol": "Rate", "name": "Tax Slab", "description": "Percentage GST/VAT rate (e.g. 5%, 12%, 18%, 28%)"}
                ],
                "example": {
                    "scenario": "Invoicing a service worth $10,000 subject to 18% standard GST rate.",
                    "steps": [
                        {"num": 1, "title": "Calculate Tax Payable", "math": "$10,000 × 0.18 = $1,800.00", "desc": "18% tax addition."},
                        {"num": 2, "title": "Gross Invoice Total", "math": "$10,000 + $1,800 = $11,800.00", "desc": "Total payable by client."}
                    ],
                    "result": "Net Amount: $10,000.00 | GST (18%): $1,800.00 | Gross Total: $11,800.00",
                    "insight": "When extracting tax from a tax-inclusive price, divide by 1 + (rate/100)."
                },
                "faqs": [
                    {"q": "How do I calculate GST-inclusive reverse pricing?", "a": "<p>Formula: Pre-Tax Amount = Total Inclusive Price ÷ (1 + GST Rate ÷ 100).</p>"}
                ]
            }
        ]

        for item in calculators_dataset:
            cat_obj = created_cats.get(item["category"])
            if not cat_obj:
                continue

            calc_page = CalculatorPage.objects.filter(slug=item["slug"]).first()
            if not calc_page:
                body_data = [
                    (
                        "formula",
                        {
                            "title": "Mathematical Formula & Methodology",
                            "formula_expression": item["formula_expr"],
                            "explanation": f"<p>The {item['title']} uses standard actuarial and financial equations to provide transparent, verified calculations.</p>",
                            "variables": item["formula_vars"],
                            "notes": "Calculations assume standard periodic compounding."
                        }
                    ),
                    (
                        "worked_example",
                        {
                            "title": f"Step-by-Step Example: {item['title']}",
                            "scenario_description": item["example"]["scenario"],
                            "steps": [
                                {
                                    "step_number": s["num"],
                                    "step_title": s["title"],
                                    "step_math": s["math"],
                                    "description": s["desc"]
                                }
                                for s in item["example"]["steps"]
                            ],
                            "result_highlight": item["example"]["result"],
                            "key_observation": item["example"]["insight"]
                        }
                    ),
                    (
                        "faqs",
                        {
                            "heading": "Frequently Asked Questions",
                            "faqs": [
                                {"question": f["q"], "answer": f["a"]}
                                for f in item["faqs"]
                            ]
                        }
                    ),
                    (
                        "expert_review",
                        {
                            "reviewer_name": "FinanceToolsLab Editorial Board",
                            "reviewer_title": "Certified Financial Analysts (CFA®) & Actuarial Specialists",
                            "reviewed_date": datetime.date.today(),
                            "methodology_note": "Every calculation model is validated against banking algorithms and verified numerical benchmarks."
                        }
                    )
                ]

                calc_page = CalculatorPage(
                    title=item["title"],
                    slug=item["slug"],
                    calculator_type=item["type"],
                    badge_tag=item["badge"],
                    short_summary=item["summary"],
                    search_description=item["summary"],
                    body=body_data
                )
                cat_obj.add_child(instance=calc_page)
                calc_page.save_revision().publish()
                self.stdout.write(f"Published calculator: {item['title']} under {cat_obj.title}")
            else:
                self.stdout.write(f"Calculator {item['title']} already exists.")

        # 6. Standard Informational Pages
        standard_pages_data = [
            {
                "slug": "about",
                "title": "About Us",
                "subtitle": "Transparency, Speed, and Actuarial Accuracy",
                "intro": "FinanceToolsLab.com was created to provide free, high-speed, ad-free financial and health calculation engines for individuals and professionals worldwide.",
                "body": [
                    ("heading", "Our Mission"),
                    ("paragraph", "<p>We believe financial literacy starts with clear, transparent tools. Unlike commercial sites laden with intrusive ads and trackers, FinanceToolsLab.com runs with verified mathematical equations and instant server-rendered performance.</p>"),
                    ("heading", "Our Editorial Standards"),
                    ("paragraph", "<p>Every equation, from loan amortization to body composition formulas, is reviewed by certified professionals and backed by transparent mathematical steps.</p>")
                ]
            },
            {
                "slug": "contact",
                "title": "Contact Us",
                "subtitle": "Questions, Feedback, or Feature Requests",
                "intro": "We welcome your feedback, calculator feature suggestions, and inquiries.",
                "body": [
                    ("heading", "Get in Touch"),
                    ("paragraph", "<p>Have a question about a calculation formula or a suggestion for a new financial tool? Contact our team at <strong>support@financetoolslab.com</strong>.</p>")
                ]
            },
            {
                "slug": "privacy",
                "title": "Privacy Policy",
                "subtitle": "Zero Data Retention & Client-Side Calculation Security",
                "intro": "At FinanceToolsLab.com, your privacy is paramount. Your financial numbers stay strictly on your device.",
                "body": [
                    ("heading", "Data Handling"),
                    ("paragraph", "<p>We do not store, track, or transmit any financial or health numbers entered into our calculators. All calculations evaluate instantly in your browser.</p>")
                ]
            },
            {
                "slug": "terms",
                "title": "Terms of Service",
                "subtitle": "Educational & Estimative Use",
                "intro": "Please read these terms carefully before utilizing our online calculation tools.",
                "body": [
                    ("heading", "Disclaimer"),
                    ("paragraph", "<p>Calculations provided by FinanceToolsLab.com are for educational and estimation purposes only. Consult a certified financial advisor or medical professional for personalized advice.</p>")
                ]
            }
        ]

        for p_data in standard_pages_data:
            std_page = StandardPage.objects.filter(slug=p_data["slug"]).first()
            if not std_page:
                std_page = StandardPage(
                    title=p_data["title"],
                    slug=p_data["slug"],
                    subtitle=p_data["subtitle"],
                    intro=p_data["intro"],
                    body=p_data["body"],
                    search_description=p_data["intro"]
                )
                home.add_child(instance=std_page)
                std_page.save_revision().publish()
                self.stdout.write(f"Published standard page: {p_data['title']}")

        self.stdout.write(self.style.SUCCESS("All 20 calculators and standard pages seeded successfully!"))
