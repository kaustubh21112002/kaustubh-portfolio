import urllib.request
import re

req = urllib.request.urlopen('http://localhost:4173/')
html = req.read().decode('utf-8')

js_match = re.search(r'src="(/assets/[^"]+\.js)"', html)
if js_match:
    js_url = 'http://localhost:4173' + js_match.group(1)
    js_content = urllib.request.urlopen(js_url).read().decode('utf-8')
    print('Fetched JS bundle:', js_url, 'Size:', len(js_content))
    checks = [
        'Business Analytics & Research.',
        'Kaustubh K. Nandurkar',
        'Historical & Forecast Assumptions',
        '33,431.99',
        '41,631.22',
        '821.78',
        'PRESERVE',
        'Kaustubh_Nandurkar_Resume.pdf'
    ]
    for c in checks:
        print(f"Match '{c}':", c in js_content)
else:
    print('No JS bundle found in HTML')
