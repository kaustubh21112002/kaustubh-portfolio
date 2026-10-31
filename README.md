# Audited & Verified Business Analytics & Equity Valuation Portfolio

**Kaustubh K. Nandurkar — MBA in Business Analytics & Financial Valuation**  
*Production URL:* [https://kaustubh-portfolio-six.vercel.app/](https://kaustubh-portfolio-six.vercel.app/)  
*GitHub Repository:* [https://github.com/kaustubh21112002/kaustubh-portfolio](https://github.com/kaustubh21112002/kaustubh-portfolio)

A production-grade, editorial-style personal portfolio featuring an interactive, hardware-accelerated cursor-tracking character hero section, deep-dive financial valuation models, and governed enterprise analytics case studies.

---

## 1. Verified Profile & Candidate Positioning

- **Core Positioning:** *"I turn complex data into financial insights, operational intelligence, and better business decisions."*
- **Target Roles:** Business Analyst (BA), Data Analyst (DA), Financial Analyst (FA), Applied Data Science.
- **Academic Qualifications:**
  - **MBA — Business Analytics** | Sandip University, Nashik (2025 – 2027)
  - **BSc — Computer Science** | Kamla Nehru Mahavidyalaya, Nagpur (2021 – 2025, Grade: 56.7%)
  - **HSC — Science** | G. H. Raisoni Vidya Niketan, Nagpur (2021, Grade: 67.4%)
- **Professional Experience:**
  - **Sports Data Analyst Intern** | SPIIDEO (June 2026 – Oct 2026): Tagging and validating soccer and field hockey match events into structured video analytics datasets.
- **Location Preference:** Nagpur / Nashik / Hybrid & Remote India.
- **Contact:**
  - Email: `kaustubhnandurkar21@gmail.com`
  - LinkedIn: [linkedin.com/in/kaustubhnandurkar](https://www.linkedin.com/in/kaustubhnandurkar)
  - GitHub: [github.com/kaustubh21112002](https://github.com/kaustubh21112002)
- **Verified Resume PDF:** [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) (Exact size: 96,435 bytes; SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C`).

---

## 2. PhonePe Valuation Workbook Audit (`DCF of phonepe.xlsx`)

In accordance with data governance rules (**PRESERVE → DOCUMENT → FLAG → GOVERN**), the underlying financial model was fully audited line-by-line:

### Reconciled Financial Valuation Figures
- **Enterprise Value (EV):** **₹33,431.99 Cr**
  - Present Value of Explicit 5-Year FCFs (FY26E–FY30E): **₹13,878.15 Cr**
  - Present Value of Terminal Value: **₹19,553.83 Cr** (blended average of Perpetuity Growth TV ₹54,464 Cr and Exit Multiple TV ₹19,425 Cr)
- **Equity Value:** **₹41,631.22 Cr**
  - (+) Cash & Bank Balances: ₹1,127.58 Cr
  - (+) Marketable Securities & Liquid Investments: ₹7,787.65 Cr
  - (-) Long-Term Debt Obligations: ₹716.00 Cr
- **Cost of Capital (WACC):** **14.92%** ($R_f = 3.0\%$, FinTech $\beta = 1.35$, $R_m = 11.82\%$).
- **Exit Multiple:** **13.15x** Year 5 EBITDA.
- **Implied Share Price:** **₹821.78 per share** (evaluated over 50.66 Cr shares outstanding).

### Documented Inconsistencies & Flags
1. **Share Price Division by Debt in Cell C13:** On sheet `'EV to Equity Value'`, cell `C13` had formula `=C10/C9`, which divided Equity Value (₹41,631.22 Cr) by Long Term Debt (`C9 = 716`) producing 58.14. It should have divided by Shares Outstanding (`C12 = 50.66 Cr shares`), which evaluates to **₹821.78 per share**.
2. **Stale Row 36 Formula Artifacts in `'DCF Full'`:** Row 36 displays negative PV numbers from an earlier draft using negative historical EBIT, while cell `C38` actively pulls from `=Discounting!C15` which evaluates positive cash flows matching ₹33,431.99 Cr.
3. **Cost of Debt `#DIV/0!` on `'Assumptions'` Sheet:** Formula `=(B21/B20)*100` divides by 0 because debt is entered as 0, whereas `'EV to Equity Value'` enters debt as ₹716 Cr.
4. **Independent Research Disclosure:** The project is documented as independent academic research, not an official investment recommendation.

---

## 3. The 6 Canonical Projects Architecture

1. **PhonePe Pre-IPO Equity Research & DCF Valuation** (Independent Pre-IPO Valuation)
2. **STRATOS AI | Controlled Business Analytics & KPI Governance** (50,000 orders, 30 KPIs, 10 validation controls, 15,630 exception occurrences across 14,156 affected orders, DQ-10 review badge)
3. **Sports Match Event Tracking & Video Analytics (SPIIDEO)** (Sports data analyst internship event tagging and QA)
4. **IT Support Service Intelligence & Resolution Prediction** (Academic dissertation: 10,000+ support ticket records, MySQL star schema, Power BI DAX KPIs, Python regression duration model)
5. **SmartBank 360 – FinTech Feasibility & Unit Economics Report** (MBA academic business model report: neobank unit economics, deposit acquisition payback, Basel III compliance)
6. **EquiTrack Analytics OS** (Interactive portfolio governance interface prototype)

---

## 4. Cursor Tracking & Rendering Engine

- **Asset Processing:** 64 WebP frames (`frame_000.webp` to `frame_063.webp`) along a 360° rotation plus `center.webp`.
- **Canvas Renderer:** Single crisp frame rendered at 100% opacity without alpha blending.
- **Shortest-Path Angular Lerp:** `lerpAngle(current, target, 0.26)` tracks cursor direction in $\sim 35\text{ ms}$ with zero lag.
- **Eye Contact Deadzone:** 12% screen radius threshold around face center triggers `center.webp`.
- **Accessibility & Mobile:** Automatically falls back to static center frame when `prefers-reduced-motion` is active or on touch devices.

---

## 5. Development & Verification

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Verification & Testing
```bash
# TypeScript type checks (app and API)
npm run typecheck

# Financial valuation math tests (22 tests)
node scripts/test_valuation_math.mjs

# Contact API tests (9 tests)
node scripts/test_contact_api.mjs

# Deep linking shareable URL tests (6 tests)
node scripts/test_shareable_urls.mjs
```

### Production Build & Preview
```bash
npm run build
npm run preview
```
*Note: If `npm run build` runs `build:resume`, restore the protected resume using:*
```bash
git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf
```

---

## 6. Documentation Index
- Product Requirements: [`PRD.md`](file:///PRD.md)
- Design System: [`DESIGN.md`](file:///DESIGN.md)
- System Architecture: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)
- Data Models: [`DATABASE.md`](file:///DATABASE.md)
- API Specifications: [`API.md`](file:///API.md)
- Agent Rules: [`AGENTS.md`](file:///AGENTS.md)
- Decisions Log: [`DECISIONS.md`](file:///DECISIONS.md)
- Testing Suites: [`TESTING.md`](file:///TESTING.md)
- Master Context: [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md)
