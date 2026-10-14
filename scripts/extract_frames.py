"""
OpenCV Video Inspector and Frame Extractor
Inspects public/character.mp4 timeline, frame counts, FPS, and extracts frames.
"""
import os
import cv2
import numpy as np
from PIL import Image

def inspect_and_extract(video_path="public/character.mp4", output_dir="public/frames"):
    if not os.path.exists(video_path):
        print(f"Error: {video_path} does not exist.")
        return

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0

    print("==================================================")
    print("      OPENCV CHARACTER VIDEO INSPECTION REPORT    ")
    print("==================================================")
    print(f"Video file:     {video_path}")
    print(f"Resolution:     {width}x{height}")
    print(f"Total frames:   {total_frames}")
    print(f"Frame Rate:     {fps:.2f} FPS")
    print(f"Duration:       {duration:.2f} seconds")
    print("--------------------------------------------------")

    # Compass directions along 360 rotation (64 rotation frames):
    # 0 deg: RIGHT -> Frame 0
    # 45 deg: DOWN_RIGHT -> Frame 8
    # 90 deg: DOWN -> Frame 16
    # 135 deg: DOWN_LEFT -> Frame 24
    # 180 deg: LEFT -> Frame 32
    # 225 deg: UP_LEFT -> Frame 40
    # 270 deg: UP -> Frame 48
    # 315 deg: UP_RIGHT -> Frame 56
    # Neutral CENTER -> Frame (total_frames - 10)

    compass_map = {
        "RIGHT (0 deg)": 0,
        "DOWN_RIGHT (45 deg)": 8,
        "DOWN (90 deg)": 16,
        "DOWN_LEFT (135 deg)": 24,
        "LEFT (180 deg)": 32,
        "UP_LEFT (225 deg / -135 deg)": 40,
        "UP (270 deg / -90 deg)": 48,
        "UP_RIGHT (315 deg / -45 deg)": 56,
        "CENTER (Neutral Eye-Contact)": min(total_frames - 10, total_frames - 1),
    }

    print("Key Directional Frames Mapping:")
    for direction, frame_num in compass_map.items():
        print(f"  * {direction:30s} -> Frame #{frame_num:03d}")

    os.makedirs(output_dir, exist_ok=True)

    # Sample background color from frame 0
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    ret, f0 = cap.read()
    if ret:
        corner = f0[10:30, 10:30]
        bg_bgr = np.mean(corner, axis=(0, 1)).astype(int)
        bg_rgb = (int(bg_bgr[2]), int(bg_bgr[1]), int(bg_bgr[0]))
        hex_color = f"#{bg_rgb[0]:02x}{bg_rgb[1]:02x}{bg_rgb[2]:02x}"
        print("--------------------------------------------------")
        print(f"Detected Background Color: RGB{bg_rgb} / Hex: {hex_color}")
        print("--------------------------------------------------")

    # Read and save 64 rotation frames
    print("Extracting 64 circular frames (~5.6 deg step) into WebP...")
    for i in range(min(64, total_frames)):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            im = Image.fromarray(rgb)
            im.save(os.path.join(output_dir, f"frame_{i:03d}.webp"), "WEBP", quality=95)

    # Save center neutral frame
    center_frame_no = compass_map["CENTER (Neutral Eye-Contact)"]
    cap.set(cv2.CAP_PROP_POS_FRAMES, center_frame_no)
    ret, frame = cap.read()
    if ret:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        im = Image.fromarray(rgb)
        im.save(os.path.join(output_dir, "center.webp"), "WEBP", quality=95)
        print("Extracted center neutral eye contact frame: public/frames/center.webp")

    cap.release()
    print("Frame extraction and inspection complete.")

if __name__ == "__main__":
    inspect_and_extract()
