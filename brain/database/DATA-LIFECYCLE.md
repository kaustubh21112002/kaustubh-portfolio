# Data Retention, Privacy & Lifecycle Policies

> **Scope**: Retention periods, cleanup routines, GDPR/CCPA alignment, and privacy guarantees.  
> **Status**: `VERIFIED`

---

## 1. Privacy By Design Principles

1. **Zero Cookieless Fingerprinting**:
   - The platform generates no device hashes, canvas fingerprints, or audio fingerprints.
2. **Zero IP Address Storage**:
   - Visitor IP addresses are used strictly in transient Node.js memory for rate limiting and are **never** persisted to PostgreSQL columns.
3. **Strict Path Sanitization**:
   - Query strings containing tracking tags, search parameters, or user-supplied strings are aggressively stripped before database insertion.

---

## 2. Retention Windows & Lifecycle Schedules

| Entity | Storage Medium | Retention Policy | Purge Mechanism |
| :--- | :--- | :--- | :--- |
| **`analytics_events`** | Neon PostgreSQL | 90-Day Rolling Window | Events older than 90 days are candidate rows for partition/range pruning. |
| **`auth_sessions`** | Neon PostgreSQL | 4 Hours Strict | Sessions expire automatically (`expires_at < NOW()`). Invalid rows purged on lookup. |
| **`feedback_submissions`**| Neon PostgreSQL | Indefinite (Audit Log)| Retained for ongoing portfolio and user experience improvement. |
| **Candidate Resumes** | Browser Client Memory | Transient Session Only | Exclusively in React state / `sessionStorage`; destroyed on tab closure. |

