import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

const viewports = [
  { width: 375, height: 667, name: '375_iPhoneSE' },
  { width: 430, height: 932, name: '430_iPhone14ProMax' },
  { width: 768, height: 1024, name: '768_iPad' },
  { width: 1024, height: 768, name: '1024_iPadLandscape' },
  { width: 1440, height: 900, name: '1440_Desktop' }
];

const cdpPort = 9224;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_viewports_'));

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
  const consoleErrors = [];

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) { callbacks.get(msg.id)(msg.result); callbacks.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
  };

  function send(method, params = {}) {
    return new Promise(r => { const msgId = id++; callbacks.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const auditResults = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
    await new Promise(r => setTimeout(r, 1500));

    const evalResult = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        hasHero: !!document.getElementById('hero'),
        hasFlagship: !!document.getElementById('flagship'),
        hasProjects: !!document.getElementById('projects'),
        bodyWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth
      })`,
      returnByValue: true
    });

    auditResults.push({
      viewport: vp,
      metrics: evalResult.result.value
    });
  }

  console.log('VIEWPORT_AUDIT_REPORT:', JSON.stringify({ auditResults, consoleErrors }, null, 2));

  ws.close();
  proc.kill();
}

run().catch(err => {
  console.error(err);
  try { proc.kill(); } catch (e) {}
  process.exit(1);
});

