# Technology Stack & Dependency Inventory

> **Scope**: Verified catalog of all runtime platforms, languages, frameworks, libraries, build tools, and development utilities.  
> **Status**: `VERIFIED` against `package.json`, `package-lock.json`, and source code imports.

---

## 1. Core Runtime & Language Environment

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Node.js Runtime** | Node.js (Active LTS) | `>= 20.x` (Dev: v22.13.4) | Local build execution, test script automation, and serverless runtime. |
| **Language (App)** | TypeScript | `^5.7.2` | Strict static typing across all UI components, state management, and contracts. |
| **Language (Server)** | TypeScript / Node.js ESM | `^5.7.2` | Serverless backend functions in `api/` and shared services in `server/lib/`. |
| **Frontend Framework** | React | `^18.3.1` | Declarative UI rendering, hooks, concurrent rendering, and portal management. |
| **DOM Renderer** | React DOM | `^18.3.1` | Client-side DOM mounting and reconciliation. |

---

## 2. Frontend Libraries & Build Infrastructure

| Package | Version | Type | Functionality in Codebase |
| :--- | :--- | :--- | :--- |
| **`vite`** | `^6.0.7` | `devDependency` | Next-generation frontend bundler, HMR server, and production Rollup build orchestrator. |
| **`@vitejs/plugin-react`** | `^4.3.4` | `devDependency` | Official Vite plugin for React Fast Refresh and JSX transformation. |
| **`tailwindcss`** | `^3.4.17` | `devDependency` | Utility-first CSS framework configured with custom dark/light palettes. |
| **`postcss`** | `^8.5.30` | `devDependency` | CSS transformation pipeline for Tailwind autoprefixing. |
| **`autoprefixer`** | `^10.6.1` | `devDependency` | Adds vendor prefixes automatically to CSS rules. |
| **`lucide-react`** | `^0.475.0` | `dependency` | Comprehensive tree-shakeable SVG icon collection for UI elements. |
| **`clsx`** | `^2.1.1` | `dependency` | High-performance utility for constructing conditional className strings. |
| **`pdfjs-dist`** | `^4.10.38` | `dependency` | Mozilla's PDF reader for local, in-browser document parsing and claim extraction. |

---

## 3. Backend & Cloud Infrastructure

| Package | Version | Type | Functionality in Codebase |
| :--- | :--- | :--- | :--- |
| **`@neondatabase/serverless`** | `^1.2.0` | `dependency` | Serverless PostgreSQL driver utilizing HTTP/WebSockets for connection pooling. |
| **`@neon/config`** | `^1.14.0` | `dependency` | Configuration bindings for Neon serverless architecture. |
| **`@neon/env`** | `^2.1.3` | `dependency` | Automatic environment variable injection for Neon branches. |
| **`@types/node`** | `^22.13.4` | `devDependency` | Type definitions for Node.js standard libraries (`crypto`, `fs`, `path`). |
| **`@types/react`** | `^18.3.18` | `devDependency` | TypeScript declarations for React. |
| **`@types/react-dom`** | `^18.3.5` | `devDependency` | TypeScript declarations for React DOM. |

---

## 4. External Services & Cloud APIs

| Service | Provider | Interface Method | Role in System |
| :--- | :--- | :--- | :--- |
| **Neon Serverless Postgres** | Neon Inc. | `@neondatabase/serverless` via HTTPS | Persistent relational storage for telemetry events, sessions, and feedback. |
| **Groq AI Inference** | Groq Inc. | OpenAI-compatible HTTP streaming API | Ultra-low latency LLM inference (`llama-3.3-70b-versatile`) for Portfolio Assistant. |
| **Vercel Serverless Platform** | Vercel | Edge routing & Node.js Lambda runtime | Hosting of SPA assets and serverless execution of `/api/*` endpoints. |
| **Slack Webhooks** | Slack Technologies | HTTPS POST with Block Kit JSON | Real-time administrative notifications for contact form submissions. |
| **WhatsApp Direct Bridge** | WhatsApp (Meta) | `https://wa.me/918080001550` | Direct recruiter click-to-chat bridge without intermediary brokers. |

---

## 5. Development & Verification Script Tooling

The repository maintains an extensive suite of verification, automation, and testing scripts located in `scripts/`:

| Tool / Script | Technology | Responsibility |
| :--- | :--- | :--- |
| `test_valuation_math.mjs` | Node.js ESM | Validates 22 mathematical assertions covering WACC, TV, and sensitivity matrices. |
| `test_contact_api.mjs` | Node.js ESM | Validates 9 security and validation contracts for `/api/contact`. |
| `test_dashboard_auth_flow.mjs` | Node.js ESM | Validates 15 cryptographic, rate limiting, and origin boundary rules. |
| `test_analytics_contract_v2.mjs`| Node.js ESM | Validates path regex normalization, payload shapes, and origin security. |
| `generate_resume_pdf.mjs` | Node.js + Puppeteer | Headless Chrome print-to-PDF generator for canonical resume updates. |
| `reset_local_passphrase.mjs` | Node.js + `crypto` | Interactive, masked CLI tool for resetting administrative passphrases safely. |
| `test_browser_network_isolation.mjs` | Node.js + Puppeteer | Verifies that client-side PDF ingestion sends zero network packets. |

---

## 6. TypeScript Compilation Topology

The project enforces strict separation between client-side bundling and serverless API type checking:

1. **`tsconfig.json` (Client SPA)**:
   - Target: `ES2020`
   - Module: `ESNext`
   - JSX: `react-jsx`
   - Strict mode: `true`
   - Inclusion: `src`
2. **`tsconfig.api.json` (Serverless Functions)**:
   - Target: `ES2022`
   - Module: `NodeNext`
   - ModuleResolution: `NodeNext`
   - Strict mode: `true`
   - Inclusion: `api/**/*`, `server/**/*`
3. **`tsconfig.node.json` (Build Tooling)**:
   - Target: `ES2022`
   - Module: `ESNext`
   - Inclusion: `vite.config.ts`

