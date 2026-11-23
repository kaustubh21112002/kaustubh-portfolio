import http from 'http';
import { exec } from 'child_process';
import fs from 'fs';

async function performFinancialExportQA() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = exec(`"${chromePath}" --headless=new --remote-debugging-port=9229 --disable-gpu http://127.0.0.1:4173`);
  
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

  const tabs = await getJson('http://127.0.0.1:9229/json');
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

  const scenarios = ['base', 'bear', 'bull'];
  const results = {};

  for (const scen of scenarios) {
    // 1. Switch scenario on page
    await send('Runtime.evaluate', {
      expression: `(() => {
        // Go to scenarios tab
        document.getElementById('phonepe-tab-scenarios')?.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('${scen} case'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    // Read interactive model values from Tab 4 card
    const interactiveValues = await send('Runtime.evaluate', {
      expression: `(() => {
        const scenarioCards = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('${scen} case'));
        const activeCard = Array.from(document.querySelectorAll('.rounded-3xl.border')).find(c => c.textContent.toLowerCase().includes('${scen} case'));
        if (!activeCard) return null;
        
        return {
          header: activeCard.querySelector('.font-mono.uppercase')?.textContent.trim(),
          ev: activeCard.querySelector('.text-3xl')?.textContent.trim(),
          footer: activeCard.querySelector('.border-t')?.textContent.trim()
        };
      })()`,
      returnByValue: true
    });

    // 2. Open Export Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label*=\"Export one-page executive valuation brief\"]');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // Read values from inside Export Modal
    const exportValues = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('[role=\"dialog\"][aria-labelledby=\"export-summary-title\"]');
        if (!modal) return null;

        const statBoxes = Array.from(modal.querySelectorAll('.grid-cols-2.sm\\\\:grid-cols-4 > div')).map(d => ({
          label: d.querySelector('.uppercase')?.textContent.trim(),
          value: d.querySelector('.text-lg, .text-xl')?.textContent.trim()
        }));

        const bridgeRows = Array.from(modal.querySelectorAll('table:nth-of-type(1) tr')).map(tr => ({
          label: tr.querySelector('td:nth-child(1)')?.textContent.trim(),
          value: tr.querySelector('td:nth-child(2)')?.textContent.trim()
        }));

        return {
          statBoxes,
          bridgeRows
        };
      })()`,
      returnByValue: true
    });

    // 3. Generate actual PDF via Page.printToPDF
    // Test A4
    const a4Pdf = await send('Page.printToPDF', {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.3,
      marginBottom: 0.3,
      marginLeft: 0.3,
      marginRight: 0.3,
      printBackground: true
    });
    fs.writeFileSync(`scripts/inspection/valuation_summary_${scen}_a4.pdf`, Buffer.from(a4Pdf.data, 'base64'));

    // Test Letter
    const letterPdf = await send('Page.printToPDF', {
      paperWidth: 8.5,
      paperHeight: 11.0,
      marginTop: 0.3,
      marginBottom: 0.3,
      marginLeft: 0.3,
      marginRight: 0.3,
      printBackground: true
    });
    fs.writeFileSync(`scripts/inspection/valuation_summary_${scen}_letter.pdf`, Buffer.from(letterPdf.data, 'base64'));

    results[scen] = {
      interactive: interactiveValues.result.value,
      exported: exportValues.result.value,
      a4PdfBytes: Buffer.from(a4Pdf.data, 'base64').length,
      letterPdfBytes: Buffer.from(letterPdf.data, 'base64').length
    };

    // Close modal via Escape key
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('QA Results:', JSON.stringify(results, null, 2));

  ws.close();
  proc.kill();
}

performFinancialExportQA().catch(console.error);
