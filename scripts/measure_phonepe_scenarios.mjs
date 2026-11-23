import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

const cdpPort = 9225;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_phonepe_test_'));

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

  function send(method, params = {}) {
    return new Promise(r => { const msgId = id++; callbacks.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }

  const networkLog = [];
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) { callbacks.get(msg.id)(msg.result); callbacks.delete(msg.id); }
    if (msg.method === 'Network.responseReceived') {
      const url = msg.params.response.url;
      if (url.includes('/assets/')) {
        networkLog.push({
          url: url.split('/').pop(),
          status: msg.params.response.status,
          mimeType: msg.params.response.mimeType,
          encodedDataLength: msg.params.response.encodedDataLength,
          timestamp: msg.params.timestamp
        });
      }
    }
  };

  await send('Network.enable');
  await send('Page.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  // Scenario A: Fresh Homepage Load without Scrolling
  console.log('--- SCENARIO A: Fresh Homepage Load without Scrolling ---');
  networkLog.length = 0;
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await new Promise(r => setTimeout(r, 2000));
  const scenarioA = [...networkLog];
  console.log('SCENARIO_A_CHUNKS:', JSON.stringify(scenarioA, null, 2));

  // Scenario B: Homepage after scrolling to the PhonePe section
  console.log('--- SCENARIO B: Scrolling down to #flagship ---');
  networkLog.length = 0;
  await send('Runtime.evaluate', {
    expression: `document.getElementById('flagship').scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 1500));
  const scenarioB = [...networkLog];
  console.log('SCENARIO_B_CHUNKS:', JSON.stringify(scenarioB, null, 2));

  // Scenario C: Direct navigation to PhonePe deep link
  console.log('--- SCENARIO C: Direct Navigation to ?project=phonepe-valuation ---');
  networkLog.length = 0;
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?project=phonepe-valuation' });
  await new Promise(r => setTimeout(r, 2000));
  const scenarioC = [...networkLog];
  console.log('SCENARIO_C_CHUNKS:', JSON.stringify(scenarioC, null, 2));

  ws.close();
  proc.kill();
}

run().catch(err => {
  console.error(err);
  try { proc.kill(); } catch (e) {}
  process.exit(1);
});

