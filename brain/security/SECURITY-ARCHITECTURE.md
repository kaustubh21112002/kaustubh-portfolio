# Security Architecture & Threat Modeling

> **Scope**: Defense-in-depth principles, attack surface minimization, and threat mitigations.  
> **Status**: `VERIFIED`

---

## 1. Security Architecture Principles

1. **Perimeter Strictness**:
   - Every serverless API route validates the incoming request origin against an explicit whitelist (`originValidator.ts`).
2. **Zero-Trust Administrative Access**:
   - Administrative features are completely decoupled from client code.
   - Plaintext administrative passphrases never cross the network after authentication.
   - Only ephemeral SHA-256 session token digests exist in the persistent store.
3. **Data Minimization & Cookieless Architecture**:
   - Public visitors receive zero persistent identification cookies.
   - No PII is collected or persisted in telemetry.

---

## 2. Threat Modeling & Mitigation Matrix

| Threat Category | Potential Attack Vector | System Mitigation & Defense Implementation |
| :--- | :--- | :--- |
| **Cross-Site Request Forgery (CSRF)** | Malicious third-party site dispatching requests to API endpoints. | `SameSite=Strict` cookie policy + origin verification rejecting requests from outside authorized domains. |
| **Cross-Site Scripting (XSS)** | Malicious scripts attempting to steal session credentials. | `HttpOnly` cookie flag prevents JavaScript reading tokens; React escapes output strings by default; strict CSP in `index.html`. |
| **Brute Force / Password Guessing**| High-frequency dictionary attacks on `/api/analytics/dashboard/login`. | In-memory sliding-window rate limiter restricts attempts to max 5 per 15 minutes per IP; memory-hard `scrypt` hashing makes offline hashing costly. |
| **Denial of Service (DoS / Resource Exhaustion)** | Overloading telemetry collector with massive payloads or rapid bursts. | Request body limited to 2KB; rate limited to 60 req/min/IP; JSON parsing strictly guarded; scale-to-zero serverless architecture. |
| **Path Traversal / Query Injection** | Submitting paths like `/../../etc/passwd` or tracking URLs with embedded script tags. | `PATH_VALIDATION_REGEX` rejects non-whitelisted paths; automatic query-string stripping normalizes input. |
| **Timing Attacks** | Measuring time differences during password comparison. | `crypto.timingSafeEqual` over fixed-length binary buffers ensures execution time is independent of input accuracy. |

