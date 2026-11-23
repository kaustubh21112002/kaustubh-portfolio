import subprocess
import json

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
res = subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--dump-dom', 'http://localhost:4173/'
], capture_output=True)

out = res.stdout
print("DOM bytes length:", len(out))

ids = ['hero', 'about', 'flagship', 'projects', 'journey', 'skills', 'research', 'resume', 'contact']
for i in ids:
    needle = f'id="{i}"'.encode()
    print(f"Has id='{i}':", needle in out)
