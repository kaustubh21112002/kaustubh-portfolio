# Portfolio Integrations & Security Architecture Specification

**Project:** Kaustubh Nandurkar — Business Analytics & Valuation Portfolio  
**Target:** Phased Slack Integration, AI Assistant Architecture, and Content Security  
**Status:** Architecture Proposal & Specification (Non-Destructive)  
**Date:** October 2026  

---

## 1. Executive Summary

This document specifies the governed, production-grade architecture for:
1. **Phase A — Private Inquiry Notifications (Serverless Slack Webhook Pipeline)**
2. **Phase B — Visitor-Facing Portfolio AI Assistant (Grounded RAG / Decision Intelligence)**
3. **Phase C — Authenticated Private Document Vault (Future Scope)**
4. **Phase D — Realistic Browser Security Boundaries & Asset Protection Doctrine**

In strict adherence to STRATOS operating principles, zero secrets or tokens are exposed to frontend clients, no invasive third-party tracking is introduced, and no unapproved external services or paid models are provisioned during this static portfolio phase.

---

## 2. Phase A: Private Inquiry Notifications Architecture

### 2.1 Workflow Diagram

```
[ Visitor fills Contact Form ]
             │
             ▼
[ Client-side validation: length, email format, honeypot ]
             │
             ▼ HTTPS POST /api/contact (JSON payload)
[ Vercel Edge / Serverless Function ]
             │
             ├──> [ Rate Limiting (Upstash Redis / In-Memory Token Bucket) ]
             ├──> [ Spam & Schema Validation (Zod / Turnstile) ]
             ├──> [ Payload Sanitization (Strip HTML, escape Markdown) ]
             │
             ▼ HTTPS POST to SLACK_WEBHOOK_URL
[ Private Slack Channel: #recruiter-inquiries ]
             │
             ▼
[ HTTP 200 Response to Client -> Show In-App Confirmation Banner ]
```

### 2.2 Security & Operational Requirements

1. **Zero Secret Leakage:**
   - Webhook URLs and API credentials MUST NEVER be prefixed with `VITE_` or embedded in bundled client-side JavaScript.
   - Credentials are stored exclusively in Vercel environment variables:
     - `SLACK_WEBHOOK_URL` (Server-side secret)
     - `CONTACT_RATE_LIMIT_SECRET` (Internal HMAC key)
2. **Defensive Rate Limiting & Spam Mitigation:**
   - Enforce a strict rate limit of **3 submissions per IP per 10 minutes** to eliminate webhook flooding.
   - Hidden honeypot field (`website_url_check`) on the frontend to trap automated bots.
   - Enforce message size bounds: minimum 10 characters, maximum 1,500 characters.
3. **Data Minimization Doctrine:**
   - Notifications dispatched to Slack must transmit only minimal operational metadata:
     - Timestamp (ISO 8601 UTC)
     - Sender Name & Contact Email
     - Subject & Inquiry Body
   - No browser fingerprinting, full IP disclosure, or tracking telemetry sent to Slack.
4. **Fallback & Degradation:**
   - If the serverless Slack endpoint times out or fails (HTTP 500/504), the API returns a structured error instructing the visitor to use the direct email link (`mailto:kaustubhnandurkar21@gmail.com`).
   - The UI never falsely reports success if the backend webhook failed.

---

## 3. Phase B: Visitor-Facing Portfolio AI Assistant Architecture

### 3.1 Objective & Guardrails
A dedicated conversational assistant enabling recruiters and hiring managers to query Kaustubh's valuation methodology, project deliverables, technical proficiencies, and career background.

### 3.2 Grounded Retrieval-Augmented Generation (RAG) Architecture

```
[ Recruiter Question: "How was PhonePe's WACC calculated?" ]
                               │
                               ▼
            [ HTTPS POST /api/assistant-query ]
                               │
    ┌──────────────────────────┴──────────────────────────┐
    ▼                                                     ▼
[ Rate Limiter & Token Quota ]            [ Vector Search / Structured KB ]
  (Max 5 queries / session)                 (Grounding: projects.ts, skills.ts,
                                             research papers, audited models)
                                                          │
                                                          ▼
                                            [ Top-3 Grounded Snippets ]
                                                          │
                                                          ▼
[ LLM Generation (Gemini 2.5 Flash / Claude Haiku via Serverless Endpoint) ]
  • Strict System Prompt: Answer solely from provided portfolio facts.
  • Mandatory attribution to specific sections (#flagship, #projects).
  • Zero hallucination policy: Acknowledge missing data transparently.
                               │
                               ▼
[ Structured JSON Response: { answer, citations: ["#flagship", "Cell C20"], verified: true } ]
                               │
                               ▼
[ Interactive Chat Drawer with Section Jump Links & Non-AI Fallback ]
```

### 3.3 Core Operating Constraints
1. **Truthful & Governed:**
   - The assistant only cites public evidence already validated in `src/data/projects.ts` and `src/data/skills.ts`.
   - Never invents metrics, ROI, or causal relationships.
   - For Financial Governance control `DQ-10`, the assistant strictly explains it remains in `REVIEW` due to unitemized credit adjustments.
2. **No Exposure of Internal Slack Workspaces:**
   - The assistant is completely decoupled from private Slack conversations, candidate personal notes, or proprietary internal documents.
3. **Cost Protection & Non-AI Fallback:**
   - If model quotas are reached or API credentials are unset, the UI displays a clean index of direct links to the relevant portfolio sections without breaking the browsing experience.

---

## 4. Phase C: Authenticated Private Workspace (Future Vault)

If sensitive spreadsheets, unreleased research papers, or proprietary internship deliverables require restricted access in the future:
1. **Decoupled Architecture:** Hosted on an isolated route (e.g. `/vault/*`) or separate subdomain, protected by server-side authentication (e.g. Supabase Auth / NextAuth session cookies).
2. **Short-Lived Signed URLs:** Sensitive PDF/Excel assets stored in private cloud storage (AWS S3 / Google Cloud Storage) accessed solely via 15-minute cryptographically signed URLs.
3. **Audit Ledger:** Every access request logged with timestamp, user ID, and document identifier.

---

## 5. Phase D: Realistic Browser Security & Anti-Exfiltration Doctrine

### 5.1 Technical Reality of Client-Side Content
In modern browser architecture:
- Any text, vector graphic, or video rendered on a client monitor can be screenshotted via OS-level utilities (e.g., Snipping Tool, PrintScreen, macOS Cmd+Shift+4).
- Disabling right-click (`contextmenu`), preventing text selection (`user-select: none`), or blocking DevTools (`F12`) provides **zero real security** while severely frustrating recruiters, accessibility tools, and screen-readers.

### 5.2 Pragmatic Security Model for the Portfolio
1. **Public by Design:**
   - Everything published on `kaustubh-portfolio-six.vercel.app` is verified public professional demonstration work.
2. **Watermarking on Governed Visuals:**
   - Sensitive financial charts or custom model diagrams embed subtle, non-intrusive metadata watermarks ("Kaustubh Nandurkar • Independent Research").
3. **Server-Side Enforcement for Private Assets:**
   - Never rely on CSS or JavaScript obscurity for confidential information. If data is confidential, it must never be served in the public client bundle.
