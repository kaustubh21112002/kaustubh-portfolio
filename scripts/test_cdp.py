import asyncio
import json
import subprocess
import urllib.request
import os

out_dir = r"c:\Users\kaust\OneDrive\Desktop\portfolio\scripts"
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Launch Chrome with remote debugging
proc = subprocess.Popen([
    chrome_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--window-size=1600,900"
])

import time
time.sleep(2)

try:
    # Get WebSocket debugger URL
    resp = urllib.request.urlopen("http://localhost:9222/json/list")
    tabs = json.loads(resp.read().decode())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    print("Chrome debugger attached:", ws_url)
except Exception as e:
    print("Could not attach to Chrome:", e)
    proc.terminate()
