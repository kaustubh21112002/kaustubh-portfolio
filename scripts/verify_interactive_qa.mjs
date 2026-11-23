import http from 'http';
import { exec } from 'child_process';

async function testInteractions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = exec(`"${chromePath}" --headless=new --remote-debugging-port=9227 --disable-gpu http://127.0.0.1:4173`);
  
  await new Promise(r => setTimeout(r, 2000));

  function getJson(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const tabs = await getJson('http://127.0.0.1:9227/json');
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173'));
  if (!targetTab) throw new Error('Target tab not found');

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(resolve => { ws.onopen = resolve; });

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result);
      callbacks.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');

  // Mobile emulation
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  const tapTargets = await send('Runtime.evaluate', {
    expression: `(() => {
      const heroExplore = document.querySelector('a[href="#projects"]');
      const heroResume = document.querySelector('a[href*="Resume"]');
      const mobileMenuBtn = document.querySelector('button[aria-label="Open navigation menu"]');
      const copyBtn = document.querySelector('button[aria-label="Copy email address"]');
      const sendEmailBtn = document.querySelector('a[href^="mailto:"]');
      
      const getRect = (el) => el ? { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;
      
      return {
        heroExplore: getRect(heroExplore),
        heroResume: getRect(heroResume),
        mobileMenuBtn: getRect(mobileMenuBtn),
        copyBtn: getRect(copyBtn),
        sendEmailBtn: getRect(sendEmailBtn)
      };
    })()`,
    returnByValue: true
  });

  console.log('Mobile tap dimensions:', JSON.stringify(tapTargets.result.value, null, 2));

  // Open Drawer
  const openDrawer = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Open navigation menu"]');
      if (btn) btn.click();
      return !!btn;
    })()`,
    returnByValue: true
  });
  console.log('Drawer opened:', openDrawer.result.value);

  await new Promise(r => setTimeout(r, 400));

  const drawerLinks = await send('Runtime.evaluate', {
    expression: `(() => {
      return Array.from(document.querySelectorAll('#mobile-navigation a')).map(a => ({
        label: a.textContent.trim(),
        w: Math.round(a.getBoundingClientRect().width),
        h: Math.round(a.getBoundingClientRect().height)
      }));
    })()`,
    returnByValue: true
  });
  console.log('Drawer links measured:', JSON.stringify(drawerLinks.result.value, null, 2));

  // Close Drawer
  const closeDrawer = await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[aria-label="Close navigation menu"]');
      if (closeBtn) closeBtn.click();
      return !!closeBtn;
    })()`,
    returnByValue: true
  });
  console.log('Drawer closed successfully:', closeDrawer.result.value);

  ws.close();
  proc.kill();
}

testInteractions().catch(console.error);
