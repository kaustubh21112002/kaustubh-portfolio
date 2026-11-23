import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

async function runBrowserVerification() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\kaust\\AppData\\Local\\Temp\\chrome_verify_' + Date.now();
  const proc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    'http://127.0.0.1:4173'
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

  // Poll for debugger readiness
  let tabs = null;
  for (let attempt = 0; attempt < 15; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      tabs = await getJson('http://127.0.0.1:9222/json');
      if (tabs && tabs.length > 0) break;
    } catch (e) {
      // retry
    }
  }
  if (!tabs) throw new Error('Chrome remote debugging did not respond on port 9222');
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('4173')) || tabs[0];
  if (!targetTab) throw new Error('Target tab not found');

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(resolve => { ws.onopen = resolve; });

  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];
  const failedRequests = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result);
      callbacks.delete(msg.id);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    } else if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.status >= 400) {
        failedRequests.push({ url: msg.params.response.url, status: msg.params.response.status });
      }
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
  await send('Runtime.enable');
  await send('Network.enable');

  // Explicitly navigate and await load
  const loadPromise = new Promise(resolve => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired') {
        ws.removeEventListener('message', handler);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await Promise.race([loadPromise, new Promise(r => setTimeout(r, 3000))]);
  await new Promise(r => setTimeout(r, 1200));

  const report = {};

  // 1. Desktop Layout & Overflow
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));

  report.desktopOverflow = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`,
    returnByValue: true
  });

  // 2. Mobile Layout & Overflow at 390px
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 800));

  report.mobileOverflow = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`,
    returnByValue: true
  });

  // 3. Mobile Touch Targets Inspection
  report.mobileTouchTargets = await send('Runtime.evaluate', {
    expression: `(() => {
      const getBox = el => el ? {
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height)
      } : null;

      // Project card buttons
      const dcfBtn = document.querySelector('a[href="#flagship"]');
      const inspectBtn = document.querySelector('button[aria-label*="Inspect case study"]');
      const soundBtn = document.querySelector('button[aria-label*="sound"]');
      const navMenuBtn = document.querySelector('button[aria-label*="navigation menu"]');
      const heroExplore = document.querySelector('button[aria-label*="Explore flagship"]');
      const heroResume = document.querySelector('a[aria-label*="Download verified resume PDF from hero section"]');

      return {
        dcfModelBtn: getBox(dcfBtn),
        inspectCaseStudyBtn: getBox(inspectBtn),
        videoSoundToggleBtn: getBox(soundBtn),
        mobileNavMenuBtn: getBox(navMenuBtn),
        heroExploreWorkBtn: getBox(heroExplore),
        heroResumeBtn: getBox(heroResume)
      };
    })()`,
    returnByValue: true
  });

  // 4. Case Study Modal Test: Open -> Verify focus -> Escape dismissal
  const modalTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const inspectBtn = document.querySelector('button[aria-label*="Inspect case study"]');
      if (!inspectBtn) return { error: 'Inspect button not found' };
      inspectBtn.click();
      return { clicked: true };
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 600));

  report.caseStudyModalOpen = await send('Runtime.evaluate', {
    expression: `(() => {
      const dialog = document.querySelector('[role="dialog"][aria-labelledby="case-study-title"]');
      const title = document.getElementById('case-study-title')?.innerText;
      const activeEl = document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName;
      const closeBtn = document.querySelector('button[aria-label="Close case study"]');
      const evidenceBtn = dialog?.querySelector('a[aria-label*="View project evidence"]');
      const closeOverviewBtn = Array.from(dialog?.querySelectorAll('button') || []).find(b => b.innerText.includes('Close Overview'));
      
      const getBox = el => el ? { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;

      return {
        dialogPresent: !!dialog,
        title,
        activeElementFocused: activeEl,
        closeBtnTarget: getBox(closeBtn),
        evidenceBtnTarget: getBox(evidenceBtn),
        closeOverviewTarget: getBox(closeOverviewBtn)
      };
    })()`,
    returnByValue: true
  });

  // Press Escape on modal
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise(r => setTimeout(r, 500));

  report.caseStudyModalAfterEscape = await send('Runtime.evaluate', {
    expression: `(() => {
      const dialog = document.querySelector('[role="dialog"][aria-labelledby="case-study-title"]');
      return { dialogClosed: !dialog };
    })()`,
    returnByValue: true
  });

  // 5. PhonePe Valuation Scenarios: Switch Base -> Bear -> Bull and Verify Interactive Values & Export Modal
  report.valuationScenarios = {};

  for (const scen of ['bear', 'base', 'bull']) {
    // Click scenario tab
    const tabClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = document.getElementById('phonepe-tab-scenarios');
        if (tab) {
          tab.scrollIntoView();
          tab.click();
          return { tabFound: true };
        }
        return { tabFound: false };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 400));

    // Select scenario
    const scenClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.toLowerCase().includes('${scen} case'));
        if (btn) {
          btn.click();
          return { scenFound: true, text: btn.textContent.trim() };
        }
        return { scenFound: false };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 400));

    // Open export modal
    const exportClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.toLowerCase().includes('export 1-page summary'));
        if (btn) {
          btn.click();
          return { exportFound: true };
        }
        return { exportFound: false };
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 600));

    // Inspect export modal contents
    const modalData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('[data-valuation-modal="true"]');
        if (!modal) return { isOpen: false };
        const text = modal.innerText || '';
        const priceMatch = text.match(/₹([0-9,.]+)\\s*\\/\\s*share/i) || text.match(/₹([0-9,.]+)/);
        const evMatch = text.match(/₹([0-9,.]+)\\s*Cr/i);
        return {
          isOpen: true,
          priceMatch: priceMatch ? priceMatch[0] : null,
          evMatch: evMatch ? evMatch[0] : null,
          hasBasePrice: text.includes('₹821.78'),
          hasBearPrice: text.includes('₹645.46'),
          hasBullPrice: text.includes('₹1,065.91'),
          hasWacc: text.includes('14.92%'),
          hasSensitivityFormula: text.includes('33,432') || text.includes('ΔWACC'),
          modalClasses: modal.className
        };
      })()`,
      returnByValue: true
    });

    report.valuationScenarios[scen] = {
      tabClick: tabClick?.result?.value,
      scenClick: scenClick?.result?.value,
      exportClick: exportClick?.result?.value,
      modalInspection: modalData?.result?.value
    };

    // If base case, test Print to PDF layout (A4 and Letter)
    if (scen === 'base') {
      try {
        const a4Print = await send('Page.printToPDF', {
          paperWidth: 8.27,
          paperHeight: 11.69,
          marginTop: 0.2,
          marginBottom: 0.2,
          marginLeft: 0.2,
          marginRight: 0.2,
          printBackground: true
        });
        const letterPrint = await send('Page.printToPDF', {
          paperWidth: 8.5,
          paperHeight: 11.0,
          marginTop: 0.2,
          marginBottom: 0.2,
          marginLeft: 0.2,
          marginRight: 0.2,
          printBackground: true
        });
        report.printLayoutVerification = {
          a4Supported: !!a4Print?.data,
          a4ByteLength: a4Print?.data ? Buffer.from(a4Print.data, 'base64').length : 0,
          letterSupported: !!letterPrint?.data,
          letterByteLength: letterPrint?.data ? Buffer.from(letterPrint.data, 'base64').length : 0
        };
      } catch (err) {
        report.printLayoutVerification = { error: err.message };
      }
    }

    // Close export modal via close button
    await send('Runtime.evaluate', {
      expression: `document.querySelector('button[aria-label="Close valuation summary modal"]')?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // 6. Sound Toggle Interaction & Accessibility Check
  report.soundToggle = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label*="sound"]');
      if (!btn) return { error: 'Sound button not found' };
      const initialAriaPressed = btn.getAttribute('aria-pressed');
      const initialLabel = btn.getAttribute('aria-label');
      btn.click();
      return {
        initialLabel,
        initialAriaPressed,
        rect: { w: Math.round(btn.getBoundingClientRect().width), h: Math.round(btn.getBoundingClientRect().height) }
      };
    })()`,
    returnByValue: true
  });

  // 7. Keyboard Navigation & Visible Focus Ring Check
  for (let i = 0; i < 4; i++) {
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', windowsVirtualKeyCode: 9 });
    await new Promise(r => setTimeout(r, 100));
  }

  report.keyboardFocusState = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.activeElement;
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        text: (el.innerText || '').slice(0, 30).trim(),
        outline: style.outline,
        boxShadow: style.boxShadow,
        hasVisibleFocus: style.outlineStyle !== 'none' || style.boxShadow.includes('rgb')
      };
    })()`,
    returnByValue: true
  });

  // 8. Contact Section & Primary Actions Check
  report.contactActions = await send('Runtime.evaluate', {
    expression: `(() => {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      const copyBtn = document.querySelector('button[aria-label*="Copy"]');
      const resumeLink = document.querySelector('#contact a[href*="Resume"]');
      const getBox = el => el ? { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;
      return {
        emailLinkFound: !!emailLink,
        emailTarget: getBox(emailLink),
        copyBtnFound: !!copyBtn,
        copyTarget: getBox(copyBtn),
        resumeLinkFound: !!resumeLink,
        resumeTarget: getBox(resumeLink)
      };
    })()`,
    returnByValue: true
  });

  // 7. Error logs & failed network requests
  report.consoleErrors = consoleErrors;
  report.failedRequests = failedRequests;

  console.log('=== BROWSER VERIFICATION REPORT ===');
  console.log(JSON.stringify(report, null, 2));

  try { ws.close(); } catch (e) {}
  try { proc.kill(); } catch (e) {}
  process.exit(0);
}

runBrowserVerification().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
