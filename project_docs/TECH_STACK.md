# Technology Stack Specifications

**Confidence:** [VERIFIED]

---

## 1. Core Frameworks & Dependencies

| Tool / Library | Version | Role in Project | Verification Status |
| :--- | :--- | :--- | :--- |
| **React** | `18.3.1` | Client-side component rendering and hooks | [VERIFIED] `package.json` |
| **React DOM** | `18.3.1` | DOM mounting and portal interactions | [VERIFIED] `package.json` |
| **TypeScript** | `5.5.3` | Strict static typing for application and API | [VERIFIED] `package.json` |
| **Vite** | `6.4.4` | Build tool, dev server, rollup chunking | [VERIFIED] `package.json` |
| **Tailwind CSS** | `3.4.1` | Utility-first responsive design system | [VERIFIED] `package.json` |
| **PostCSS** | `8.4.35` | CSS processing & vendor autoprefixing | [VERIFIED] `package.json` |
| **Autoprefixer** | `10.4.18` | Cross-browser CSS compatibility | [VERIFIED] `package.json` |
| **Lucide React** | `0.344.0` | Accessible SVG icon primitives | [VERIFIED] `package.json` |

---

## 2. Serverless Runtime & Infrastructure

| Layer | Environment | Role | Verification Status |
| :--- | :--- | :--- | :--- |
| **Hosting Platform** | Vercel Edge / Serverless | Static assets & serverless function hosting | [VERIFIED] `vercel.json` |
| **Serverless Function** | Node.js 18+ runtime | Serverless contact dispatcher (`api/contact.ts`) | [VERIFIED] `tsconfig.api.json` |
| **External Integrations** | Slack Webhook API | Incoming webhook for recruiter inquiries | [VERIFIED] `api/contact.ts` |
| **WhatsApp Protocol** | WhatsApp Click-to-Chat (`wa.me`) | Standard HTTPS deep-link (`https://wa.me/...`) | [VERIFIED] `HeroSection.tsx` |

---

## 3. Disallowed Dependencies & Workarounds

- **No CSS UI Component Libraries:** Material UI, Ant Design, Chakra UI, and Radix UI are not installed; all primitives are pure Tailwind CSS + React.
- **No Heavy Charting Runtimes in Bundle Root:** Recharts and Canvas character animations are deferred and isolated.
- **No Third-Party Analytics Trackers:** Google Analytics / Meta Pixel are not loaded to maintain zero tracker latency and recruiter privacy.

