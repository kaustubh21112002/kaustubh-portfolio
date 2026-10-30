import http from 'http';
import net from 'net';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

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

async function targetedCdpAudit() {
  const cdpPort = parseInt(process.env.CDP_PORT || '9235', 10);
  const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/';
  const chromePath = resolveChromePath();

  const isAvailable = await checkPortAvailable(cdpPort);
  if (!isAvailable) {
    throw new Error(`Port ${cdpPort} is already in use. Please terminate conflicting processes or specify CDP_PORT.`);
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_targeted_'));
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
      baseUrl
    ], { detached: false, stdio: 'ignore' });

    function getJson(url) {
      return new Promise((resolve, reject) => {
        http.get(url, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
    }

    // Poll for debugger readiness
    let tabs = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
        if (tabs && tabs.length > 0) break;
      } catch (e) {
        // retry
      }
    }
    if (!tabs) throw new Error(`Chrome remote debugging did not respond on port ${cdpPort}`);
    const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173')) || tabs[0];
    if (!targetTab) throw new Error('Target tab not found');

    ws = new WebSocket(targetTab.webSocketDebuggerUrl);
    await new Promise(resolve => { ws.onopen = resolve; });

    let id = 1;
    const callbacks = new Map();
    const consoleErrors = [];
    const failedRequests = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      } else if (msg.method === 'Network.responseReceived') {
        if (msg.params.response.status >= 400) {
          failedRequests.push({ url: msg.params.response.url, status: msg.params.response.status });
        }
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
    await send('Runtime.enable');
    await send('Network.enable');

    // Await page load
    await send('Page.navigate', { url: baseUrl });
    await new Promise(r => setTimeout(r, 3000));

    const report = {};

    // 1. Desktop 1440px
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));

    report.desktop = await send('Runtime.evaluate', {
      expression: `(() => {
        const cc = document.querySelector('#command-center');
        const flagship = document.querySelector('#flagship');
        const dq10 = document.body.textContent.includes('DQ-10') && document.body.textContent.includes('REVIEW');
        return {
          docScrollWidth: document.documentElement.scrollWidth,
          windowInnerWidth: window.innerWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          commandCenterFound: !!cc,
          flagshipFound: !!flagship,
          dq10Found: dq10
        };
      })()`,
      returnByValue: true
    });

    // 2. Mobile 390px
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 500));

    report.mobile = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          docScrollWidth: document.documentElement.scrollWidth,
          windowInnerWidth: window.innerWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      })()`,
      returnByValue: true
    });

    // 3. Command Center Action Audit
    report.commandCenter = await send('Runtime.evaluate', {
      expression: `(() => {
        const cc = document.querySelector('#command-center');
        if (!cc) return { error: 'No command center' };
        const buttons = Array.from(cc.querySelectorAll('button, a'));
        const briefBtns = buttons.filter(b => b.textContent && b.textContent.includes('30s Brief'));
        const caseStudyBtns = buttons.filter(b => b.textContent && b.textContent.includes('Case Study'));
        const exploreBtn = buttons.find(b => b.textContent && b.textContent.includes('Explore Projects'));
        const resumeLink = buttons.find(b => b.textContent && b.textContent.includes('View Resume'));
        return {
          totalActions: buttons.length,
          briefButtonsCount: briefBtns.length,
          caseStudyButtonsCount: caseStudyBtns.length,
          hasExploreBtn: !!exploreBtn,
          hasResumeLink: !!resumeLink,
          resumeHref: resumeLink ? resumeLink.getAttribute('href') : null
        };
      })()`,
      returnByValue: true
    });

    // 4. Modal Open, Escape & Focus Restoration
    report.modalInteraction = await send('Runtime.evaluate', {
      expression: `(() => {
        const cc = document.querySelector('#command-center');
        const briefBtn = Array.from(cc.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('30s Brief'));
        if (briefBtn) briefBtn.click();
        return { briefClicked: !!briefBtn };
      })()`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 400));

    const modalOpenState = await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const title = dialog ? dialog.querySelector('h3, h2, h4')?.textContent : null;
        return {
          isOpen: !!dialog,
          title: title
        };
      })()`,
      returnByValue: true
    });

    // Dispatch Escape
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 300));

    const modalAfterEscape = await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return {
          dialogClosed: !dialog,
          activeElementTag: document.activeElement ? document.activeElement.tagName : null
        };
      })()`,
      returnByValue: true
    });

    report.briefModalLifecycle = {
      ...report.modalInteraction.result.value,
      ...modalOpenState.result.value,
      ...modalAfterEscape.result.value
    };

    report.consoleErrors = consoleErrors;
    report.failedRequests = failedRequests;

    console.log('AUDIT_SUITE_FINAL_OUTPUT:', JSON.stringify(report, null, 2));
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

targetedCdpAudit().catch(err => {
  console.error('Targeted CDP audit failed:', err);
  process.exit(1);
});
