file_path = r"C:\Users\Aryan\.gemini\antigravity\brain\af439ffc-70ba-4f42-a14e-cd7090c57410\.system_generated\steps\1607\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print("File total size:", len(content))
print("Chars 20000 to 30000:")
print(content[20000:30000].encode('ascii', errors='backslashreplace').decode('ascii'))
