# API Endpoint Specifications

> **Scope**: Exhaustive per-endpoint parameter, schema, and error definitions.  
> **Status**: `VERIFIED`

---

## 1. POST `/api/analytics/collect`

Ingests cookieless client events.

### Request Headers
- `Content-Type: application/json`
- `Origin` or `Referer` (Required, must match authorized whitelist)

### Request Body
```json
{
  "eventType": "page_view",
  "path": "/",
  "projectId": "phonepe-valuation",
  "referrerCategory": "direct",
  "deviceCategory": "desktop",
  "timestamp": 1731400000000,
  "metadata": {
    "roleLength": 24,
    "hasCompany": true
  }
}
```

### Response
- `200 OK`: `{ "success": true, "code": "EVENT_RECORDED" }`
- `400 Bad Request`: Payload validation failure or invalid path regex.
- `403 Forbidden`: Unauthorized origin.
- `429 Too Many Requests`: IP rate limit exceeded.
- `503 Service Unavailable`: `DATABASE_URL` not configured.

---

## 2. POST `/api/analytics/dashboard/login`

Authenticates administrator and issues HttpOnly session cookie.

### Request Body
```json
{
  "passphrase": "ENTER_YOUR_ADMIN_PASSPHRASE"
}
```

### Response
- `200 OK`:
  - `Set-Cookie: portfolio_intelligence_session=<rawToken>; HttpOnly; Secure; SameSite=Strict; Path=/api/analytics/dashboard/; Max-Age=14400`
  - Body: `{ "success": true, "code": "SESSION_CREATED", "message": "Authentication successful." }`
- `401 Unauthorized`: Invalid credentials provided.
- `403 Forbidden`: Request origin not permitted.
- `429 Too Many Requests`: Too many failed login attempts (max 5 per 15 min).
- `503 Service Unavailable`: `ANALYTICS_ADMIN_HASH` or database unconfigured.

---

## 3. GET `/api/analytics/dashboard/stats`

Returns aggregated telemetry for the dashboard.

### Request Headers
- `Cookie: portfolio_intelligence_session=<rawToken>`

### Response
- `200 OK`:
  ```json
  {
    "success": true,
    "timeframe": "30d",
    "metrics": {
      "totalEvents": 1420,
      "pageViews": 850,
      "projectViews": 320,
      "resumeDownloads": 140,
      "contactClicks": 65,
      "conversionRate": 4.57,
      "deviceBreakdown": { "desktop": 980, "mobile": 440 },
      "topProjects": [{ "id": "phonepe-valuation", "views": 210 }]
    }
  }
  ```
- `401 Unauthorized`: Session token missing, invalid, or expired.

---

## 4. POST `/api/contact`

Receives inbound recruiter inquiries and dispatches notifications to Slack.

### Request Body
```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@fintech-ventures.com",
  "message": "Interested in discussing a Lead Analytics Engineer role.",
  "_gotcha": ""
}
```

### Validation Rules
- `name`: Non-empty string, $\le 100$ characters.
- `email`: Valid RFC 5322 email regex, $\le 255$ characters.
- `message`: $\ge 10$ characters, $\le 5,000$ characters.
- `_gotcha`: Hidden honeypot field. If populated by an automated bot, the API returns `200 OK` silently without dispatching to Slack.

