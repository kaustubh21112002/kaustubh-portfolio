# Role-Based Access Control & Authorization

> **Scope**: Administrative access levels, role boundaries, and session enforcement.  
> **Status**: `VERIFIED`

---

## 1. Access Roles & Privileges

The system implements a clean two-tier role model:

| Role | Access Scope | Authentication Mechanism | Allowed Operations |
| :--- | :--- | :--- | :--- |
| **`public` (Visitor / Recruiter)** | Public Website & Client Tools | None (Open Access) | View portfolio, interact with valuation model, review case studies, submit contact form, talk to AI assistant. |
| **`admin` (Portfolio Owner)** | Telemetry & Observability Dashboard | Passphrase -> Session Cookie (`portfolio_intelligence_session`) | View aggregate telemetry metrics, monitor conversion rates, review daily traffic trends, trigger manual logouts. |

---

## 2. Authorization Enforcement Pipeline

For any endpoint requiring `admin` privileges (e.g., `/api/analytics/dashboard/stats`):

1. **Cookie Extraction**: Reads `portfolio_intelligence_session` from the request `Cookie` header.
2. **Token Format Validation**: Ensures the token is a valid 64-character hexadecimal string.
3. **Cryptographic Lookup**: Hashes the token using SHA-256 and queries `auth_sessions`:
   ```sql
   SELECT id, role, expires_at 
   FROM auth_sessions 
   WHERE session_token_hash = $1 AND expires_at > NOW();
   ```
4. **Access Grant / Rejection**:
   - If a valid, non-expired record with `role = 'admin'` is found, the request proceeds.
   - Otherwise, the request is halted with HTTP `401 Unauthorized` and an `UNAUTHORIZED` error code.

