import http from 'http';
import { spawn } from 'child_process';

async function runAccurateBrowserTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome_pi_acc_' + Date.now();
  
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
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

  let tabs = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      tabs = await getJson('http://127.0.0.1:9224/json');
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  if (!tabs) throw new Error('Chrome remote debugging did not respond on port 9224');
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('5173')) || tabs[0];
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

  // Set desktop viewport (1440x900)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 2000));

  async function evalExpr(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.result?.value;
  }

  const report = {};

  // TEST 1: Desktop Activity Trigger
  report.test1_desktopTrigger = await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry (Ctrl+Shift+I)"]');
    if (!btn) return { pass: false, error: 'trigger button not found' };
    const rect = btn.getBoundingClientRect();
    return {
      pass: true,
      label: btn.getAttribute('aria-label'),
      title: btn.getAttribute('title'),
      renderedWidth: rect.width,
      renderedHeight: rect.height,
      visible: rect.width > 0 && rect.height > 0
    };
  })()`);

  // TEST 2: Open Modal via Click
  report.test2_openModalClick = await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry (Ctrl+Shift+I)"]');
    btn.click();
    return { clicked: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test2_modalRendered = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    if (!modal) return { pass: false, error: 'modal dialog not found' };
    const title = document.getElementById('intelligence-modal-title');
    const input = modal.querySelector('input[type="password"]');
    const submitBtn = modal.querySelector('button[type="submit"]');
    const closeBtn = modal.querySelector('button[aria-label="Close Portfolio Intelligence Dashboard"]');
    const lockedCard = modal.innerText.includes('Protected Operator Session');
    const telemetryExposed = modal.innerText.includes('Total Sessions') || modal.innerText.includes('Resume Click Rate');
    return {
      pass: true,
      title: title ? title.innerText : null,
      hasPasswordInput: !!input,
      hasSubmitBtn: !!submitBtn,
      hasCloseBtn: !!closeBtn,
      isAuthGated: lockedCard,
      telemetryExposed: telemetryExposed,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // TEST 3: Close via X button
  report.test3_closeViaX = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    const closeBtn = modal.querySelector('button[aria-label="Close Portfolio Intelligence Dashboard"]');
    if (!closeBtn) return { pass: false, error: 'close button not found' };
    closeBtn.click();
    return { clicked: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test3_modalAfterX = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      pass: !modal,
      isOpen: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // TEST 4: Reopen via Shortcut
  report.test4_reopenShortcut = await evalExpr(`(() => {
    const evt = new KeyboardEvent('keydown', { key: 'I', code: 'KeyI', shiftKey: true, ctrlKey: true, bubbles: true });
    window.dispatchEvent(evt);
    return { dispatched: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test4_modalAfterShortcut = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      pass: !!modal,
      isOpen: !!modal
    };
  })()`);

  // TEST 5: Close via Escape
  report.test5_closeViaEscape = await evalExpr(`(() => {
    const evt = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
    window.dispatchEvent(evt);
    return { dispatched: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test5_modalAfterEscape = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      pass: !modal,
      isOpen: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // TEST 6: Backdrop Click Close
  await evalExpr(`(() => {
    const btn = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry (Ctrl+Shift+I)"]');
    if (btn) btn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test6_closeViaBackdrop = await evalExpr(`(() => {
    const backdrop = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    if (!backdrop) return { pass: false, error: 'backdrop not found' };
    const clickEvt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    backdrop.dispatchEvent(clickEvt);
    return { dispatched: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test6_modalAfterBackdrop = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    return {
      pass: !modal,
      isOpen: !!modal,
      bodyOverflow: document.body.style.overflow
    };
  })()`);

  // TEST 7: Mobile Viewport & Hamburger Drawer Trigger
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  report.test7_openMobileMenu = await evalExpr(`(() => {
    const menuBtn = document.querySelector('button[aria-label="Open navigation menu"]');
    if (!menuBtn) return { pass: false, error: 'Open navigation menu button not found' };
    menuBtn.click();
    return { clicked: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test7_mobileDrawerTrigger = await evalExpr(`(() => {
    const trigger = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry dashboard"]');
    if (!trigger) return { pass: false, error: 'Mobile portfolio intelligence button not found' };
    const rect = trigger.getBoundingClientRect();
    return {
      pass: true,
      text: trigger.innerText.trim(),
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    };
  })()`);

  report.test7_clickMobileTrigger = await evalExpr(`(() => {
    const trigger = document.querySelector('button[aria-label="Open Portfolio Intelligence private telemetry dashboard"]');
    trigger.click();
    return { clicked: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test7_modalAfterMobile = await evalExpr(`(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="intelligence-modal-title"]');
    const closeBtn = modal?.querySelector('button[aria-label="Close Portfolio Intelligence Dashboard"]');
    const isOpen = !!modal;
    if (closeBtn) closeBtn.click();
    return {
      pass: isOpen,
      isOpen: isOpen
    };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  // Reset to desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));

  // TEST 8: Global QuickSearch Modal & Navigation Intact
  report.test8_quickSearchModal = await evalExpr(`(() => {
    const searchBtn = document.querySelector('button[aria-label="Search portfolio projects and skills (Ctrl+K)"]');
    if (!searchBtn) return { pass: false, error: 'Search trigger not found' };
    searchBtn.click();
    return { pass: true, clicked: true };
  })()`);
  await new Promise(r => setTimeout(r, 500));

  report.test8_quickSearchState = await evalExpr(`(() => {
    const input = document.querySelector('input[placeholder="Search projects, DCF models, skills, tools..."]');
    const modal = document.querySelector('[role="dialog"][aria-label="Search portfolio projects and skills"]');
    const isOpen = !!input && !!modal;
    if (isOpen) {
      const esc = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
      window.dispatchEvent(esc);
    }
    return {
      pass: isOpen,
      searchModalOpened: isOpen,
      placeholder: input ? input.getAttribute('placeholder') : null
    };
  })()`);

  report.consoleErrors = consoleErrors;
  console.log(JSON.stringify(report, null, 2));

  ws.close();
  process.exit(0);
}

runAccurateBrowserTest().catch(err => {
  console.error(err);
  process.exit(1);
});
