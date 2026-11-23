import subprocess
import json
import re

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
base_url = "http://localhost:4173/"

# Run Chrome to evaluate element offsets
for w, label in [(1600, "desktop"), (390, "mobile_390"), (360, "mobile_360")]:
    html_snippet = f"""
    <!DOCTYPE html>
    <html><body>
    <iframe id="f" src="{base_url}" style="width:{w}px;height:12000px;border:none;"></iframe>
    <script>
      window.onload = () => {{
        setTimeout(() => {{
          const doc = document.getElementById('f').contentDocument;
          const secs = ['hero', 'about', 'flagship', 'projects', 'journey', 'skills', 'research', 'resume', 'contact'];
          const data = {{}};
          for (const s of secs) {{
            const el = doc.getElementById(s);
            if (el) {{
              data[s] = {{
                top: Math.round(el.offsetTop),
                height: Math.round(el.offsetHeight),
                bottom: Math.round(el.offsetTop + el.offsetHeight)
              }};
            }}
          }}
          console.log('SECTION_DATA_' + '{label}:' + JSON.stringify(data));
        }}, 1500);
      }};
    </script>
    </body></html>
    """
    temp_file = f"scripts/temp_{label}.html"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(html_snippet)

print("Coord generation templates ready.")
