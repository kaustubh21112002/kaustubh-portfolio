import http from 'http';
import { spawn } from 'child_process';

async function inspectDom() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome_dom_' + Date.now();
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9246',
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
    try { tabs = await getJson('http://127.0.0.1:9246/json'); if (tabs && tabs.length) break; } catch (e) {}
  }

  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173')) || tabs[0];
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) { callbacks.get(msg.id)(msg.result); callbacks.delete(msg.id); }
  };
  function send(method, params = {}) {
    return new Promise(r => { const msgId = id++; callbacks.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 2000));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector("#projects");
      if (!sec) return { error: "no projects sec" };
      const cardsContainer = sec.querySelector(".grid.grid-cols-1.lg\\\\:grid-cols-2");
      const projectArticles = cardsContainer ? Array.from(cardsContainer.children).map(c => {
        const h3 = c.querySelector("h3");
        return h3 ? h3.textContent.trim() : "no-title";
      }) : [];
      const allGridDivs = sec.querySelectorAll(".grid > div");
      const allGrids = Array.from(sec.querySelectorAll(".grid")).map(g => ({
        className: g.className,
        directChildrenCount: g.children.length
      }));
      return {
        projectArticlesCount: projectArticles.length,
        projectTitles: projectArticles,
        allGridDivsCount: allGridDivs.length,
        allGrids
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM_BREAKDOWN:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectDom();

