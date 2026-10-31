# Portfolio Master Context & Analytical Source of Truth (PROJECT_CONTEXT.md)

**Document Version:** 1.0.0  
**Status:** GOVERNED SOURCE OF TRUTH  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`  
**Production URL:** [https://kaustubh-portfolio-six.vercel.app/](https://kaustubh-portfolio-six.vercel.app/)  
**GitHub:** [https://github.com/kaustubh21112002/kaustubh-portfolio](https://github.com/kaustubh21112002/kaustubh-portfolio)

---

## 1. Professional Positioning & Candidate Identity

### 1.1 Core Positioning Statement
> **"I turn complex data into financial insights, operational intelligence, and better business decisions."**

### 1.2 Target Professional Roles
1. **Business Analyst (BA):** Translating unstructured operational problems into governed KPI frameworks, data pipelines, and executive dashboards.
2. **Data Analyst (DA):** Designing relational star schemas, authoring advanced SQL queries, executing data quality audits, and building BI dashboards.
3. **Financial Analyst (FA):** Building discounted cash flow (DCF) valuation models, sensitivity matrices, unit economics models, and capital allocation frameworks.
4. **Selective Applied Data Science:** Practical regression modeling and machine learning duration estimation grounded in business utility (e.g. IT support ticket resolution duration).

### 1.3 Candidate Profile & Academic Milestones
- **Candidate Name:** Kaustubh K. Nandurkar
- **Current Academic Enrollment:** MBA in Business Analytics | Sandip University, Nashik (2025 – 2027)
- **Undergraduate Degree:** BSc in Computer Science | Kamla Nehru Mahavidyalaya, Nagpur (2021 – 2025, Grade: 56.7%)
- **Secondary Schooling:** HSC in Science | G. H. Raisoni Vidya Niketan, Nagpur (2021, Grade: 67.4%)
- **Professional Experience:** Sports Data Analyst Intern | SPIIDEO (June 2026 – Oct 2026): Tagging and validating match event streams into structured video datasets.
- **Location Preference:** Nagpur / Nashik / Hybrid & Remote India.
- **Official Resume:** [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) (Exact size: 96,435 bytes; SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C`).

---

## 2. Core Data Governance Principles

The analytical credibility of this portfolio rests on the strict adherence to:
$$\textbf{PRESERVE} \longrightarrow \textbf{DOCUMENT} \longrightarrow \textbf{FLAG} \longrightarrow \textbf{GOVERN}$$

### Mandatory Governance Rules:
1. **Zero Silent Imputation:** Never fill missing source values, convert missing attribution to zero, or synthesize convenient benchmarks.
2. **Use "Unspecified":** When data attribution is missing, explicitly classify it as `"Unspecified"`. `"Unspecified"` does **not** mean `"none"`.
3. **Descriptive Language Only:** Use observational terminology: *observed*, *recorded*, *associated*, *correlated*, *requires investigation*. Never assert causal claims from observational datasets.
4. **Zero Invention:** Never fabricate ML models, customer lifetime values, churn rates, ROI benchmarks, or targets unless explicitly backed by the governed upstream project.

---

## 3. Canonical Project Metrics & Source Evidence

### 3.1 Project 1: PhonePe Pre-IPO DCF Valuation
- **Context:** Independent academic pre-IPO equity valuation workbook (`DCF of phonepe.xlsx`).
- **Qualification Badge:** `MODEL ESTIMATE`.
- **Enterprise Value (EV):** **₹33,431.99 Cr**
  - PV of 5-Year Explicit FCFs (FY26E–FY30E): ₹13,878.15 Cr
  - PV of Terminal Value: ₹19,553.83 Cr (Blended average of Perpetuity Growth TV ₹54,464 Cr and Exit Multiple TV ₹19,425 Cr)
- **Equity Value:** **₹41,631.22 Cr**
  - (+) Cash & Bank Balances: ₹1,127.58 Cr
  - (+) Marketable Securities & Liquid Investments: ₹7,787.65 Cr
  - (-) Long-Term Debt Obligations: ₹716.00 Cr
- **Implied Share Price:** **₹821.78 per share** (evaluated across 50.66 Cr shares outstanding).
- **Cost of Capital (WACC):** **14.92%** ($R_f = 3.0\%$, FinTech $\beta = 1.35$, $R_m = 11.82\%$).
- **Exit Multiple:** **13.15x** Year 5 EBITDA.
- **Audited Cell Inconsistencies (Preserved & Documented):**
  - *Cell C13 Error in Workbook:* On sheet `'EV to Equity Value'`, cell `C13` has formula `=C10/C9`, which divided Equity Value (₹41,631.22 Cr) by Long Term Debt (`C9 = 716`) resulting in 58.14. It should have divided by Shares Outstanding (`C12 = 50.66 Cr shares`), which evaluates to ₹821.78. Both figures are transparently documented.
  - *Stale Formula in Row 36:* Displays negative PV from an earlier draft, whereas cell `C38` correctly evaluates positive flows.
  - *Cost of Debt `#DIV/0!`:* Formula `=(B21/B20)*100` divides by 0 on the assumptions sheet because debt is entered as 0, whereas `'EV to Equity Value'` enters debt as ₹716 Cr.

### 3.2 Project 2: STRATOS Retail Decision Intelligence
- **Context:** Governed enterprise retail intelligence project (upstream source: Google Sheets + Apps Script).
- **Scale:** 50,000 orders analyzed; 30 controlled KPIs; 10 validation checks; 15,630 exception occurrences across 14,156 affected orders.
- **Critical Financial Governance Invariant (DQ-10):**
  - Anomaly: `Net Revenue > Gross Revenue in controlled totals`.
  - Status: **Strictly preserved as `REVIEW`**.
  - Rule: Never mark DQ-10 as resolved, repaired, or dismissed. It represents an active reconciliation audit item.

### 3.3 Project 3: Sports Match Event Tracking (SPIIDEO)
- **Context:** Sports data analyst internship tagging soccer and field hockey matches.
- **Qualification Badge:** `OPERATIONAL SLA`.
- **Scale & Performance:** 1,200+ match sequences; 99.4% tagging precision; sub-15 minute delivery turnaround.

### 3.4 Project 4: IT Support Service Intelligence
- **Context:** Academic dissertation analyzing enterprise IT service tickets.
- **Qualification Badge:** `STUDY ESTIMATE`.
- **Scale & Architecture:** 10,000+ support tickets; Star schema (MySQL: `Fact_TicketResolution` with 5 dimensions); DAX metrics in Power BI; regression duration model ($R^2 = 0.81$).

### 3.5 Project 5: SmartBank 360 FinTech Feasibility
- **Context:** MBA academic business case analyzing digital banking unit economics.
- **Key Metrics:** Customer Acquisition Cost (CAC) ₹450; 14-month payback period; 16.2% Tier-1 capital adequacy.

### 3.6 Project 6: EquiTrack Analytics OS
- **Context:** Interactive portfolio governance interface prototype.
- **Qualification Badge:** `PROTOTYPE DEMO`.
- **Status:** Architectural prototype demonstrating decision-layer UI.

---

## 4. Dashboard & UI Design Principles

1. **Wireframe First, Information Density Always:** Start with the core business metric before breaking down supporting data layers.
2. **One Main Insight per View:** Avoid overwhelming executive recruiters with unfocused charts.
3. **Visual Hierarchy:**
   $$\textbf{WHAT MATTERS} \longrightarrow \textbf{WHAT CHANGED} \longrightarrow \textbf{WHY} \longrightarrow \textbf{WHAT TO DO NEXT}$$
4. **Restrained Color Usage:** High-contrast editorial palette. Color is reserved for semantic meaning (emerald = verified, amber = review, red = brand focus).
5. **No Decorative Noise:** Avoid 3D visual clutter, gratuitous particle animations, or unreadable low-contrast text.

---

## 5. Protected Assets & Repository Invariants

1. **Protected Resume PDF:**
   - Location: `public/Kaustubh_Nandurkar_Resume.pdf`
   - Size: Exactly **96,435 bytes**
   - Checksum: SHA-1 `317857D88309548D9D05E8198FFBF8212C88470C`
   - Protection: Never overwrite, convert, or alter this file. If `npm run build` runs `build:resume`, restore immediately with `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`.
2. **Canonical Project IDs:**
   - The 6 canonical IDs (`phonepe-valuation`, `stratos-governance`, `spiideo-sports-analytics`, `it-support-analytics`, `smartbank-360`, `equitrack-analytics-os`) are immutable URL contracts.
3. **Git & Staging Safety:**
   - Never stage untracked files or test diagnostics.
   - Never use `git add .` or `git add -A`.
   - Never commit, push, or deploy without explicit user authorization.

---

## 6. Implementation vs. Future Roadmap

| Subsystem | Implemented in Active Repository | Planned for Future Roadmap (Portfolio OS) |
| :--- | :--- | :--- |
| **Frontend Stack** | React 18 + TypeScript + Vite Single Page Application | No change (remain lean SPA) |
| **Theme System** | 3-state switcher (`light`/`dark`/`system`) with zero-flash script | No change |
| **Navigation & Modals**| `?project=` & `&view=brief` URL routing with `popstate` | No change |
| **Hero Experience** | 360° cursor tracking canvas + deferred personal video | Persona switcher (`Recruiter` / `Founder` / `Enterprise`) |
| **Financial Valuation**| Interactive waterfall, 25-node sensitivity matrix, PDF export | Multi-company comparison matrix |
| **Inquiry Pipeline** | Serverless Slack webhook dispatch with honeypot & 503 fallback | Grounded conversational AI assistant (Gemini RAG) |
| **Consulting Tools** | Static case study disclosures | Interactive scope & budget estimator |

---

## 7. Cross References
- System Requirements: [`PRD.md`](file:///PRD.md)
- Design Specifications: [`DESIGN.md`](file:///DESIGN.md)
- Architectural Decisions: [`DECISIONS.md`](file:///DECISIONS.md)
- Operating Rules: [`AGENTS.md`](file:///AGENTS.md)
- Testing Suites: [`TESTING.md`](file:///TESTING.md)

