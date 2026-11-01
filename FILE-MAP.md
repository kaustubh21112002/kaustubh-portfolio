# Verified Repository File Map (FILE-MAP.md)

**Generated:** 2026-11-01  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`  
**Purpose:** Concise, verified architectural and navigational directory for engineers and AI coding assistants. Grounded in actual source imports, dependencies, and file paths.

---

## 1. Overview & Technology Stack

| Layer | Technology | Governance & Invariants |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3.1 + TypeScript 5.5.3 + Vite 6.4.4 | Strict client-side SPA with Tailwind CSS 3.4.1 |
| **Icons & UI** | Lucide React 0.344.0 | Accessible SVG icon primitives |
| **Serverless Backend** | Vercel Serverless Function (`api/contact.ts`) | Strict POST validation, rate-limiting, honeypot, Slack webhook dispatch |
| **Analytical Data Truth** | Static JSON (`src/data/projects.json`) + TypeScript definitions (`src/data/projects.ts`) | PRESERVE → DOCUMENT → FLAG → GOVERN (DQ-10 remains `REVIEW`) |
| **Protected Invariant** | `public/Kaustubh_Nandurkar_Resume.pdf` | **Strict:** 96,435 bytes; SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C` |

---

## 2. Application Entry Points & Core Bootstrap

```
index.html (HTML Shell, Theme Initializer, SEO & OpenGraph Meta)
  └─ src/main.tsx (React DOM Root, React.StrictMode, ErrorBoundary)
       └─ src/components/common/ErrorBoundary.tsx (Global Fallback UI)
            └─ src/App.tsx (Main Application Container, Scroll Observer, Deep Links)
                 ├─ src/context/ThemeContext.tsx (Light/Dark/System Theme State)
                 ├─ src/components/navigation/Header.tsx (Floating Pill Nav, Progress Bar)
                 ├─ src/components/common/MagneticCursor.tsx (Pointer tracking, motion reduced)
                 └─ Main Content Sections (Hero through Contact)
```

- [`index.html`](file:///index.html): Defines canonical URLs, OpenGraph/Twitter social cards, preloaded fonts, and an anti-flash inline JavaScript theme script.
- [`src/main.tsx`](file:///src/main.tsx): Mounts the React application inside an ErrorBoundary.
- [`src/App.tsx`](file:///src/App.tsx): Manages scroll position tracking across 11 sections, synchronizes URL hash/search query targets on initial mount, renders skip-to-content accessibility link, and wraps the layout in `ThemeProvider`.

---

## 3. High-Level Folder Map

```
portfolio/
├── .github/workflows/          # CI pipeline (GitHub Actions ci.yml)
├── api/                        # Serverless backend functions (contact API)
├── docs/                       # Engineering reliability audit documentation
├── public/                     # Static assets (protected resume, robots.txt, sitemap.xml, 404.html)
├── scripts/                    # Verification suites, math audit, screenshot & test tooling
├── src/
│   ├── components/             # Modular React UI components organized by section
│   │   ├── about/              # Section 01: Bio, manifesto, 5-stage problem-solving methodology
│   │   ├── command/            # Recruiter Command Center: quick filters, capability matrix
│   │   ├── common/             # Shared primitives (cursor, back-to-top, availability block, skeletons)
│   │   ├── contact/            # Section 09: Contact form, direct channels, availability, dynamic footer
│   │   ├── faq/                # Section 08: Recruiter FAQ accordion
│   │   ├── flagship/           # Section 02: PhonePe Pre-IPO DCF model, waterfall chart, sensitivity
│   │   ├── hero/               # Section 00: 60 FPS Canvas character animation, recruiter elevator pitch
│   │   ├── journey/            # Section 04: Career and academic chronological timeline
│   │   ├── metrics/            # Evidence Telemetry Bar: governed metrics ticker
│   │   ├── navigation/         # Header navigation bar with reading progress indicator
│   │   ├── projects/           # Section 03: Projects grid, modals, decision intelligence blocks
│   │   ├── research/           # Section 06: Academic manuscripts & dissertation library
│   │   ├── resume/             # Section 07: PDF viewer & resume download station
│   │   └── skills/             # Section 05: Categorized technical skills & domain expertise
│   ├── config/                 # Static portfolio configuration (portfolio.ts)
│   ├── context/                # React contexts (ThemeContext.tsx)
│   ├── data/                   # Governed analytical data records, schema, and telemetry metrics
│   ├── index.css               # Global Tailwind CSS definitions, animations, and custom scrollbars
│   └── vite-env.d.ts           # Vite client TypeScript declarations
├── index.html                  # Single-page HTML entry point
├── package.json                # Dependencies, scripts, and build configuration
├── tailwind.config.js          # Tailwind styling tokens, custom colors, animations
├── tsconfig.json               # TypeScript compiler configuration (App)
├── tsconfig.api.json           # TypeScript compiler configuration (Serverless API)
├── vercel.json                 # Security headers and deployment configuration
└── vite.config.ts              # Vite bundling, manual chunk splitting, and build settings
```

---

## 4. Functional Architecture by Feature

### A. PhonePe Pre-IPO Valuation Engine (Flagship)
- **Container / Lazy Boundary:** [`src/components/common/DeferredFlagshipPhonePe.tsx`](file:///src/components/common/DeferredFlagshipPhonePe.tsx)
  - Uses `IntersectionObserver` (200px root margin) to defer loading the heavy valuation bundle until scrolled into viewport.
  - Fallback placeholder: [`src/components/common/FlagshipSkeleton.tsx`](file:///src/components/common/FlagshipSkeleton.tsx).
- **Core Component:** [`src/components/flagship/FlagshipPhonePe.tsx`](file:///src/components/flagship/FlagshipPhonePe.tsx)
- **Sensitivity Math:** [`src/components/flagship/valuationSensitivityMath.ts`](file:///src/components/flagship/valuationSensitivityMath.ts)
  - Pure mathematical engine computing PV of 5-year FCF (FY26E–FY30E), Perpetuity TV, Exit Multiple TV, Blended TV (50/50), Enterprise Value (Base: ₹33,431.99 Cr), Equity Value (Base: ₹41,631.22 Cr), and Per-Share Price (Base: ₹821.78 across 50.66 Cr shares).
- **Scenario Presets:** [`src/components/flagship/valuationScenarios.ts`](file:///src/components/flagship/valuationScenarios.ts) (Conservative, Base Case, Aggressive).
- **Waterfall Chart:** [`src/components/flagship/ValuationWaterfallChart.tsx`](file:///src/components/flagship/ValuationWaterfallChart.tsx).
- **Export & Comparison:** [`src/components/flagship/ValuationExportModal.tsx`](file:///src/components/flagship/ValuationExportModal.tsx), [`src/components/flagship/ValuationScenarioComparison.tsx`](file:///src/components/flagship/ValuationScenarioComparison.tsx).

### B. Data-Driven Projects & Case Studies
- **Centralized Data Record:** [`src/data/projects.json`](file:///src/data/projects.json)
  - Single source of truth for: `id`, `title`, `status`, `lastUpdated`, `oneLineSummary`, `problem`, `data`, `method`, `result`, `tools`, `links`.
- **Data Validation & Freshness:** [`src/data/projectSchema.ts`](file:///src/data/projectSchema.ts)
  - Exports `validateProjectsData()` and `getLatestProjectUpdateDate()`.
- **Rich Data Records:** [`src/data/projects.ts`](file:///src/data/projects.ts)
  - Detailed case study sections, tables, metric items with classifications, methods/assumptions, and verified evidence links.
- **Projects Grid:** [`src/components/projects/ProjectsSection.tsx`](file:///src/components/projects/ProjectsSection.tsx)
  - Category filters, keyword search, lazy-loaded modals, status badges sourced from `projects.json`.
- **Navigation & Deep Linking:** [`src/components/projects/projectNavigation.ts`](file:///src/components/projects/projectNavigation.ts)
  - Handles `?project=<id>` and `?project=<id>&view=brief`, browser `pushState`/`replaceState`, adjacent project resolution.
- **Case Study Modal:** [`src/components/projects/CaseStudyModal.tsx`](file:///src/components/projects/CaseStudyModal.tsx)
  - Deep-dive modal with focus trap, table of contents jump links, and dynamically loaded interactive workspaces.
- **Executive Brief Modal:** [`src/components/projects/ProjectSummaryModal.tsx`](file:///src/components/projects/ProjectSummaryModal.tsx)
  - 30-second recruiter brief rendering `DecisionIntelligenceBlock`.
- **Interactive Workspaces:**
  - STRATOS 10-control audit matrix: [`src/components/projects/StratosDQMatrix.tsx`](file:///src/components/projects/StratosDQMatrix.tsx)
  - IT Support Ticket analytics: [`src/components/projects/ITSupportArchitectureInteractive.tsx`](file:///src/components/projects/ITSupportArchitectureInteractive.tsx)
  - Evidence metric classification badges: [`src/components/projects/DecisionIntelligenceBlock.tsx`](file:///src/components/projects/DecisionIntelligenceBlock.tsx)

### C. Recruiter Experience & Availability
- **Recruiter Command Center:** [`src/components/command/RecruiterCommandCenter.tsx`](file:///src/components/command/RecruiterCommandCenter.tsx)
  - Top capabilities matrix, role-focused views, verified metric callouts.
- **Availability Block:** [`src/components/common/AvailabilityBlock.tsx`](file:///src/components/common/AvailabilityBlock.tsx)
  - Displays recruiter availability status, candidate fields with unconfirmed placeholders (`[ADD VALUE]`), direct `mailto:` link, and single-click copy-to-clipboard action with visual confirmation.
- **Dynamic Footer:** [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx)
  - Computes dynamic "Last updated: <date>" from maximum `lastUpdated` timestamp in `projects.json`.

### D. Contact & Communications
- **Contact UI:** [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx)
  - Direct channels (Email, LinkedIn, GitHub), candidate availability card, serverless contact form with honeypot validation and client rate-limiting.
- **Serverless Endpoint:** [`api/contact.ts`](file:///api/contact.ts)
  - Vercel Serverless Function executing POST validation, IP-based sliding window rate-limiting (5 requests/minute), honeypot filtering, and formatted Slack webhook notification.

---

## 5. Important File Index

| File Path | Classification | Key Responsibilities |
| :--- | :--- | :--- |
| [`src/App.tsx`](file:///src/App.tsx) | **Verified** | Root layout, scroll spy, skip link, section rendering |
| [`src/data/projects.json`](file:///src/data/projects.json) | **Verified** | Master project records & common attributes |
| [`src/data/projectSchema.ts`](file:///src/data/projectSchema.ts) | **Verified** | Schema validator & latest update date evaluator |
| [`src/data/projects.ts`](file:///src/data/projects.ts) | **Verified** | Deep case study sections, verified evidence links, metric classifications |
| [`src/components/flagship/FlagshipPhonePe.tsx`](file:///src/components/flagship/FlagshipPhonePe.tsx) | **Verified** | Interactive DCF valuation UI & model controls |
| [`src/components/flagship/valuationSensitivityMath.ts`](file:///src/components/flagship/valuationSensitivityMath.ts) | **Verified** | Core financial DCF math & sensitivity matrix logic |
| [`src/components/projects/ProjectsSection.tsx`](file:///src/components/projects/ProjectsSection.tsx) | **Verified** | Project cards dock, filters, modal lazy-loading triggers |
| [`src/components/projects/CaseStudyModal.tsx`](file:///src/components/projects/CaseStudyModal.tsx) | **Verified** | Full case study modal with focus trap & keyboard nav |
| [`src/components/projects/projectNavigation.ts`](file:///src/components/projects/projectNavigation.ts) | **Verified** | URL search param parser, sync & deep link routing |
| [`src/components/common/AvailabilityBlock.tsx`](file:///src/components/common/AvailabilityBlock.tsx) | **Verified** | Recruiter availability widget with copy email action |
| [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx) | **Verified** | Contact channels, inquiry form, dynamic footer freshness |
| [`api/contact.ts`](file:///api/contact.ts) | **Verified** | Serverless contact API, rate limiting & Slack webhook |
| [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) | **Protected** | Canonical resume (96,435 bytes; strict hash check) |
| [`public/robots.txt`](file:///public/robots.txt) | **Verified** | Crawler permissions and sitemap pointer |
| [`public/sitemap.xml`](file:///public/sitemap.xml) | **Verified** | XML search index sitemap |
| [`public/404.html`](file:///public/404.html) | **Verified** | Custom static 404 fallback page |
| [`vite.config.ts`](file:///vite.config.ts) | **Verified** | Manual chunk splitting configuration |

---

## 6. Critical User & Application Flows

### Flow 1: Recruiter Deep-Linking & Project Case Study Modal
```
User navigates to /?project=phonepe-valuation
  └─ App.tsx: Synchronous hash/search target parser scrolls #projects into view
  └─ ProjectsSection.tsx: useEffect calls parseProjectUrlParams()
       ├─ Validates projectId via isValidProjectId() in projectNavigation.ts
       ├─ Resolves project record from projects.ts and metadata from projects.json
       └─ Lazily imports and mounts CaseStudyModal.tsx inside Suspense boundary (ModalFallback.tsx)
            ├─ Focus trapped to close button via focusable elements query
            ├─ Next/Prev navigation updates URL via setProjectUrlParam()
            └─ Escape key or Backdrop click closes modal and clears URL search params
```

### Flow 2: Deferred Flagship Valuation Interactive Model
```
User scrolls down towards Section 02 (#flagship)
  └─ DeferredFlagshipPhonePe.tsx: IntersectionObserver triggers 200px before reaching section
       ├─ Triggers dynamic import('./flagship/FlagshipPhonePe')
       └─ Replaces FlagshipSkeleton with live FlagshipPhonePe component
            ├─ Reads default WACC (14.92%), Terminal Growth (7.0%), Exit Multiple (13.15x)
            ├─ valuationSensitivityMath.ts executes computeValuationSensitivity()
            └─ Updates ValuationWaterfallChart, Enterprise Value, and Equity Value live
```

### Flow 3: Contact Inquiry Submission
```
User submits inquiry in ContactSection.tsx
  └─ Client validates name, email format, message length (>= 10 chars), honeypot
  └─ Submits POST to /api/contact
       └─ api/contact.ts:
            ├─ Validates HTTP method is POST (405 otherwise)
            ├─ Verifies honeypot field is empty (silent 200 if filled)
            ├─ Checks client IP against in-memory sliding window rate limiter (max 5/min, 429 otherwise)
            ├─ Checks SLACK_WEBHOOK_URL env var (503 if missing)
            └─ Dispatches mrkdwn block payload to Slack (200 on success, 502 on upstream failure)
```

---

## 7. Data Layer & Governance Protocol

Analytical data records are partitioned strictly across:
1. **Master Metadata (`src/data/projects.json`):** Central source for card summaries, problems, data scopes, methods, deliverables, and external workbook URLs.
2. **Deep Qualitative Artifacts (`src/data/projects.ts`):** Complete research manuscripts, methodology tables, analytical caveats, and metric item classifications.
3. **Telemetry Metrics (`src/data/telemetryMetrics.ts`):** Controlled metrics displayed in the top Evidence Telemetry Bar.
4. **Governed Decision Protocol:** Strictly adheres to `PRESERVE → DOCUMENT → FLAG → GOVERN`. STRATOS DQ-10 discrepancy (Net Revenue > Gross Revenue in controlled totals) is permanently maintained in `REVIEW` status across all interfaces.

---

## 8. Shared Components & Reverse Dependencies

- **`src/components/common/AvailabilityBlock.tsx`**
  - Consumed by: [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx)
- **`src/components/common/DeferredFlagshipPhonePe.tsx`**
  - Consumed by: [`src/App.tsx`](file:///src/App.tsx)
  - Dependencies: [`src/components/common/FlagshipSkeleton.tsx`](file:///src/components/common/FlagshipSkeleton.tsx), [`src/components/flagship/FlagshipPhonePe.tsx`](file:///src/components/flagship/FlagshipPhonePe.tsx)
- **`src/components/projects/DecisionIntelligenceBlock.tsx`**
  - Consumed by: [`src/components/projects/CaseStudyModal.tsx`](file:///src/components/projects/CaseStudyModal.tsx), [`src/components/projects/ProjectSummaryModal.tsx`](file:///src/components/projects/ProjectSummaryModal.tsx)
- **`src/components/projects/ShareProjectButton.tsx`**
  - Consumed by: [`src/components/projects/CaseStudyModal.tsx`](file:///src/components/projects/CaseStudyModal.tsx), [`src/components/projects/ProjectSummaryModal.tsx`](file:///src/components/projects/ProjectSummaryModal.tsx)
- **`src/components/common/ErrorBoundary.tsx`**
  - Consumed by: [`src/main.tsx`](file:///src/main.tsx)

---

## 9. Testing & Diagnostic Automation Scripts

All scripts reside in `scripts/` and are executed via Node.js or Python:

| Script Name | Purpose | Execution Command |
| :--- | :--- | :--- |
| `scripts/test_valuation_math.mjs` | **Verified:** 22/22 tests validating DCF formulas, sensitivity matrices, TV blending | `node scripts/test_valuation_math.mjs` |
| `scripts/test_contact_api.mjs` | **Verified:** 9/9 tests verifying serverless contact validation, rate limiting & Slack dispatch | `node scripts/test_contact_api.mjs` |
| `scripts/test_projects_json_schema.mjs` | **Verified:** Validates `projects.json` structure, status enums, date sorting | `node scripts/test_projects_json_schema.mjs` |
| `scripts/test_shareable_urls.mjs` | **Verified:** Headless Chrome test of canonical project URLs, back/forward navigation | `node scripts/test_shareable_urls.mjs` |
| `scripts/verify_viewports_responsive.mjs` | **Verified:** Tests responsive layout across 375, 430, 768, 1024, 1440px | `node scripts/verify_viewports_responsive.mjs` |
| `scripts/generate_resume_pdf.mjs` | **Strict Protection:** Generates sandbox review copies; canonical resume is protected | Protected by SHA-1 guard |

---

## 10. Unknowns & Boundaries

1. **Slack Webhook Production Setup:** `SLACK_WEBHOOK_URL` environment variable is consumed in `api/contact.ts`. In local test environments without this variable, the endpoint returns a truthful `503 Service Unavailable`.
2. **Third-Party Video Assets:** SPIIDEO sports analytics and hero character canvas rely on optimized local/asset references; external video CDNs are intentionally not used to ensure zero network-dependent initial paint.
3. **Candidate Availability Values:** In `AvailabilityBlock.tsx`, candidate fields are intentionally set to `[ADD VALUE]` placeholders to avoid inferring unconfirmed personal availability.

---

## 11. Instructions for Keeping FILE-MAP.md Synchronized

1. **When adding a new component or route:** Add the file path to the appropriate category in Section 3 and index in Section 5.
2. **When modifying analytical formulas or project IDs:** Update Section 4 (Functional Architecture) and ensure `scripts/test_valuation_math.mjs` or `scripts/test_projects_json_schema.mjs` is run.
3. **Never modify the protected resume:** Any command touching `public/Kaustubh_Nandurkar_Resume.pdf` must be verified against the 96,435-byte / SHA-1 invariant.
4. **Validation Command:** Always run `npm run typecheck` and `npm run build` following structural changes.

