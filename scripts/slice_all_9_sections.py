import subprocess
import os
from PIL import Image

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection"
os.makedirs(out_dir, exist_ok=True)

# Capture desktop at 1600x15000
desk_full = os.path.join(out_dir, "desktop_15000.png")
subprocess.run([
    chrome, '--headless=new', '--disable-gpu',
    '--window-size=1600,15000',
    f'--screenshot={desk_full}',
    'http://localhost:4173/'
], capture_output=True)

print("Desktop 15000 captured:", os.path.exists(desk_full))

# Let's inspect where black borders or headers are
img = Image.open(desk_full)
print("Image size:", img.size)

# Let's find white/bright text or section breaks down the page
# We can crop 1200px chunks from 8000 to the bottom
for y in range(8000, img.height, 1000):
    c = img.crop((0, y, img.width, min(y + 1200, img.height)))
    p = os.path.join(out_dir, f"tail_{y}_{y+1200}.png")
    c.save(p)
    print(f"Saved {p}")
