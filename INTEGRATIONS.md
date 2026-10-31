# Third-Party Integrations & Infrastructure (INTEGRATIONS.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Third-Party Service Inventory

This inventory documents all active, partial, and planned third-party services, APIs, and infrastructure dependencies:

| Service / Integration | Category | Status | Secrets / Credentials | Purpose & Verification Evidence |
| :--- | :--- | :---: | :--- | :--- |
| **Vercel Edge Platform** | Hosting & CDN | **Active** | Managed via Vercel GitHub integration. | Hosts static SPA bundle, handles DNS/SSL, and executes serverless API routes (`api/contact.ts`). |
| **GitHub** | Version Control & CI | **Active** | SSH / Personal Access Tokens. | Remote code repository: `https://github.com/kaustubh21112002/kaustubh-portfolio`. Triggers automated Vercel preview/production deployments. |
| **Slack Incoming Webhook** | Notifications | **Implemented (Opt-in)** | `SLACK_WEBHOOK_URL` (Serverless environment variable only). | Dispatches structured recruiter inquiry alerts from `api/contact.ts` to private channel `#recruiter-inquiries`. Honest 503 fallback when omitted. |
| **jsPDF** | Client PDF Generation | **Active (Bundled)** | None (Pure client library). | Generates formatted A4/Letter financial valuation executive summaries from the PhonePe DCF model. |
| **Lucide React** | Iconography | **Active (Bundled)** | None (Open-source package). | Provides lightweight, accessible SVG icons across navigation, telemetry, and project modals. |
| **Google Gemini API / Anthropic API** | LLM Engine | **Planned** | Serverless secret (Future scope). | Powers the proposed visitor-facing Portfolio AI Assistant (`docs/portfolio-integrations.md`). |
| **Upstash Redis** | Distributed Rate Limiting | **Planned** | Serverless secret (Future scope). | Distributed sliding-window rate limiting for the contact API and future AI assistant endpoint. |

---

## 2. Integration Architecture: Slack Recruiter Inquiry Webhook

### 2.1 Workflow & Data Minimization
When a recruiter submits an inquiry via `ContactSection.tsx`:
1. Client sends JSON payload to `POST /api/contact`.
2. Vercel function inspects the payload for honeypot completion and validates field lengths.
3. If valid, formats a clean Slack Block Kit payload:
   - Header: *"New Recruiter Inquiry — Portfolio"*
   - Sender Name & Email
   - Subject & Message Body
   - Submission Timestamp (ISO 8601 UTC)
4. Function issues HTTPS POST to `SLACK_WEBHOOK_URL`.
5. Returns HTTP 200 to client.

### 2.2 Security Invariant
`SLACK_WEBHOOK_URL` is **NEVER** exposed to client JavaScript or bundled into `dist/`.

---

## 3. External Links & Document Assets

The application links to verified external professional profiles:
- **LinkedIn:** `https://www.linkedin.com/in/kaustubhnandurkar`
- **GitHub:** `https://github.com/kaustubh21112002`
- **Official Resume PDF:** Hosted locally at `/Kaustubh_Nandurkar_Resume.pdf` (zero external dependencies).

---

## 4. Cross References
- API Specifications: [`API.md`](file:///API.md)
- Security Posture: [`AUTH_SECURITY.md`](file:///AUTH_SECURITY.md)
- System Architecture: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)

