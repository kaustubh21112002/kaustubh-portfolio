import http from 'http';
import { exec } from 'child_process';
import fs from 'fs';

async function testValuationExport() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = exec(`"${chromePath}" --headless=new --remote-debugging-port=9228 --disable-gpu http://127.0.0.1:4173`);
  
  await new Promise(r => setTimeout(r, 2000));

  function getJson(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const tabs = await getJson('http://127.0.0.1:9228/json');
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173'));
  if (!targetTab) throw new Error('Target tab not found');

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(resolve => { ws.onopen = resolve; });

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
  await send('DOM.enable');

  // Desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Scroll to Flagship PhonePe
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('flagship')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture Flagship section with export button
  const flagshipShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/export_flagship_button.png', Buffer.from(flagshipShot.data, 'base64'));
  console.log('Saved scripts/inspection/export_flagship_button.png');

  // Click Export Button
  const openModal = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label*=\"Export one-page executive valuation brief\"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`,
    returnByValue: true
  });
  console.log('Opened export modal:', openModal.result.value);

  await new Promise(r => setTimeout(r, 600));

  // Inspect modal content values to verify reconciliation
  const modalInspection = await send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('[role=\"dialog\"][aria-labelledby=\"export-summary-title\"]');
      if (!modal) return null;
      return {
        title: modal.querySelector('#export-summary-title')?.textContent.trim(),
        textSnippet: modal.textContent.slice(0, 300)
      };
    })()`,
    returnByValue: true
  });
  console.log('Modal inspection:', JSON.stringify(modalInspection.result.value, null, 2));

  // Capture screenshot of the opened Executive Valuation Brief
  const modalShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/export_modal_preview.png', Buffer.from(modalShot.data, 'base64'));
  console.log('Saved scripts/inspection/export_modal_preview.png');

  // Test scenario change to Bear Case
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Close modal
      const closeBtn = document.querySelector('button[aria-label=\"Close valuation summary modal\"]');
      if (closeBtn) closeBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  // Switch to Tab 4 and select Bear Case
  await send('Runtime.evaluate', {
    expression: `(() => {
      const tab4 = document.getElementById('phonepe-tab-scenarios');
      if (tab4) tab4.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const bearBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bear Case'));
      if (bearBtn) bearBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  // Re-open Export Modal in Bear Case
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label*=\"Export one-page executive valuation brief\"]');
      if (btn) btn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  // Capture Bear case export preview
  const bearModalShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/inspection/export_modal_bear_preview.png', Buffer.from(bearModalShot.data, 'base64'));
  console.log('Saved scripts/inspection/export_modal_bear_preview.png');

  ws.close();
  proc.kill();
}

testValuationExport().catch(console.error);
