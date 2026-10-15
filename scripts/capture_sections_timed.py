import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"
out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"

anchors = [
    ("about", "#about"),
    ("flagship", "#flagship"),
    ("projects", "#projects"),
    ("journey", "#journey"),
    ("skills", "#skills"),
    ("contact", "#contact")
]

for name, anchor in anchors:
    shot = os.path.join(out_dir, f"section_{name}.png")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1600,900",
        "--virtual-time-budget=2000",
        f"--screenshot={shot}",
        f"{base_url}{anchor}"
    ], capture_output=True)
    print(f"Captured section_{name}.png: size={os.path.getsize(shot) if os.path.exists(shot) else 0}")
