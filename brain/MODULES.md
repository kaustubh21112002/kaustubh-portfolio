# Module Boundaries & Inter-Module Dependency Matrix

> **Scope**: Structural relationships, module isolation rules, import boundaries, and coupling metrics.  
> **Status**: `VERIFIED`

---

## 1. System Module Boundaries

The codebase is organized into five isolated architectural modules:

```
[Module: Client Presentation (src/)]
       │
       ├───> [Module: Client Analytics & State (src/lib/)]
       │
       └───> [HTTP / JSON Network Boundary]
                   │
                   ▼
       [Module: Serverless API Handlers (api/)]
                   │
                   ├───> [Module: Server Core & Security (server/lib/)]
                   │           │
                   │           └───> [PostgreSQL / HTTPS Boundary]
                   │                       │
                   │                       ▼
                   │         [Module: Neon Persistence Layer]
                   │
                   └───> [External Cloud Boundaries: Groq / Slack]
```

---

## 2. Module Coupling & Import Rules

To prevent architectural drift and security vulnerabilities, the repository enforces strict module boundary rules:

1. **Client Isolation**:
   - `src/` must **never** import from `api/`, `server/`, or `migrations/`.
   - Any attempt to import Node.js server modules inside `src/` will fail the Vite Rollup build.
2. **Serverless Function Encapsulation**:
   - `api/` endpoints must only import shared logic from `server/lib/` or external npm packages.
   - Files in `api/` must never import from `src/`.
3. **Database Driver Isolation**:
   - Only `server/lib/analyticsStorage.ts` and `server/lib/authService.ts` may import `@neondatabase/serverless`.
   - API route controllers must call repository functions (`recordEvent`, `createSession`, `getDashboardMetrics`) rather than executing raw SQL queries directly.
4. **Candidate Data Isolation (Phase 8)**:
   - Components in `src/components/candidate/` must store state exclusively in local React state or `sessionStorage`.
   - They must **never** invoke `fetch()` or dispatch network requests containing candidate resume text.

---

## 3. Inter-Module Dependency Matrix

| From Module \ To Module | `src/components/` | `src/lib/` | `api/` | `server/lib/` | Neon DB | External APIs |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`src/components/`** | Allowed (Internal) | Allowed | HTTP Only | **FORBIDDEN** | **FORBIDDEN** | WhatsApp Only |
| **`src/lib/`** | **FORBIDDEN** | Allowed (Internal) | HTTP Only | **FORBIDDEN** | **FORBIDDEN** | **FORBIDDEN** |
| **`api/`** | **FORBIDDEN** | **FORBIDDEN** | Allowed (Internal) | Allowed | Via `server/lib/` | Allowed |
| **`server/lib/`** | **FORBIDDEN** | **FORBIDDEN** | **FORBIDDEN** | Allowed (Internal) | Direct SQL | Allowed (Groq/Slack) |
| **`scripts/`** | **FORBIDDEN** | **FORBIDDEN** | In-Memory Call | Allowed (Test Mode) | Direct SQL | Mocked |

---

## 4. Subsystem Responsibilities

### Module A: Client Shell & UI (`src/components/`)
- Renders responsive UI components using Tailwind CSS.
- Handles keyboard shortcuts (`Ctrl+K` for command center, `Ctrl+Shift+I` for admin dashboard).
- Manages user input for financial sensitivity sliders, case study navigation, and search queries.

### Module B: Telemetry & Ingestion Pipeline (`src/lib/analytics.ts` -> `api/analytics/collect.ts` -> `server/lib/analyticsStorage.ts`)
- Captures page views, button clicks, and downloads with millisecond timestamps and normalized paths.
- Validates origins and rejects spoofed requests.
- Persists events in PostgreSQL with zero PII.

### Module C: Authentication & Access Control (`server/lib/authService.ts`)
- Manages cryptographic passphrases, rate limits, session tokens, and secure cookie lifecycle.

### Module D: AI Reasoning Engine (`api/assistant.ts` -> `server/lib/groqProvider.ts`)
- Streams structured portfolio intelligence to prospective recruiters and engineers.
- Grounds answers in canonical project facts.

