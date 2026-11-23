# Candidate Data Model & Integrity Specification

**Document Version:** 1.0.0  
**Status:** Data Architecture & Ontology Specification  
**Governance Principle:** PRESERVE → DOCUMENT → FLAG → GOVERN  
**Ground Truth Rule:** Strict separation between **Verified Facts**, **User Preferences**, and **AI Suggestions**.  

---

## 1. Data Integrity, Evidence Grounding & Trust Hierarchy

To guarantee absolute professional credibility and eliminate hallucination:
1. **Tier 1 — Verified Facts (Candidate-Certified Ground Truth):**
   - **Portfolio-Verifiable Ground Truth:** Project metrics, architecture artifacts, case studies, codebase links, and data governance analyses already authored and verified within this repository (e.g. PhonePe DCF valuation with ₹41,631.22 Cr equity value, STRATOS analytics project with 50,000 audited orders).
   - **Explicit User Confirmation Required:** External employer employment dates, job titles, formal compensation history, educational degrees, institution names, and formal certifications CANNOT be inferred automatically from portfolio text or AI analysis. They **require active, explicit confirmation and input from the user**.
   - **Zero Synthetic Facts in Production:** Synthetic candidate data (e.g., "Alex Morgan", synthetic salaries, mock notice periods) is strictly restricted to test harnesses. **Synthetic data must NEVER be treated as real candidate preferences or merged into candidate records.**
2. **Tier 2 — User Preferences (Current Career Parameters):** Candidate's target titles, minimum compensation floors (INR LPA), notice period, and geographic limits. Editable only by the candidate; never inferred by AI.
3. **Tier 3 — AI Suggestions (Generated & Drafted):** Tailored summary bullets, cover letter drafts, skill relevance mappings, and application answers. Always tagged as `AI_SUGGESTION` until explicitly confirmed or edited by the candidate. AI suggestions can NEVER be promoted to Tier 1 without explicit user sign-off.

---

## 2. Structured Entity Schema

```sql
-- Core Candidate Profile
CREATE TABLE candidate_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    primary_email VARCHAR(160) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    location_city VARCHAR(80) NOT NULL,
    location_country VARCHAR(60) NOT NULL DEFAULT 'India',
    linkedin_url VARCHAR(255) NULL,
    portfolio_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verified Work Experience (Tier 1 Facts)
CREATE TABLE candidate_experiences (
    experience_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(profile_id) ON DELETE CASCADE,
    company_name VARCHAR(140) NOT NULL,
    job_title VARCHAR(120) NOT NULL,
    employment_type VARCHAR(40) NOT NULL DEFAULT 'Full-time',
    location VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL, -- NULL indicates current employment
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    verified_achievements JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of verified accomplishment bullets
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verified Projects & Portfolio Evidence (Tier 1 Facts)
CREATE TABLE candidate_projects (
    project_id VARCHAR(60) PRIMARY KEY, -- Slug matching portfolio, e.g., 'phonepe-valuation'
    profile_id UUID NOT NULL REFERENCES candidate_profiles(profile_id) ON DELETE CASCADE,
    title VARCHAR(140) NOT NULL,
    domain VARCHAR(60) NOT NULL, -- 'FINANCIAL_VALUATION', 'DATA_GOVERNANCE', etc.
    summary TEXT NOT NULL,
    core_metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"impliedEquityValue": "41631 Cr", "orderCount": 50000}
    evidence_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['PostgreSQL', 'Python', 'PowerBI']
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verified Skills Taxonomy (Tier 1 Facts)
CREATE TABLE candidate_skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(profile_id) ON DELETE CASCADE,
    skill_name VARCHAR(80) NOT NULL,
    category VARCHAR(40) NOT NULL, -- 'TECHNICAL', 'TOOL', 'DOMAIN_KNOWLEDGE', 'LEADERSHIP'
    proficiency_level VARCHAR(20) NOT NULL, -- 'EXPERT', 'PROFICIENT', 'FAMILIAR'
    years_experience NUMERIC(3, 1) NOT NULL,
    primary_evidence_project_id VARCHAR(60) NULL REFERENCES candidate_projects(project_id),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_profile_skill UNIQUE (profile_id, skill_name)
);

-- Candidate Preferences (Tier 2 Preferences)
CREATE TABLE candidate_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(profile_id) ON DELETE CASCADE,
    target_job_titles JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['Lead Business Analyst', 'BI Architect']
    minimum_base_salary_inr NUMERIC(12, 2) NOT NULL, -- e.g. 2,400,000 INR
    preferred_locations JSONB NOT NULL DEFAULT '["Bengaluru", "Mumbai", "Remote"]'::jsonb,
    remote_preference VARCHAR(30) NOT NULL DEFAULT 'HYBRID_OR_REMOTE', -- 'REMOTE_ONLY', 'HYBRID_OR_REMOTE', 'ANY'
    notice_period_days INTEGER NOT NULL DEFAULT 30,
    willing_to_relocate BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document Artifacts (Resumes & Cover Letters)
CREATE TABLE candidate_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(profile_id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL, -- 'CANONICAL_RESUME', 'TAILORED_RESUME', 'COVER_LETTER'
    version_label VARCHAR(60) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    is_canonical_protected BOOLEAN NOT NULL DEFAULT FALSE,
    source_markdown TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Data Ownership, Versioning & Auditability

1. **Candidate Data Ownership:** All data belongs exclusively to the candidate. It is stored on candidate-controlled infrastructure (local disk or personal serverless DB) with zero multi-tenant pooling or external model training.
2. **Document Versioning:** Every resume generation increments a deterministic version counter and preserves a cryptographic SHA-256 hash. The candidate can inspect exactly what document was attached to any historical application.
3. **Protected Canonical Resume:** The production-approved executive resume (`public/Kaustubh_Nandurkar_Resume.pdf`, 96,435 bytes, SHA-1 `317857D88309548D9D05E8198FFBF8212C88470C`) is marked `is_canonical_protected = TRUE` and cannot be modified or replaced by automated scripts.

---

## 4. Privacy, Export, Deletion & Provider Data Flow

### 4.1 Candidate Data Privacy & Access Control
- **Single-Tenant Authentication Boundary:** The Career Copilot operates strictly behind the candidate's authenticated administrative session. Unauthenticated access is completely barred.
- **Zero Public Exposure:** Candidate profiles, application histories, and document versions are strictly barred from the public portfolio client and CDN cache.
- **Storage Isolation:** Candidate data resides in isolated database schemas with strict row and role boundaries.

### 4.2 Data Export & Right to Erasure
- **Complete Data Export (JSON / ZIP):** One-click full export providing candidate profile, verified project evidence, application history, and all generated documents in standard JSON and archive files.
- **Right to Erasure (Purge API):** Truncates all candidate data, job postings, and application histories permanently across database tables and object storage with zero ghost backups.

### 4.3 AI Provider Data-Flow Restrictions
- **Zero Training on Candidate Data:** When calling external LLM providers (Google Gemini, Groq), API calls must use commercial enterprise endpoints with explicit zero-data-retention and zero-model-training guarantees.
- **Minimal Context Boundary:** Prompts must only transmit the specific job description text and the relevant candidate experience subset needed for the specific drafting task. Unrelated candidate profile details (phone number, home address, unrelated employer history) must be scrubbed before prompt dispatch.
- **Zero External Tool Execution:** The LLM is provided zero dispatch tools, zero network connectivity, and zero execution privileges. Output is restricted to deterministic JSON conforming to strict Zod schemas.

