import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

const cdpPort = 9223;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_net_test_'));

let chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chromePath)) {
  chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
}

const proc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
], { detached: false, stdio: 'ignore' });

async function run() {
  function getJson(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
  }

  let tabs = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 400));
    try { tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`); if (tabs && tabs.length) break; } catch (e) {}
  }
  if (!tabs) throw new Error(`Chrome remote debugging did not respond on port ${cdpPort}`);

  const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const callbacks = new Map();
  const requests = [];

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) { callbacks.get(msg.id)(msg.result); callbacks.delete(msg.id); }
    if (msg.method === 'Network.requestWillBeSent') {
      const url = msg.params.request.url;
      if (url.includes('/assets/')) {
        requests.push({
          url: url.split('/').pop(),
          type: msg.params.type
        });
      }
    }
  };

  function send(method, params = {}) {
    return new Promise(r => { const msgId = id++; callbacks.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }

  await send('Network.enable');
  await send('Page.enable');

  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('INITIAL_REQUESTS_HOMEPAGE:', JSON.stringify(requests, null, 2));

  // Now trigger modal open by navigating to ?project=stratos-governance
  requests.length = 0;
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?project=stratos-governance' });
  await new Promise(r => setTimeout(r, 2000));
  console.log('PROJECT_MODAL_REQUESTS:', JSON.stringify(requests, null, 2));

  ws.close();
  proc.kill();
}

run().catch(err => {
  console.error(err);
  try { proc.kill(); } catch (e) {}
  process.exit(1);
});

