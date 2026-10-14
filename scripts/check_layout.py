import subprocess
import json

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

script = """
(() => {
  const hero = document.getElementById('hero');
  const h1 = document.querySelector('h1');
  const content = hero ? hero.querySelector('.relative.z-20') : null;
  const canvas = document.querySelector('canvas');
  
  return {
    hero: hero ? { top: hero.offsetTop, height: hero.offsetHeight } : null,
    h1: h1 ? { top: h1.offsetTop, height: h1.offsetHeight, text: h1.innerText } : null,
    content: content ? { top: content.offsetTop, height: content.offsetHeight } : null,
    canvas: canvas ? { top: canvas.offsetTop, height: canvas.offsetHeight } : null
  };
})()
"""

# Let's run chrome and print document layout
res = subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,900",
    "--run-all-compositor-stages-before-draw",
    "--dump-dom",
    "http://localhost:4173/"
], capture_output=True, text=True, encoding='utf-8')

print("Completed check")
