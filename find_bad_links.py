import os
import re

directory = 'src'
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            # find all href="..."
            matches = re.findall(r'href="(.*?)"', content)
            for m in matches:
                # ignore external, hash, mailto, and root "/"
                if m.startswith('http') or m.startswith('#') or m.startswith('mailto:') or m == '/' or m == '':
                    continue
                # if it doesn't end with slash, warn
                if not m.endswith('/') and '?' not in m:
                    print(f"Bad href in {path}: {m}")
            
            # find all path: '...'
            matches2 = re.findall(r"path:\s*'([^']+)'", content)
            for m in matches2:
                if m.startswith('http') or m.startswith('#') or m == '/':
                    continue
                if not m.endswith('/') and '?' not in m:
                    print(f"Bad path in {path}: {m}")

