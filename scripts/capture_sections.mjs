import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function findFreePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

async function run() {
  const port = await findFreePort();
  const userDataDir = path.join('C:\\Users\\kaust\\AppData\\Local\\Temp', 'chrome-sections-' + Date.now());
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await res.json();
      const page = tabs.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 200));
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => { ws.onopen = resolve; });

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
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await new Promise((r) => setTimeout(r, 2500));

  // Scroll to telemetry & about
  await send('Runtime.evaluate', { expression: `document.querySelector('section[aria-label="Quantitative Evidence Telemetry"]')?.scrollIntoView()` });
  await new Promise(r => setTimeout(r, 800));
  const shotTelemetry = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/baseline_telemetry_desktop.png', Buffer.from(shotTelemetry.data, 'base64'));

  // Mobile drawer test
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
  await new Promise(r => setTimeout(r, 500));
  // Open mobile menu
  await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="Open navigation menu"]')?.click()` });
  await new Promise(r => setTimeout(r, 800));
  const shotDrawer = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/baseline_mobile_drawer.png', Buffer.from(shotDrawer.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Saved baseline_telemetry_desktop.png and baseline_mobile_drawer.png');
}

run().catch(console.error);
