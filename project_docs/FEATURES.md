# Portfolio Features Inventory

**Confidence:** [VERIFIED]

---

## 1. Flagship PhonePe Pre-IPO DCF Valuation
- **Interactive DCF Sensitivity Model:** Real-time computation of Enterprise Value and Equity Value based on user-controlled WACC (12% to 18%), Terminal Growth (5% to 9%), and Exit Multiple (10x to 16x).
- **Dual Terminal Value Methodologies:** Toggle between 100% Perpetuity Growth, 100% Exit EBITDA Multiple, and 50/50 Blended approach.
- **Dynamic Waterfall Bridge:** Visualizes the bridge from FY26E–FY30E Cash Flow PVs through Net Cash / Debt to Implied Equity Value.
- **5x5 WACC Sensitivity Matrix:** Heatmap comparing valuation across discount rates and terminal multiples.
- **Scenario Presets:** Instant loading of Conservative (₹26,112 Cr EV), Base Case (₹33,432 Cr EV), and Aggressive (₹43,890 Cr EV) presets.

## 2. Governed Case Studies & Project Directory
- **Single Source of Truth (`projects.json`):** Common project data (Problem, Data Scope, Method, Result, Tools, Links).
- **Search & Filter:** Instant category filtering (Equity Research, Business Analytics, Sports Analytics, etc.) and keyword search.
- **Deep-Dive Case Study Modal:** Full-page narrative modal with focus trap, table-of-contents jump links, and adjacent project cycling.
- **30-Second Recruiter Brief Modal:** High-level summary displaying standardized Decision Intelligence blocks.

## 3. Recruiter Engagement Touchpoints
- **Hero Character Animation:** 60 FPS HTML5 Canvas cursor-tracking character with prefers-reduced-motion fallback.
- **WhatsApp Click-to-Chat:** Direct communication link (`https://wa.me/918080001550`) with pre-filled professional inquiry message in Hero and Contact sections.
- **Candidate Availability Block:** Status badge, unconfirmed field placeholders (`[ADD VALUE]`), and one-click copy email action with 2-second visual confirmation.
- **Dynamic Footer Freshness:** Computes latest content update date automatically across project records.
- **Serverless Contact Form:** Validated form with IP-based rate limiting, honeypot protection, and Slack webhook dispatch.
- **Recruiter Feedback Widget:** Discreet bottom-corner tab asking "Was this portfolio useful?" with thumbs up/down assessment, optional 500-char comment, localStorage dismissal memory, and secure Slack notification dispatch via `POST /api/feedback`.

