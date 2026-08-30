from wagtail import blocks


class VariableBlock(blocks.StructBlock):
    symbol = blocks.CharBlock(max_length=20, help_text="e.g. P, r, n, t")
    name = blocks.CharBlock(max_length=100, help_text="e.g. Principal Loan Amount")
    description = blocks.CharBlock(max_length=255, help_text="Explanation of what this variable represents")

    class Meta:
        icon = "snippet"


class FormulaBlock(blocks.StructBlock):
    title = blocks.CharBlock(default="Mathematical Formula", help_text="Heading for the formula section")
    formula_expression = blocks.CharBlock(
        help_text="The mathematical equation, e.g. EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)"
    )
    explanation = blocks.RichTextBlock(
        help_text="Detailed narrative explanation of how the formula works mathematically."
    )
    variables = blocks.ListBlock(VariableBlock(), help_text="Breakdown of each variable in the equation")
    notes = blocks.CharBlock(required=False, help_text="Additional assumptions or notes (e.g. compounding frequency)")

    class Meta:
        icon = "code"
        template = "calculators/blocks/formula_block.html"


class StepBlock(blocks.StructBlock):
    step_number = blocks.IntegerBlock(default=1)
    step_title = blocks.CharBlock(max_length=150)
    step_math = blocks.CharBlock(required=False, help_text="Sub-calculation, e.g. 50,000 × 0.00583")
    description = blocks.TextBlock(help_text="Explanation of this calculation step")

    class Meta:
        icon = "list-ol"


class WorkedExampleBlock(blocks.StructBlock):
    title = blocks.CharBlock(default="Real-World Calculation Example")
    scenario_description = blocks.TextBlock(
        help_text="Context of the example scenario, e.g. 'John is taking a $30,000 car loan at 6.5% interest for 5 years...'"
    )
    steps = blocks.ListBlock(StepBlock(), help_text="Step-by-step resolution")
    result_highlight = blocks.CharBlock(help_text="Final result summary, e.g. 'Total Monthly Payment = $586.98'")
    key_observation = blocks.TextBlock(required=False, help_text="Strategic takeaway for the reader")

    class Meta:
        icon = "tasks"
        template = "calculators/blocks/worked_example_block.html"


class ComparisonTableRowBlock(blocks.StructBlock):
    column_values = blocks.ListBlock(blocks.CharBlock(), help_text="Cell values across columns")

    class Meta:
        icon = "table"


class ComparisonTableBlock(blocks.StructBlock):
    title = blocks.CharBlock(default="Scenario Comparison Table")
    intro = blocks.TextBlock(required=False, help_text="Explanation of what this comparison highlights")
    headers = blocks.ListBlock(blocks.CharBlock(), help_text="Column Header names (e.g. Loan Term, Monthly EMI, Total Interest)")
    rows = blocks.ListBlock(ComparisonTableRowBlock(), help_text="Data rows")
    takeaway = blocks.CharBlock(required=False, help_text="Summary tip for picking the best option")

    class Meta:
        icon = "table"
        template = "calculators/blocks/comparison_table_block.html"


class FAQItemBlock(blocks.StructBlock):
    question = blocks.CharBlock(max_length=255, help_text="Frequently asked question")
    answer = blocks.RichTextBlock(help_text="Authoritative, detailed answer")

    class Meta:
        icon = "help"


class FAQBlock(blocks.StructBlock):
    heading = blocks.CharBlock(default="Frequently Asked Questions (FAQ)")
    faqs = blocks.ListBlock(FAQItemBlock(), help_text="Add 3-6 comprehensive FAQs with schema generation")

    class Meta:
        icon = "help"
        template = "calculators/blocks/faq_block.html"


class ExpertReviewBlock(blocks.StructBlock):
    reviewer_name = blocks.CharBlock(max_length=100, default="FinCalc Financial Review Board")
    reviewer_title = blocks.CharBlock(max_length=150, default="Certified Financial Analyst (CFA®) & Editorial Team")
    reviewed_date = blocks.DateBlock(help_text="Date when this tool & formula was verified")
    methodology_note = blocks.TextBlock(
        default="This calculator adheres strictly to standard actuarial and financial compound interest formulas. All calculations are validated against verified benchmark models."
    )

    class Meta:
        icon = "user"
        template = "calculators/blocks/expert_review_block.html"


class KeyTakeawaysBlock(blocks.StructBlock):
    heading = blocks.CharBlock(default="Key Considerations & Pro Tips")
    points = blocks.ListBlock(blocks.CharBlock(max_length=255))

    class Meta:
        icon = "tick"
        template = "calculators/blocks/key_takeaways_block.html"
