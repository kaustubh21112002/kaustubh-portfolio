# Project Requirements Document (PRD) — Kaustubh Nandurkar Portfolio

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`  
**Production URL:** [https://kaustubh-portfolio-six.vercel.app/](https://kaustubh-portfolio-six.vercel.app/)  
**GitHub:** [https://github.com/kaustubh21112002/kaustubh-portfolio](https://github.com/kaustubh21112002/kaustubh-portfolio)

---

## 1. Executive Summary & Purpose

The Kaustubh Nandurkar Portfolio is a high-performance, single-page application (SPA) designed to convert executive recruiters, analytics directors, and hiring managers evaluating talent for **Business Analyst (BA)**, **Data Analyst (DA)**, **Financial Analyst (FA)**, and selective **Applied Data Science** roles.

Unlike conventional aesthetic developer portfolios, this application functions as an audited decision intelligence artifact. Every claim, KPI, financial valuation model, and operational metric is grounded in verifiable evidence, source code, academic dissertations, or audited financial workbooks.

---

## 2. Target Personas & Conversion Goals

### 2.1 Primary Persona: Corporate & Technical Recruiters (30-second evaluation)
- **Goal:** Immediately verify candidate profile, graduation timeline (MBA 2025–2027, BSc CS 2021–2025), core competencies, work authorization, location preference (Nagpur/Nashik/Hybrid India), and access the verified resume PDF in 1 click.
- **Conversion Touchpoints:**
  - Hero positioning statement and quick copy email button.
  - Recruiter Command Center (quick jump, candidate profile summary, verified resume download).
  - Evidence Telemetry Bar (137,000+ records analyzed, 99.8% reconciliation, DQ-10 review badge).

### 2.2 Secondary Persona: Analytics Directors & Hiring Managers (5-minute audit)
- **Goal:** Audit analytical depth, SQL/star schema modeling skills, business metrics governance, and financial valuation methodology.
- **Conversion Touchpoints:**
  - PhonePe Pre-IPO DCF Valuation interactive waterfall and sensitivity matrix.
  - STRATOS Retail Decision Intelligence 30-KPI data quality matrix (`DQ-01` to `DQ-10`).
  - IT Support Service Intelligence star schema architecture and ML duration modeling.
  - Dedicated technical case study modals with shareable URL parameters (`?project=...`).

### 2.3 Tertiary Persona: Business Leaders & Founders (Consulting evaluation)
- **Goal:** Evaluate the author's ability to link technical analysis to financial outcomes, EBITDA expansion, and capital allocation.
- **Conversion Touchpoints:**
  - SmartBank 360 unit economics model (deposit acquisition payback, Basel III compliance).
  - Research publications section (FinTech unit economics and IT service intelligence).
  - Availability indicator with real-time internship/full-time status.

---

## 3. Core Feature Inventory & Implementation Status

| Feature ID | Feature Name | Status | Evidence / Source Component |
| :--- | :--- | :--- | :--- |
| `PRD-01` | **Interactive 360° Character Hero** | **Implemented** | `src/components/hero/CharacterCanvas.tsx` (64 WebP frames, 35ms lerp tracking, eye-contact deadzone, reduced-motion bypass). |
| `PRD-02` | **Recruiter Command Center** | **Implemented** | `src/components/command/RecruiterCommandCenter.tsx` (Role matrix, key milestones, quick jump triggers, resume download). |
| `PRD-03` | **Evidence Telemetry Bar** | **Implemented** | `src/components/metrics/EvidenceTelemetryBar.tsx` (`137,000+` rows, `99.8%` reconciliation, `DQ-10 REVIEW` status). |
| `PRD-04` | **PhonePe DCF Valuation Flagship** | **Implemented** | `src/components/flagship/FlagshipPhonePe.tsx` (Interactive waterfall, dynamic sensitivity matrix, scenario switcher, PDF export). |
| `PRD-05` | **Canonical Project Explorer** | **Implemented** | `src/components/projects/ProjectsSection.tsx` (6 canonical projects, category pills, search filter, semantic `<article>` tags). |
| `PRD-06` | **Executive Brief Modals** | **Implemented** | `src/components/projects/ProjectSummaryModal.tsx` (30-second high-level overview triggered by `&view=brief`). |
| `PRD-07` | **Technical Case Study Modals** | **Implemented** | `src/components/projects/CaseStudyModal.tsx` (Deep dive into methodology, architecture, and validation checks). |
| `PRD-08` | **Deep-Link URL Routing** | **Implemented** | `src/components/projects/projectNavigation.ts` (Synchronized with `window.history.pushState` and `popstate`). |
| `PRD-09` | **Multi-Mode Theme System** | **Implemented** | `src/context/ThemeContext.tsx`, `index.html` (3-state `light`/`dark`/`system`, anti-flash inline script). |
| `PRD-10` | **Quick Search Modal (⌘K)** | **Implemented** | `src/components/common/QuickSearchModal.tsx` (Instant multi-field indexing over projects, skills, research). |
| `PRD-11` | **Recruiter FAQ Accordion** | **Implemented** | `src/components/faq/FAQSection.tsx` (5 factual Q&As addressing valuation methodology, STRATOS DQ-10, work status). |
| `PRD-12` | **Protected Resume Access** | **Implemented** | `src/components/resume/ResumeSection.tsx` (`public/Kaustubh_Nandurkar_Resume.pdf`, 96,435 bytes). |
| `PRD-13` | **Serverless Contact Pipeline** | **Implemented** | `api/contact.ts`, `src/components/contact/ContactSection.tsx` (Slack webhook, honeypot spam filter, honest 503 fallback). |
| `PRD-14` | **Print-Friendly Stylesheet** | **Implemented** | `src/index.css` (`@media print` rules stripping dark mode and navigation for clean monochrome printing). |
| `PRD-15` | **Persona Switcher (Portfolio OS)** | **Planned** | Proposed in `docs/portfolio-os-specification.md` (Recruiter / Founder / Enterprise views). |
| `PRD-16` | **Interactive Scope Estimator** | **Planned** | Proposed in `docs/portfolio-os-specification.md`. |
| `PRD-17` | **Grounded AI RAG Assistant** | **Planned** | Proposed in `docs/portfolio-integrations.md` (Serverless LLM retrieval over portfolio facts). |

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Accessibility (WCAG 2.1 Level AA)
- **Score:** 100/100 on Google Lighthouse (Mobile & Desktop).
- **Labeling (WCAG 2.5.3):** All interactive buttons and links have accessible names matching visible text.
- **Focus & Semantic Trapping:** Modals implement focus traps and close via `Escape`.
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` across canvas, scroll behavior, and video playback.

### 4.2 Performance & Responsiveness
- **Desktop Performance:** 98/100 Lighthouse score (FCP 544 ms, LCP 863 ms, TBT 30 ms).
- **Mobile Performance:** 80/100 Lighthouse score (FCP 1.47s, LCP 1.47s, CLS 0.007).
- **Zero Viewport Overflow:** Document client width equals scroll width across 375px, 430px, 768px, 1024px, and 1440px viewports.

### 4.3 Data Governance & Honesty
- **Governance Doctrine:** `PRESERVE → DOCUMENT → FLAG → GOVERN`.
- **Disclaimers:** Prototype projects (EquiTrack), study estimates (IT Support), and academic valuation models (PhonePe) are explicitly flagged.
- **No Fabricated Benchmarks:** Unresolved data quality issues (e.g. STRATOS DQ-10) remain permanently flagged as `REVIEW`.

---

## 5. Cross References
- Technical Architecture: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)
- Design Guidelines & System: [`DESIGN.md`](file:///DESIGN.md)
- Architectural Decisions: [`DECISIONS.md`](file:///DECISIONS.md)
- Operational Master Context: [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md)

