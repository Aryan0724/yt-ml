import re

file_path = r"C:\Users\Aryan\.gemini\antigravity\brain\af439ffc-70ba-4f42-a14e-cd7090c57410\.system_generated\steps\1745\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's clean up content
content_no_styles = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
content_no_scripts = re.sub(r'<script[^>]*>.*?</script>', '', content_no_styles, flags=re.DOTALL)

# Find title and meta tags
title = re.search(r'<title>(.*?)</title>', content_no_styles)
desc = re.search(r'<meta name="description" content="(.*?)"', content_no_styles)

# Find all text between tags
text_blocks = re.findall(r'>([^<>\n\r\t]+)<', content_no_scripts)

# Filter unique text blocks that have actual letters
cleaned_blocks = []
seen = set()
for block in text_blocks:
    block = block.strip()
    if block and len(block) > 2:
        block = block.replace("&nbsp;", " ").replace("&amp;", "&").replace("&middot;", "middot")
        if block not in seen:
            seen.add(block)
            cleaned_blocks.append(block)

# Print title and description
print("=== META ===")
if title:
    print("Title:", title.group(1))
if desc:
    print("Description:", desc.group(1))

# Print all text blocks
print("\n=== EXTRACTED TEXT ===")
for i, block in enumerate(cleaned_blocks[:150]):
    print(f"{i}: {block.encode('ascii', errors='backslashreplace').decode('ascii')}")
