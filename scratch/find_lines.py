import re

filepath = r"c:\Users\Sajad\Desktop\SaSLoop\pos-app\src\App.jsx"
queries = ["isTabAllowed", "handleLogin", "isModuleAllowed", "pos_profile", "getDashboardAccess", "pos_token", "Settings", "settingsButton", "sidebarSettings", "ACCESS LEVEL", "Printers", "Shortcuts", "general"]

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for query in queries:
    print(f"=== Matches for '{query}' ===")
    matches = 0
    for idx, line in enumerate(lines):
        if query.lower() in line.lower():
            print(f"{idx+1}: {line.strip()[:100]}")
            matches += 1
            if matches >= 15:
                print("... (truncated)")
                break
