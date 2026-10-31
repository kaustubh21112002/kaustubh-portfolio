# Testing, Quality Assurance & Verification (TESTING.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Quality Assurance Philosophy & Standard

In accordance with STRATOS data governance principles:
> **"Do not declare success merely because code was written."**

All features, refactors, and performance improvements must pass automated verification suites and manual inspection before being staged or committed.

---

## 2. Test Suites & Verification Scripts

The repository contains automated test scripts located in `scripts/`:

```text
scripts/
├── test_valuation_math.mjs     # 22 tests: DCF formulas, sensitivity matrix, EV-to-Equity
├── test_contact_api.mjs        # 9 tests: HTTP contract, honeypot defense, 503 fallback
└── test_shareable_urls.mjs     # 6 tests: ?project= & &view=brief routing, popstate navigation
```

### 2.1 Valuation Math Verification (`scripts/test_valuation_math.mjs`)
Verifies the mathematical integrity of the financial modeling engine:
- **Enterprise Value (EV):** ₹33,431.99 Cr.
- **Equity Value:** ₹41,631.22 Cr.
- **Implied Share Price:** ₹821.78 per share.
- **WACC:** 14.92%.
- **Exit Multiple:** 13.15x Year 5 EBITDA.
- **Sensitivity Matrix:** 25 nodes correctly calculated across WACC (13.92%–15.92%) and Terminal Growth (4.0%–6.0%).
- **Execution:**
  ```bash
  node scripts/test_valuation_math.mjs
  # Expected: 22/22 tests passed
  ```

### 2.2 Contact API Contract Verification (`scripts/test_contact_api.mjs`)
Verifies the serverless contact endpoint behavior:
- Rejects malformed JSON with `400 Bad Request`.
- Rejects missing required fields with `400 Bad Request`.
- Detects honeypot trap completion (`website_url_check`) and blocks automated bots.
- Enforces payload bounds (minimum 10 chars, maximum 1,500 chars).
- Returns honest `503 Service Unavailable` when `SLACK_WEBHOOK_URL` is omitted.
- **Execution:**
  ```bash
  node scripts/test_contact_api.mjs
  # Expected: 9/9 tests passed
  ```

### 2.3 Deep-Link Routing Verification (`scripts/test_shareable_urls.mjs`)
Verifies URL synchronization with modal state:
- Direct navigation to `/?project=phonepe-valuation` opens the full Case Study Modal.
- Direct navigation to `/?project=stratos-governance&view=brief` opens the Executive Brief Modal.
- Unknown project IDs fall back gracefully to closed state without throwing exceptions.
- Native browser Back (`popstate`) closes modals cleanly.
- Native browser Forward restores modal state.
- **Execution:**
  ```bash
  node scripts/test_shareable_urls.mjs
  # Expected: 6/6 tests passed
  ```

---

## 3. Preflight & Release Verification Checklist

Before creating a commit or deploying, execute this checklist:

1. **TypeScript Validation:**
   ```bash
   cmd /c "npm run typecheck"
   ```
   *Must exit with 0 errors across both `tsconfig.json` and `tsconfig.api.json`.*

2. **Automated Unit & Contract Tests:**
   ```bash
   node scripts/test_valuation_math.mjs
   node scripts/test_contact_api.mjs
   node scripts/test_shareable_urls.mjs
   ```
   *All 37 test assertions must pass.*

3. **Production Build Compilation:**
   ```bash
   cmd /c "npm run build"
   ```
   *Must output optimized assets to `dist/` without compilation warnings.*

4. **Restore & Verify Protected Resume Artifact:**
   ```bash
   git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf
   node -e "const fs=require('fs'), crypto=require('crypto'); const b=fs.readFileSync('public/Kaustubh_Nandurkar_Resume.pdf'); console.log(b.length, crypto.createHash('sha1').update(b).digest('hex').toUpperCase());"
   ```
   *Must output exactly: `96435 317857D88309548D9D05E8198FFBF8212C88470C`.*

5. **Multi-Viewport Layout Overflow Verification:**
   Audit viewports at 375px, 430px, 768px, 1024px, and 1440px.
   *Ensure `document.documentElement.scrollWidth === document.documentElement.clientWidth` (exactly 0px horizontal overflow).*

6. **Lighthouse Quality Audits:**
   Run against local production preview (`npm run preview`):
   - **Accessibility:** 100/100
   - **Best Practices:** 100/100
   - **SEO:** 100/100
   - **Performance:** $\ge 80$ (Mobile), $\ge 95$ (Desktop).

---

## 4. Cross References
- Requirements: [`PRD.md`](file:///PRD.md)
- Decisions: [`DECISIONS.md`](file:///DECISIONS.md)
- Troubleshooting: [`DEBUGGING.md`](file:///DEBUGGING.md)

