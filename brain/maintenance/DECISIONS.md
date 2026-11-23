# Governed Architecture Decisions Record (ADR)

> **Scope**: Chronological ledger of key architectural decisions, context, and consequences.  
> **Status**: `VERIFIED`

---

## Decision Index

### ADR-001: Decoupled Serverless Over Containerized Microservices
- **Status**: `CONFIRMED`
- **Context**: Portfolio traffic is bursty, with periods of high recruiter engagement and long idle intervals.
- **Decision**: Deploy backend logic as Vercel Serverless Functions paired with Neon Serverless Postgres.
- **Consequence**: Zero idle compute cost, scale-to-zero database execution, instant scale-up during recruiter spikes.

### ADR-002: Cookieless Telemetry & Zero Third-Party Surveillance
- **Status**: `CONFIRMED`
- **Context**: Invasive third-party trackers (Google Analytics, Meta Pixels) harvest recruiter IPs and breach GDPR.
- **Decision**: Implement first-party cookieless event collection writing directly to Neon PostgreSQL.
- **Consequence**: Full GDPR/CCPA compliance, zero third-party data leakage, absolute telemetry ownership.

### ADR-003: Memory-Hard Scrypt Authentication for Dashboard
- **Status**: `CONFIRMED`
- **Context**: Administrative analytics must be shielded from unauthorized access without requiring complex third-party OAuth providers.
- **Decision**: Implement single-tenant scrypt passphrase verification with unique 16-byte random salts and SHA-256 session token hashing.
- **Consequence**: Resilient to GPU brute-force attacks; timing-safe comparisons prevent side-channel timing leaks.

### ADR-004: Invariant Preservation of STRATOS DQ-10
- **Status**: `CONFIRMED`
- **Context**: Total Net Revenue ($42.3M) exceeds Total Gross Revenue ($41.8M) in controlled ERP rollups.
- **Decision**: Adhere strictly to `PRESERVE → DOCUMENT → FLAG → GOVERN`. Maintain status as `REVIEW`. Never fabricate synthetic adjustments to force Gross > Net.
- **Consequence**: Preserves audit integrity and models real-world enterprise data engineering practice.

