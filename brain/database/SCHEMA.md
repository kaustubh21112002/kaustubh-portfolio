# Database Schema & Data Dictionary

> **Scope**: Exhaustive table definitions, columns, data types, indexes, and constraints.  
> **Status**: `VERIFIED` against `migrations/001_portfolio_intelligence_init.sql`.

---

## 1. Table: `analytics_events`

Stores cookieless, privacy-preserving visitor telemetry.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Sequence | Unique monotonically increasing event identifier. |
| `event_type` | `VARCHAR(64)` | `NOT NULL` | None | Event name (`page_view`, `project_view`, `resume_download`, `contact_click`, `feedback_submit`, `job_match_use`). |
| `path` | `VARCHAR(255)` | `NOT NULL` | None | Normalized request path (e.g., `/`, `/Kaustubh_Nandurkar_Resume.pdf`, `#contact`). |
| `project_id` | `VARCHAR(64)` | `NULL` | `NULL` | Identifier of project if event relates to a project view. |
| `referrer_category` | `VARCHAR(32)` | `NOT NULL` | `'direct'` | Categorized traffic source (`direct`, `linkedin`, `github`, `search`, `other`). |
| `device_category` | `VARCHAR(32)` | `NOT NULL` | `'desktop'` | Inferred client device type (`desktop`, `mobile`, `tablet`). |
| `metadata` | `JSONB` | `NULL` | `NULL` | Whitelisted non-PII attributes (e.g., `{ roleLength: 24, hasCompany: true }`). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CURRENT_TIMESTAMP` | High-precision event creation timestamp. |

### Indexes
- `idx_analytics_events_created_at`: `CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);`
- `idx_analytics_events_type`: `CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);`
- `idx_analytics_events_project`: `CREATE INDEX idx_analytics_events_project ON analytics_events(project_id) WHERE project_id IS NOT NULL;`

---

## 2. Table: `auth_sessions`

Stores active administrative dashboard sessions with hashed tokens.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Sequence | Unique session primary key. |
| `session_token_hash`| `VARCHAR(64)` | `NOT NULL, UNIQUE` | None | SHA-256 cryptographic digest of the raw cookie session token. |
| `role` | `VARCHAR(32)` | `NOT NULL` | `'admin'` | Security role assigned to the session. |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | None | Absolute expiration timestamp (issued for 4 hours). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CURRENT_TIMESTAMP` | Session issuance timestamp. |

### Indexes
- `idx_auth_sessions_hash`: `CREATE UNIQUE INDEX idx_auth_sessions_hash ON auth_sessions(session_token_hash);`
- `idx_auth_sessions_expires`: `CREATE INDEX idx_auth_sessions_expires ON auth_sessions(expires_at);`

---

## 3. Table: `feedback_submissions`

Stores recruiter ratings, qualitative feedback, and contact intent.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Sequence | Unique feedback submission identifier. |
| `rating` | `INTEGER` | `NOT NULL, CHECK (rating >= 1 AND rating <= 5)` | None | Recruiter satisfaction score (1 to 5 stars). |
| `category` | `VARCHAR(64)` | `NOT NULL` | None | Feedback category (e.g., `technical_depth`, `design`, `clarity`). |
| `comments` | `TEXT` | `NULL` | `NULL` | Optional qualitative feedback remarks. |
| `role_context` | `VARCHAR(128)` | `NULL` | `NULL` | Recruiter's stated role or industry (e.g., `Fintech Hiring Manager`). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CURRENT_TIMESTAMP` | Submission timestamp. |

