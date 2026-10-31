# Authentication, Security & Privacy Posture (AUTH_SECURITY.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Authentication Status & Scope Disclosure

> [!NOTE]
> **No User Authentication in Current Scope:**
> The portfolio is an entirely public-facing Single Page Application (SPA). There are **no user accounts, password inputs, session tokens, JWTs, OAuth flows, or protected administrative dashboards**.
>
> Consequently, traditional user authentication features (login, password reset, MFA, session revocation) are **Not Applicable** to the active production build.

---

## 2. Serverless API Security (`api/contact.ts`)

The single backend touchpoint is the serverless inquiry endpoint (`POST /api/contact`). It adheres to strict zero-trust operational security guidelines:

### 2.1 Zero Secret Leakage Doctrine
- **No Client Secrets:** All external credentials (specifically `SLACK_WEBHOOK_URL`) are stored exclusively in Vercel Serverless environment variables.
- **Bundle Isolation:** Webhook secrets are never prefixed with `VITE_` and are completely absent from client-side JavaScript bundles.
- **Code Audit:** Client components (`src/components/contact/ContactSection.tsx`) only communicate via the relative path `/api/contact`.

### 2.2 Defensive Input Sanitization & Spam Mitigation
- **Honeypot Anti-Bot Field:** Includes a hidden input (`website_url_check`) on the client. If an automated bot populates this field, the server immediately drops or rejects the payload without dispatching to Slack.
- **Payload Boundaries:**
  - `name`: 2 to 100 characters, stripped of HTML.
  - `email`: RFC 5322 regex validation, max 100 characters.
  - `subject`: 2 to 150 characters, stripped of HTML.
  - `message`: 10 to 1,500 characters, sanitized markdown.
- **IP Rate Limiting:** Enforces a sliding token-bucket rate limit of **5 submissions per IP per 10 minutes** to eliminate spam flooding.

### 2.3 Honest Fallback & Error Handling
- If `SLACK_WEBHOOK_URL` is unconfigured, the endpoint honestly returns HTTP 503 (`SERVICE_UNCONFIGURED`).
- The frontend UI never reports a false success state. On 503 or network failure, it provides an instant one-click clipboard copy of the message draft and a pre-populated `mailto:` link.

---

## 3. Client-Side Security & Privacy

### 3.1 Zero Tracking & Cookie Posture
- **No Third-Party Cookies:** The application uses zero marketing cookies, analytics pixels (e.g. Meta, TikTok), or intrusive fingerprinting libraries.
- **No Invasive Banners:** Because no third-party cookies or non-essential tracking exist, no deceptive or annoying cookie banners are deployed.
- **Client Persistence:** Local storage usage is limited strictly to user-controlled, non-PII settings (`portfolio-theme`).

### 3.2 Asset & Integrity Protection
- **Protected Resume PDF:** `public/Kaustubh_Nandurkar_Resume.pdf` is strictly tracked and checksum-verified:
  - File Size: `96,435` bytes
  - SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C`
  - Modification of this file without explicit human authorization is prohibited.
- **Content Security Headers:** Recommended security headers configured via `vercel.json` (strict `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

## 4. Future Security Architecture (Portfolio OS / AI Assistant)

As specified in `docs/portfolio-integrations.md`, future enhancements will enforce:
1. **Authenticated Private Document Vault (Phase C):** Magic link / time-limited JWT authentication for confidential full-workbook access.
2. **AI RAG Rate Limiting (Phase B):** Ephemeral session-based token quotas (e.g. 5 questions per session) to prevent LLM denial-of-wallet attacks.

---

## 5. Cross References
- API Specifications: [`API.md`](file:///API.md)
- External Integrations: [`INTEGRATIONS.md`](file:///INTEGRATIONS.md)
- Operating Protocols: [`AGENTS.md`](file:///AGENTS.md)

