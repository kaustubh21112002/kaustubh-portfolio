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
    ("resume", "#resume"),
    ("contact", "#contact")
]

for name, anchor in anchors:
    # Desktop
    shot_desk = os.path.join(out_dir, f"anchor_desk_{name}.png")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1600,900",
        f"--screenshot={shot_desk}",
        f"{base_url}{anchor}"
    ], capture_output=True)

    # Mobile
    shot_mob = os.path.join(out_dir, f"anchor_mob_{name}.png")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=390,844",
        f"--screenshot={shot_mob}",
        f"{base_url}{anchor}"
    ], capture_output=True)

print("Anchor screenshots captured.")
