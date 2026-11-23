# Backend Services & Domain Logic

> **Scope**: Internal service libraries, cryptographic engines, AI prompt pipelines, and database repositories.  
> **Status**: `VERIFIED`

---

## 1. Authentication Service (`server/lib/authService.ts`)

Encapsulates all administrative identity, cryptographic verification, and session token persistence operations:

- `verifyPassphrase(passphrase: string, hash: string): boolean`:
  - Parses `scrypt$<salt>$<derivedKey>`.
  - Computes `crypto.scryptSync(passphrase, salt, 32, { N: 16384, r: 8, p: 1 })`.
  - Compares using `crypto.timingSafeEqual` in constant time.
- `createSession(role: string = 'admin'): Promise<string>`:
  - Generates 32 random bytes (`rawToken`).
  - Computes SHA-256 digest (`sessionTokenHash`).
  - Persists into `auth_sessions` table with an expiration timestamp set 4 hours in the future.
  - Returns `rawToken` to be sealed in an `HttpOnly` cookie.
- `validateSession(rawToken: string): Promise<boolean>`:
  - Hashes `rawToken` via SHA-256.
  - Queries `auth_sessions` where `session_token_hash = $1` and `expires_at > NOW()`.
- `revokeSession(rawToken: string): Promise<void>`:
  - Deletes session from `auth_sessions`.

---

## 2. Analytics Contract Service (`server/lib/analyticsContract.ts`)

Guarantees clean, governed data before writing to the database:

- **Path Regex Normalization**:
  - `PATH_VALIDATION_REGEX`: Strict validation accepting root (`/`), `/Kaustubh_Nandurkar_Resume.pdf`, anchor hashes (`#contact`), and single-level slug paths (`/projects`).
  - Rejects directory traversal attempts (`/..`), percent-encoded strings, and script injections.
- **Query Stripping**:
  - Automatically isolates pathname, discarding tracking parameters (`?utm_source=...`).
- **Metadata Whitelist**:
  - Allows only pre-approved metadata attributes (e.g., `roleLength`, `hasCompany` for `job_match_use`).
  - Rejects arbitrary, oversized payloads.

---

## 3. Storage Repository Service (`server/lib/analyticsStorage.ts`)

Handles all SQL operations on Neon PostgreSQL:

- `recordEvent(event: AnalyticsPayload): Promise<void>`:
  - Asynchronously executes `INSERT INTO analytics_events (...)`.
- `getDashboardMetrics(timeframe: '24h' | '7d' | '30d'): Promise<DashboardMetrics>`:
  - Runs parallelized SQL aggregate queries for:
    - Total event volume.
    - Unique session estimations.
    - Event type distribution breakdown.
    - Device category distribution (Desktop vs Mobile).
    - Top viewed projects.
    - Funnel conversion rates (Visitors -> Case Study -> Resume Download -> Contact Click).

---

## 4. AI Context Grounding Service (`server/lib/portfolioContext.ts` & `groqProvider.ts`)

- Compiles an immutable system prompt detailing verified achievements, technical skills, and career timeline.
- Enforces strict persona guardrails: polite, analytical, objective, and truthful.
- Invokes Groq's high-speed completion API (`https://api.groq.com/openai/v1/chat/completions`) with `stream: true`.

