import subprocess
import os
import time
import urllib.request

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"

# Wait up to 5 seconds for preview server
for i in range(10):
    try:
        resp = urllib.request.urlopen(base_url)
        if resp.status == 200:
            print("Preview server is reachable.")
            break
    except Exception as e:
        time.sleep(0.5)

# 1. Dump DOM
dom_res = subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--dump-dom",
    base_url
], capture_output=True)

import html
import sys

# Ensure UTF-8 output on Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

dom = html.unescape(dom_res.stdout.decode('utf-8', errors='replace'))
print("DOM length:", len(dom))

checks = [
    "Kaustubh K. Nandurkar",
    "Business Analytics",
    "& Research.",
    "Explore My Work",
    "Download Résumé",
    "(01)",
    "About & Analytical Manifesto",
    "Problem-Solving Methodology",
    "(02)",
    "Flagship Valuation",
    "33,432 Cr",
    "41,631 Cr",
    "821.78",
    "(03)",
    "Selected Case Studies",
    "(04)",
    "Professional Journey & Education",
    "Sports Data Analyst Intern",
    "Sandip University",
    "Kamla Nehru Mahavidyalaya",
    "(05)",
    "Skills & Verified Competencies",
    "(06)",
    "Research Library",
    "(07)",
    "Verified Curriculum Vitae",
    "(08)",
    "Direct Contact"
]

passed_count = 0
for c in checks:
    found = c in dom
    if found:
        passed_count += 1
    print(f"Check '{c}': {found}")

print(f"\nTotal DOM checks passed: {passed_count}/{len(checks)}")

# 2. Viewport Screenshots
viewports = [
    ("desktop_1600x900.png", "1600,900"),
    ("laptop_1366x768.png", "1366,768"),
    ("tablet_768x1024.png", "768,1024"),
    ("mobile_390x844.png", "390,844"),
    ("mobile_360x740.png", "360,740")
]

for filename, size in viewports:
    shot_path = os.path.join(r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts", filename)
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={size}",
        f"--screenshot={shot_path}",
        base_url
    ], capture_output=True)
    exists = os.path.exists(shot_path)
    file_size = os.path.getsize(shot_path) if exists else 0
    print(f"Screenshot {filename} ({size}): exists={exists}, size={file_size} bytes")
