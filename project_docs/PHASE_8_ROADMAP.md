# Personal AI Career Copilot — Engineering Roadmap (Phase 8.1 - 8.6)

**Document Version:** 1.0.0  
**Status:** Multi-Phase Implementation Plan  
**Architecture:** Iterative, Verifiable Milestones with Gatekeeper Authorizations  

---

## 1. Roadmap Architecture & Phased Progression

The implementation of the Career Copilot is structured into six strictly gated phases. Each phase requires explicit human authorization, automated regression test verification, and invariant preservation before advancing.

```text
[ Phase 8.1: Candidate Profile & Knowledge Grounding ]
                     │ (Authorization Gate)
                     ▼
[ Phase 8.2: Permitted Job Source Ingestion Adapters ]
                     │ (Authorization Gate)
                     ▼
[ Phase 8.3: Explainable Job Matching & Fit Engine ]
                     │ (Authorization Gate)
                     ▼
[ Phase 8.4: Document Tailoring & Answer Synthesizer ]
                     │ (Authorization Gate)
                     ▼
[ Phase 8.5: Human Approval Gate & Tracking Kanban ]
                     │ (Authorization Gate)
                     ▼
[ Phase 8.6: Interview Intelligence & Career Analytics ]
```

---

## 2. Phase-by-Phase Execution Plan

### Phase 8.1 — Candidate Profile & Knowledge Grounding
- **Primary Deliverable:** Structured Candidate Knowledge Base and PostgreSQL Schema initialization.
- **Key Features:**
  - Database schema for `candidate_profiles`, `candidate_experiences`, `candidate_projects`, `candidate_skills`, and `candidate_preferences`.
  - Integration with existing portfolio evidence repository (`jobMatchKnowledge.ts`, PhonePe DCF, STRATOS).
  - Validation rules preventing unverified qualifications.
- **Dependencies:** PostgreSQL database instance (Neon) provisioning authorization.
- **Technical Risks:** Incomplete capture of historical achievements; schema migration friction.
- **Testing Requirements:** 100% unit test coverage for schema CRUD, tier-1 fact immutability, and export functions.
- **Completion Criteria:** Candidate data successfully loaded and verifiable via clean TypeScript contracts.

---

### Phase 8.2 — Permitted Job Source Ingestion Adapters
- **Primary Deliverable:** Multi-source ingestion pipeline without scraping violations.
- **Key Features:**
  - Direct text paste & file upload ingestion tool (candidate inputs JD text directly).
  - Public ATS Board Polling Adapter (Greenhouse, Lever, Ashby public APIs).
  - Canonical URL tracker and open graph metadata resolver (with immediate fallback to manual paste).
  - Normalization engine (standardizing role family, salary in LPA, location, company canonical name).
  - Multi-stage deduplication pipeline (Primary: source ID + canonical URL; Secondary: composite SHA-256 fingerprint).
- **Dependencies:** Phase 8.1 candidate schema.
- **Technical Risks:** ATS API schema changes; irregular formatting in user-submitted text.
- **Testing Requirements:** Direct text ingestion tests; ATS JSON fixture tests; deduplication collision tests.
- **Completion Criteria:** Ingests and normalizes 25 test job postings across Greenhouse, Lever, and manual paste with 100% schema compliance.

---

### Phase 8.3 — Explainable Job Matching & Fit Engine
- **Primary Deliverable:** Deterministic and LLM-assisted multi-dimensional match scorer.
- **Key Features:**
  - Reuse and expansion of existing `jobMatchEngine.ts` rule-based patterns.
  - Multi-dimensional scoring (skills, seniority, responsibilities, location, salary).
  - Evidence-backed citation generator (linking JD requirements directly to candidate project IDs).
  - Hard constraint eligibility filter (notice period, visa, minimum salary).
  - Explicit gap reporting (`CRITICAL_GAP` vs `TRANSFERABLE_SKILL`).
- **Dependencies:** Phase 8.1 & 8.2.
- **Technical Risks:** LLM latency; semantic mismatch on niche technical keywords.
- **Testing Requirements:** Benchmark suite of 30 annotated job descriptions testing precision, recall, and zero-hallucination guarantees.
- **Completion Criteria:** Accurate match score and citation generation under 1.5 seconds per role.

---

### Phase 8.4 — Document Tailoring & Answer Synthesizer
- **Primary Deliverable:** Tailored resume generator and screening question assistant.
- **Key Features:**
  - ATS-compliant Markdown / LaTeX resume generator that highlights relevant project evidence without adding unverified skills.
  - Cover letter drafter grounded in company business model and candidate background.
  - Custom screening answer assistant ("Why this company?", "Describe SQL optimization").
  - Prompt injection sanitization boundary on all external JD inputs.
- **Dependencies:** Phase 8.3 match engine.
- **Technical Risks:** LLM embellishment or exaggeration of metrics.
- **Testing Requirements:** Fact-checking regression test verifying that every claim in generated documents exists in Tier 1 candidate profile.
- **Completion Criteria:** Generates clean, compiled PDF resume and structured screening answers with zero hallucinated facts.

---

### Phase 8.5 — Human Approval Gate & Tracking Kanban
- **Primary Deliverable:** Cryptographic approval workflow and lifecycle tracking dashboard.
- **Key Features:**
  - Full application package review modal (Job Description, Tailored Resume PDF, Cover Letter, Answers, Target Apply Link).
  - SHA-256 Package Hash verification; explicit candidate digital sign-off record.
  - Kanban pipeline tracking (`DISCOVERED` to `OFFER/REJECTED`).
  - Follow-up reminder scheduler (Day 5, Day 12).
- **Dependencies:** Phase 8.4 document artifacts.
- **Technical Risks:** State synchronization errors; mutation of approved packages.
- **Testing Requirements:** Approval invalidation tests; state transition rule verification; audit log verification.
- **Completion Criteria:** Zero applications can advance to `SUBMITTED` without an immutable approval record.

---

### Phase 8.6 — Interview Intelligence & Career Analytics
- **Primary Deliverable:** Interview preparation briefings and funnel intelligence dashboard.
- **Key Features:**
  - Company research briefing generator (business model, competitive landscape, tech stack).
  - Technical & behavioral question rehearsal coach linked to candidate case studies.
  - Career funnel analytics: Application volume, response rate, interview conversion, and skill market frequency.
- **Dependencies:** Phase 8.5 pipeline data.
- **Technical Risks:** Low sample size in early analytics; generic interview questions.
- **Testing Requirements:** Mock interview question generation verification; analytics aggregation math tests.
- **Completion Criteria:** Complete end-to-end user workflow validated from job discovery through interview preparation.

---

## 3. Authorization Gates & Prerequisites Summary

| Phase | Milestone Name | External DB Required? | Production Config Changed? | Explicit Authorization Required |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 8.1** | Candidate Profile Schema | Yes (Neon) | No | **MANDATORY** |
| **Phase 8.2** | Job Ingestion Adapters | Yes | No | **MANDATORY** |
| **Phase 8.3** | Explainable Match Scorer | Yes | No | **MANDATORY** |
| **Phase 8.4** | Document Tailoring | Yes | No | **MANDATORY** |
| **Phase 8.5** | Human Approval Gate | Yes | No | **MANDATORY** |
| **Phase 8.6** | Interview Intelligence | Yes | No | **MANDATORY** |

