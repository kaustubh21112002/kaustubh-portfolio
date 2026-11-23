import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import net from 'node:net';

async function findFreePort(startPort = 9300) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
let PORT = 9229;
const BASE_URL = "http://127.0.0.1:4173/";
const OUT_DIR = "c:\\Users\\kaust\\OneDrive\\Desktop\\portfolio\\scripts\\inspection";
const TEMP_USER_DATA_DIR = path.join(os.tmpdir(), 'chrome-qa-' + Date.now());

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDebuggerUrl(port) {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(500) });
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTab) {
        return pageTab.webSocketDebuggerUrl;
      }
    } catch {
      // wait
    }
    await sleep(300);
  }
  throw new Error("Could not connect to Chrome debugger page tab on port " + port);
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
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
        } else if (msg.method === 'Runtime.consoleAPICalled') {
          this.consoleLogs.push(msg.params);
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

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  }

  async captureScreenshot(filename) {
    const shot = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const filePath = path.join(OUT_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`  [Screenshot saved] ${filename} (${buffer.length} bytes)`);
    return filePath;
  }
}

async function runQA() {
  console.log("=" .repeat(60));
  console.log("PHASE 1.1 QUALITY ASSURANCE & INTERACTION AUDIT");
  console.log("=" .repeat(60));

  // Check if server is already running, or start preview server
  let serverProc = null;
  let serverStartedByScript = false;
  try {
    const ping = await fetch(BASE_URL, { signal: AbortSignal.timeout(500) });
    if (ping.ok) {
      console.log(`Verified portfolio preview server already active at ${BASE_URL}`);
    }
  } catch {
    console.log(`Starting local portfolio preview server on port 4173...`);
    serverProc = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort', '--host', '127.0.0.1'], {
      cwd: 'C:\\Users\\kaust\\OneDrive\\Desktop\\portfolio',
      stdio: 'pipe'
    });
    serverProc.stderr.on('data', d => console.error(`[Server stderr] ${d}`));
    serverStartedByScript = true;
    let ready = false;
    for (let i = 0; i < 40; i++) {
      try {
        const ping = await fetch(BASE_URL, { signal: AbortSignal.timeout(500) });
        if (ping.ok) {
          console.log(`Portfolio preview server ready at ${BASE_URL}`);
          ready = true;
          break;
        }
      } catch {
        await sleep(300);
      }
    }
    if (!ready) {
      throw new Error(`Portfolio preview server did not become ready at ${BASE_URL}`);
    }
  }

  PORT = await findFreePort();
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    `--user-data-dir=${TEMP_USER_DATA_DIR}`,
    '--window-size=1440,900'
  ], { stdio: 'ignore' });

  const results = {
    theme: {},
    search: {},
    navigation: {},
    accessibility: {},
    content: {},
    consoleErrors: []
  };

  try {
    const wsUrl = await getDebuggerUrl(PORT);
    console.log("Connected to Chrome via CDP:", wsUrl);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log(`Navigating to ${BASE_URL}...`);
    const loadPromise = new Promise(resolve => {
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.loadEventFired') {
          client.ws.removeEventListener('message', handler);
          resolve();
        }
      };
      client.ws.addEventListener('message', handler);
    });
    await client.send('Page.navigate', { url: BASE_URL });
    await Promise.race([loadPromise, sleep(5000)]);
    await sleep(1500);

    // ==========================================
    // 1. THEME BEHAVIOR & INTERACTION
    // ==========================================
    console.log("\n--- 1. THEME CORRECTNESS & STATE TESTS ---");

    // 1.1 Check initial dark mode default for new visitors
    const initialIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const initialThemeAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    console.log(`  1.1 Initial Theme Default: isDark=${initialIsDark}, data-theme=${initialThemeAttr}`);
    results.theme.initialDarkDefault = initialIsDark && initialThemeAttr === 'dark';

    // 1.2 Switch to Light Theme
    await client.eval(`document.querySelector('button[aria-label="Light theme"]')?.click()`);
    await sleep(400);
    const lightIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const lightThemeAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    const lightStorage = await client.eval(`localStorage.getItem('portfolio-theme')`);
    console.log(`  1.2 Switched to Light: isDark=${lightIsDark}, data-theme=${lightThemeAttr}, stored=${lightStorage}`);
    results.theme.lightToggle = !lightIsDark && lightThemeAttr === 'light' && lightStorage === 'light';

    // Capture light desktop screenshot
    await client.captureScreenshot('qa_desktop_light_1440x900.png');

    // 1.3 Persistence on reload
    await client.send('Page.reload');
    await sleep(1000);
    const reloadedIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const reloadedThemeAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    const reloadedStorage = await client.eval(`localStorage.getItem('portfolio-theme')`);
    console.log(`  1.3 Reload Persistence: isDark=${reloadedIsDark}, data-theme=${reloadedThemeAttr}, stored=${reloadedStorage}`);
    results.theme.persistedAfterReload = !reloadedIsDark && reloadedThemeAttr === 'light' && reloadedStorage === 'light';

    // 1.4 Switch to System Theme
    await client.eval(`document.querySelector('button[aria-label="System theme"]')?.click()`);
    await sleep(400);
    const systemStorage = await client.eval(`localStorage.getItem('portfolio-theme')`);
    console.log(`  1.4 Switched to System: stored=${systemStorage}`);
    results.theme.systemToggle = systemStorage === 'system';

    // 1.4b Live OS preference change response in System mode
    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-color-scheme', value: 'light' }]
    });
    await sleep(400);
    const osLightIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const osLightAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);

    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-color-scheme', value: 'dark' }]
    });
    await sleep(400);
    const osDarkIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const osDarkAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);

    // Reset emulated media
    await client.send('Emulation.setEmulatedMedia', { media: '', features: [] });
    await sleep(200);

    const osSystemResponsive = (!osLightIsDark && osLightAttr === 'light') && (osDarkIsDark && osDarkAttr === 'dark');
    console.log(`  1.4b System Mode Responds to Live OS Changes: ${osSystemResponsive} (Light->${osLightAttr}, Dark->${osDarkAttr})`);
    results.theme.systemRespondsToOS = osSystemResponsive;

    // 1.5 Switch back to Dark Theme
    await client.eval(`document.querySelector('button[aria-label="Dark theme"]')?.click()`);
    await sleep(400);
    const darkIsDark = await client.eval(`document.documentElement.classList.contains('dark')`);
    const darkThemeAttr = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    const darkStorage = await client.eval(`localStorage.getItem('portfolio-theme')`);
    console.log(`  1.5 Switched to Dark: isDark=${darkIsDark}, data-theme=${darkThemeAttr}, stored=${darkStorage}`);
    results.theme.darkToggle = darkIsDark && darkThemeAttr === 'dark' && darkStorage === 'dark';

    // 1.6 URL query parameter non-override test (?theme=light while stored=dark, ?theme=dark while stored=light)
    // 1.6.1 Stored is 'dark', navigate with ?theme=light
    await client.send('Page.navigate', { url: `${BASE_URL}?theme=light` });
    await sleep(1000);
    const urlParamWithDarkStored = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    const storageRemainsDark = await client.eval(`localStorage.getItem('portfolio-theme')`);

    // 1.6.2 Set stored to 'light', navigate with ?theme=dark
    await client.eval(`document.querySelector('button[aria-label="Light theme"]')?.click()`);
    await sleep(400);
    await client.send('Page.navigate', { url: `${BASE_URL}?theme=dark` });
    await sleep(1000);
    const urlParamWithLightStored = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    const storageRemainsLight = await client.eval(`localStorage.getItem('portfolio-theme')`);

    // 1.6.3 Fresh visitor with no stored preference and ?theme=light
    await client.eval(`localStorage.removeItem('portfolio-theme')`);
    await client.send('Page.navigate', { url: `${BASE_URL}?theme=light` });
    await sleep(1000);
    const freshVisitorWithUrlParam = await client.eval(`document.documentElement.getAttribute('data-theme')`);

    const urlParamsDoNotOverride = urlParamWithDarkStored === 'dark' && storageRemainsDark === 'dark' &&
                                   urlParamWithLightStored === 'light' && storageRemainsLight === 'light' &&
                                   freshVisitorWithUrlParam === 'dark';
    console.log(`  1.6 URL params (?theme=...) do not override stored preferences: ${urlParamsDoNotOverride} (Dark->${urlParamWithDarkStored}, Light->${urlParamWithLightStored}, Fresh->${freshVisitorWithUrlParam})`);
    results.theme.urlParamsDoNotOverride = urlParamsDoNotOverride;

    // Reset back to normal home URL with default dark
    await client.eval(`localStorage.setItem('portfolio-theme', 'dark')`);
    await client.send('Page.navigate', { url: BASE_URL });
    await sleep(800);

    // Capture dark desktop screenshot
    await client.captureScreenshot('qa_desktop_dark_1440x900.png');

    // ==========================================
    // 2. SEARCH DIALOG & KEYBOARD BEHAVIOR
    // ==========================================
    console.log("\n--- 2. SEARCH MODAL & KEYBOARD TESTS ---");

    // 2.1 Trigger Search with keyboard hotkey (Ctrl+K)
    await client.eval(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    `);
    await sleep(400);
    const searchModalOpen = await client.eval(`!!document.querySelector('[role="dialog"]')`);
    console.log(`  2.1 Ctrl+K Hotkey opens dialog: ${searchModalOpen}`);
    results.search.ctrlKOpensDialog = searchModalOpen;

    // 2.2 Type query "PhonePe" and check results
    const phonePeResultsCount = await client.eval(`
      (() => {
        const input = document.querySelector('input[placeholder*="Search projects"]');
        if (!input) return 0;
        input.value = 'PhonePe';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const items = document.querySelectorAll('[role="dialog"] button');
        return items.length;
      })()
    `);
    await sleep(200);
    console.log(`  2.2 Search for 'PhonePe' returned: ${phonePeResultsCount} matching items`);
    results.search.queryFiltering = phonePeResultsCount > 0;

    // 2.3 Type non-existent query and check empty state
    await client.eval(`
      (() => {
        const input = document.querySelector('input[placeholder*="Search projects"]');
        if (!input) return;
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'zzxyznonexistent99');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    await sleep(400);
    const emptyStateText = await client.eval(`
      (() => {
        const emptyEl = document.querySelector('[role="dialog"] .py-12');
        return emptyEl ? emptyEl.textContent : '';
      })()
    `);
    console.log(`  2.3 Non-existent query empty state: "${emptyStateText.trim()}"`);
    results.search.emptyStateHandling = emptyStateText.includes('No matching projects or skills');

    // 2.4 Dismiss on Escape key
    await client.eval(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    `);
    await sleep(400);
    const modalClosedAfterEsc = await client.eval(`!document.querySelector('[role="dialog"]')`);
    console.log(`  2.4 Escape key dismisses modal: ${modalClosedAfterEsc}`);
    results.search.escKeyDismissal = modalClosedAfterEsc;

    // ==========================================
    // 3. NAVIGATION, SCROLL & ACCESSIBILITY
    // ==========================================
    console.log("\n--- 3. NAVIGATION & ACCESSIBILITY TESTS ---");

    // 3.1 Skip to main content link
    const skipLinkHref = await client.eval(`document.querySelector('a[href="#main-content"]')?.getAttribute('href')`);
    const mainHasId = await client.eval(`!!document.getElementById('main-content')`);
    console.log(`  3.1 Skip-to-content landmark link: href=${skipLinkHref}, targetExists=${mainHasId}`);
    results.accessibility.skipToContent = skipLinkHref === '#main-content' && mainHasId;

    // 3.2 Back to top button visibility and click
    await client.eval(`window.scrollTo(0, 1500); window.dispatchEvent(new Event('scroll'));`);
    await sleep(500);
    const backToTopVisible = await client.eval(`
      (() => {
        const btn = document.querySelector('button[aria-label="Scroll back to top of page"]');
        return btn && !btn.classList.contains('opacity-0');
      })()
    `);
    console.log(`  3.2 Back to top visible when scrolled down: ${backToTopVisible}`);
    results.navigation.backToTopVisible = backToTopVisible;

    // Click back to top
    await client.eval(`
      document.querySelector('button[aria-label="Scroll back to top of page"]')?.click();
    `);
    await sleep(1000);
    const finalScrollY = await client.eval(`window.scrollY`);
    console.log(`  3.2 Scroll position after back-to-top click: ${finalScrollY}px`);
    results.navigation.backToTopScrolls = finalScrollY === 0;

    // 3.3 Horizontal overflow check (Desktop 1440x900)
    const deskOverflow = await client.eval(`document.documentElement.scrollWidth <= window.innerWidth`);
    console.log(`  3.3 Desktop (1440x900) zero horizontal overflow: ${deskOverflow}`);
    results.accessibility.desktopNoOverflow = deskOverflow;

    // 3.4 Mobile (390x844) viewport test
    await client.setViewport(390, 844, true);
    await sleep(500);
    const mobOverflow = await client.eval(`document.documentElement.scrollWidth <= window.innerWidth`);
    console.log(`  3.4 Mobile (390x844) zero horizontal overflow: ${mobOverflow}`);
    results.accessibility.mobileNoOverflow = mobOverflow;

    // Test mobile menu open
    await client.eval(`document.querySelector('button[aria-label="Open navigation menu"]')?.click()`);
    await sleep(400);
    const mobileMenuOpen = await client.eval(`!!document.getElementById('mobile-navigation-dialog')`);
    console.log(`  3.4 Mobile hamburger menu opens: ${mobileMenuOpen}`);
    results.navigation.mobileMenuDrawer = mobileMenuOpen;

    await client.captureScreenshot('qa_mobile_dark_390x844.png');

    // Close mobile menu
    await client.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // ==========================================
    // 4. CONTENT, FAQ & FEEDBACK
    // ==========================================
    console.log("\n--- 4. CONTENT, FAQ & FEEDBACK TESTS ---");

    // Reset to desktop viewport
    await client.setViewport(1440, 900, false);
    await sleep(300);

    // 4.1 FAQ Accordion interaction
    await client.eval(`document.getElementById('faq')?.scrollIntoView();`);
    await sleep(400);
    const faqItemInitialOpen = await client.eval(`
      document.getElementById('faq-answer-roles') !== null
    `);
    console.log(`  4.1 FAQ initial item 'roles' open: ${faqItemInitialOpen}`);
    results.content.faqInitialOpen = faqItemInitialOpen;

    // Toggle second item ('phonepe-audit')
    await client.eval(`
      document.querySelector('button[aria-controls="faq-answer-phonepe-audit"]')?.click();
    `);
    await sleep(400);
    const faqPhonePeOpen = await client.eval(`
      document.getElementById('faq-answer-phonepe-audit') !== null
    `);
    const faqPhonePeText = await client.eval(`
      document.getElementById('faq-answer-phonepe-audit')?.textContent || ''
    `);
    const hasPhonePeValuation = faqPhonePeText.includes('41,631 Cr') && faqPhonePeText.includes('14.92%');
    console.log(`  4.1 FAQ PhonePe item toggles: open=${faqPhonePeOpen}, mentionsMethodology=${hasPhonePeValuation}`);
    results.content.faqAccordionExpansion = faqPhonePeOpen && hasPhonePeValuation;

    // 4.2 Hero email copy button feedback
    await client.eval(`window.scrollTo(0, 0);`);
    await sleep(400);
    const copyButtonExists = await client.eval(`
      !!document.querySelector('button[title*="kaustubhnandurkar21@gmail.com"]')
    `);
    console.log(`  4.2 Hero quick copy button exists: ${copyButtonExists}`);
    results.content.heroCopyButton = copyButtonExists;

    // 4.3 Contact form mailto wording check
    const submitBtnText = await client.eval(`
      document.querySelector('#contact form button[type="submit"]')?.textContent.trim() || ''
    `);
    const hasTruthfulWording = submitBtnText.includes('Email Client') || submitBtnText.includes('Mail Client');
    console.log(`  4.3 Contact form submit button text: "${submitBtnText}" (Truthful: ${hasTruthfulWording})`);
    results.content.contactFormTruthful = hasTruthfulWording;

    // Print stylesheet presence
    const printRulesCount = await client.eval(`
      (() => {
        let count = 0;
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.media && rule.media.mediaText.includes('print')) {
                count += rule.cssRules.length;
              }
            }
          } catch {}
        }
        return count;
      })()
    `);
    console.log(`  4.4 Active print stylesheet CSS rules found: ${printRulesCount}`);
    results.content.printStyles = printRulesCount > 0;

    // 4.5 Phase 2.1 Availability Indicator & Engagement Popover
    const availBtnLabel = await client.eval(`
      document.querySelector('button[aria-label*="Availability status"]')?.getAttribute('aria-label') || ''
    `);
    await client.eval(`document.querySelector('button[aria-label*="Availability status"]')?.click();`);
    await sleep(300);
    const availPopoverVisible = await client.eval(`
      !!document.querySelector('div[role="dialog"][aria-label*="Engagement"]')
    `);
    await client.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(200);
    const hasAvailIndicator = availBtnLabel.includes('Available') && availPopoverVisible;
    console.log(`  4.5 Availability Indicator & Popover: ${hasAvailIndicator} (label="${availBtnLabel}")`);
    results.content.availabilityIndicator = hasAvailIndicator;

    // 4.6 Phase 2.2 Evidence Telemetry Bar
    const telemetryItemsCount = await client.eval(`
      document.querySelectorAll('section[aria-label*="Telemetry"] dd').length
    `);
    const hasAllFourMetrics = telemetryItemsCount === 4;
    console.log(`  4.6 Evidence Telemetry Bar Metrics Rendered: ${telemetryItemsCount} (Expected: 4)`);
    results.content.evidenceTelemetry = hasAllFourMetrics;

    console.log("\n" + "=" .repeat(60));
    console.log("FINAL AUDIT RESULTS SUMMARY");
    console.log("=" .repeat(60));
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error("QA Execution Error:", err);
  } finally {
    if (chromeProc) chromeProc.kill();
    if (serverStartedByScript && serverProc) serverProc.kill();
    try {
      fs.rmSync(TEMP_USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  }
}

runQA();
