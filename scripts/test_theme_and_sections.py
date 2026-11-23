import subprocess
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_dir = r"C:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection"
os.makedirs(out_dir, exist_ok=True)

targets = [
    ("light_desk_hero.png", "1440,900", "http://localhost:4173/?theme=light"),
    ("dark_desk_hero.png", "1440,900", "http://localhost:4173/?theme=dark"),
    ("light_mob_hero.png", "390,844", "http://localhost:4173/?theme=light"),
    ("dark_mob_hero.png", "390,844", "http://localhost:4173/?theme=dark"),
    ("light_desk_faq.png", "1440,900", "http://localhost:4173/?theme=light&section=faq"),
    ("light_desk_about.png", "1440,900", "http://localhost:4173/?theme=light&section=about"),
    ("light_desk_flagship.png", "1440,900", "http://localhost:4173/?theme=light&section=flagship")
]

print("Executing automated Chrome headless captures...")
for filename, size, url in targets:
    shot_path = os.path.join(out_dir, filename)
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={size}",
        f"--screenshot={shot_path}",
        url
    ], capture_output=True)
    exists = os.path.exists(shot_path)
    file_size = os.path.getsize(shot_path) if exists else 0
    print(f"Captured {filename}: exists={exists}, size={file_size} bytes")

print("Captures completed.")
