import http from 'http';
import { spawn } from 'child_process';

async function testPortfolioIntelligence() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome_pi_' + Date.now();
  
  // Launch Chrome headless pointing to http://localhost:5173
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    'http://localhost:5173'
  ], { detached: true, stdio: 'ignore' });
  proc.unref();

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
  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      tabs = await getJson('http://127.0.0.1:9223/json');
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  if (!tabs) throw new Error('Chrome remote debugging did not respond on port 9223');
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('5173')) || tabs[0];
  if (!targetTab) throw new Error('Target tab not found');

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(resolve => { ws.onopen = resolve; });

  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      cb(msg);
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
  await send('DOM.enable');

  // Wait for React hydration
  await new Promise(r => setTimeout(r, 2500));

  async function evalExpr(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.result?.value;
  }

  const results = {};

  // 1. Desktop Activity Trigger
  results.desktopTrigger = await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label*="Portfolio Intelligence private telemetry"]');
    if (!btn) return { found: false };
    const rect = btn.getBoundingClientRect();
    return {
      found: true,
      text: btn.innerText.trim(),
      title: btn.getAttribute('title'),
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    };
  })()`);

  // 2. Open Modal via Desktop Trigger
  results.openViaClick = await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label*="Portfolio Intelligence private telemetry"]');
    if (!btn) return { success: false, reason: 'button not found' };
    btn.click();
    return { success: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  // 3. Inspect Opened Modal
  results.modalAfterClick = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    if (!modal) return { open: false };
    const title = document.getElementById('intelligence-modal-title');
    const input = modal.querySelector('input[type="password"]');
    const submitBtn = modal.querySelector('button[type="submit"]');
    const closeBtn = modal.querySelector('button[aria-label="Close dialog"]');
    const lockedCard = modal.innerText.includes('Authentication Required') || modal.innerText.includes('Restricted Executive Telemetry');
    const telemetryDataExposed = modal.innerText.includes('Total Sessions') || modal.innerText.includes('Resume Click Rate');
    return {
      open: true,
      title: title ? title.innerText : null,
      hasPasswordInput: !!input,
      hasSubmitBtn: !!submitBtn,
      hasCloseBtn: !!closeBtn,
      lockedCard,
      telemetryDataExposed,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // 4. Test Close via X button
  results.closeViaX = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    if (!modal) return { success: false, reason: 'modal not open' };
    const closeBtn = modal.querySelector('button[aria-label="Close dialog"]');
    if (!closeBtn) return { success: false, reason: 'close btn not found' };
    closeBtn.click();
    return { success: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.modalAfterX = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      open: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // 5. Reopen via Ctrl+Shift+I shortcut
  results.reopenViaShortcut = await evalExpr(`(() => {
    const event = new KeyboardEvent('keydown', {
      key: 'I',
      code: 'KeyI',
      shiftKey: true,
      ctrlKey: true,
      bubbles: true
    });
    window.dispatchEvent(event);
    return { dispatched: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.modalAfterShortcut = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return { open: !!modal };
  })()`);

  // 6. Close via Escape key
  results.closeViaEscape = await evalExpr(`(() => {
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true
    });
    window.dispatchEvent(event);
    return { dispatched: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.modalAfterEscape = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      open: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // 7. Reopen and test Backdrop Click close
  await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label*="Portfolio Intelligence private telemetry"]');
    if (btn) btn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  results.closeViaBackdrop = await evalExpr(`(() => {
    const backdrop = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    if (!backdrop) return { success: false, reason: 'backdrop not found' };
    // Click directly on the backdrop (target === currentTarget)
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    backdrop.dispatchEvent(clickEvent);
    return { success: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.modalAfterBackdrop = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      open: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // 8. Mobile Drawer Activity Trigger
  // Resize viewport to mobile (390 x 844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  results.mobileDrawerTrigger = await evalExpr(`(() => {
    // Open mobile menu
    const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
    if (!menuBtn) return { success: false, reason: 'menu button not found' };
    menuBtn.click();
    return { menuClicked: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.mobileTriggerInspection = await evalExpr(`(() => {
    const trigger = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry dashboard"]');
    if (!trigger) return { found: false };
    const rect = trigger.getBoundingClientRect();
    return {
      found: true,
      text: trigger.innerText.trim(),
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    };
  })()`);

  // Click mobile trigger
  results.mobileTriggerClick = await evalExpr(`(() => {
    const trigger = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry dashboard"]');
    if (!trigger) return { success: false };
    trigger.click();
    return { success: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.modalAfterMobileClick = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return { open: !!modal };
  })()`);

  // Close modal again
  await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    const closeBtn = modal?.querySelector('button[aria-label="Close dialog"]');
    if (closeBtn) closeBtn.click();
  })()`);

  // Restore desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));

  // 9. Quick Search Modal Verification
  results.searchModalVerification = await evalExpr(`(() => {
    const searchBtn = document.querySelector('button[aria-label="Search portfolio projects and content (Cmd+K)"]');
    if (!searchBtn) return { found: false };
    searchBtn.click();
    return { found: true, clicked: true };
  })()`);

  await new Promise(r => setTimeout(r, 500));

  results.searchModalState = await evalExpr(`(() => {
    const searchModal = document.querySelector('input[placeholder*="Search by project, skill, tech"]');
    const isOpen = !!searchModal;
    // Close search modal
    if (isOpen) {
      const esc = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
      window.dispatchEvent(esc);
    }
    return { searchModalOpened: isOpen };
  })()`);

  results.consoleErrors = consoleErrors;

  console.log(JSON.stringify(results, null, 2));

  ws.close();
  process.exit(0);
}

testPortfolioIntelligence().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

