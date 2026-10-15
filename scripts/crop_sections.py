from PIL import Image
import os

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"
full_desktop_path = os.path.join(out_dir, "full_page_desktop.png")

if os.path.exists(full_desktop_path):
    img = Image.open(full_desktop_path)
    w, h = img.size
    print(f"Full desktop size: {w}x{h}")

    # Crop section 1: About (y=900 to y=2000)
    about_crop = img.crop((0, 900, w, min(2100, h)))
    about_crop.save(os.path.join(out_dir, "section_about.png"))

    # Crop section 2: PhonePe (y=2100 to y=3500)
    phonepe_crop = img.crop((0, 2100, w, min(3600, h)))
    phonepe_crop.save(os.path.join(out_dir, "section_phonepe.png"))

    # Crop section 3: Projects (y=3600 to y=4800)
    projects_crop = img.crop((0, 3600, w, min(5000, h)))
    projects_crop.save(os.path.join(out_dir, "section_projects.png"))

    # Crop section 4: Journey & Skills (y=5000 to y=6000)
    journey_crop = img.crop((0, 5000, w, min(6000, h)))
    journey_crop.save(os.path.join(out_dir, "section_journey.png"))

    print("Crops created successfully.")
