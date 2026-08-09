import re

file_path = r"c:\Users\g7256\raqmana-2026\lib\seo-articles-data.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find git conflict blocks and resolve to HEAD version
def resolve_conflict(text):
    pattern = r"<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+"
    resolved = re.sub(pattern, r"\1", text)
    return resolved

new_content = resolve_conflict(content)
new_content = resolve_conflict(new_content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Git conflict resolved successfully!")
