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

async function targetedExplorerCdpAudit() {
  const cdpPort = parseInt(process.env.CDP_PORT || '9240', 10);
  const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/';
  const chromePath = resolveChromePath();

  const isAvailable = await checkPortAvailable(cdpPort);
  if (!isAvailable) {
    throw new Error(`Port ${cdpPort} is already in use. Please terminate conflicting processes or specify CDP_PORT.`);
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome_explorer_'));
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
    const loadPromise = new Promise(resolve => {
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.loadEventFired') {
          ws.removeEventListener('message', handler);
          resolve();
        }
      };
      ws.addEventListener('message', handler);
    });
    await send('Page.navigate', { url: baseUrl });
    await Promise.race([loadPromise, new Promise(r => setTimeout(r, 4000))]);
    await new Promise(r => setTimeout(r, 1500));

    const report = {};

    // 1. Desktop Initial State
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 400));

    report.initialCount = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        if (!sec) return { error: 'Projects section not found' };
        const searchInput = sec.querySelector('input[type="text"]');
        const projectArticles = sec.querySelectorAll('article[data-project-id]');
        return {
          hasSearchInput: !!searchInput,
          displayedCardCount: projectArticles.length,
          projectIds: Array.from(projectArticles).map(a => a.getAttribute('data-project-id'))
        };
      })()`,
      returnByValue: true
    });

    // 2. Search for "DCF"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const searchInput = sec.querySelector('input[type="text"]');
        if (searchInput) {
          const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
          proto.set.call(searchInput, 'DCF');
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    report.afterSearchDCF = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const articles = Array.from(sec.querySelectorAll('article[data-project-id]'));
        const titles = articles.map(c => c.querySelector('h3')?.textContent?.trim()).filter(Boolean);
        return {
          count: articles.length,
          titles: titles
        };
      })()`,
      returnByValue: true
    });

    // 3. Search for "NonExistentTermXYZ" to test Empty State
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const searchInput = sec.querySelector('input[type="text"]');
        if (searchInput) {
          const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
          proto.set.call(searchInput, 'NonExistentTermXYZ');
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    report.emptyState = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const emptyNotice = sec.querySelector('h3');
        const hasResetBtn = !!Array.from(sec.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Reset'));
        return {
          emptyHeading: emptyNotice ? emptyNotice.textContent : null,
          hasResetBtn: hasResetBtn
        };
      })()`,
      returnByValue: true
    });

    // 4. Click Reset Filters Button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const resetBtn = Array.from(sec.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Reset'));
        if (resetBtn) resetBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    report.afterReset = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const articles = sec.querySelectorAll('article[data-project-id]');
        const searchInput = sec.querySelector('input[type="text"]');
        return {
          restoredCount: articles.length,
          searchInputValue: searchInput ? searchInput.value : null
        };
      })()`,
      returnByValue: true
    });

    // 5. Test Domain Filter: Click "Data Governance"
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const govBtn = Array.from(sec.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Data Governance'));
        if (govBtn) govBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    report.afterGovernanceFilter = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#projects');
        const articles = Array.from(sec.querySelectorAll('article[data-project-id]'));
        const titles = articles.map(c => c.querySelector('h3')?.textContent?.trim()).filter(Boolean);
        return {
          count: articles.length,
          titles: titles
        };
      })()`,
      returnByValue: true
    });

    // 6. Test Mobile Responsiveness at 390px
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 400));

    report.mobileCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          docScrollWidth: document.documentElement.scrollWidth,
          windowInnerWidth: window.innerWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      })()`,
      returnByValue: true
    });

    report.consoleErrors = consoleErrors;
    report.failedRequests = failedRequests;

    console.log('EXPLORER_CDP_AUDIT_FINAL:', JSON.stringify(report, null, 2));
  } finally {
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    if (proc) {
      try {
        proc.kill();
      } catch (e) {}
    }
    // Cleanup temporary profile directory
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

targetedExplorerCdpAudit().catch(err => {
  console.error('Targeted Explorer CDP audit error:', err);
  process.exit(1);
});
