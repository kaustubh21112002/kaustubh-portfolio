# API Specification & Endpoints (API.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Overview & Architecture

The portfolio application exposes exactly **one** serverless API endpoint, hosted on Vercel Functions:
- **Endpoint:** `POST /api/contact`
- **Source File:** [`api/contact.ts`](file:///api/contact.ts)
- **Runtime:** Node.js Serverless Function (Vercel Edge/Serverless)
- **Primary Function:** Receives contact inquiries from the web form, validates inputs, checks for spam and rate limits, and securely dispatches a formatted message payload to a private Slack channel.

---

## 2. Endpoint Specification: `POST /api/contact`

### 2.1 Request Headers
```http
POST /api/contact HTTP/1.1
Host: kaustubh-portfolio-six.vercel.app
Content-Type: application/json
Accept: application/json
```

### 2.2 Request Body Schema
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@enterprise.com",
  "subject": "Executive Recruiter Inquiry: Senior Data Analyst Role",
  "message": "Hi Kaustubh, I reviewed your PhonePe valuation case study and would like to connect.",
  "website_url_check": ""
}
```

#### Field Specifications:
| Field | Type | Required | Constraints | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | 2 to 100 characters. Stripped of HTML tags. | Sender's full name. |
| `email` | `string` | **Yes** | RFC 5322 email regex. Max 100 characters. | Sender's contact email. |
| `subject` | `string` | **Yes** | 2 to 150 characters. Stripped of HTML tags. | Inquiry subject line. |
| `message` | `string` | **Yes** | 10 to 1,500 characters. Markdown sanitized. | Inquiry body. |
| `website_url_check` | `string` | No | Must be empty. | **Honeypot trap:** automated bots filling this field are silently rejected or given HTTP 400. |

---

### 2.3 Response Payloads

#### Success Response (`HTTP 200 OK`)
Dispatched when input passes validation, rate limits, and the Slack webhook returns `200 OK`.
```json
{
  "success": true,
  "message": "Inquiry successfully received and routed to notification pipeline."
}
```

#### Validation Error (`HTTP 400 Bad Request`)
Dispatched when fields fail validation or the honeypot field is populated.
```json
{
  "success": false,
  "error": "VALIDATION_FAILED",
  "message": "Please ensure all fields are correctly formatted and message is between 10 and 1,500 characters."
}
```

#### Rate Limit Exceeded (`HTTP 429 Too Many Requests`)
Dispatched when an IP exceeds 5 requests within a 10-minute sliding window.
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please wait before submitting another inquiry or contact directly via email.",
  "retryAfter": 600
}
```

#### Unconfigured Service Fallback (`HTTP 503 Service Unavailable`)
Dispatched when the environment variable `SLACK_WEBHOOK_URL` is omitted or unconfigured on the server.
```json
{
  "success": false,
  "error": "SERVICE_UNCONFIGURED",
  "message": "Direct message pipeline is temporarily unconfigured. Please use the direct mailto link."
}
```

#### Gateway / Upstream Error (`HTTP 502 / 504`)
Dispatched when the external Slack API times out or rejects the payload.
```json
{
  "success": false,
  "error": "UPSTREAM_DISPATCH_FAILURE",
  "message": "Unable to dispatch message to upstream webhook. Please use direct email."
}
```

---

## 3. Security & Operational Guardrails

1. **Zero Secret Leakage:** The `SLACK_WEBHOOK_URL` is read purely via server-side `process.env.SLACK_WEBHOOK_URL`. It is never exported to client JavaScript bundles.
2. **Defensive Rate Limiting:** Enforces an in-memory/token bucket rate limit per IP.
3. **Frontend Graceful Fallback:** If `POST /api/contact` returns `503`, `500`, or network error, the client UI automatically provides:
   - Formatted mailto link generation (`mailto:kaustubhnandurkar21@gmail.com?subject=...`).
   - One-click copy of the message draft to clipboard.

---

## 4. Planned Endpoints (Portfolio OS / AI Assistant)

The following endpoints are proposed in `docs/portfolio-integrations.md` but are **not yet implemented**:
- `POST /api/assistant-query`: Grounded RAG query endpoint for recruiter Q&A.
- `GET /api/availability`: Real-time calendar availability endpoint.

---

## 5. Cross References
- Security Architecture: [`AUTH_SECURITY.md`](file:///AUTH_SECURITY.md)
- Integrations: [`INTEGRATIONS.md`](file:///INTEGRATIONS.md)
- Testing & Verification: [`TESTING.md`](file:///TESTING.md)

