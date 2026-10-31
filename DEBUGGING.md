# Debugging, Diagnostics & Troubleshooting (DEBUGGING.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Common Issues & Solutions

### 1.1 PowerShell Wrapper Execution Policy Block (`npx.ps1` / `npm.ps1`)
- **Symptom:** Running `npm` or `npx` commands fails in PowerShell with:
  `File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system.`
- **Root Cause:** Windows PowerShell execution policy restricts running unsigned PowerShell wrapper scripts.
- **Resolution:** Always wrap npm and npx commands in `cmd /c`:
  ```powershell
  cmd /c "npm run dev"
  cmd /c "npm run typecheck"
  cmd /c "npx vite build"
  ```

---

### 1.2 Resume PDF Checksum Mismatch After `npm run build`
- **Symptom:** Running `npm run build` alters the byte size of `public/Kaustubh_Nandurkar_Resume.pdf` from 96,435 bytes to 96,442 bytes, changing the SHA-1 checksum.
- **Root Cause:** `package.json` contains a pre-build step: `"build": "npm run build:resume && tsc ..."` which runs `generate_resume_pdf.mjs`.
- **Resolution:** The protected resume is an immutable hand-curated artifact. Always restore the protected file immediately following a build:
  ```powershell
  git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf
  ```
  Verify integrity:
  ```powershell
  node -e "const fs=require('fs'), crypto=require('crypto'); const b=fs.readFileSync('public/Kaustubh_Nandurkar_Resume.pdf'); console.log(b.length, crypto.createHash('sha1').update(b).digest('hex').toUpperCase());"
  # Must report: 96435 317857D88309548D9D05E8198FFBF8212C88470C
  ```

---

### 1.3 Mobile Viewport Horizontal Overflow (13px body scroll spill)
- **Symptom:** Mobile browsers or audit scripts report horizontal scrollability or `body.scrollWidth > window.innerWidth`.
- **Root Cause:** Deeply nested flex containers, sensitivity matrix tables, or full-bleed ambient gradients missing overflow constraints.
- **Resolution:**
  1. Inspect computed styles on offending elements.
  2. Ensure parent containers enforce `min-w-0` and `overflow-x: auto`.
  3. Enforce root-level clipping in `src/index.css`:
     ```css
     html, body {
       overflow-x: clip;
       max-width: 100vw;
     }
     ```

---

### 1.4 Contact Form Returns HTTP 503 (`SERVICE_UNCONFIGURED`)
- **Symptom:** In local development, submitting the contact form displays a notice: *"Direct message pipeline is temporarily unconfigured. Please use the direct mailto link."*
- **Root Cause:** The `SLACK_WEBHOOK_URL` environment variable is not defined in `.env.local`.
- **Resolution:** This is an intentional security design (`DEC-008`). The endpoint falls back gracefully to generating a pre-formatted `mailto:` link and copying the message to the clipboard. To test live webhook dispatch, add `SLACK_WEBHOOK_URL="https://hooks.slack.com/..."` to `.env.local`.

---

### 1.5 Video Auto-Download Causing Network / Performance Regressions
- **Symptom:** Mobile Lighthouse performance scores drop due to high bandwidth consumption on initial page load.
- **Root Cause:** Video elements configured with `preload="auto"` or `autoPlay` without user interaction.
- **Resolution:**
  - `personal-story.mp4` in `AboutSection.tsx` is configured with `preload="none"` and `onClick={togglePlayback}`. It fetches 0 bytes on load and does not fetch on scroll.
  - `intro.mp4` in `HeroSection.tsx` uses an instant WebP poster and respects `prefers-reduced-motion`.

---

### 1.6 Preview Server Port Collision (`EADDRINUSE: 4173`)
- **Symptom:** Running `npm run preview` fails with port 4173 in use or binds to 4174.
- **Resolution:**
  Find and kill the process holding port 4173:
  ```powershell
  $p = Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue
  if ($p) { Stop-Process -Id $p.OwningProcess -Force }
  ```

---

## 2. Cross References
- Environment Setup: [`SETUP.md`](file:///SETUP.md)
- Testing & Verification: [`TESTING.md`](file:///TESTING.md)
- Architectural Decisions: [`DECISIONS.md`](file:///DECISIONS.md)

