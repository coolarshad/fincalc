import os
import re

for root, _, files in os.walk('src/app'):
    for file in files:
        if file == 'Client.tsx':
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace <ResponsiveContainer width="100%" height="100%"> with minWidth={0} minHeight={0}
            new_content = re.sub(
                r'<ResponsiveContainer\s+width="100%"\s+height="100%"(?!\s+minWidth)',
                '<ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}',
                content
            )

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated ResponsiveContainer in {filepath}')
