# Verification Strategy & Quality Engineering

> **Scope**: Testing hierarchy, verification suites, regression prevention, and assertions.  
> **Status**: `VERIFIED`

---

## 1. Testing Philosophy

The platform avoids heavyweight, brittle end-to-end framework overhead in favor of **Deterministic, High-Speed Script Suites** that verify mathematical formulas, security perimeters, and API contracts directly against Node.js runtime.

---

## 2. Core Verification Matrix

| Suite File | Scope | Tests / Assertions | Invariant Checked |
| :--- | :--- | :---: | :--- |
| `scripts/test_valuation_math.mjs` | Financial Modeling | 22 / 22 Passed | Base case EV (₹33,432 Cr), EqV (₹41,631 Cr), Gordon growth formula, matrix dimensions. |
| `scripts/test_contact_api.mjs` | Inbound Contact | 9 / 9 Passed | Non-POST rejection, honeypot evasion, email regex, rate limiters, Slack 502 handling. |
| `scripts/test_dashboard_auth_flow.mjs` | Cryptography & Auth | 15 / 15 Passed | Scrypt timingSafeEqual verification, salt length checks, origin checks, cookie extraction. |
| `scripts/test_analytics_contract_v2.mjs` | Telemetry Contract | 28 / 28 Passed | Path regex normalization, query stripping, metadata allowlist, 410 deprecation response. |
| `scripts/test_browser_network_isolation.mjs` | Candidate Privacy | Complete | 0 outbound network calls during in-browser PDF ingestion and text extraction. |

