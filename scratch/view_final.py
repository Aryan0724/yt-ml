file_path = r"C:\Users\Aryan\.gemini\antigravity\brain\af439ffc-70ba-4f42-a14e-cd7090c57410\.system_generated\steps\1607\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print("File size:", len(content))
print("Content from 40000 to 50000:")
print(content[40000:50000].encode('ascii', errors='backslashreplace').decode('ascii'))
print("Content from 50000 to 60000:")
print(content[50000:60000].encode('ascii', errors='backslashreplace').decode('ascii'))
