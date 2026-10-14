import subprocess
import re

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
res = subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--dump-dom",
    "http://localhost:4173/"
], capture_output=True, text=True, encoding='utf-8')

hero_match = re.search(r'<section id="hero"[^>]*>([\s\S]*?)</section>', res.stdout)
if hero_match:
    full_html = hero_match.group(0)
    print("Full hero HTML length:", len(full_html))
    print(full_html)
