# Audited & Verified Business Analytics & Equity Valuation Portfolio
**Kaustubh K. Nandurkar — MBA in Business Analytics & Financial Valuation**

A production-grade, editorial-style personal portfolio featuring an interactive, hardware-accelerated cursor-tracking character hero section and deep-dive financial valuation and analytics case studies.

---

## 1. Verified Profile & Source Materials

- **Full Name**: Kaustubh K. Nandurkar
- **Academic Qualifications**:
  - MBA - Business Analytics | Sandip University, Nashik (2025 – 2027)
  - BSc - Computer Science | Kamla Nehru Mahavidyalaya, Nagpur (2021 – 2025, Grade: 56.7%)
  - HSC - Science | G. H. Raisoni Vidya Niketan, Nagpur (2021, Grade: 67.4%)
- **Professional Experience**:
  - Sports Data Analyst Intern | SPIIDEO (June 2026 – Present): Tagging and validating soccer and field hockey match events into structured video analytics datasets.
- **Contact & Socials**:
  - Email: `kaustubhnandurkar21@gmail.com`
  - Phone: `+91 8080001550`
  - LinkedIn: `https://www.linkedin.com/in/kaustubhnandurkar`
  - GitHub: `https://github.com/kaustubh21112002`
  - Location: Nagpur / Nashik, India
- **Official Resume PDF**: [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) (196 KB verified authentic resume).

---

## 2. PhonePe Valuation Workbook Audit (`DCF of phonepe.xlsx`)

In accordance with data governance rules (**PRESERVE → DOCUMENT → FLAG → GOVERN**), the underlying financial model was fully audited line-by-line:

### Reconciled Financial Valuation Figures
- **Enterprise Value (EV)**: **₹33,431.99 Cr**
  - Present Value of Explicit 5-Year FCFs (FY26E–FY30E): **₹13,878.15 Cr**
  - Present Value of Terminal Value: **₹19,553.83 Cr** (blended average of Perpetuity Growth TV ₹54,464 Cr and Exit Multiple TV ₹19,425 Cr)
- **Equity Value**: **₹41,631.22 Cr**
  - (+) Cash & Bank Balances: ₹1,127.58 Cr
  - (+) Marketable Securities & Liquid Investments: ₹7,787.65 Cr
  - (-) Long-Term Debt Obligations: ₹716.00 Cr
- **Cost of Capital (WACC)**: **14.92%** ($R_f = 3.0\%$, FinTech $\beta = 1.35$, $R_m = 11.82\%$).
- **Exit Multiple**: **13.15x** Year 5 EBITDA.

### Documented Inconsistencies & Flags
1. **Share Price Division by Debt in Cell C13**: On sheet `'EV to Equity Value'`, cell `C13` had formula `=C10/C9`, which divided Equity Value (₹41,631.22 Cr) by Long Term Debt (`C9 = 716`) producing 58.14. It should have divided by Shares Outstanding (`C12 = 50.66 Cr shares`), which evaluates to **₹821.78 per share**.
2. **Stale Row 36 Formula Artifacts in `'DCF Full'`**: Row 36 displays negative PV numbers from an earlier draft using negative historical EBIT, while cell `C38` actively pulls from `=Discounting!C15` which evaluates positive cash flows matching ₹33,431.99 Cr.
3. **Cost of Debt `#DIV/0!` on `'Assumptions'` Sheet**: Formula `=(B21/B20)*100` divides by 0 because debt is entered as 0, whereas `'EV to Equity Value'` enters debt as ₹716 Cr.
4. **Independent Research Disclosure**: The project is documented as independent academic research, not an official investment recommendation.

---

## 3. Verified Projects Architecture

1. **PhonePe Pre-IPO Equity Research & DCF Valuation** (Independent Pre-IPO Valuation)
2. **STRATOS AI | Controlled Business Analytics & KPI Governance** (50,000 orders, 30 KPIs, 10 validation controls, 15,630 exception occurrences across 14,156 affected orders, DQ-10 audit)
3. **Sports Match Event Tracking & Video Analytics (SPIIDEO)** (Sports data analyst internship event tagging and QA)
4. **IT Support Service Intelligence & Resolution Prediction** (Academic dissertation: 10,000+ support ticket records, MySQL star schema, Power BI DAX KPIs, Python regression duration model)
5. **SmartBank 360 – FinTech Feasibility & Unit Economics Report** (MBA academic business model report: neobank unit economics, deposit acquisition payback, Basel III compliance)

---

## 4. Cursor Tracking & Rendering Engine

- **Asset Processing**: Extracted 9 canonical poses from the 2K character sprite sheet using OpenCV (`scripts/process_character_assets.py`). Generated 64 WebP frames (`frame_000.webp` to `frame_063.webp`) along the 360° rotation plus `center.webp`.
- **Canvas Renderer**: Single crisp frame rendered at 100% opacity without alpha blending.
- **Shortest-Path Angular Lerp**: `lerpAngle(current, target, 0.26)` tracks cursor direction in ~35ms with zero lag.
- **Eye Contact Deadzone**: 12% screen radius threshold around face center triggers `center.webp`.
- **Seamless Background**: Matched canvas and page background to `#ed2026` / `RGB(237, 32, 38)`.
- **Accessibility & Mobile**: Automatically falls back to clean static center frame when `prefers-reduced-motion` is active or on touch devices.

---

## 5. Development & Deployment

### Run Locally
```bash
npm run dev
```
Preview production build:
```bash
npm run build
npm run preview
```

### Configuration
Edit [`src/config/portfolio.ts`](file:///src/config/portfolio.ts) to update profile details, contact information, or resume settings.

### Deploy to GitHub & Vercel
```bash
git remote add origin https://github.com/kaustubh21112002/kaustubh-portfolio.git
git push -u origin main
```
Then import `kaustubh-portfolio` in [vercel.com/new](https://vercel.com/new) or run `npx vercel`.
