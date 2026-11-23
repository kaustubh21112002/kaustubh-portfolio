import subprocess
import os
import time
import urllib.request
import html
import sys

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"

print("=" * 60)
print("PHASE 1 VERIFICATION & VISUAL AUDIT")
print("=" * 60)

# Check preview server connectivity
for i in range(10):
    try:
        resp = urllib.request.urlopen(base_url)
        if resp.status == 200:
            print("Preview server is reachable at http://localhost:4173/")
            break
    except Exception as e:
        time.sleep(0.5)

# 1. Capture DOM
dom_res = subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--dump-dom",
    base_url
], capture_output=True)

dom = html.unescape(dom_res.stdout.decode('utf-8', errors='replace'))
print(f"Captured DOM length: {len(dom)} characters")

# 2. Check for required Phase 1 features in DOM
feature_checks = [
    ("Skip-to-Content Link", 'Skip to main content'),
    ("Main Content Landmark", 'id="main-content"'),
    ("Theme Toggle Radiogroup", 'aria-label="Color theme selection"'),
    ("Theme Toggle Light", 'aria-label="Light theme"'),
    ("Theme Toggle Dark", 'aria-label="Dark theme"'),
    ("Theme Toggle System", 'aria-label="System theme"'),
    ("Back-to-Top Button", 'aria-label="Scroll back to top of page"'),
    ("Quick Search Hotkey / Button", 'aria-label="Search portfolio projects and skills (Ctrl+K)"'),
    ("Recruiter FAQ Section", 'id="faq"'),
    ("Recruiter FAQ Role Query", 'What specific roles and opportunities is Kaustubh targeting?'),
    ("Recruiter FAQ PhonePe Query", 'How was the PhonePe Pre-IPO valuation model constructed and audited?'),
    ("Recruiter FAQ STRATOS Query", 'What is the STRATOS data quality framework and why does DQ-10 remain in review?'),
    ("Recruiter FAQ Evidence Query", 'How can hiring teams verify the underlying analytical models and workbooks?'),
    ("Recruiter FAQ Stack Query", 'What technical tools and frameworks are demonstrated across this portfolio?'),
    ("Hero Quick Email Copy Button", 'aria-label="Copy email address"')
]

print("\n--- DOM FEATURE CHECKS ---")
passed_dom = 0
for name, query in feature_checks:
    found = query in dom
    if found:
        passed_dom += 1
        print(f"  [PASS] {name}")
    else:
        print(f"  [FAIL] {name} (query: '{query[:40]}...')")

print(f"\nDOM feature check summary: {passed_dom}/{len(feature_checks)} passed.")

# 3. Viewport Screenshots
os.makedirs(r"C:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection", exist_ok=True)
viewports = [
    ("phase1_desktop_1440x900.png", "1440,900"),
    ("phase1_mobile_390x844.png", "390,844")
]

print("\n--- VIEWPORT SCREENSHOT CAPTURES ---")
for filename, size in viewports:
    shot_path = os.path.join(r"C:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection", filename)
    res = subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={size}",
        f"--screenshot={shot_path}",
        base_url
    ], capture_output=True)
    exists = os.path.exists(shot_path)
    file_size = os.path.getsize(shot_path) if exists else 0
    print(f"  Captured {filename} ({size}): exists={exists}, size={file_size} bytes")

print("\nVerification execution complete.")
