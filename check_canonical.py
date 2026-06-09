import os
import re

directory = 'src/app'
routes = []

for root, _, files in os.walk(directory):
    for file in files:
        if file == 'page.tsx':
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            match = re.search(r'canonical:\s*[\'"`](.*?)[\'"`]', content)
            if match:
                canon = match.group(1)
                if not canon.endswith('/') and not canon.endswith('.com'):
                    print(f"Missing trailing slash in {path}: {canon}")
