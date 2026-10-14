import os
import cv2
import numpy as np
from PIL import Image

def main():
    source_path = r"C:\Users\kaust\Downloads\Animated_character_tracking_cursor_2K_20261014115931_no_watermark.png"
    if not os.path.exists(source_path):
        # Fallback to user uploaded media
        source_path = r"C:\Users\kaust\.gemini\antigravity-ide\brain\e6cf731b-7630-4a1b-9bb3-f41463f6c861\.user_uploaded\media_1792001460358.png"

    print(f"Loading source asset from: {source_path}")
    source_img = Image.open(source_path).convert("RGB")
    w, h = source_img.size
    print(f"Source image size: {w}x{h}")

    cw = w / 3.0
    ch = h / 3.0

    # Extract 9 base cells:
    # 0,0: UP_LEFT   | 0,1: UP   | 0,2: UP_RIGHT
    # 1,0: LEFT      | 1,1: CTR  | 1,2: RIGHT
    # 2,0: DOWN_LEFT | 2,1: DOWN | 2,2: DOWN_RIGHT

    cells = {}
    for r in range(3):
        for c in range(3):
            x1 = int(round(c * cw))
            y1 = int(round(r * ch))
            x2 = int(round((c + 1) * cw))
            y2 = int(round((r + 1) * ch))
            cell_crop = source_img.crop((x1, y1, x2, y2))
            cells[(r, c)] = np.array(cell_crop)

    # Standardize dimensions to 916x512
    target_w, target_h = 916, 512
    for k in cells:
        cells[k] = cv2.resize(cells[k], (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

    # Measure exact background color
    # Sample top-left corner
    bg_sample = cells[(1, 1)][10:30, 10:30]
    avg_bg = np.mean(bg_sample, axis=(0, 1)).astype(int)
    hex_color = f"#{avg_bg[0]:02x}{avg_bg[1]:02x}{avg_bg[2]:02x}"
    print(f"Detected background color: RGB({avg_bg[0]}, {avg_bg[1]}, {avg_bg[2]}) -> {hex_color}")

    # Save center neutral frame
    os.makedirs("public/frames", exist_ok=True)
    center_img = Image.fromarray(cells[(1, 1)])
    center_img.save("public/frames/center.webp", "WEBP", quality=95)
    print("Saved public/frames/center.webp")

    # The 8 compass directions in circular clockwise order starting at RIGHT (0 rad):
    # 0: RIGHT (row 1, col 2)
    # 1: DOWN_RIGHT (row 2, col 2)
    # 2: DOWN (row 2, col 1)
    # 3: DOWN_LEFT (row 2, col 0)
    # 4: LEFT (row 1, col 0)
    # 5: UP_LEFT (row 0, col 0)
    # 6: UP (row 0, col 1)
    # 7: UP_RIGHT (row 0, col 2)
    compass_keys = [
        (1, 2),  # 0: RIGHT (0 deg)
        (2, 2),  # 1: DOWN_RIGHT (45 deg)
        (2, 1),  # 2: DOWN (90 deg)
        (2, 0),  # 3: DOWN_LEFT (135 deg)
        (1, 0),  # 4: LEFT (180 deg)
        (0, 0),  # 5: UP_LEFT (225 deg / -135 deg)
        (0, 1),  # 6: UP (270 deg / -90 deg)
        (0, 2),  # 7: UP_RIGHT (315 deg / -45 deg)
    ]

    key_images = [cells[k] for k in compass_keys]

    # Warp function using optical flow
    def warp_flow(img, flow):
        h, w = flow.shape[:2]
        flow_map = np.copy(flow)
        flow_map[:, :, 0] += np.arange(w)
        flow_map[:, :, 1] += np.arange(h)[:, np.newaxis]
        res = cv2.remap(img, flow_map.astype(np.float32), None, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        return res

    def morph_frames(img1, img2, alpha):
        if alpha <= 0.001:
            return img1
        if alpha >= 0.999:
            return img2

        # Convert to gray for flow
        g1 = cv2.cvtColor(img1, cv2.COLOR_RGB2GRAY)
        g2 = cv2.cvtColor(img2, cv2.COLOR_RGB2GRAY)

        # Downsample for fast robust optical flow
        scale = 0.5
        small_g1 = cv2.resize(g1, (0, 0), fx=scale, fy=scale)
        small_g2 = cv2.resize(g2, (0, 0), fx=scale, fy=scale)

        flow_fw_small = cv2.calcOpticalFlowFarneback(small_g1, small_g2, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        flow_bw_small = cv2.calcOpticalFlowFarneback(small_g2, small_g1, None, 0.5, 3, 15, 3, 5, 1.2, 0)

        flow_fw = cv2.resize(flow_fw_small, (img1.shape[1], img1.shape[0])) * (1.0 / scale)
        flow_bw = cv2.resize(flow_bw_small, (img1.shape[1], img1.shape[0])) * (1.0 / scale)

        warp1 = warp_flow(img1, flow_fw * alpha)
        warp2 = warp_flow(img2, flow_bw * (1.0 - alpha))

        morphed = cv2.addWeighted(warp1, 1.0 - alpha, warp2, alpha, 0)
        return morphed

    # Generate 64 frames (8 sectors * 8 frames per sector)
    total_frames = 64
    steps_per_sector = total_frames // 8  # 8

    frame_list = []
    print("Generating 64 smooth directional WebP frames...")
    for sector in range(8):
        img_start = key_images[sector]
        img_end = key_images[(sector + 1) % 8]

        for step in range(steps_per_sector):
            frame_idx = sector * steps_per_sector + step
            alpha = step / float(steps_per_sector)
            morphed = morph_frames(img_start, img_end, alpha)
            frame_list.append(morphed)

            # Save as WebP
            pil_frame = Image.fromarray(morphed)
            out_file = f"public/frames/frame_{frame_idx:03d}.webp"
            pil_frame.save(out_file, "WEBP", quality=95)

    print(f"Successfully generated {len(frame_list)} frames in public/frames/")

    # Generate character.mp4
    # The video will show full 360 rotation + transition to center neutral pose
    video_out = "public/character.mp4"
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    fps = 30
    writer = cv2.VideoWriter(video_out, fourcc, fps, (target_w, target_h))

    # 1. 360 degree rotation (64 frames)
    for frame in frame_list:
        bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        writer.write(bgr)

    # 2. Smooth transition from last frame (frame 63 -> center)
    center_bgr = cv2.cvtColor(cells[(1, 1)], cv2.COLOR_RGB2BGR)
    last_frame = frame_list[-1]
    for step in range(15):
        alpha = (step + 1) / 15.0
        m = morph_frames(last_frame, cells[(1, 1)], alpha)
        writer.write(cv2.cvtColor(m, cv2.COLOR_RGB2BGR))

    # 3. Hold on center neutral pose for 1.5 seconds (45 frames)
    for _ in range(45):
        writer.write(center_bgr)

    writer.release()
    print(f"Successfully saved {video_out} ({64 + 15 + 45} frames total, duration: {(64 + 15 + 45)/fps:.2f}s)")

if __name__ == "__main__":
    main()
