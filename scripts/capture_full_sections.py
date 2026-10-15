import subprocess
import os
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"
out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"

sections = [
    ("about", "#about"),
    ("flagship", "#flagship"),
    ("projects", "#projects"),
    ("journey", "#journey"),
    ("skills", "#skills"),
    ("research", "#research"),
    ("resume", "#resume"),
    ("contact", "#contact")
]

# Capture desktop full page
full_desktop = os.path.join(out_dir, "full_page_desktop.png")
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1600,6000",
    f"--screenshot={full_desktop}",
    base_url
], capture_output=True)

# Capture mobile full page
full_mobile = os.path.join(out_dir, "full_page_mobile.png")
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=390,9000",
    f"--screenshot={full_mobile}",
    base_url
], capture_output=True)

print("Full desktop captured:", os.path.exists(full_desktop))
print("Full mobile captured:", os.path.exists(full_mobile))
