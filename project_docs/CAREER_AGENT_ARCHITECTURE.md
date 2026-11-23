# Personal AI Career Copilot — Architecture Specification

**Document Version:** 1.0.0  
**Status:** System Architecture Blueprint  
**Design Philosophy:** Modular Monolith with Replaceable Adapters  

---

## 1. Architectural Strategy & Design Principles

To maximize reliability and velocity while minimizing operational overhead, the Career Copilot is designed as a **TypeScript-based Modular Monolith**:
- **Zero Premature Microservices:** Avoids multi-repo operational drag, network latency, and distributed transaction complexity.
- **Strict Module Boundaries:** Clean separation between Ingestion, Matching, Document Synthesis, and Workflow Execution.
- **Replaceable Job-Source Adapters:** Polymorphic ingestion interfaces allowing sources to be swapped or updated without affecting core business logic.
- **Deterministic Pipeline First, LLM Second:** Core eligibility, deduplication, and parsing run deterministically. LLMs are invoked only for semantic synthesis, reasoning, and drafting.

---

## 2. High-Level System Architecture

```text
+-------------------------------------------------------------------------------------------------------+
|                                  USER INTERFACE (REACT 18.3 + VITE)                                   |
|  - Candidate Profile Manager    - Discovery Feed & Kanban Pipeline     - Application Review Modal     |
|  - Document Diff & Tailoring    - Approval Gate & Signature Controller - Career Analytics Dashboard   |
+-------------------------------------------------------------------------------------------------------+
                                                  ▲
                                                  │ HTTPS / JSON API
                                                  ▼
+-------------------------------------------------------------------------------------------------------+
|                                    BACKEND MODULAR MONOLITH (NODE / TS)                                |
|                                                                                                       |
|  +---------------------------+  +--------------------------+  +------------------------------------+  |
|  |     DISCOVERY MODULE      |  |     MATCHING ENGINE      |  |         DOCUMENT ENGINE            |  |
|  | - Source Adapter Registry |  | - Rule-Based Evidence    |  | - Resume Tailoring (LaTeX/MD)      |  |
|  | - Ingestion Scheduler     |  | - Semantic LLM Evaluator |  | - Cover Letter Generator          |  |
|  | - Normalizer & Deduper    |  | - Gap Analysis Matrix   |  | - Screening Answer Synthesizer     |  |
|  +---------------------------+  +--------------------------+  +------------------------------------+  |
|                                                                                                       |
|  +---------------------------+  +--------------------------+  +------------------------------------+  |
|  |   APPLICATION WORKFLOW    |  |    SECURITY & AUDIT      |  |        AI ORCHESTRATION            |  |
|  | - State Machine Manager   |  | - Approval Verification  |  | - Prompt Injection Firewall        |  |
|  | - Submission Assistant    |  | - Immutable Audit Logger |  | - Provider Adapter (Groq / Gemini) |  |
|  | - Follow-up Scheduler     |  | - Role & Secret Vault    |  | - Structured JSON Output Guards    |  |
|  +---------------------------+  +--------------------------+  +------------------------------------+  |
+-------------------------------------------------------------------------------------------------------+
                                                  ▲
                                                  │ Connection Pool
                                                  ▼
+-------------------------------------------------------------------------------------------------------+
|                                  PERSISTENCE & STORAGE (POSTGRESQL)                                   |
|  - Candidate Profile Schema     - Job Postings Schema      - Applications & Audit Ledger Schema       |
|  - Normalized Skills Ontology   - Interaction Logs         - Document Storage (Encrypted Objects)     |
+-------------------------------------------------------------------------------------------------------+
```

---

## 3. Core Component Subsystems

### 3.1 Job Source Adapter Interface
Every job ingestion source must implement the standardized `IJobSourceAdapter` contract:
```typescript
export interface RawJobListing {
  sourceId: string;
  sourceType: 'user_submitted' | 'ats_api' | 'feed_rss' | 'email_alert';
  sourceUrl: string;
  externalJobId?: string;
  titleRaw: string;
  companyRaw: string;
  locationRaw: string;
  descriptionRaw: string;
  postedAtRaw?: string;
  compensationRaw?: string;
}

export interface IJobSourceAdapter {
  readonly sourceName: string;
  isAuthorized(): boolean;
  fetchListings(params: DiscoveryParams): Promise<RawJobListing[]>;
  parseSingleUrl?(url: string): Promise<RawJobListing>;
}
```

### 3.2 Job Normalization & Deduplication Pipeline
1. **Sanitization:** Strips HTML, tracking scripts, and invalid Unicode.
2. **Entity Resolution:** Resolves raw company names against a canonical directory.
3. **Location Normalization:** Maps addresses to `City, State, Country` and flags `Remote / Hybrid / On-site`.
4. **Multi-Stage Deduplication Hierarchy:**
   - **Primary Evidence (Source ID & Canonical URL):**
     Matches exact `(sourceType, externalJobId)` or normalized canonical URL (with all query tracking tokens like `utm_*`, `refId`, `trackingId` stripped). If a primary match occurs within an active window, the listing is recognized immediately as an existing record.
   - **Secondary Evidence (Composite Fingerprint):**
     For cross-portal listings where external IDs differ, a deterministic secondary fingerprint is computed:
     ```typescript
     const secondaryFingerprint = sha256(`${canonicalCompany}|${canonicalTitle}|${normalizedLocation}`);
     ```
     If the secondary fingerprint matches an active posting within a 30-day window, the system groups the posting as a secondary source observation rather than creating a duplicate opportunity.
   - **Confidence Scoring for Fuzzy Matches:** Ambiguous cross-postings are flagged for manual user review rather than merged destructively.

### 3.3 AI Orchestration Layer
- **Provider-Neutral Architecture:** Adapters for Google Gemini 1.5/2.0 and Groq Llama 3 models.
- **Zero Autonomous Tool Calling for External Dispatches:** AI prompt engines are bounded to read-only analytical tools and synthesis functions.
- **Strict JSON Output Enforcement:** Every prompt uses Pydantic/Zod schemas with temperature = 0.1 for deterministic, verifiable outputs.

### 3.4 Approval Security Gate
The `ApprovalGateService` ensures that the transition from `PREPARING` to `SUBMITTED` cannot occur without an unalterable user confirmation:
```typescript
export interface ApplicationApprovalRecord {
  approvalId: string;
  applicationId: string;
  approvedAt: string; // ISO-8601 UTC
  userConfirmed: boolean;
  packageHash: string; // SHA-256 of immutable package snapshot
  packageSnapshot: {
    targetJobUrl: string;
    targetCompany: string;
    targetTitle: string;
    resumeVersionId: string;
    resumeSha256: string;
    coverLetterText: string;
    screeningAnswers: Array<{ question: string; answer: string }>;
  };
  oneTimeAuthToken: string; // Single-use execution token
  isUsed: boolean;
  reviewedBy: string;
}
```
**Strict Invariants:**
1. **Immutable Package Snapshot:** The complete package payload (resume version, text, answers, target) is frozen in `packageSnapshot`.
2. **Version Binding:** The approval is strictly bound to explicit document IDs (`resumeVersionId`, `resumeSha256`).
3. **One-Time Authorization:** The `oneTimeAuthToken` can only be redeemed once to log submission.
4. **Invalidation on Mutation:** Any tweak to the resume, cover letter, or answers invalidates existing tokens and requires fresh candidate sign-off.

---

## 4. Infrastructure & Deployment Model

### 4.1 Required Infrastructure (Immediate)
- **Runtime:** Node.js 22 LTS / TypeScript.
- **Application Framework:** Modular monolith running on serverless Vercel Functions or a dedicated lightweight container (Cloud Run / Railway).
- **Database:** PostgreSQL 15+ (Neon serverless or managed Postgres) with JSONB support.
- **Storage:** Local encrypted directory or secure private object storage (Cloud Storage / S3) for generated PDFs.

### 4.2 Deferred / Optional Infrastructure (Do NOT Implement Now)
- **Redis:** Not required for single-user copilot. PostgreSQL handles queuing and session caching efficiently.
- **Kafka / RabbitMQ:** Overkill for batch job ingestion. Standard cron/scheduled serverless execution is sufficient.
- **Kubernetes:** Extreme operational complexity. Prohibited for this architecture.

---

## 5. Security & Isolation Boundaries

1. **Private Workspace Isolation:** The Career Copilot operates in an authenticated, single-tenant private workspace. It is completely isolated from the public portfolio presentation layer.
2. **Zero Ingestion of Untrusted Code:** Job description HTML is stripped to plain text using strict parsers (`cheerio` / `DOMPurify`) before LLM ingestion.
3. **Prompt Organization & Semantic Delimitation:** User prompts and job descriptions are wrapped in XML delimiters (`<untrusted_job_description>...</untrusted_job_description>`). XML wrapping is treated strictly as **input data organization and structured delimitation**, NOT as an impenetrable security boundary against sophisticated prompt injection. True security is enforced via zero-privilege execution environments, strict Zod schema validation, and mandatory out-of-band human approvals.

