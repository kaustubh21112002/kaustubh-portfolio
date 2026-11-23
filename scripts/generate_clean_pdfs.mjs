import http from 'http';
import { exec } from 'child_process';
import fs from 'fs';

async function generateCleanPdfs() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = exec(`"${chromePath}" --headless=new --remote-debugging-port=9242 --disable-gpu http://127.0.0.1:4173`);
  
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

  const tabs = await getJson('http://127.0.0.1:9242/json');
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

  for (const scen of scenarios) {
    console.log(`Processing scenario: ${scen}`);

    // Switch to tab 4 scenarios
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.getElementById('phonepe-tab-scenarios')?.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Select scenario
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.toLowerCase().includes('${scen} case'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Open modal via the export button
    const openRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const exportBtn = btns.find(b => b.textContent.toLowerCase().includes('export 1-page summary'));
        if (exportBtn) {
          exportBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    });
    console.log(`Modal open clicked for ${scen}:`, openRes.result.value);
    await new Promise(r => setTimeout(r, 800));

    // Check if card exists and get text length
    const verifyCard = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.valuation-export-card');
        return card ? card.innerText.length : 0;
      })()`,
      returnByValue: true
    });
    console.log(`Card text length in DOM: ${verifyCard.result.value}`);

    // Print A4
    const a4Pdf = await send('Page.printToPDF', {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.25,
      marginBottom: 0.25,
      marginLeft: 0.25,
      marginRight: 0.25,
      scale: 0.95,
      pageRanges: '1',
      printBackground: true
    });
    fs.writeFileSync(`scripts/inspection/valuation_summary_${scen}_a4.pdf`, Buffer.from(a4Pdf.data, 'base64'));

    // Print Letter
    const letterPdf = await send('Page.printToPDF', {
      paperWidth: 8.5,
      paperHeight: 11.0,
      marginTop: 0.25,
      marginBottom: 0.25,
      marginLeft: 0.25,
      marginRight: 0.25,
      scale: 0.92,
      pageRanges: '1',
      printBackground: true
    });
    fs.writeFileSync(`scripts/inspection/valuation_summary_${scen}_letter.pdf`, Buffer.from(letterPdf.data, 'base64'));

    console.log(`Saved ${scen} A4 & Letter PDFs`);

    // Close modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label="Close valuation summary modal"]');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
  }

  ws.close();
  proc.kill();
  console.log('Finished generating clean PDFs.');
}

generateCleanPdfs().catch(console.error);
