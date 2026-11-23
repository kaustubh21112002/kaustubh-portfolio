# Kaustubh Nandurkar Portfolio & Decision Intelligence Platform — Knowledge Base

> **System Status**: Production-Ready / Continuous Telemetry & Decision OS  
> **Source Repository**: `kaustubh-portfolio`  
> **Documentation Root**: `/brain/`  
> **Verification Status**: VERIFIED directly against codebase implementation as of November 2026.

---

## 1. Executive Summary

This repository hosts the personal engineering portfolio, decision intelligence system, financial analytics engine, and privacy-preserving observability architecture of **Kaustubh Nandurkar** (Senior Analytics Engineer, BI Architect, and Decision Intelligence Specialist).

Beyond serving as an executive showcase, the platform is an active, production-grade distributed system featuring:
1. **Interactive Valuation & Sensitivity Engine**: Real-time DCF valuation waterfall and scenario matrix for PhonePe (₹33,431.99 Cr EV / ₹41,631.22 Cr Equity Value).
2. **STRATOS Retail Decision Intelligence**: Governed data quality engine strictly upholding the DQ-10 audit constraint (`Net Revenue > Gross Revenue` flagged as `REVIEW`).
3. **Cookieless Event Telemetry**: First-party privacy-conscious visitor telemetry persisted into PostgreSQL via Neon Serverless.
4. **Administrative Telemetry Dashboard**: Scrypt-authenticated, rate-limited, origin-locked session management with sliding-window analytics aggregation.
5. **Context-Aware Career AI Assistant**: Streaming Groq (Llama-3.3-70b-versatile) agent grounded strictly in documented portfolio evidence.
6. **Local Browser Candidate Review & Resume Parsing**: Client-side PDF ingestion, text extraction, claim synthesis, and matching without transmitting candidate PII.

---

## 2. Master Navigation Index

### Root Architecture & Systems
| Document | Scope & Contents | Status |
| :--- | :--- | :--- |
| [`PROJECT-OVERVIEW.md`](./PROJECT-OVERVIEW.md) | Business justification, core objectives, user personas, and capabilities | `VERIFIED` |
| [`TECH-STACK.md`](./TECH-STACK.md) | Exhaustive dependency manifest, runtime environments, and versions | `VERIFIED` |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | High-level system topology, execution boundaries, and data flow | `VERIFIED` |
| [`SYSTEM-DESIGN.md`](./SYSTEM-DESIGN.md) | Mathematical models, cryptographic pipelines, and system invariants | `VERIFIED` |
| [`FOLDER-STRUCTURE.md`](./FOLDER-STRUCTURE.md) | Directory-by-directory tree breakdown and structural conventions | `VERIFIED` |
| [`FILE-MAP.md`](./FILE-MAP.md) | Master file lookup table: entry points, callers, responsibilities | `VERIFIED` |
| [`MODULES.md`](./MODULES.md) | Cross-module boundaries, interfaces, and dependency matrices | `VERIFIED` |

### Subsystem Documentation
- **Frontend Architecture**: [`frontend/FRONTEND-ARCHITECTURE.md`](./frontend/FRONTEND-ARCHITECTURE.md), [`frontend/COMPONENTS.md`](./frontend/COMPONENTS.md), [`frontend/STATE-MANAGEMENT.md`](./frontend/STATE-MANAGEMENT.md), [`frontend/ROUTING.md`](./frontend/ROUTING.md)
- **Backend & Serverless**: [`backend/BACKEND-ARCHITECTURE.md`](./backend/BACKEND-ARCHITECTURE.md), [`backend/SERVICES.md`](./backend/SERVICES.md), [`backend/MIDDLEWARE.md`](./backend/MIDDLEWARE.md), [`backend/BACKGROUND-JOBS.md`](./backend/BACKGROUND-JOBS.md)
- **Database & Persistence**: [`database/DATABASE-ARCHITECTURE.md`](./database/DATABASE-ARCHITECTURE.md), [`database/SCHEMA.md`](./database/SCHEMA.md), [`database/RELATIONSHIPS.md`](./database/RELATIONSHIPS.md), [`database/DATA-FLOW.md`](./database/DATA-FLOW.md), [`database/DATA-LIFECYCLE.md`](./database/DATA-LIFECYCLE.md)
- **API Specification**: [`api/API-OVERVIEW.md`](./api/API-OVERVIEW.md), [`api/ENDPOINTS.md`](./api/ENDPOINTS.md), [`api/REQUEST-RESPONSE.md`](./api/REQUEST-RESPONSE.md), [`api/AUTHENTICATION.md`](./api/AUTHENTICATION.md), [`api/EXTERNAL-INTEGRATIONS.md`](./api/EXTERNAL-INTEGRATIONS.md)
- **Security & Governance**: [`security/SECURITY-ARCHITECTURE.md`](./security/SECURITY-ARCHITECTURE.md), [`security/AUTHORIZATION.md`](./security/AUTHORIZATION.md), [`security/SECURITY-CONCERNS.md`](./security/SECURITY-CONCERNS.md)
- **Workflows & Journeys**: [`workflows/USER-JOURNEYS.md`](./workflows/USER-JOURNEYS.md), [`workflows/ADMIN-JOURNEYS.md`](./workflows/ADMIN-JOURNEYS.md), [`workflows/BUSINESS-LOGIC.md`](./workflows/BUSINESS-LOGIC.md)
- **Infrastructure & Operations**: [`infrastructure/ENVIRONMENT.md`](./infrastructure/ENVIRONMENT.md), [`infrastructure/DEPENDENCIES.md`](./infrastructure/DEPENDENCIES.md), [`infrastructure/BUILD.md`](./infrastructure/BUILD.md), [`infrastructure/DEPLOYMENT.md`](./infrastructure/DEPLOYMENT.md), [`infrastructure/CI-CD.md`](./infrastructure/CI-CD.md), [`infrastructure/MONITORING.md`](./infrastructure/MONITORING.md)
- **Testing & Verification**: [`testing/TESTING-STRATEGY.md`](./testing/TESTING-STRATEGY.md), [`testing/TEST-COVERAGE.md`](./testing/TEST-COVERAGE.md), [`testing/KNOWN-ISSUES.md`](./testing/KNOWN-ISSUES.md)
- **Maintenance & Decisions**: [`maintenance/DEVELOPMENT-GUIDE.md`](./maintenance/DEVELOPMENT-GUIDE.md), [`maintenance/CHANGE-IMPACT.md`](./maintenance/CHANGE-IMPACT.md), [`maintenance/DECISIONS.md`](./maintenance/DECISIONS.md), [`maintenance/DOCUMENTATION-STATUS.md`](./maintenance/DOCUMENTATION-STATUS.md)

---

## 3. Strict Operating Invariants (Code & Governance)

All human contributors and AI assistants working in this repository must maintain the following non-negotiable invariants:

1. **Resume Immutability**:
   - Path: `public/Kaustubh_Nandurkar_Resume.pdf`
   - Invariant Size: **96,435 bytes**
   - Invariant SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C`
   - *Note*: Running `npm run build` regenerates a 96,442-byte file via headless Chrome; it must immediately be restored using `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`.
2. **STRATOS Data Governance (DQ-10)**:
   - Data anomaly `Net Revenue > Gross Revenue` in controlled totals **MUST REMAIN `REVIEW`**. Never mark it resolved, clean it, or fabricate explanatory causes.
3. **Financial Model Parity**:
   - PhonePe DCF Base Case: Enterprise Value **₹33,431.99 Cr**, Equity Value **₹41,631.22 Cr**, Implied Share Price **₹821.78**.
4. **WhatsApp Communication Protocol**:
   - Phone link must remain invariant: `https://wa.me/918080001550`.

