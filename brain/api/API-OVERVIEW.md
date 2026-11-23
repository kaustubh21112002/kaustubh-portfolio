# API Architecture & Routing Overview

> **Scope**: Routing design, headers, error contracts, status codes, and security policies.  
> **Status**: `VERIFIED`

---

## 1. Architectural Routing Table

All endpoints reside under the `/api/` path on Vercel:

| Endpoint Path | Method | Handled By | Auth Requirement | Rate Limit |
| :--- | :---: | :--- | :--- | :--- |
| `/api/analytics/collect` | `POST` | `api/analytics/collect.ts` | Public (Origin Checked) | 60 req/min/IP |
| `/api/analytics/dashboard/login` | `POST` | `api/analytics/dashboard/login.ts` | Passphrase (scrypt) | 5 attempts/15 min/IP |
| `/api/analytics/dashboard/stats` | `GET` | `api/analytics/dashboard/stats.ts` | Session Cookie (HttpOnly) | Authenticated |
| `/api/analytics/dashboard/logout` | `POST` | `api/analytics/dashboard/logout.ts` | Session Cookie (HttpOnly) | Authenticated |
| `/api/analytics/stats` | `ALL` | `api/analytics/stats.ts` | None | Permanent 410 Gone |
| `/api/assistant` | `POST` | `api/assistant.ts` | Public (Origin Checked) | 10 req/min/IP |
| `/api/contact` | `POST` | `api/contact.ts` | Public (Origin Checked) | 5 submissions/15 min/IP |
| `/api/feedback` | `POST` | `api/feedback.ts` | Public (Origin Checked) | 10 submissions/15 min/IP |

---

## 2. Standardized JSON Envelope Format

All responses follow a predictable JSON contract:

### Success Envelope
```json
{
  "success": true,
  "code": "EVENT_RECORDED",
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Error Envelope
```json
{
  "success": false,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid administrator credentials provided."
}
```

### Standard Status Codes
- `200 OK`: Request succeeded.
- `400 Bad Request`: Payload validation or JSON syntax failure.
- `401 Unauthorized`: Missing or invalid credentials / expired session.
- `403 Forbidden`: Unauthorized origin or CSRF perimeter violation.
- `405 Method Not Allowed`: Incorrect HTTP verb.
- `410 Gone`: Permanently deprecated route.
- `429 Too Many Requests`: Rate limiter triggered.
- `503 Service Unavailable`: Unconfigured environment variables or database unreachable.

