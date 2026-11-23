import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"
out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"

sections = [
    "hero",
    "about",
    "flagship",
    "projects",
    "journey",
    "skills",
    "research",
    "resume",
    "contact"
]

print("Starting section capture...")

for s in sections:
    url = f"{base_url}?section={s}"

    # Desktop 1600x900
    desk_file = os.path.join(out_dir, f"view_desk_{s}.png")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1600,900",
        "--virtual-time-budget=2000",
        f"--screenshot={desk_file}",
        url
    ], capture_output=True)

    # Mobile 390x844
    mob_file = os.path.join(out_dir, f"view_mob_{s}.png")
    subprocess.run([
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=390,844",
        "--virtual-time-budget=2000",
        f"--screenshot={mob_file}",
        url
    ], capture_output=True)

    d_size = os.path.getsize(desk_file) if os.path.exists(desk_file) else 0
    m_size = os.path.getsize(mob_file) if os.path.exists(mob_file) else 0
    print(f"[{s}] Desktop: {d_size} bytes | Mobile: {m_size} bytes")

print("Section capture completed.")
