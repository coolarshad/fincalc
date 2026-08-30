import os
import re

files_to_clean = [
    'src/app/HomeClient.tsx',
    'src/app/about/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/contact/ContactClient.tsx',
]

for root, dirs, files in os.walk('src/app'):
    for f in files:
        if f == 'Client.tsx':
            files_to_clean.append(os.path.join(root, f))

# regex pattern matching the yellow firebase warning banner
pattern = re.compile(
    r'\{\s*firebaseConfig\.projectId\s*===?\s*[\'"`]YOUR_PROJECT_ID[\'"`]\s*&&\s*\(\s*<div[^>]*>.*?Firebase is not connected.*?</div>\s*\)\s*\}',
    re.DOTALL
)

cleaned_count = 0
for filepath in set(files_to_clean):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        new_content = pattern.sub('', content)
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            cleaned_count += 1
            print(f'Cleaned banner from {filepath}')

print(f'Total files cleaned: {cleaned_count}')
