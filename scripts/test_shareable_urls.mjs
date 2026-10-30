import http from 'http';
import net from 'net';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

const CANONICAL_PROJECTS = [
  { id: 'phonepe-valuation', expectedTitle: 'PhonePe Pre-IPO Equity Research & Valuation' },
  { id: 'stratos-governance', expectedTitle: 'STRATOS AI | Controlled Business Analytics & KPI Governance' },
  { id: 'spiideo-sports-analytics', expectedTitle: 'Sports Match Event Tracking & Video Analytics' },
  { id: 'it-support-analytics', expectedTitle: 'IT Support Service Intelligence & Resolution Prediction' },
  { id: 'smartbank-360', expectedTitle: 'SmartBank 360 – FinTech Business Model Credibility Report' },
  { id: 'equitrack-analytics-os', expectedTitle: 'EquiTrack Analytics OS — Financial News Intelligence & Data Governance' }
];

function resolveChromePath() {
  if (process.env.CHROME_BIN) {
    if (fs.existsSync(process.env.CHROME_BIN)) {
      return process.env.CHROME_BIN;
    }
    throw new Error(`Configured CHROME_BIN does not exist: ${process.env.CHROME_BIN}`);
  }
  const platform = os.platform();
  const candidates = [];
  if (platform === 'win32') {
    candidates.push(
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    );
  } else if (platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser'
    );
  }

  for (const c of candidates) {
    if (c && fs.existsSync(c)) {
      return c;
    }
  }

  throw new Error(
    'Chrome executable not found. Please install Chrome or set the CHROME_BIN environment variable.'
  );
}

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function runDirectUrlAndNavTests() {
  const cdpPort = parseInt(process.env.CDP_PORT || '9248', 10);
  const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
  const chromePath = resolveChromePath();

  const isAvailable = await checkPortAvailable(cdpPort);
  if (!isAvailable) {
    throw new Error(`Port ${cdpPort} is already in use. Please terminate conflicting processes or specify CDP_PORT.`);
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_url_test_'));
  let proc = null;
  let ws = null;

  try {
    proc = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank'
    ], { detached: false, stdio: 'ignore' });

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
    ws = new WebSocket(targetTab.webSocketDebuggerUrl);
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

    const results = {
      canonicalUrls: [],
      invalidFallback: null,
      nextPrevNav: null,
      historyBackForward: null,
      consoleErrors
    };

    // 1. Test Direct Deep Link for all 6 projects
    for (const proj of CANONICAL_PROJECTS) {
      const url = `${baseUrl}/?project=${proj.id}`;
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 1000));

      const check = await send('Runtime.evaluate', {
        expression: `(() => {
          const modalTitle = document.querySelector('#case-study-title')?.textContent?.trim() || null;
          const shareBtn = document.querySelector('button[title*="Copy link"]');
          const prevBtn = document.querySelector('button[aria-label*="Navigate to previous project"]');
          const nextBtn = document.querySelector('button[aria-label*="Navigate to next project"]');
          return {
            modalOpen: !!modalTitle,
            titleText: modalTitle,
            hasShareBtn: !!shareBtn,
            hasPrevBtn: !!prevBtn,
            hasNextBtn: !!nextBtn
          };
        })()`,
        returnByValue: true
      });
      results.canonicalUrls.push({
        id: proj.id,
        url,
        matchesExpected: check.result.value?.titleText === proj.expectedTitle,
        details: check.result.value
      });
    }

    // 2. Test Invalid Project ID Fallback
    await send('Page.navigate', { url: `${baseUrl}/?project=unknown-fake-id-12345` });
    await new Promise(r => setTimeout(r, 1000));
    const invalidCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modalTitle = document.querySelector('#case-study-title');
        const summaryModal = document.querySelector('#summary-modal-title');
        const hero = document.querySelector('#hero');
        return {
          modalOpen: !!modalTitle,
          summaryModalOpen: !!summaryModal,
          heroRendered: !!hero
        };
      })()`,
      returnByValue: true
    });
    results.invalidFallback = invalidCheck.result.value;

    // 3. Test Next / Prev Navigation inside Case Study Modal
    // Open PhonePe first (index 0)
    await send('Page.navigate', { url: `${baseUrl}/?project=phonepe-valuation` });
    await new Promise(r => setTimeout(r, 1000));

    const navTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('button[aria-label*="Navigate to next project"]');
        if (!nextBtn) return { error: 'Next button not found' };
        nextBtn.click();
        return { clickedNext: true };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 600));

    const afterNextCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('#case-study-title')?.textContent?.trim();
        const currentUrl = window.location.search;
        return { title, currentUrl };
      })()`,
      returnByValue: true
    });

    // Now test browser Back button
    await send('Runtime.evaluate', { expression: `window.history.back()` });
    await new Promise(r => setTimeout(r, 600));

    const afterBackCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('#case-study-title')?.textContent?.trim();
        const currentUrl = window.location.search;
        return { title, currentUrl };
      })()`,
      returnByValue: true
    });

    results.nextPrevNav = {
      afterNext: afterNextCheck.result.value,
      afterBack: afterBackCheck.result.value
    };

    console.log('SHAREABLE_URL_TEST_REPORT:\n', JSON.stringify(results, null, 2));
  } finally {
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    if (proc) {
      try { proc.kill(); } catch (e) {}
    }
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

runDirectUrlAndNavTests().catch(err => {
  console.error('Shareable URLs test error:', err);
  process.exit(1);
});
