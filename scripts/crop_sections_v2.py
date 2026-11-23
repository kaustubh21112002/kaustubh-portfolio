from PIL import Image
import os

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts\inspection"
desk_path = os.path.join(out_dir, "complete_desktop.png")
mob_path = os.path.join(out_dir, "complete_mobile.png")
mob360_path = os.path.join(out_dir, "complete_mobile_360.png")

# DESKTOP CROPS
if os.path.exists(desk_path):
    img = Image.open(desk_path)
    w, h = img.size
    print(f"Desktop size: {w}x{h}")

    desk_sections = [
        ("01_hero", 0, 1080),
        ("02_about", 1080, 2050),
        ("03_phonepe", 2050, 3250),
        ("04_projects", 3250, 4550),
        ("05_journey", 4550, 5700),
        ("06_skills", 5700, 6600),
        ("07_research", 6600, 7400),
        ("08_resume", 7400, 8000),
        ("09_contact", 8000, min(8500, h))
    ]

    for name, top, bottom in desk_sections:
        c = img.crop((0, top, w, min(bottom, h)))
        p = os.path.join(out_dir, f"section_desktop_{name}.png")
        c.save(p)
        print(f"Saved {p}")

# MOBILE 390 CROPS
if os.path.exists(mob_path):
    img = Image.open(mob_path)
    w, h = img.size
    print(f"\nMobile size: {w}x{h}")

    mob_sections = [
        ("01_hero", 0, 850),
        ("02_about", 850, 2400),
        ("03_phonepe", 2400, 4700),
        ("04_projects", 4700, 7300),
        ("05_journey", 7300, 9300),
        ("06_skills", 9300, 11000),
        ("07_research", 11000, 12300),
        ("08_resume", 12300, 13200),
        ("09_contact", 13200, min(14000, h))
    ]

    for name, top, bottom in mob_sections:
        c = img.crop((0, top, w, min(bottom, h)))
        p = os.path.join(out_dir, f"section_mobile_390_{name}.png")
        c.save(p)
        print(f"Saved {p}")

# NARROW MOBILE 360 CROPS
if os.path.exists(mob360_path):
    img = Image.open(mob360_path)
    w, h = img.size
    print(f"\nNarrow mobile size: {w}x{h}")

    for name, top, bottom in mob_sections:
        c = img.crop((0, top, w, min(bottom, h)))
        p = os.path.join(out_dir, f"section_mobile_360_{name}.png")
        c.save(p)
        print(f"Saved {p}")

print("\nAll 9 section images cropped successfully!")
