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
  const userDataDir = path.join('C:\\Users\\kaust\\AppData\\Local\\Temp', 'chrome-test-' + Date.now());
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
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  if (!wsUrl) {
    console.error('Failed to get wsUrl');
    chrome.kill();
    return;
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

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
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await new Promise((r) => setTimeout(r, 2500));

  fs.mkdirSync('scripts/inspection', { recursive: true });

  // 1. Capture desktop screenshot
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/baseline_desktop_1440.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved scripts/inspection/baseline_desktop_1440.png');

  // 2. Mobile viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 1000));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/baseline_mobile_390.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved scripts/inspection/baseline_mobile_390.png');

  ws.close();
  chrome.kill();
}

run().catch(console.error);
