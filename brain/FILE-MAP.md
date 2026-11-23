# Master File Map & Codebase Navigation Index

> **Scope**: Exhaustive directory of critical files, entry points, responsibilities, callers, and dependencies.  
> **Status**: `VERIFIED`

---

## 1. Application & Service Entry Points

| File Path | Layer | Role / Responsibility | Invoked By / Entry Trigger |
| :--- | :--- | :--- | :--- |
| `src/main.tsx` | Client | Initializes React 18 root, binds ThemeContext, and mounts to `#root`. | Browser document load (`index.html`) |
| `src/App.tsx` | Client | Root application layout, section rendering, and global modal orchestration. | `src/main.tsx` |
| `api/analytics/collect.ts` | Serverless | Validates, normalizes, and persists cookieless telemetry events. | `POST /api/analytics/collect` |
| `api/analytics/dashboard/login.ts` | Serverless | Verifies admin passphrase via scrypt and issues session cookie. | `POST /api/analytics/dashboard/login` |
| `api/analytics/dashboard/stats.ts` | Serverless | Authenticates session and queries aggregated telemetry metrics. | `GET /api/analytics/dashboard/stats` |
| `api/analytics/dashboard/logout.ts` | Serverless | Invalidates active database session and clears session cookie. | `POST /api/analytics/dashboard/logout` |
| `api/assistant.ts` | Serverless | Context-grounded AI streaming endpoint using Groq Cloud API. | `POST /api/assistant` |
| `api/contact.ts` | Serverless | Processes recruiter contact submissions and posts to Slack. | `POST /api/contact` |
| `api/feedback.ts` | Serverless | Stores recruiter experience feedback into database. | `POST /api/feedback` |

---

## 2. Server Domain Logic & Shared Libraries (`server/lib/`)

| File Path | Primary Exports | Responsibility | Downstream Consumers |
| :--- | :--- | :--- | :--- |
| `server/lib/authService.ts` | `verifyPassphrase`, `createSession`, `validateSession`, `revokeSession`, `isAuthorizedOrigin` | Cryptographic scrypt verification, session hashing, origin checks, and cookie extraction. | `api/analytics/dashboard/*` |
| `server/lib/analyticsContract.ts` | `validateAnalyticsPayload`, `PATH_VALIDATION_REGEX` | Event type verification, path sanitization, query stripping, metadata allowlist enforcement. | `api/analytics/collect.ts`, `scripts/test_analytics_contract_v2.mjs` |
| `server/lib/analyticsStorage.ts` | `recordEvent`, `getDashboardMetrics`, `getDatabaseHealth` | SQL queries executed via Neon Serverless driver for event insertion and time-window rollups. | `api/analytics/collect.ts`, `api/analytics/dashboard/stats.ts` |
| `server/lib/originValidator.ts` | `validateCollectionOrigin`, `CANONICAL_PRODUCTION_ORIGIN` | Enforces authorized origins, rejects arbitrary Vercel subdomains, and handles referer fallbacks. | `server/lib/authService.ts`, `api/analytics/collect.ts` |
| `server/lib/portfolioContext.ts` | `buildPortfolioContext` | Compiles structured factual context for LLM grounding. | `api/assistant.ts` |
| `server/lib/groqProvider.ts` | `streamGroqChatCompletion` | Connects to Groq OpenAI-compatible chat completion endpoint. | `api/assistant.ts` |
| `server/lib/sheetsSync.ts` | `syncSheetsTelemetry` | Governed Google Sheets integration for analytical verification. | Background sync tasks |

---

## 3. Client Presentation & Feature Components (`src/components/`)

| File Path | Component Name | Role & Architecture Details |
| :--- | :--- | :--- |
| `src/components/navigation/Header.tsx` | `Header` | Sticky glassmorphism navigation header with theme toggle, command trigger, and mobile menu. |
| `src/components/hero/HeroSection.tsx` | `HeroSection` | Hero banner with value proposition, dynamic call-to-actions, and availability indicator. |
| `src/components/hero/CharacterCanvas.tsx` | `CharacterCanvas` | Canvas-based animated character visualization reacting to user interactions. |
| `src/components/flagship/FlagshipPhonePe.tsx` | `FlagshipPhonePe` | Interactive DCF valuation model with live slider inputs and dynamic recalculations. |
| `src/components/flagship/ValuationWaterfallChart.tsx` | `ValuationWaterfallChart` | Custom SVG waterfall chart displaying cash flow step-downs and equity bridge. |
| `src/components/flagship/ValuationScenarioComparison.tsx` | `ValuationScenarioComparison` | Interactive $5 \times 5$ sensitivity matrix with terminal methodology selectors. |
| `src/components/projects/ProjectsSection.tsx` | `ProjectsSection` | Showcase of 6 flagship projects with category filtering and case study modal triggers. |
| `src/components/projects/CaseStudyModal.tsx` | `CaseStudyModal` | In-depth modal overlay detailing problem statement, metrics, architecture, and learnings. |
| `src/components/projects/StratosDQMatrix.tsx` | `StratosDQMatrix` | Interactive governed data quality matrix demonstrating the DQ-10 invariant. |
| `src/components/analytics/PortfolioIntelligenceModal.tsx` | `PortfolioIntelligenceModal` | Authenticated admin dashboard displaying telemetry, funnels, and event distributions. |
| `src/components/assistant/PortfolioAssistant.tsx` | `PortfolioAssistant` | Sliding interactive chat drawer communicating with `/api/assistant`. |
| `src/components/candidate/ResumeUpload.tsx` | `ResumeUpload` | Client-side drag-and-drop PDF ingestion with text extraction using `pdfjs-dist`. |
| `src/components/candidate/CandidateReview.tsx` | `CandidateReview` | Client-side candidate claim synthesis and requirement matching scoring view. |
| `src/components/command/RecruiterCommandCenter.tsx` | `RecruiterCommandCenter` | Spotlight-style modal search (`Ctrl+K`) for rapid navigation and project discovery. |
| `src/components/contact/ContactSection.tsx` | `ContactSection` | Secure recruiter inquiry form with honeypot fields, direct email, and WhatsApp bridges. |
| `src/components/feedback/FeedbackWidget.tsx` | `FeedbackWidget` | Floating feedback widget collecting recruiter ratings and qualitative reviews. |

---

## 4. Client Utilities & Business Logic (`src/lib/` and `src/data/`)

| File Path | Responsibilities & Logic |
| :--- | :--- |
| `src/lib/analytics.ts` | Client telemetry dispatcher with batching, visibility tracking, and cookieless payload generation. |
| `src/lib/pdfExtractor.ts` | Local browser PDF parsing using `pdfjs-dist/legacy/build/pdf.mjs`. |
| `src/lib/pdfValidator.ts` | Client-side file size and MIME-type validation before extraction. |
| `src/lib/candidateExtractor.ts` | Regex and heuristic parsing of skills, titles, and dates from extracted PDF text. |
| `src/lib/candidateClaimStore.ts` | Local storage management (`sessionStorage`) for parsed candidate claims. |
| `src/data/projects.ts` | Governed data definitions for all 6 projects with metrics, tech stacks, and challenge notes. |
| `src/data/skills.ts` | Categorized technical competencies across Analytics Engineering, Systems, and AI. |
| `src/data/journey.ts` | Career progression milestones, responsibilities, and key achievements. |
| `src/data/faq.json` | Curated recruiter FAQ answers for instantaneous client search. |
| `src/context/ThemeContext.tsx` | Dark/light theme state provider synchronized with `localStorage` and system preferences. |

---

## 5. Verification & Testing Suites (`scripts/`)

| File Path | Target Domain | Assertions / Verification Coverage |
| :--- | :--- | :--- |
| `scripts/test_valuation_math.mjs` | Financial Engine | 22 assertions: Base case EV/EqV, Gordon Growth formula, Multiple method, matrix bounds. |
| `scripts/test_contact_api.mjs` | Contact API | 9 assertions: Method checks, honeypot evasion, email validation, rate limits, Slack errors. |
| `scripts/test_dashboard_auth_flow.mjs` | Auth Security | 15 assertions: Scrypt hash verification, salt lengths, origin rules, cookie extraction, 503 states. |
| `scripts/test_analytics_contract_v2.mjs` | Telemetry Contract | Path regex validation, query string normalization, metadata allowlist, origin validation. |
| `scripts/test_browser_network_isolation.mjs` | Candidate Privacy | Verifies zero outbound network calls occur during in-browser PDF extraction. |

