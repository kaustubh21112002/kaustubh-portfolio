# Environment Setup & Developer Guide (SETUP.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Prerequisites & Tooling

To develop, audit, and build this portfolio, ensure the following tools are installed:

- **Node.js:** `v20.x` or later (LTS recommended).
- **npm:** `v10.x` or later.
- **Git:** `2.40+`
- **Operating System:** Windows 11 / macOS / Linux.
  *(Note for Windows: When running scripts in PowerShell, use `cmd /c` to avoid `.ps1` execution policy blocks).*

---

## 2. Installation & Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kaustubh21112002/kaustubh-portfolio.git
   cd portfolio
   ```

2. **Checkout the active feature branch:**
   ```bash
   git checkout feature/phonepe-valuation-waterfall
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

---

## 3. Environment Variables Configuration

The frontend application requires **zero** environment variables for standard local development or static preview.

For the serverless contact endpoint (`api/contact.ts`), create a `.env.local` file in the root if you wish to test Slack webhook dispatch locally:

```ini
# Server-side only (NEVER prefix with VITE_)
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

> [!NOTE]
> If `SLACK_WEBHOOK_URL` is omitted, the API returns an honest HTTP 503 (`SERVICE_UNCONFIGURED`) and the frontend falls back to generating a mailto link and copying the message to the user's clipboard.

---

## 4. Verification & Testing Commands

Run the full testing and quality assurance suite:

```bash
# 1. Strict TypeScript validation (Application & API)
npm run typecheck

# 2. Valuation engine math tests (22 test assertions)
node scripts/test_valuation_math.mjs

# 3. Contact API contract & error handling tests (9 test assertions)
node scripts/test_contact_api.mjs

# 4. Shareable URL deep linking and history navigation tests (6 test assertions)
node scripts/test_shareable_urls.mjs
```

---

## 5. Production Build & Preview

```bash
# Compile and package for production
npm run build

# Start local production preview
npm run preview
```

### Critical Resume Protection Step
`npm run build` triggers `build:resume` which regenerates a 96,442-byte PDF file. **You must immediately restore the official protected resume artifact:**
```bash
git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf
```
Verify the restored hash:
```bash
node -e "const fs=require('fs'), crypto=require('crypto'); const b=fs.readFileSync('public/Kaustubh_Nandurkar_Resume.pdf'); console.log(b.length, crypto.createHash('sha1').update(b).digest('hex').toUpperCase());"
# Output must be: 96435 317857D88309548D9D05E8198FFBF8212C88470C
```

---

## 6. Vercel Deployment

The application is deployed on Vercel via GitHub continuous integration.

- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Serverless Runtime:** Node.js 20.x

---

## 7. Cross References
- System Architecture: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)
- Testing Guide: [`TESTING.md`](file:///TESTING.md)
- Debugging & Troubleshooting: [`DEBUGGING.md`](file:///DEBUGGING.md)

