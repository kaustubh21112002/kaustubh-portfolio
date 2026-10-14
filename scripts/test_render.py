import subprocess
import os
import html

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 1. Test dumping rendered DOM
result = subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--dump-dom",
    "http://localhost:4173/"
], capture_output=True)

dom_raw = result.stdout.decode('utf-8', errors='replace')
dom = html.unescape(dom_raw)

print(f"DOM return code: {result.returncode}")
print(f"Rendered DOM length: {len(dom_raw)}")

checks = [
    "Kaustubh K. Nandurkar",
    "Business Analytics & Research.",
    "PhonePe Pre-IPO Equity Valuation & DCF Model",
    "Selected Projects & Case Studies",
    "Research Library & Manuscripts",
    "About Kaustubh K. Nandurkar",
    "Resume & Professional Experience",
    "33,432 Cr",
    "41,631 Cr"
]

for c in checks:
    matched = c in dom
    print(f"Match: '{c}' -> {matched}")

# 2. Test capturing desktop screenshot
desktop_shot = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\desktop.png"
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,900",
    f"--screenshot={desktop_shot}",
    "http://localhost:4173/"
], capture_output=True)

# 3. Test capturing mobile screenshot
mobile_shot = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\mobile.png"
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=390,844",
    f"--screenshot={mobile_shot}",
    "http://localhost:4173/"
], capture_output=True)

print("Desktop screenshot exists:", os.path.exists(desktop_shot), f"size: {os.path.getsize(desktop_shot) if os.path.exists(desktop_shot) else 0}")
print("Mobile screenshot exists:", os.path.exists(mobile_shot), f"size: {os.path.getsize(mobile_shot) if os.path.exists(mobile_shot) else 0}")
