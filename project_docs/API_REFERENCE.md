# Serverless API Reference

**Confidence:** [VERIFIED]

---

## Endpoint: Contact Form Dispatcher

- **Route:** `POST /api/contact`
- **Source Implementation:** [`api/contact.ts`](file:///api/contact.ts)
- **Runtime:** Vercel Node.js Serverless Function
- **Authentication:** Public (Protected by rate limiting & honeypot)

### Request Specifications

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body Schema:**
  ```json
  {
    "name": "string (required, min 2 chars, max 100 chars, trimmed)",
    "email": "string (required, valid RFC 5322 email regex, max 150 chars)",
    "subject": "string (optional, max 200 chars)",
    "message": "string (required, min 10 chars, max 2000 chars on server; client UI limits input to 1500 chars)",
    "honeypot": "string (optional, must be empty)"
  }
  ```

> **Note on Message Length:** The client interface in [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx) enforces a front-end limit of 1,500 characters (`MAX_MESSAGE_LENGTH = 1500`). The serverless endpoint at [`api/contact.ts`](file:///api/contact.ts) accepts a larger maximum of up to 2,000 characters before rejecting with `INVALID_MESSAGE`.

### Response Status Codes

| Status Code | Reason | Response Body Payload |
| :--- | :--- | :--- |
| `200 OK` | Message accepted and dispatched to Slack (or honeypot triggered) | `{"success": true, "code": "DISPATCH_ACCEPTED", "message": "..."}` |
| `400 Bad Request` | Missing or invalid field (e.g. invalid email format, message < 10 chars) | `{"success": false, "code": "INVALID_...", "message": "..."}` |
| `405 Method Not Allowed` | Invoked with `GET`, `PUT`, `DELETE`, etc. | `{"success": false, "code": "METHOD_NOT_ALLOWED", "message": "..."}` |
| `429 Too Many Requests` | Client IP exceeded 5 requests in a 10-minute sliding window | `{"success": false, "code": "RATE_LIMIT_EXCEEDED", "message": "Too many submissions. Please wait 10 minutes..."}` |
| `502 Bad Gateway` | Upstream Slack webhook failed to deliver | `{"success": false, "code": "SLACK_DELIVERY_FAILED", "message": "..."}` |
| `503 Service Unavailable` | `SLACK_WEBHOOK_URL` environment variable is not configured | `{"success": false, "code": "SLACK_NOT_CONFIGURED", "message": "..."}` |

---

## Endpoint: Visitor Feedback Dispatcher

- **Route:** `POST /api/feedback`
- **Source Implementation:** [`api/feedback.ts`](file:///api/feedback.ts)
- **Runtime:** Vercel Node.js Serverless Function
- **Authentication:** Public (Protected by origin validation, rate limiting & honeypot)

### Request Specifications

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body Schema:**
  ```json
  {
    "rating": "string (required, 'up' | 'down')",
    "comment": "string (optional, max 500 chars)",
    "honeypot": "string (optional, must be empty)"
  }
  ```

### Response Status Codes

| Status Code | Reason | Response Body Payload |
| :--- | :--- | :--- |
| `200 OK` | Feedback accepted and dispatched to Slack (or honeypot triggered) | `{"success": true, "code": "FEEDBACK_SUBMITTED", "message": "..."}` |
| `400 Bad Request` | Missing or invalid rating / comment > 500 chars | `{"success": false, "code": "INVALID_RATING" \| "COMMENT_TOO_LONG", "message": "..."}` |
| `403 Forbidden` | Untrusted origin or referer domain | `{"success": false, "code": "FORBIDDEN_ORIGIN", "message": "..."}` |
| `405 Method Not Allowed` | Invoked with non-POST method | `{"success": false, "code": "METHOD_NOT_ALLOWED", "message": "..."}` |
| `429 Too Many Requests` | Client IP exceeded 3 requests per hour sliding window | `{"success": false, "code": "RATE_LIMIT_EXCEEDED", "message": "..."}` |
| `502 Bad Gateway` | Upstream Slack webhook failed to accept notification | `{"success": false, "code": "SLACK_DELIVERY_FAILED", "message": "..."}` |
| `503 Service Unavailable` | `SLACK_WEBHOOK_URL` environment variable is not configured | `{"success": false, "code": "SLACK_NOT_CONFIGURED", "message": "..."}` |

### Security & Rate Limiting Specifications
- **Strict Origin Validation Policy:**
  - **Full Origin Inspection:** Enforces strict validation of URL scheme, hostname, and port.
  - **Canonical Production Origin:** Accepts exclusively `https://kaustubh-portfolio-six.vercel.app` (default port 443 only). Non-HTTPS origins (`http://...`) and unexpected ports (`:8080`) are rejected with `403 Forbidden`.
  - **Preview Deployments:** Accepted **only** when matching the exact runtime deployment host defined in `process.env.VERCEL_URL` (HTTPS scheme, standard port). Broad wildcard prefix patterns (e.g. `startsWith('kaustubh-portfolio-six-')`) are **not** accepted as proof of ownership; unverified or non-matching preview hostnames are rejected.
  - **Origin / Referer Precedence:** If `Origin` is present, it must be valid (an invalid `Origin` cannot be overridden by a valid `Referer`). If `Origin` is absent, a valid `Referer` fallback is accepted. Requests missing both headers or with malformed values are rejected with `403 Forbidden`.
  - **Local Development:** `localhost` and `127.0.0.1` are permitted **exclusively** when the environment is explicitly established as local development (`process.env.VERCEL !== '1'`, `!process.env.VERCEL_ENV`, and `process.env.NODE_ENV === 'development' | 'test'`). They are strictly rejected in Vercel Preview (`VERCEL_ENV === 'preview'`), Vercel Production (`VERCEL_ENV === 'production'`), and any ambiguous or unestablished runtime environment where `NODE_ENV` is missing or undefined.
- **Best-Effort Rate Limiting:** Enforces an in-memory sliding window limit of 3 submissions per hour per client IP (`RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000`). Because state is held in-memory within active serverless worker instances, protection is best-effort and does not provide globally synchronized distributed locking across cold instances. Zero IP addresses or client identifiers are logged or forwarded to Slack.
- **Client Persistence:** Successful feedback submissions are suppressed for the current browser tab session using `sessionStorage` (`portfolio_feedback_submitted`). Access is wrapped defensively in `try/catch` to ensure uninterrupted operation when storage is unavailable.

