# Security Concerns, Audit Notes & Residual Risks

> **Scope**: Security limitations, edge-case audit findings, and operational precautions.  
> **Status**: `VERIFIED`

---

## 1. Security Audit Findings & Residual Risks

### A. In-Memory Rate Limiting in Serverless Environments
- **Observation**: Rate limit counters are stored in Node.js module-level memory (`const loginAttempts = new Map<string, number[]>()`).
- **Residual Risk**: When multiple serverless lambda instances spin up concurrently across different AWS availability zones, each instance maintains its own memory space. An attacker distributing requests across multiple distinct edge instances could theoretically exceed the per-instance threshold.
- **Remediation / Future Hardening**: Transition rate limiting to Upstash Redis or Neon-backed atomic counters if coordinated distributed brute-force traffic is observed.

### B. Vercel Preview Origin Configuration
- **Observation**: Authorized preview domains rely on `process.env.VERCEL_URL`.
- **Finding**: In production deployments on custom domains, `VERCEL_URL` points to the auto-generated Vercel deployment URL while visitors arrive via `kaustubh-portfolio-six.vercel.app`. The origin validator correctly includes `CANONICAL_PRODUCTION_ORIGIN` alongside `VERCEL_URL` to avoid false rejections.

### C. Client-Side Resume Extraction Privacy
- **Observation**: PDF ingestion (`pdfjs-dist`) executes entirely in browser memory.
- **Audit Verification**: Confirmed via `scripts/test_browser_network_isolation.mjs` that zero network requests transmit parsed candidate text over the wire.

