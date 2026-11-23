import http from 'http';
import { exec } from 'child_process';
import fs from 'fs';

async function diagnose() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = exec(`"${chromePath}" --headless=new --remote-debugging-port=9240 --disable-gpu http://127.0.0.1:4173`);
  
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

  const tabs = await getJson('http://127.0.0.1:9240/json');
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

  // Check tab button
  const tabCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const tab = document.getElementById('phonepe-tab-scenarios');
      return {
        exists: !!tab,
        text: tab ? tab.textContent : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Tab scenarios check:', JSON.stringify(tabCheck.result.value));

  // Click scenarios tab
  await send('Runtime.evaluate', {
    expression: `document.getElementById('phonepe-tab-scenarios')?.click()`
  });
  await new Promise(r => setTimeout(r, 500));

  // Find export button
  const btnCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const exportBtn = btns.find(b => b.textContent.toLowerCase().includes('export'));
      return {
        allButtons: btns.map(b => b.textContent.trim().slice(0, 30)),
        foundExport: exportBtn ? {
          text: exportBtn.textContent.trim(),
          ariaLabel: exportBtn.getAttribute('aria-label'),
          rect: exportBtn.getBoundingClientRect()
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Export button check:', JSON.stringify(btnCheck.result.value, null, 2));

  // Click export button
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const exportBtn = btns.find(b => b.textContent.toLowerCase().includes('export'));
      if (exportBtn) exportBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  // Check modal
  const modalCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('[data-valuation-modal="true"]');
      const card = document.querySelector('.valuation-export-card');
      return {
        modalExists: !!modal,
        cardExists: !!card,
        cardTextLen: card ? card.innerText.length : 0,
        cardSnippet: card ? card.innerText.slice(0, 200) : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Modal check:', JSON.stringify(modalCheck.result.value, null, 2));

  ws.close();
  proc.kill();
}

diagnose().catch(console.error);
