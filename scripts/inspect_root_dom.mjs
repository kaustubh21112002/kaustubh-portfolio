import http from 'http';
import { spawn } from 'child_process';

async function check() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome_chk_' + Date.now();
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9250',
    '--user-data-dir=' + userDataDir,
    '--disable-gpu',
    'http://127.0.0.1:4173/'
  ], { detached: true, stdio: 'ignore' });
  proc.unref();

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
    try { tabs = await getJson('http://127.0.0.1:9250/json'); if (tabs && tabs.length) break; } catch (e) {}
  }
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173')) || tabs[0];
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const callbacks = new Map();
  const consoleMsgs = [];
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) { callbacks.get(msg.id)(msg.result); callbacks.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleMsgs.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
  };
  function send(method, params = {}) {
    return new Promise(r => { const msgId = id++; callbacks.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 3000));

  const domCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        bodyHtmlSnippet: document.body.innerHTML.slice(0, 300),
        hasRootChildren: document.getElementById("root")?.children?.length,
        hasCommandCenter: !!document.querySelector("#command-center")
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM_CHECK:', JSON.stringify(domCheck.result.value, null, 2));
  console.log('CONSOLE_MSGS:', consoleMsgs);
  ws.close();
  proc.kill();
}
check();

