import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"

# 1. Desktop 1600x900
desktop_shot = os.path.join(out_dir, "fresh_desktop_1600x900.png")
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1600,900",
    f"--screenshot={desktop_shot}",
    base_url
], capture_output=True)

# 2. Mobile 390x844
mobile_shot = os.path.join(out_dir, "fresh_mobile_390x844.png")
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=390,844",
    f"--screenshot={mobile_shot}",
    base_url
], capture_output=True)

print(f"Desktop screenshot: {os.path.exists(desktop_shot)}, size: {os.path.getsize(desktop_shot) if os.path.exists(desktop_shot) else 0}")
print(f"Mobile screenshot: {os.path.exists(mobile_shot)}, size: {os.path.getsize(mobile_shot) if os.path.exists(mobile_shot) else 0}")
