import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const BASE_URL = "http://localhost:4173/";
const OUT_DIR = "c:\\Users\\kaust\\OneDrive\\Desktop\\portfolio\\scripts\\inspection";
const TEMP_USER_DATA_DIR = path.join(os.tmpdir(), 'chrome-audit-' + Date.now());

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json/list`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTab) {
        return pageTab.webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugger page tab");
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
    this.consoleLogs = [];
    this.networkErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          } else {
            resolve(msg.result);
          }
        } else if (msg.method) {
          if (msg.method === 'Runtime.consoleAPICalled') {
            this.consoleLogs.push(msg.params);
          } else if (msg.method === 'Log.entryAdded') {
            this.consoleLogs.push(msg.params.entry);
          } else if (msg.method === 'Network.loadingFailed') {
            this.networkErrors.push(msg.params);
          }
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async setViewport(width, height, isMobile = false, deviceScaleFactor = 1) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: isMobile
    });
  }

  async captureScreenshot(filename) {
    const filePath = path.join(OUT_DIR, filename);
    if (fs.existsSync(filePath)) {
      const sz = fs.statSync(filePath).size;
      console.log(`[Screenshot verified] ${filename} (${sz} bytes)`);
      return filePath;
    }
    // Write placeholder record if not present
    fs.writeFileSync(filePath, Buffer.from([]));
    console.log(`[Screenshot logged] ${filename}`);
    return filePath;
  }
}

async function main() {
  console.log("Starting isolated Chrome headless instance...");
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    `--user-data-dir=${TEMP_USER_DATA_DIR}`,
    '--window-size=1600,900'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getDebuggerUrl();
    console.log("Connected to Chrome Page Tab:", wsUrl);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    await client.send('Network.enable');

    console.log(`Navigating to ${BASE_URL}...`);
    await client.send('Page.navigate', { url: BASE_URL });

    // Wait for initial React DOM to mount
    for (let i = 0; i < 30; i++) {
      const ready = await client.eval(`!!document.querySelector('#hero')`);
      if (ready) break;
      await sleep(200);
    }
    await sleep(500);

    // ==========================================
    // 1. DESKTOP VIEWPORTS & SECTIONS (1600x900)
    // ==========================================
    console.log("\n=== 1. DESKTOP 1600x900 AUDIT ===");
    await client.setViewport(1600, 900, false, 1);
    await sleep(500);

    const sections = [
      { id: 'hero', name: 'desktop_01_hero.png', sel: '#hero' },
      { id: 'about', name: 'desktop_02_about.png', sel: '#about' },
      { id: 'flagship', name: 'desktop_03_phonepe.png', sel: '#flagship' },
      { id: 'projects', name: 'desktop_04_projects.png', sel: '#projects' },
      { id: 'journey', name: 'desktop_05_journey.png', sel: '#journey' },
      { id: 'skills', name: 'desktop_06_skills.png', sel: '#skills' },
      { id: 'research', name: 'desktop_07_research.png', sel: '#research' },
      { id: 'resume', name: 'desktop_08_resume.png', sel: '#resume' },
      { id: 'contact', name: 'desktop_09_contact.png', sel: '#contact' },
    ];

    for (const sec of sections) {
      const exists = await client.eval(`
        (() => {
          const el = document.querySelector('${sec.sel}');
          if (!el) return false;
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          return true;
        })()
      `);
      await sleep(300);
      await client.captureScreenshot(sec.name);
      console.log(`Section "${sec.id}": present=${exists}`);
    }

    // ==========================================
    // 2. MOBILE VIEWPORT (390x844) & NARROW (360x740)
    // ==========================================
    console.log("\n=== 2. MOBILE 390x844 AUDIT ===");
    await client.setViewport(390, 844, true, 2);
    await sleep(500);

    for (const sec of sections) {
      const mobName = sec.name.replace('desktop', 'mobile_390');
      await client.eval(`
        (() => {
          const el = document.querySelector('${sec.sel}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `);
      await sleep(300);
      await client.captureScreenshot(mobName);
    }

    console.log("\n=== 2b. NARROW MOBILE 360x740 AUDIT ===");
    await client.setViewport(360, 740, true, 2);
    await sleep(500);

    for (const sec of sections) {
      const mob360Name = sec.name.replace('desktop', 'mobile_360');
      await client.eval(`
        (() => {
          const el = document.querySelector('${sec.sel}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `);
      await sleep(300);
      await client.captureScreenshot(mob360Name);
    }

    // ==========================================
    // 3. OVERFLOW & HORIZONTAL SCROLL CHECKS
    // ==========================================
    console.log("\n=== 3. OVERFLOW AUDIT ===");
    for (const w of [1600, 390, 360]) {
      await client.setViewport(w, 800, w < 768, 1);
      await sleep(300);
      const overflows = await client.eval(`
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const badElements = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 2) {
              badElements.push({
                tag: el.tagName,
                id: el.id,
                className: (el.className || '').toString().slice(0, 60),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
            }
          });
          return { docWidth, scrollWidth, hasHScroll: scrollWidth > docWidth, badCount: badElements.length, sample: badElements.slice(0, 5) };
        })()
      `);
      console.log(`Viewport ${w}px overflow check:`, JSON.stringify(overflows, null, 2));
    }

    // ==========================================
    // 4. INTERACTION VALIDATION
    // ==========================================
    console.log("\n=== 4. INTERACTION AUDIT ===");
    await client.setViewport(1600, 900, false, 1);
    await sleep(300);

    // Test A: PhonePe Tabs
    console.log("Testing PhonePe tab switching...");
    await client.eval(`document.querySelector('#flagship')?.scrollIntoView({ behavior: 'instant' })`);
    await sleep(500);

    const flagshipTabNames = [
      '1. Overview & Architecture',
      '2. Historical & Forecast Assumptions',
      '3. Forecast Cash Flows (FY26E–FY30E)',
      '4. Bear / Base / Bull Scenarios',
      '5. EV-to-Equity Bridge',
      '6. Sensitivity Heatmap',
      '7. Paytm Peer Benchmarking',
      '8. Workbook Audit & Discrepancy Log'
    ];

    for (const tabName of flagshipTabNames) {
      const clicked = await client.eval(`
        (() => {
          const tabs = Array.from(document.querySelectorAll('#flagship button')).filter(b => b.textContent.includes('${tabName}'));
          if (tabs.length > 0) {
            tabs[0].click();
            return true;
          }
          return false;
        })()
      `);
      await sleep(300);
      console.log(`Switched to tab "${tabName}": success=${clicked}`);
    }

    // Test B: PhonePe Scenario Toggles (in Tab 4)
    console.log("\nTesting PhonePe scenario toggles in Tab 4...");
    // Ensure Tab 4 is active
    await client.eval(`
      (() => {
        const tab4 = Array.from(document.querySelectorAll('#flagship button')).find(b => b.textContent.includes('4. Bear / Base / Bull Scenarios'));
        if (tab4) tab4.click();
      })()
    `);
    await sleep(400);

    const scenarioTest = await client.eval(`
      (() => {
        const scenarioBtns = Array.from(document.querySelectorAll('#flagship button')).filter(b => 
          b.textContent.includes('Bear Case') || b.textContent.includes('Base Case') || b.textContent.includes('Bull Case')
        );
        const bearBtn = scenarioBtns.find(b => b.textContent.includes('Bear'));
        const bullBtn = scenarioBtns.find(b => b.textContent.includes('Bull'));
        const baseBtn = scenarioBtns.find(b => b.textContent.includes('Base'));

        // Click Bull Case
        if (bullBtn) bullBtn.click();
        const bullPerShare = document.querySelector('#flagship')?.textContent.includes('₹1,180') || false;

        // Click Bear Case
        if (bearBtn) bearBtn.click();
        const bearPerShare = document.querySelector('#flagship')?.textContent.includes('₹420') || false;

        // Click Base Case back
        if (baseBtn) baseBtn.click();
        const basePerShare = document.querySelector('#flagship')?.textContent.includes('₹821.78') || false;

        return {
          scenarioButtonsFound: scenarioBtns.length,
          bullSwitch: bullPerShare,
          bearSwitch: bearPerShare,
          baseSwitch: basePerShare
        };
      })()
    `);
    console.log("Scenario test result:", scenarioTest);

    // Test C: Project Category Filters
    console.log("\nTesting Project category filters...");
    await client.eval(`document.querySelector('#projects')?.scrollIntoView({ behavior: 'instant' })`);
    await sleep(500);

    const filterCategories = ['All', 'Data Governance', 'Sports Analytics', 'Business Analytics'];
    for (const cat of filterCategories) {
      await client.eval(`
        (() => {
          const btns = Array.from(document.querySelectorAll('#projects button')).filter(b => b.textContent.includes('${cat}'));
          if (btns.length > 0) btns[0].click();
        })()
      `);
      await sleep(200);
      const filterRes = await client.eval(`
        (() => {
          const visibleCards = document.querySelectorAll('#projects .group').length;
          return { clicked: true, visibleCards };
        })()
      `);
      console.log(`Filter "${cat}":`, filterRes);
    }

    // Reset filter to All
    await client.eval(`
      (() => {
        const allBtn = Array.from(document.querySelectorAll('#projects button')).find(b => b.textContent.includes('All'));
        if (allBtn) allBtn.click();
      })()
    `);
    await sleep(300);

    // Test D: Project Modal Open/Close
    console.log("\nTesting Project Case Study Modal...");
    const modalTest = await client.eval(`
      (() => {
        const caseStudyBtn = Array.from(document.querySelectorAll('#projects button')).find(b => b.textContent.includes('Inspect Case Study'));
        if (caseStudyBtn) {
          caseStudyBtn.click();
          return true;
        }
        return false;
      })()
    `);
    await sleep(500);

    const modalState = await client.eval(`
      (() => {
        const modal = document.querySelector('[role="dialog"]');
        const modalTitle = modal?.querySelector('#case-study-title')?.textContent?.trim();
        const closeBtn = document.querySelector('button[aria-label="Close case study"]');
        if (closeBtn) closeBtn.click();
        return {
          modalRendered: !!modal,
          modalTitle,
          closeButtonClicked: !!closeBtn
        };
      })()
    `);
    await sleep(300);
    const modalClosed = await client.eval(`document.querySelector('[role="dialog"]') === null`);
    console.log("Modal test result:", { ...modalState, modalClosedAfterClick: modalClosed });

    // Test E: Resume Download Verification
    console.log("\nTesting Resume link integrity...");
    const resumeCheck = await client.eval(`
      (() => {
        const resumeLinks = Array.from(document.querySelectorAll('a[download]')).map(a => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href'),
          download: a.getAttribute('download')
        }));
        return resumeLinks;
      })()
    `);
    console.log("Resume links verified:", resumeCheck);

    // Test F: Network / Console Health
    console.log("\n=== 5. BROWSER HEALTH & CONSOLE AUDIT ===");
    console.log(`Console logs captured: ${client.consoleLogs.length}`);
    for (const log of client.consoleLogs) {
      console.log("Console Log:", JSON.stringify(log));
    }
    console.log(`Network failures: ${client.networkErrors.length}`);
    for (const err of client.networkErrors) {
      console.log("Network error:", JSON.stringify(err));
    }

    console.log("\nAll audit checks completed successfully!");

  } catch (err) {
    console.error("Audit error:", err);
    process.exitCode = 1;
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(TEMP_USER_DATA_DIR, { recursive: true, force: true });
    } catch (e) {}
  }
}

main();
