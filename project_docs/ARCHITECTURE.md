# System Architecture & Technical Specifications

**Confidence:** [VERIFIED]

---

## 1. High-Level Architectural Diagram

```
[ Browser Client ]
        │
        ├── Initial Paint (index.html, index.css, index.js, vendor-core.js)
        ├── Route/Component-Level Lazy Boundaries (React.lazy + Suspense):
        │     ├── DeferredFlagshipPhonePe (IntersectionObserver triggered)
        │     │     └── module-flagship-valuation.js (~103 kB)
        │     ├── CaseStudyModal (Click / URL parameter triggered)
        │     │     └── module-case-studies.js (~152 kB)
        │     └── ProjectSummaryModal (Brief button triggered)
        │
        └── Outbound HTTP Requests:
              ├── HTTPS GET https://wa.me/918080001550?text=... (Click-to-Chat)
              └── HTTPS POST /api/contact (Serverless Contact Submission)
                        │
                        ▼
            [ Vercel Serverless Function: api/contact.ts ]
                        │
                        ├─ IP Sliding-Window Rate Limiter (5 req/min)
                        ├─ Honeypot & Body Validation
                        └─ Dispatches mrkdwn to Slack Webhook
```

---

## 2. Chunking & Bundle Optimization Strategy

Configured in [`vite.config.ts`](file:///vite.config.ts):
- `vendor-core`: React, React DOM, Lucide React (core shared runtime).
- `module-flagship-valuation`: PhonePe DCF model, waterfall chart, scenario math (isolated to avoid blocking initial LCP).
- `module-case-studies`: Deep case study modal, STRATOS DQ matrix, IT support architecture interactive components.
- `ProjectSummaryModal`: 30-second recruiter brief component.

---

## 3. Data & State Management

- **Master Project Metadata:** `src/data/projects.json` + `src/data/projectSchema.ts`.
- **Deep Case Study Sections:** `src/data/projects.ts`.
- **Theme State:** `src/context/ThemeContext.tsx` with `localStorage` persistence and inline anti-flash script in `index.html`.
- **Navigation State:** Native URL query parameters (`?project=<id>`, `&view=brief`) synchronized via `window.history.pushState` and `window.history.replaceState`.

