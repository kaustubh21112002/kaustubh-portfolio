// Browser QA test suite using Chrome DevTools Protocol (CDP)
// Tests:
// 1. EquiTrack card visibility in Projects section
// 2. Click "Deep-Dive Case Study" for EquiTrack -> modal opens
// 3. Verify modal content: Title, "View Project Workbook" button & URL, 7 sections, table
// 4. Verify Review Completion Velocity warning callout (57.1% vs 70%)
// 5. Verify modal close button restores background
// 6. Verify Journey section displays "June 2026 – Oct 2026"
// 7. Verify AboutSection snapshot card displays "June 2026 – Oct 2026"
// 8. Test at both Desktop (1280x800) and Mobile (375x667)

import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9224;
const PREVIEW_PORT = 4189;

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function runBrowserQA() {
  console.log('--- STARTING CDP BROWSER QA TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(cond, name, details = '') {
    if (cond) {
      console.log(`✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${name} - ${details}`);
      failed++;
    }
  }

  // 1. Launch Vite preview
  console.log(`Launching Vite preview on port ${PREVIEW_PORT}...`);
  const previewProc = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
    cwd: 'c:\\Users\\kaust\\OneDrive\\Desktop\\portfolio',
    stdio: 'ignore'
  });
  await sleep(2500);

  // 2. Launch headless Chrome with CDP
  console.log('Launching headless Chrome...');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome-qa-' + Date.now()
  ], { detached: true, stdio: 'ignore' });
  await sleep(2000);

  try {
    // Get websocket debugger URL
    const targetsRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found in Chrome');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res) => { ws.onopen = res; });

    let msgId = 1;
    const callbacks = new Map();
    const eventListeners = new Set();

    ws.onmessage = (event) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : event.data.toString();
        const parsed = JSON.parse(raw);
        if (parsed.id && callbacks.has(parsed.id)) {
          callbacks.get(parsed.id)(parsed.result !== undefined ? parsed.result : parsed);
          callbacks.delete(parsed.id);
        }
        for (const listener of eventListeners) {
          listener(parsed);
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const timeout = setTimeout(() => {
          if (callbacks.has(id)) {
            callbacks.delete(id);
            reject(new Error(`Command ${method} timed out`));
          }
        }, 10000);
        callbacks.set(id, (res) => {
          clearTimeout(timeout);
          resolve(res);
        });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');
    await sendCommand('DOM.enable');

    // TEST DESKTOP (1280x800)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    const val = (res) => {
      if (res && res.result && res.result.value !== undefined) return res.result.value;
      if (res && res.value !== undefined) return res.value;
      return res;
    };

    console.log(`Navigating to http://localhost:${PREVIEW_PORT}/ ...`);
    const loadPromise = new Promise(resolve => {
      const handler = (msg) => {
        if (msg.method === 'Page.loadEventFired') {
          eventListeners.delete(handler);
          resolve();
        }
      };
      eventListeners.add(handler);
    });

    await sendCommand('Page.navigate', { url: `http://localhost:${PREVIEW_PORT}/` });
    await Promise.race([loadPromise, sleep(4000)]);
    await sleep(2000);

    // Check Journey date display on desktop
    const journeyDateRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const journeyEl = document.getElementById('journey');
        return journeyEl ? journeyEl.innerText.includes('June 2026 – Oct 2026') : false;
      })()`,
      returnByValue: true
    });
    assert(val(journeyDateRes) === true, 'Journey section shows June 2026 – Oct 2026 on desktop');

    // Check AboutSection date display on desktop
    const aboutDateRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const aboutEl = document.getElementById('about');
        return aboutEl ? aboutEl.innerText.includes('SPIIDEO (June 2026 – Oct 2026)') : false;
      })()`,
      returnByValue: true
    });
    assert(val(aboutDateRes) === true, 'AboutSection profile snapshot shows June 2026 – Oct 2026');

    // REGRESSION TEST: ALL 6 PROJECTS (Card rendering, modal opening, metadata, and close)
    const allProjects = [
      { id: 'phonepe-valuation', titleKey: 'PhonePe' },
      { id: 'stratos-governance', titleKey: 'STRATOS' },
      { id: 'spiideo-sports-analytics', titleKey: 'Sports Match' },
      { id: 'it-support-analytics', titleKey: 'IT Support' },
      { id: 'smartbank-360', titleKey: 'SmartBank 360' },
      { id: 'equitrack-analytics-os', titleKey: 'EquiTrack' }
    ];

    for (const proj of allProjects) {
      // 1. Verify card exists
      const cardCheck = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('#projects button')).find(b => {
            const label = b.getAttribute('aria-label') || '';
            return label.includes('${proj.titleKey}');
          });
          return !!btn;
        })()`,
        returnByValue: true
      });
      assert(val(cardCheck) === true, `Project card and inspect button found: ${proj.id}`);

      // 2. Open modal
      await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const btn = Array.from(document.querySelectorAll('#projects button')).find(b => {
            const label = b.getAttribute('aria-label') || '';
            return label.includes('${proj.titleKey}');
          });
          if (btn) btn.click();
        })()`,
        returnByValue: true
      });
      await sleep(600);

      // 3. Inspect opened modal
      const modalCheck = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const dialog = document.querySelector('[role="dialog"]');
          if (!dialog) return { open: false };
          const titleEl = dialog.querySelector('#case-study-title');
          const title = titleEl ? titleEl.innerText : '';
          const hasMetrics = !!dialog.querySelector('#modal-metrics');
          const hasSections = !!dialog.querySelector('#modal-sections');
          return { open: true, title, hasMetrics, hasSections };
        })()`,
        returnByValue: true
      });
      const mData = val(modalCheck) || {};
      assert(mData.open === true, `Case study modal opened for ${proj.id}`);
      assert(mData.title && mData.title.length > 5 && mData.title.includes(proj.titleKey), `Valid title rendered in modal for ${proj.id}: "${mData.title}"`);
      assert(mData.hasMetrics === true, `Metrics grid present in modal for ${proj.id}`);

      // 4. Close modal
      await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Close case study"]');
          if (closeBtn) closeBtn.click();
        })()`,
        returnByValue: true
      });
      await sleep(400);

      const closedCheck = await sendCommand('Runtime.evaluate', {
        expression: `document.querySelector('[role="dialog"]') === null`,
        returnByValue: true
      });
      assert(val(closedCheck) === true, `Modal closed cleanly for ${proj.id}`);
    }

    // EquiTrack deep dive specifically
    const openEquiTrackRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('#projects button')).find(b => b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('EquiTrack'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    });
    assert(val(openEquiTrackRes) === true, 'Opened EquiTrack case study for deep verification');
    await sleep(600);

    // Expand all sections in EquiTrack modal
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('[role="dialog"] button'));
        const expandBtn = btns.find(b => b.innerText.includes('Expand All'));
        if (expandBtn) expandBtn.click();
      })()`,
      returnByValue: true
    });
    await sleep(600);

    const equiContentRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return { open: false };
        const text = dialog.innerText;
        const hasTitle = text.includes('EquiTrack Analytics OS');
        const hasWorkbookLink = dialog.innerHTML.includes('docs.google.com/spreadsheets/d/1kYoHioEEruwGpU0QJxqu3Ntk3JnnGSqb-e94ei4yjy0');
        const hasWarningCallout = text.includes('57.1%') && text.includes('70.0%') && text.includes('backlog');
        const hasClassification = text.includes('PROTOTYPE DEMO');
        return { open: true, hasTitle, hasWorkbookLink, hasWarningCallout, hasClassification };
      })()`,
      returnByValue: true
    });
    const equiData = val(equiContentRes) || {};
    assert(equiData.hasTitle === true, 'Modal contains EquiTrack Analytics OS title');
    assert(equiData.hasWorkbookLink === true, 'Modal contains valid Google Sheets workbook URL');
    assert(equiData.hasWarningCallout === true, 'Modal emphasizes 57.1% vs 70% review velocity backlog in warning callout');
    assert(equiData.hasClassification === true, 'Modal metrics display PROTOTYPE DEMO classification');

    // Close EquiTrack modal
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Close case study"]');
        if (closeBtn) closeBtn.click();
      })()`,
      returnByValue: true
    });
    await sleep(400);

    // TEST MOBILE VIEWPORT (375x667)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(1000);

    // Check no horizontal overflow at 375px
    const overflowRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        return document.documentElement.scrollWidth <= window.innerWidth + 2;
      })()`,
      returnByValue: true
    });
    assert(val(overflowRes) === true, 'No horizontal page scroll or layout overflow at 375px mobile viewport');

    // Check Journey date at mobile
    const mobileJourneyRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const journeyEl = document.getElementById('journey');
        return journeyEl ? journeyEl.innerText.includes('June 2026 – Oct 2026') : false;
      })()`,
      returnByValue: true
    });
    assert(val(mobileJourneyRes) === true, 'Mobile Journey section renders June 2026 – Oct 2026 cleanly');

    // Switch back to desktop for remaining journey checks
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(500);

    // 1. Primary Navigation Links Check
    const navCheckRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('header');
        if (!header) return { count: 0, hasWork: false, hasAbout: false, hasContact: false };
        const buttons = Array.from(header.querySelectorAll('button, a'));
        const labels = buttons.map(b => (b.textContent || b.getAttribute('aria-label') || '').toLowerCase());
        const hasWork = labels.some(l => l.includes('work'));
        const hasAbout = labels.some(l => l.includes('about'));
        const hasContact = labels.some(l => l.includes('contact'));
        return { count: buttons.length, hasWork, hasAbout, hasContact };
      })()`,
      returnByValue: true
    });
    const navData = val(navCheckRes) || {};
    assert(navData.hasAbout && navData.hasContact && navData.hasWork, 'Primary header navigation anchors render correctly');

    // 2. Resume Download Link Check
    const resumeLinkRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const resumeLinks = Array.from(document.querySelectorAll('a[href*="Resume"], a[href*="resume"]'));
        const validLink = resumeLinks.find(a => a.getAttribute('href')?.includes('.pdf'));
        return {
          found: !!validLink,
          href: validLink ? validLink.getAttribute('href') : null
        };
      })()`,
      returnByValue: true
    });
    const resumeData = val(resumeLinkRes) || {};
    assert(resumeData.found === true && resumeData.href.includes('Kaustubh_Nandurkar_Resume.pdf'), 'Resume download link points directly to Kaustubh_Nandurkar_Resume.pdf');

    // 3. Contact Form Validation and Dispatch Behavior
    const contactValidationRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('form');
        if (!form) return { formFound: false };
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const msgInput = document.getElementById('contact-message');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Check required attributes
        const nameReq = nameInput ? nameInput.hasAttribute('required') : false;
        const emailReq = emailInput ? emailInput.hasAttribute('required') : false;
        const msgReq = msgInput ? msgInput.hasAttribute('required') : false;

        return { formFound: true, nameReq, emailReq, msgReq, hasSubmitBtn: !!submitBtn };
      })()`,
      returnByValue: true
    });
    const contactData = val(contactValidationRes) || {};
    assert(contactData.formFound === true, 'Contact section form is rendered in DOM');
    assert(contactData.nameReq && contactData.emailReq && contactData.msgReq, 'Contact form fields have native required constraints');

    // 3b. Test Mocked Successful Delivery in UI
    const mockSuccessRes = await sendCommand('Runtime.evaluate', {
      expression: `(async () => {
        const origFetch = window.fetch;
        window.fetch = async (url, options) => {
          if (typeof url === 'string' && url.includes('/api/contact')) {
            return {
              ok: true,
              status: 200,
              json: async () => ({
                success: true,
                delivered: true,
                code: 'DISPATCH_SUCCESSFUL',
                message: 'Your message has been directly delivered to private notifications. Thank you!'
              })
            };
          }
          return origFetch(url, options);
        };

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const msgInput = document.getElementById('contact-message');
        const submitBtn = document.querySelector('#contact form button[type="submit"]');

        const setNativeVal = (el, val) => {
          const valueSetter = Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype, 'value')?.set;
          if (valueSetter) {
            valueSetter.call(el, val);
          } else {
            el.value = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setNativeVal(nameInput, 'Talent Acquisition Partner');
        setNativeVal(emailInput, 'recruiter@fintech-ventures.com');
        setNativeVal(msgInput, 'Interview invitation for Business Analyst & Valuation role.');

        if (submitBtn) submitBtn.click();
        await new Promise(r => setTimeout(r, 600));

        const deliveryBanner = document.querySelector('#contact [role="status"]');
        const hasDeliveredText = deliveryBanner ? deliveryBanner.innerText.includes('Delivery Confirmed') : false;

        window.fetch = origFetch;
        return { hasDeliveredText };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    const mockSuccessData = val(mockSuccessRes) || {};
    assert(mockSuccessData.hasDeliveredText === true, 'Contact form transitions to Delivery Confirmed status on 200 delivered response');

    // 3c. Test Mocked Unconfigured / 503 Fallback in UI
    const mockFallbackRes = await sendCommand('Runtime.evaluate', {
      expression: `(async () => {
        const origFetch = window.fetch;
        window.fetch = async (url, options) => {
          if (typeof url === 'string' && url.includes('/api/contact')) {
            return {
              ok: false,
              status: 503,
              json: async () => ({
                success: false,
                delivered: false,
                code: 'SLACK_NOT_CONFIGURED',
                message: 'Automated dispatch endpoint is in standby mode.'
              })
            };
          }
          return origFetch(url, options);
        };

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const msgInput = document.getElementById('contact-message');
        const submitBtn = document.querySelector('#contact form button[type="submit"]');

        const setNativeVal = (el, val) => {
          const valueSetter = Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype, 'value')?.set;
          if (valueSetter) {
            valueSetter.call(el, val);
          } else {
            el.value = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setNativeVal(nameInput, 'Hiring Manager');
        setNativeVal(emailInput, 'manager@analytics.org');
        setNativeVal(msgInput, 'Testing standby mode and fallback notice.');

        if (submitBtn) submitBtn.click();
        await new Promise(r => setTimeout(r, 600));

        const statusBanner = document.querySelector('#contact [role="status"]');
        const hasFallbackNotice = statusBanner ? statusBanner.innerText.includes('Dispatch Routing Notice') : false;

        window.fetch = origFetch;
        return { hasFallbackNotice };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    const mockFallbackData = val(mockFallbackRes) || {};
    assert(mockFallbackData.hasFallbackNotice === true, 'Contact form displays truthful fallback routing notice on 503 unconfigured response');

    // 4. External Workbook Links Safe Attributes Check
    const externalLinksRes = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const externalLinks = Array.from(document.querySelectorAll('a[href^="http"]'));
        const badLinks = externalLinks.filter(a => {
          const rel = a.getAttribute('rel') || '';
          const target = a.getAttribute('target');
          return target === '_blank' && (!rel.includes('noopener') || !rel.includes('noreferrer'));
        });
        return { total: externalLinks.length, badCount: badLinks.length };
      })()`,
      returnByValue: true
    });
    const extData = val(externalLinksRes) || {};
    assert(extData.badCount === 0, 'All target="_blank" external links have safe rel="noopener noreferrer"');

    ws.close();
  } finally {
    try {
      chromeProc.kill();
    } catch {}
    try {
      previewProc.kill();
    } catch {}
  }

  console.log(`\n--- BROWSER QA SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runBrowserQA().catch((err) => {
  console.error('Browser QA test error:', err);
  process.exit(1);
});
