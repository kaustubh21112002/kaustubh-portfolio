# Project Overview & System Purpose

> **Scope**: High-level business rationale, user archetypes, capability boundaries, and non-goals.  
> **Status**: `VERIFIED`

---

## 1. Problem Statement & Motivation

Traditional software engineering portfolios suffer from four fundamental flaws:
1. **Static Presentation**: Projects are presented as screenshots or bulleted text without live execution environments or interactive mathematical models.
2. **Fabricated Claims**: Claims of enterprise scale, valuation accuracy, or data hygiene are made without auditable proof or interactive sensitivity models.
3. **Third-Party Surveillance**: Portfolios inject invasive trackers (Google Analytics, Meta Pixels, Hotjar) that leak recruiter and visitor IPs, violate GDPR/CCPA, and harvest personal browsing history.
4. **Information Asymmetry**: Prospective hiring managers, venture capitalists, and engineering leaders must manually parse lengthy resumes to determine fit for specialized roles.

The **Kaustubh Nandurkar Decision Intelligence Platform** solves these problems by functioning as an active, auditable, high-performance web platform that demonstrates senior engineering and analytical architecture in real time.

---

## 2. Core Capabilities

### A. Interactive Financial Engineering (PhonePe DCF Model)
- Full Discounted Cash Flow (DCF) waterfall modeling the enterprise valuation of PhonePe at ₹33,431.99 Cr ($4.03B USD).
- Live interactive sensitivity matrix modulating Weighted Average Cost of Capital (WACC: 11.5% to 15.5%) and Terminal Growth Rate (4.0% to 6.0%).
- Three switchable terminal value methodologies: **Perpetuity Growth Method**, **Exit Multiple Method (15.0x to 25.0x EV/EBITDA)**, and **Blended 50/50 Approach**.
- Full financial breakdown: Present Value of 5-Year Free Cash Flows (₹13,878.15 Cr) + PV of Terminal Value (₹19,553.95 Cr) + Cash Equivalents (₹8,449.23 Cr) - Total Debt (₹250.00 Cr) = Equity Value (₹41,631.22 Cr) across 50,660,000 shares.

### B. Governed Data Quality Intelligence (STRATOS Decision Matrix)
- Implementation of the governed analytical source of truth from enterprise Google Sheets & Apps Script.
- Interactive Data Quality Matrix enforcing the protocol: `PRESERVE → DOCUMENT → FLAG → GOVERN`.
- Permanent auditable preservation of known production anomaly **DQ-10**: Net Revenue > Gross Revenue in controlled totals ($42.3M Net vs $41.8M Gross), maintaining `REVIEW` status without silent synthetic imputation.

### C. First-Party Cookieless Telemetry & Observability
- Zero third-party scripts, zero tracking cookies, zero IP storage, zero fingerprinting.
- High-throughput client-side telemetry buffer collecting normalized events (`page_view`, `project_view`, `resume_download`, `contact_click`, `feedback_submit`, `job_match_use`).
- Serverless validation pipeline verifying origins against production (`https://kaustubh-portfolio-six.vercel.app`) and local development ports.
- Automated rate limiting (sliding-window IP check in Node memory) and asynchronous batch persistence to PostgreSQL via Neon Serverless.

### D. Authenticated Telemetry & Portfolio Intelligence Dashboard
- Cryptographically isolated administrative dashboard accessible directly via secret key combination (`Ctrl+Shift+I` or dedicated footer access).
- Passphrase verification using memory-hard `scrypt` hashing with unique 16-byte random salts and strict parameters (`N=16384, r=8, p=1`).
- Ephemeral, cryptographically secure 32-byte session tokens hashed with SHA-256 in the database and issued via `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- Comprehensive telemetry metrics: 24-hour / 7-day / 30-day aggregations, daily event volume, device breakdowns, top project interest, and conversion funnels.

### E. Grounded AI Portfolio Assistant
- Serverless streaming AI conversational assistant powered by Groq's high-speed inference engine running `llama-3.3-70b-versatile`.
- Retrieval context strictly anchored in verified project documentation, architecture decisions, and career timeline.
- Hallucination guardrails: the assistant explicitly denies knowledge of unverified projects, never fabricates contact credentials, and preserves data governance invariants.

### F. Client-Side Resume Ingestion & Candidate Matching OS (Phase 8 In-Flight)
- In-browser PDF processing using `pdfjs-dist` to extract plain text and structural data directly inside the client DOM without server uploads.
- Complete network isolation: candidate resume text and contact PII are processed strictly in local client memory and `sessionStorage`, never transmitted across the network.
- Automated claim extraction, experience tagging, skill taxonomy mapping, and qualification scoring against specialized analytics engineering benchmarks.

---

## 3. User Personas & Target Audiences

| Persona | Primary Goal | Key Journeys & Features Used |
| :--- | :--- | :--- |
| **Executive Recruiter / Talent Lead** | Rapidly assess senior-level competency, verify track record, and obtain contact details. | Recruiter Command Center (`Ctrl+K`), One-click Protected Resume Download, WhatsApp instant chat, Candidate Review. |
| **Hiring Manager / Staff Engineer** | Inspect real code quality, component architecture, state management, and testing rigors. | Codebase modals, Architecture deep-dives, Test harnesses (`scripts/`), Git history inspectability. |
| **Venture Capitalist / FinTech Analyst** | Scrutinize financial modeling rigor and valuation methodology. | PhonePe Interactive Valuation Waterfall, WACC/Terminal Sensitivity Matrix, CSV/JSON financial export. |
| **Chief Data Officer / BI Architect** | Evaluate data governance, auditability, and data engineering standards. | STRATOS Data Quality Matrix, DQ-10 audit trail, governed source-of-truth definitions. |
| **Portfolio Administrator (Kaustubh)** | Monitor engagement, review conversion rates, and inspect feedback securely. | Secret-authenticated Portfolio Intelligence Dashboard, Neon SQL live inspect, Telemetry Aggregates. |

---

## 4. Non-Goals & System Boundaries

To preserve strict architectural clarity, the project enforces explicit boundaries:
- **No Monetization / E-Commerce**: The system does not process payments or host commercial checkout flows.
- **No User Account Creation**: The platform does not maintain a public user authentication database; authentication is strictly single-tenant administrative.
- **No Heavyweight Backend Servers**: The backend is 100% serverless functions optimized for cold-start speed and zero idle infrastructure cost.
- **No Unaudited Third-Party Scripts**: No CDNs, tracking pixels, or remote unvetted script tags are permitted in `index.html`.

