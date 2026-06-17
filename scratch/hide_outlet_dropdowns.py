import os
import re

reports_dir = r"c:\Users\Sajad\Desktop\SaSLoop\pos-app\src\components\reports"

for filename in os.listdir(reports_dir):
    if not filename.endswith(".jsx"):
        continue
    filepath = os.path.join(reports_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Let's search for '<select' containing 'outlet_id'
    select_matches = list(re.finditer(r"<select[^>]*value=\{\s*filters\.outlet_id[^}]*\}", content))
    if not select_matches:
        continue
        
    print(f"\n--- File: {filename} ---")
    for match in select_matches:
        idx = match.start()
        # Look backwards to find the enclosing <div or <span
        # Let's print the 300 characters preceding the select
        pre_context = content[max(0, idx-300):idx]
        print(f"Context before select:\n{pre_context}\n")
