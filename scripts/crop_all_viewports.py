from PIL import Image
import os

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection"
desk_path = os.path.join(out_dir, "full_desktop_1600.png")
mob_path = os.path.join(out_dir, "full_mobile_390.png")
mob360_path = os.path.join(out_dir, "full_mobile_360.png")

# DESKTOP CROPS (1600 width)
if os.path.exists(desk_path):
    img = Image.open(desk_path)
    w, h = img.size
    print(f"Cropping desktop ({w}x{h})...")
    
    sections = [
        ("01_hero", 0, 900),
        ("02_about", 900, 2100),
        ("03_phonepe", 2100, 3650),
        ("04_projects", 3650, 5000),
        ("05_journey", 5000, 6200),
        ("06_skills", 6200, 7200),
        ("07_research", 7200, 8100),
        ("08_resume", 8100, 8900),
        ("09_contact", 8900, min(9500, h))
    ]
    
    for name, top, bottom in sections:
        crop = img.crop((0, top, w, min(bottom, h)))
        save_path = os.path.join(out_dir, f"desktop_{name}.png")
        crop.save(save_path)
        print(f"Saved {save_path} ({w}x{bottom-top})")

# MOBILE 390 CROPS
if os.path.exists(mob_path):
    img = Image.open(mob_path)
    w, h = img.size
    print(f"\nCropping mobile 390 ({w}x{h})...")
    
    # On mobile, content is more vertical:
    # 01_hero: 0 - 850
    # 02_about: 850 - 2700
    # 03_phonepe: 2700 - 5200
    # 04_projects: 5200 - 8000
    # 05_journey: 8000 - 10000
    # 06_skills: 10000 - 12000
    # 07_research: 12000 - 13800
    # 08_resume: 13800 - 15000
    # 09_contact: 15000 - 16000
    mob_sections = [
        ("01_hero", 0, 850),
        ("02_about", 850, 2700),
        ("03_phonepe", 2700, 5200),
        ("04_projects", 5200, 8000),
        ("05_journey", 8000, 10000),
        ("06_skills", 10000, 12000),
        ("07_research", 12000, 13800),
        ("08_resume", 13800, 15000),
        ("09_contact", 15000, min(16000, h))
    ]
    
    for name, top, bottom in mob_sections:
        crop = img.crop((0, top, w, min(bottom, h)))
        save_path = os.path.join(out_dir, f"mobile_390_{name}.png")
        crop.save(save_path)
        print(f"Saved {save_path} ({w}x{bottom-top})")

# NARROW MOBILE 360 CROPS
if os.path.exists(mob360_path):
    img = Image.open(mob360_path)
    w, h = img.size
    print(f"\nCropping mobile 360 ({w}x{h})...")
    
    for name, top, bottom in mob_sections:
        crop = img.crop((0, top, w, min(bottom, h)))
        save_path = os.path.join(out_dir, f"mobile_360_{name}.png")
        crop.save(save_path)
        print(f"Saved {save_path} ({w}x{bottom-top})")

print("\nAll section crops generated successfully.")
