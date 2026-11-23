# Folder Structure & Directory Topology

> **Scope**: Structural breakdown of all directories and file conventions.  
> **Status**: `VERIFIED`

---

## 1. Directory Tree Map

```
kaustubh-portfolio/
├── .agents/                    # Custom AI agent skill configurations and definitions
│   └── skills/                 # Installed specialized skills (impeccable, ponytail, etc.)
├── .github/                    # GitHub repository configurations
│   └── workflows/              # CI/CD automation pipelines (ci.yml, notify-slack.yml)
├── api/                        # Serverless backend functions (Vercel Node.js runtime)
│   ├── analytics/              # Visitor telemetry ingestion and administrative endpoints
│   │   ├── dashboard/          # Authenticated admin routes (login, logout, stats)
│   │   ├── collect.ts          # Public telemetry ingestion handler
│   │   └── stats.ts            # Deprecated stats endpoint (returns HTTP 410)
│   ├── assistant.ts            # Groq AI streaming assistant endpoint
│   ├── contact.ts              # Contact form submission and Slack dispatch handler
│   └── feedback.ts             # Feedback submission handler
├── brain/                      # Universal Project Knowledge Base & Architecture Docs
│   ├── api/                    # API endpoints, request-response schemas, auth
│   ├── backend/                # Serverless services, middleware, background workers
│   ├── database/               # Relational schemas, migrations, data lifecycles
│   ├── frontend/               # React architecture, state management, components, routing
│   ├── infrastructure/         # Deployment, environment variables, CI/CD, monitoring
│   ├── maintenance/            # Development guides, change impact, decision logs
│   ├── security/               # Cryptography, authorization, rate limiting, threat model
│   ├── testing/                # Verification suites, coverage, known issues
│   └── workflows/              # User journeys, business logic, financial models
├── docs/                       # Auxiliary documentation and legacy architectural assets
├── migrations/                 # PostgreSQL DDL migrations for Neon database
│   └── 001_portfolio_intelligence_init.sql # Core relational schema
├── project_docs/               # In-depth architectural specifications and product plans
├── public/                     # Static assets served directly at root
│   ├── favicon.svg             # Vector site icon
│   ├── Kaustubh_Nandurkar_Resume.pdf # Protected canonical resume (96,435 bytes)
│   └── og-image.png            # Open Graph social preview banner
├── scripts/                    # Test harnesses, browser verifiers, and CLI utilities
├── server/                     # Shared backend domain logic and database drivers
│   └── lib/                    # Server libraries (auth, contracts, Groq, Neon storage)
├── src/                        # Client-side React 18 Single Page Application
│   ├── components/             # Reusable and feature-specific UI components
│   │   ├── about/              # About me and engineering philosophy sections
│   │   ├── analytics/          # Authenticated Portfolio Intelligence Modal
│   │   ├── assistant/          # Streaming conversational assistant drawer
│   │   ├── candidate/          # Client-side resume parsing and review interface
│   │   ├── command/            # Recruiter Command Center modal (Ctrl+K)
│   │   ├── common/             # Shared atomic widgets (buttons, tooltips, QR codes)
│   │   ├── contact/            # Contact form and direct communication channels
│   │   ├── faq/                # Interactive FAQ accordion
│   │   ├── feedback/           # Persistent recruiter feedback widget
│   │   ├── flagship/           # PhonePe DCF valuation waterfall and scenario matrix
│   │   ├── hero/               # Hero banner and dynamic character animation canvas
│   │   ├── journey/            # Interactive career timeline and milestone tracker
│   │   ├── metrics/            # Evidence telemetry and verified metric counters
│   │   ├── navigation/         # Responsive navigation header and mobile drawer
│   │   ├── projects/           # Project showcase, case study modals, Stratos DQ matrix
│   │   ├── research/           # Research papers and technical publications
│   │   ├── resume/             # Inline resume preview and verified skill taxonomy
│   │   ├── skills/             # Interactive technical skills matrix
│   │   └── tools/              # Job match evaluation modal
│   ├── config/                 # Static portfolio profile metadata and social links
│   ├── context/                # React context providers (ThemeContext)
│   ├── data/                   # Governed JSON datasets and static knowledge files
│   ├── lib/                    # Client utilities (analytics client, PDF extractors)
│   ├── types/                  # Shared TypeScript type definitions
│   ├── App.tsx                 # Root application component and modal orchestrator
│   ├── index.css               # Global Tailwind CSS definitions and utility classes
│   └── main.tsx                # Client entry point and DOM root renderer
├── index.html                  # HTML template with strict CSP and preload tags
├── package.json                # Project dependencies, scripts, and engine versions
├── tailwind.config.js          # Tailwind styling tokens, fonts, and dark mode configs
├── tsconfig.json               # Client-side TypeScript configuration
├── tsconfig.api.json           # Serverless Node.js TypeScript configuration
├── vercel.json                 # Vercel deployment routes and header security policies
└── vite.config.ts              # Vite bundling, HMR, and chunk-splitting configuration
```

---

## 2. Directory Conventions & Policies

1. **`api/` vs `server/`**:
   - `api/` houses **only** endpoint entry-point functions adhering to the Vercel Serverless Function signature (`handler(req, res)`).
   - `server/lib/` houses reusable backend domain logic, database operations, and cryptographic helpers.
   - Code inside `server/` must **never** be imported by client code inside `src/`.
2. **`src/` (Client Code)**:
   - Everything in `src/` is bundled for the browser.
   - No Node.js standard modules (`fs`, `crypto`, `child_process`) may be imported here.
   - Client-side cryptographic operations must use the Web Crypto API (`window.crypto`).
3. **`scripts/`**:
   - Standalone automation and test harnesses.
   - Written as ES Modules (`.mjs`) or Python scripts (`.py`).
   - Must be executable independently via `node scripts/<script>.mjs`.

