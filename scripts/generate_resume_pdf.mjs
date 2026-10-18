import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Central single source of truth data imports
import { portfolioConfig } from '../src/config/portfolio.ts';
import { projects } from '../src/data/projects.ts';
import { getResumeSkillCategories } from '../src/data/skills.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function buildResumeHtml() {
  const resumeProjects = projects
    .filter((p) => p.includeInResume && p.status !== 'In Progress' && p.resumeHighlight)
    .sort((a, b) => (a.resumeHighlight?.order ?? 99) - (b.resumeHighlight?.order ?? 99));

  const skillCategories = getResumeSkillCategories();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${portfolioConfig.fullName} - Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 12mm 8mm 12mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    background: #ffffff;
    font-size: 8.5pt;
    line-height: 1.34;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  a {
    color: #0f172a;
    text-decoration: none;
  }

  /* Header */
  .header {
    text-align: center;
    padding-bottom: 5px;
    border-bottom: 2px solid #0f172a;
    margin-bottom: 6px;
  }

  .name {
    font-size: 19pt;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #0f172a;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .role {
    font-size: 9.5pt;
    font-weight: 700;
    color: #dc2626;
    margin-top: 2.5px;
    letter-spacing: 0.5px;
  }

  .contact-bar {
    font-size: 8pt;
    color: #475569;
    margin-top: 3.5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }

  .contact-bar span.separator {
    color: #94a3b8;
    font-weight: bold;
  }

  .contact-bar a {
    color: #0f172a;
    font-weight: 500;
  }

  .contact-bar a:hover {
    text-decoration: underline;
  }

  /* Section Styling */
  .section {
    margin-bottom: 5.5px;
  }

  .section-title {
    font-size: 8.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.9px;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 1px;
    margin-bottom: 3.5px;
  }

  /* Career Objective */
  .objective-text {
    font-size: 8.1pt;
    color: #1e293b;
    line-height: 1.35;
    text-align: justify;
  }

  /* Skills */
  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .skill-row {
    font-size: 8.1pt;
    line-height: 1.3;
    color: #1e293b;
  }

  .skill-label {
    font-weight: 700;
    color: #0f172a;
  }

  /* Item Header */
  .item-group {
    margin-bottom: 4.5px;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 8.4pt;
    line-height: 1.28;
  }

  .item-title {
    font-weight: 700;
    color: #0f172a;
  }

  .item-subtitle {
    font-weight: 600;
    color: #334155;
    margin-left: 3px;
  }

  .item-date {
    font-size: 7.8pt;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }

  .item-subdetail {
    font-size: 7.8pt;
    color: #475569;
    font-style: italic;
    margin-bottom: 2px;
    margin-top: 0.5px;
  }

  /* Natural-order bullets with hanging indent */
  ul.bullets {
    list-style-type: none;
    padding-left: 0;
    margin-top: 1.5px;
  }

  ul.bullets li {
    font-size: 8.05pt;
    line-height: 1.32;
    color: #1e293b;
    margin-bottom: 1.5px;
    padding-left: 11px;
    text-indent: -11px;
  }

  ul.bullets li .bullet-symbol {
    color: #dc2626;
    font-weight: bold;
    display: inline-block;
    width: 11px;
  }

  /* Certifications */
  .cert-list {
    display: flex;
    flex-direction: column;
    gap: 1.5px;
  }

  .cert-item {
    font-size: 8.05pt;
    color: #1e293b;
    line-height: 1.28;
  }

  .cert-item .bullet-symbol {
    color: #dc2626;
    font-weight: bold;
    display: inline-block;
    width: 11px;
  }

  .cert-name {
    font-weight: 600;
    color: #0f172a;
  }

  .cert-meta {
    color: #475569;
  }
</style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <h1 class="name">${portfolioConfig.fullName}</h1>
    <div class="role">${portfolioConfig.role}</div>
    <div class="contact-bar">
      <span><a href="tel:${portfolioConfig.socials.phone?.replace(/\\s+/g, '')}">${portfolioConfig.socials.phone}</a></span>
      <span class="separator">•</span>
      <span><a href="mailto:${portfolioConfig.socials.email}">${portfolioConfig.socials.email}</a></span>
      <span class="separator">•</span>
      <span><a href="${portfolioConfig.socials.linkedIn}" target="_blank">linkedin.com/in/kaustubhnandurkar</a></span>
      <span class="separator">•</span>
      <span><a href="${portfolioConfig.socials.github}" target="_blank">github.com/kaustubh21112002</a></span>
      <span class="separator">•</span>
      <span>${portfolioConfig.socials.location || portfolioConfig.location}</span>
    </div>
  </header>

  <!-- Career Objective -->
  <section class="section">
    <h2 class="section-title">Career Objective</h2>
    <p class="objective-text">
      ${portfolioConfig.objective || portfolioConfig.shortBio}
    </p>
  </section>

  <!-- Technical & Professional Skills -->
  <section class="section">
    <h2 class="section-title">Core Competencies & Technical Skills</h2>
    <div class="skills-list">
      ${skillCategories.map(cat => `
        <div class="skill-row">
          <span class="skill-label">• ${cat.category}:</span>
          <span>${cat.skills.join(' | ')}</span>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Professional Experience -->
  <section class="section">
    <h2 class="section-title">Professional Experience</h2>
    ${portfolioConfig.experience.map(exp => `
      <div class="item-group">
        <div class="item-header">
          <div>
            <span class="item-title">${exp.organization}</span>
            <span class="item-subtitle">| ${exp.role}</span>
          </div>
          <span class="item-date">${exp.period}</span>
        </div>
        <ul class="bullets">
          ${exp.responsibilities.map(r => `<li><span class="bullet-symbol">•</span>${r}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </section>

  <!-- Highlighted Analytical Projects -->
  <section class="section">
    <h2 class="section-title">Featured Analytical Projects</h2>
    ${resumeProjects.map(p => {
      let displayTitle = p.title;
      let displayRole = p.resumeHighlight?.role || p.category;
      if (p.id === 'stratos-governance') {
        displayTitle = 'STRATOS AI';
        displayRole = 'Controlled Business Analytics & KPI Governance';
      } else if (p.id === 'phonepe-valuation') {
        displayTitle = 'PhonePe Limited';
        displayRole = 'Pre-IPO Equity Research & Valuation';
      }
      return `
      <div class="item-group">
        <div class="item-header">
          <div>
            <span class="item-title">${displayTitle}</span>
            <span class="item-subtitle">| ${displayRole}</span>
          </div>
          <span class="item-date">${p.date}</span>
        </div>
        <ul class="bullets">
          ${(p.resumeHighlight?.bulletPoints || []).map(bp => `<li><span class="bullet-symbol">•</span>${bp}</li>`).join('')}
        </ul>
      </div>
      `;
    }).join('')}
  </section>

  <!-- Academic Qualifications -->
  <section class="section">
    <h2 class="section-title">Academic Qualifications</h2>
    ${portfolioConfig.education.map(edu => `
      <div class="item-group" style="margin-bottom: 3.5px;">
        <div class="item-header">
          <div>
            <span class="item-title">${edu.degree}</span>
            <span class="item-subtitle">| ${edu.institution}</span>
          </div>
          <span class="item-date">${edu.period}</span>
        </div>
        ${edu.details ? `<div class="item-subdetail">${edu.details}</div>` : ''}
      </div>
    `).join('')}
  </section>

  <!-- Certifications -->
  <section class="section" style="margin-bottom: 0;">
    <h2 class="section-title">Certifications</h2>
    <div class="cert-list">
      ${portfolioConfig.certifications.map(c => `
        <div class="cert-item">
          <span class="bullet-symbol">•</span>
          <span class="cert-name">${c.name}</span>
          <span class="cert-meta">— ${c.issuer} (${c.year})</span>
        </div>
      `).join('')}
    </div>
  </section>

</body>
</html>`;
}

export async function generateResumePdf(outputPath, screenshotPath = null) {
  // Vercel cloud environment check: Vercel build containers lack Chromium.
  // Use the verified, committed PDF and proceed with TypeScript check and Vite build.
  if (process.env.VERCEL === '1' || process.env.NOW_BUILDER === '1') {
    if (fs.existsSync(outputPath)) {
      console.log(`[Resume PDF] Vercel cloud build environment detected (VERCEL=1). Using verified committed resume at: ${outputPath}`);
      return outputPath;
    }
  }

  const browserPath = findBrowser();
  if (!browserPath) {
    throw new Error(
      `[Resume PDF] Generation Failed: No Chromium-based browser (Chrome or Edge) was detected.\n` +
      `The downloadable resume PDF must be compiled from verified portfolio data using a Chromium headless browser.\n` +
      `Please ensure Google Chrome or Microsoft Edge is installed in the local environment.`
    );
  }

  const htmlContent = buildResumeHtml();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-resume-gen-'));
  const port = 9444 + Math.floor(Math.random() * 500);

  const chromeProcess = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=794,1123',
    `--user-data-dir=${tmpDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    let wsUrl = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 150));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          const data = await res.json();
          wsUrl = data.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) {
      throw new Error(`Failed to establish CDP connection on port ${port}`);
    }

    const newTargetRes = await fetch(`http://127.0.0.1:${port}/json/new`, { method: 'PUT' });
    const target = await newTargetRes.json();
    const targetWsUrl = target.webSocketDebuggerUrl;

    const ws = new WebSocket(targetWsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === id) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(new Error(resp.error.message));
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
      mobile: false
    });

    const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

    const navPromise = new Promise((resolve) => {
      const handler = (evt) => {
        const resp = JSON.parse(evt.data);
        if (resp.method === 'Page.loadEventFired') {
          ws.removeEventListener('message', handler);
          resolve();
        }
      };
      ws.addEventListener('message', handler);
    });

    await sendCommand('Page.navigate', { url: dataUri });
    await navPromise;

    // Small delay to ensure all font rendering and layouts settle
    await new Promise(r => setTimeout(r, 200));

    // Optional screenshot capture for visual review
    if (screenshotPath) {
      const screenshot = await sendCommand('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });
      const sDir = path.dirname(screenshotPath);
      if (!fs.existsSync(sDir)) fs.mkdirSync(sDir, { recursive: true });
      fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
      console.log(`[Resume PDF] Visual preview saved to: ${screenshotPath}`);
    }

    const pdfResult = await sendCommand('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      generateTaggedPDF: true
    });

    const pdfBuffer = Buffer.from(pdfResult.data, 'base64');
    const targetDir = path.dirname(outputPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`[Resume PDF] Generated successfully at: ${outputPath} (${pdfBuffer.length} bytes)`);

    ws.close();
    return outputPath;
  } finally {
    try {
      chromeProcess.kill();
    } catch (e) {}
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targetPath = process.argv[2] 
    ? path.resolve(process.cwd(), process.argv[2])
    : path.resolve(projectRoot, 'public', 'Kaustubh_Nandurkar_Resume.pdf');

  const screenshotPath = process.argv[3]
    ? path.resolve(process.cwd(), process.argv[3])
    : null;

  console.log(`[Resume PDF] Generating resume from governed portfolio data...`);
  generateResumePdf(targetPath, screenshotPath)
    .then(() => {
      console.log(`[Resume PDF] Done!`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`[Resume PDF] Failed:`, err);
      process.exit(1);
    });
}
