import re
from collections import Counter

file_path = r"C:\Users\Aryan\.gemini\antigravity\brain\af439ffc-70ba-4f42-a14e-cd7090c57410\.system_generated\steps\1607\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's inspect the tags that are present
tags = re.findall(r'<[a-zA-Z0-9]+', content)
print("Total tags found:", len(tags))
print("Tag counts:", Counter(tags))

# Let's write the first 20,000 characters without styles or scripts to a file so we can view it
content_no_styles = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
content_no_scripts = re.sub(r'<script[^>]*>.*?</script>', '', content_no_styles, flags=re.DOTALL)

with open("scratch/inspected.html", "w", encoding="utf-8") as f:
    f.write(content_no_scripts[:20000])

print("Wrote scratch/inspected.html")
