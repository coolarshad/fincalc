import os
import re

directory = 'src'
routes = [
    'about', 'contact', 'privacy',
    'loan-calculator', 'mortgage-calculator', 'salary-calculator',
    'interest-calculator', 'investment-calculator', 'credit-card-calculator',
    'bmi-calculator', 'calorie-calculator', 'body-fat-calculator',
    'pregnancy-calculator', 'currency-calculator', 'inflation-calculator',
    'margin-calculator', 'break-even-calculator', 'cash-flow-calculator',
    'fd-calculator', 'loan-eligibility-calculator', 'sip-calculator',
    'cagr-calculator', 'gst-calculator'
]

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = content
            for route in routes:
                # match exactly href="/route" or path: '/route' or path: "/route"
                new_content = re.sub(rf'href="/{route}"', f'href="/{route}/"', new_content)
                new_content = re.sub(rf"path: '/{route}'", f"path: '/{route}/'", new_content)
                new_content = re.sub(rf'path: "/{route}"', f'path: "/{route}/"', new_content)
            
            if new_content != content:
                print(f"Updated {path}")
                with open(path, 'w') as f:
                    f.write(new_content)
