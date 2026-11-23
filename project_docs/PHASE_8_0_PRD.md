# Personal AI Career Copilot — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Architecture Specification & Product Blueprint  
**Phase:** Phase 8.0 Planning  
**Geography:** India and Global Remote Opportunities  
**Autonomy Model:** Copilot Mode (Strict Human-in-the-Loop; mandatory explicit approval per submission)  

---

## 1. Executive Summary & Vision

The **Personal AI Career Copilot** is a self-hosted, privacy-first career intelligence platform designed to eliminate job search fatigue, prevent application black holes, and systematically optimize executive/analytical career progression. 

Operating strictly under a **Copilot governance model**, the system discovers, filters, scores, and prepares tailored applications for relevant roles (Data Analytics, BI Architecture, Financial Modeling, Decision Intelligence, and Product Analytics) across India (Bengaluru, Mumbai, NCR, Pune, Hyderabad, Remote) and international remote markets.

### The Core Invariant
**Zero Autonomous Submissions.** The agent possesses zero autonomous authority to dispatch applications, submit forms, or transmit candidate data without a cryptographically bound, reviewable user approval record.

---

## 2. Target Persona & Geographic Scope

- **Candidate Profile:** Senior / Lead Business Analyst, Analytics Engineer, BI Architect, Decision Intelligence Specialist.
- **Geographic Markets:**
  - **Tier 1 Tech Hubs (India):** Bengaluru, Mumbai/MMR, NCR (Gurugram/Noida), Pune, Hyderabad.
  - **Global Remote:** US/EU companies hiring remote talent in IST or flexible timezones.
- **Role Targets:** Analytics Engineering, Business Intelligence, Strategy & Operations, Financial Valuation & Data Governance.

---

## 3. Product Modules

### 3.1 Module 1: Private Candidate Profile
- **Purpose:** Stores the single source of truth for candidate credentials, work history, verified accomplishments, and career parameters.
- **Features:**
  - Verified career history with immutable audit evidence.
  - Dynamic skill taxonomy mapped to real portfolio projects (e.g., PhonePe DCF, STRATOS).
  - Career preferences matrix: minimum compensation, notice period, location preference, hybrid/remote tolerance.

### 3.2 Module 2: Job Discovery Engine
- **Purpose:** Ingests candidate job postings from authorized, documented, and user-submitted channels.
- **Supported Channels:**
  - Direct user copy-paste of job title, company, and description text into ingestion modal (primary).
  - Manual document upload (candidate-saved PDF / text job descriptions).
  - Official ATS public JSON feeds (Greenhouse, Lever, Ashby).
  - Official RSS / Atom syndicated job feeds (RemoteOK, Himalayas).
  - User-submitted URLs for reference and canonical metadata tracking (strictly avoiding automated DOM scraping).
  - Candidate-forwarded email alert parsing via private webhook.

### 3.3 Module 3: Job Normalization & Deduplication
- **Purpose:** Normalizes messy, unstructured job descriptions into a uniform schema.
- **Features:**
  - Canonical company normalization (e.g., "Google Inc", "Google India" -> "Google").
  - Role family categorization.
  - Compensation extraction & normalization (INR LPA vs USD k/yr).
  - Primary deduplication via `(sourceType, externalJobId)` and canonical URL tracking.
  - Secondary cross-portal deduplication via composite hashing (`company_clean + title_clean + location_clean`).

### 3.4 Module 4: Explainable Job-Fit Analysis
- **Purpose:** Calculates deterministic and qualitative compatibility between candidate and role.
- **Scoring Dimensions:**
  - Skills alignment (hard technical skills vs tools).
  - Experience level & seniority calibration.
  - Responsibilities alignment (hands-on vs management).
  - Hard eligibility gates (visa, location, education).
- **Core Principle:** Transparent scoring. Returns exact evidence citations from candidate background; never invents qualifications.

### 3.5 Module 5: Resume & Cover Letter Preparation
- **Purpose:** Generates tailored, ATS-compliant LaTeX / Markdown resumes and structured cover letters.
- **Features:**
  - Re-orders portfolio project highlights based on role requirements.
  - Tailors executive summary without fabricating unheld skills.
  - Generates verifiable PDF artifacts.

### 3.6 Module 6: Application Answer Assistance
- **Purpose:** Drafts bespoke answers for custom ATS screening questions.
- **Features:**
  - "Why do you want to work here?" grounded in real candidate career trajectory.
  - Technical experience questionnaires (e.g., "Describe a complex SQL optimization you performed").
  - Truthful gap handling: When candidate lacks a requirement, drafts an honest transferable-competency response rather than claiming false experience.

### 3.7 Module 7: Human Approval Workflow
- **Purpose:** The security boundary of the platform.
- **Workflow:**
  1. System presents complete Application Package (Target Employer, Job URL, Tailored Resume PDF, Generated Cover Letter, Screening Answers).
  2. Candidate reviews diff and confirms submissions.
  3. Digital approval record logged with timestamp and content hash.
  4. System dispatches or assists submission only after approval is locked.

### 3.8 Module 8: Application Tracking & Pipeline Management
- **State Machine:**
  `DISCOVERED → SHORTLISTED → PREPARING → AWAITING_APPROVAL → SUBMITTED → INTERVIEW → OFFER / REJECTED / WITHDRAWN`
- **Features:**
  - Centralized Kanban and tabular tracking.
  - Status change history with notes.
  - Stale application alerts (e.g., 14 days without response).

### 3.9 Module 9: Interview Preparation & Briefing
- **Purpose:** Prepares candidate for technical and executive rounds upon interview invitation.
- **Features:**
  - Company research brief (business model, revenue streams, tech stack).
  - High-probability behavioral and technical question bank based on JD.
  - Rehearsal prompts matching candidate portfolio case studies to expected interview topics.

### 3.10 Module 10: Follow-up Reminders & Cadence
- **Purpose:** Maintains professional recruiter cadence without spamming.
- **Features:**
  - Post-submission follow-up scheduler (Day 5, Day 12).
  - Post-interview thank-you note generator.
  - Recruiter response sentiment detection.

### 3.11 Module 11: Career Analytics & Funnel Intelligence
- **Purpose:** Executive dashboard measuring job hunt conversion rates.
- **Metrics:**
  - Discovery volume vs Shortlist conversion.
  - Tailored application response rate vs baseline generic rate.
  - Skill demand frequency across targeted job market.
  - Salary range distribution across opportunities.

---

## 4. Success Metrics

1. **Precision over Volume:** 80%+ of recommended roles meet minimum salary and skill criteria.
2. **Zero Compliance Breaches:** Zero scraping bans, zero anti-bot triggers, zero account suspensions.
3. **Audit Trail Completeness:** 100% of submitted applications backed by a signed approval log.
4. **Time Efficiency:** Reduces tailoring and screening answer preparation time from 45 minutes to under 5 minutes per role.

