# API Authentication & Session Protocol

> **Scope**: Session cookie contracts, scrypt verification, token issuance, and expiration lifecycle.  
> **Status**: `VERIFIED`

---

## 1. Authentication Handshake Lifecycle

```
Client Browser                          Serverless Endpoint
      │                                          │
      │ 1. POST /api/analytics/dashboard/login  │
      │    { "passphrase": "..." }               │
      │─────────────────────────────────────────>│
      │                                          │── Scrypt Verification against
      │                                          │   process.env.ANALYTICS_ADMIN_HASH
      │                                          │── Generate 32-byte rawToken
      │                                          │── SHA-256(rawToken) -> sessionHash
      │                                          │── Insert into auth_sessions table
      │ 2. 200 OK + Set-Cookie:                  │
      │    portfolio_intelligence_session=...    │
      │<─────────────────────────────────────────│
      │                                          │
      │ 3. GET /api/analytics/dashboard/stats    │
      │    Cookie: portfolio_intelligence_...    │
      │─────────────────────────────────────────>│
      │                                          │── Extract rawToken from Cookie
      │                                          │── SHA-256(rawToken) -> sessionHash
      │                                          │── Verify session in auth_sessions
      │ 4. 200 OK + Telemetry Data               │
      │<─────────────────────────────────────────│
```

---

## 2. Cookie Security Invariants

The `Set-Cookie` header issued by `/api/analytics/dashboard/login` strictly enforces:
- **`HttpOnly`**: Blocks JavaScript access; prevents document cookie extraction via XSS.
- **`Secure`**: Enforces transmission exclusively over HTTPS in production.
- **`SameSite=Strict`**: Completely prevents cross-site request forgery by withholding the cookie on any cross-origin navigation.
- **`Path=/api/analytics/dashboard/`**: Cookie is never transmitted to other public routes like `/api/contact` or `/api/analytics/collect`.
- **`Max-Age=14400`**: Session duration is capped at exactly 4 hours (14,400 seconds).

