import re

file_path = r"C:\Users\Aryan\.gemini\antigravity\brain\af439ffc-70ba-4f42-a14e-cd7090c57410\.system_generated\steps\1607\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for all text that looks like labels or words
words = re.findall(r'"([A-Za-z0-9\s\-\.\,\!\?\:\'\"]{4,100})"', content)
print("Total string values found:", len(words))

# Print first 200 string values to see what is inside the JSON or JS bundles
from collections import Counter
counts = Counter(words)
print("Most common strings:")
for w, c in counts.most_common(50):
    print(f"  {w}: {c}")
