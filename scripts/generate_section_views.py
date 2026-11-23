import subprocess
import os
import sys
from PIL import Image

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"
out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection"
os.makedirs(out_dir, exist_ok=True)

# 1. Desktop full (1600x9500)
subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--window-size=1600,9500',
    f'--screenshot={os.path.join(out_dir, "full_desktop_1600.png")}',
    base_url
], capture_output=True)

# 2. Mobile full (390x16000)
subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--window-size=390,16000',
    f'--screenshot={os.path.join(out_dir, "full_mobile_390.png")}',
    base_url
], capture_output=True)

# 3. Narrow Mobile full (360x16000)
subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--window-size=360,16000',
    f'--screenshot={os.path.join(out_dir, "full_mobile_360.png")}',
    base_url
], capture_output=True)

print("Screenshots taken.")
for fname in ["full_desktop_1600.png", "full_mobile_390.png", "full_mobile_360.png"]:
    p = os.path.join(out_dir, fname)
    if os.path.exists(p):
        img = Image.open(p)
        print(f"{fname}: {img.size}, bytes: {os.path.getsize(p)}")
