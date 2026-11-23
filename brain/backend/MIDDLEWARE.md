# Backend Middleware & Boundary Guards

> **Scope**: In-memory rate limiting, origin verification, CORS enforcement, and request payload validation.  
> **Status**: `VERIFIED`

---

## 1. Perimeter Origin Validator (`server/lib/originValidator.ts`)

To protect serverless functions from unauthorized third-party embedding, CSRF attacks, and unauthorized compute consumption, every endpoint enforces strict origin validation:

### Whitelist Matrix
- **Canonical Production Origin**: `https://kaustubh-portfolio-six.vercel.app`
- **Authorized Vercel Previews**: Evaluates dynamically against `process.env.VERCEL_URL` (only the exact deployed preview URL matching `https://${process.env.VERCEL_URL}` is permitted).
- **Authorized Development Origins**:
  - `http://localhost:5173` (Vite Default)
  - `http://localhost:3000` (Vercel Dev / Next Default)
  - `http://127.0.0.1:5173`
  - `http://127.0.0.1:3000`
- **Strict Rejection**:
  - Rejects arbitrary third-party `.vercel.app` subdomains.
  - Rejects untrusted domains (`https://evil.com`).
  - Rejects insecure HTTP schemes in production.

---

## 2. In-Memory Sliding-Window Rate Limiters

All public and authenticated routes implement sliding-window rate limiting stored in serverless memory:

| Route | Window Duration | Max Requests / Window | Action on Violation |
| :--- | :--- | :--- | :--- |
| **`/api/analytics/collect`** | 60 seconds | 60 requests per IP | HTTP `429 Too Many Requests` |
| **`/api/analytics/dashboard/login`** | 15 minutes | 5 attempts per IP | HTTP `429 RATE_LIMIT_EXCEEDED` |
| **`/api/contact`** | 15 minutes | 5 submissions per IP | HTTP `429 RATE_LIMIT_EXCEEDED` |
| **`/api/assistant`** | 60 seconds | 10 queries per IP | HTTP `429 Too Many Requests` |

*IP Resolution*: IP addresses are extracted safely from `req.headers['x-forwarded-for']` (first comma-separated entry) or defaulted to `127.0.0.1`.

---

## 3. Payload Boundary & JSON Guards

To protect against memory exhaustion and payload injection:
- String payloads exceeding **2,048 bytes** are immediately terminated with `400 PAYLOAD_TOO_LARGE`.
- Malformed JSON strings are safely caught and return `400 INVALID_JSON`.
- Non-POST requests to mutation endpoints return `405 METHOD_NOT_ALLOWED` with explicit `Allow: POST` headers.

