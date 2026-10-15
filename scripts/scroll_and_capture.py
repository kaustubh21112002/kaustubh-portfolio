import urllib.request
import json
import base64
import os
import time

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"

# Check if Chrome is listening on 9222
try:
    resp = urllib.request.urlopen("http://localhost:9222/json/list")
    tabs = json.loads(resp.read().decode())
    target_tab = tabs[0]
    ws_url = target_tab["webSocketDebuggerUrl"]
    print("Found active tab:", target_tab["id"])
except Exception as e:
    print("Chrome 9222 not reachable:", e)
    # Start Chrome with remote debugging
    import subprocess
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    subprocess.Popen([
        chrome_path,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--disable-gpu",
        "--window-size=1600,900"
    ])
    time.sleep(2)
    resp = urllib.request.urlopen("http://localhost:9222/json/list")
    tabs = json.loads(resp.read().decode())
    target_tab = tabs[0]
    ws_url = target_tab["webSocketDebuggerUrl"]

# Use simple websocket client to send scroll and screenshot commands
import asyncio
import websockets

async def capture_all_sections():
    async with websockets.connect(ws_url) as ws:
        # Navigate to preview URL
        await ws.send(json.dumps({
            "id": 1,
            "method": "Page.navigate",
            "params": {"url": "http://localhost:4173/"}
        }))
        await ws.recv()
        await asyncio.sleep(2)

        sections = [
            ("hero", "window.scrollTo(0, 0)"),
            ("about", "document.getElementById('about')?.scrollIntoView()"),
            ("flagship", "document.getElementById('flagship')?.scrollIntoView()"),
            ("projects", "document.getElementById('projects')?.scrollIntoView()"),
            ("journey", "document.getElementById('journey')?.scrollIntoView()"),
            ("skills", "document.getElementById('skills')?.scrollIntoView()"),
            ("research", "document.getElementById('research')?.scrollIntoView()"),
            ("contact", "document.getElementById('contact')?.scrollIntoView()")
        ]

        for idx, (name, scroll_cmd) in enumerate(sections, start=2):
            await ws.send(json.dumps({
                "id": idx * 10,
                "method": "Runtime.evaluate",
                "params": {"expression": scroll_cmd}
            }))
            await ws.recv()
            await asyncio.sleep(0.8)

            # Capture screenshot
            await ws.send(json.dumps({
                "id": idx * 10 + 1,
                "method": "Page.captureScreenshot",
                "params": {"format": "png"}
            }))
            res = json.loads(await ws.recv())
            if "result" in res and "data" in res["result"]:
                img_data = base64.b64decode(res["result"]["data"])
                path = os.path.join(out_dir, f"section_view_{name}.png")
                with open(path, "wb") as f:
                    f.write(img_data)
                print(f"Captured {name}: {len(img_data)} bytes")

asyncio.run(capture_all_sections())
