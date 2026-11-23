# Administrator Journeys & Observability Workflows

> **Scope**: Admin authentication, telemetry dashboard inspection, and operational tasks.  
> **Status**: `VERIFIED`

---

## 1. Journey: Authenticated Telemetry Monitoring

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Portfolio Owner (Kaustubh)
    participant UI as Browser UI
    participant Auth as /api/analytics/dashboard/login
    participant Stats as /api/analytics/dashboard/stats
    participant DB as Neon PostgreSQL

    Admin->>UI: Presses Ctrl+Shift+I (or clicks hidden footer trigger)
    UI->>UI: Opens Portfolio Intelligence Modal
    Admin->>UI: Enters Admin Passphrase
    UI->>Auth: POST /api/analytics/dashboard/login
    Auth->>Auth: Scrypt Verify + Issue HttpOnly Cookie
    Auth-->>UI: 200 OK (Authenticated)
    UI->>Stats: GET /api/analytics/dashboard/stats?timeframe=30d
    Stats->>DB: Query Aggregated Metrics & Conversion Funnels
    DB-->>Stats: Rollup Dataset
    Stats-->>UI: 200 OK + Metrics Payload
    UI->>Admin: Renders Interactive Telemetry Dashboard
    Admin->>UI: Selects "Logout"
    UI->>UI: Dispatches Logout Broadcast to all open tabs
```

---

## 2. Journey: Local Passphrase Recovery

If the administrator needs to rotate or recover the local admin passphrase:
1. Open local terminal.
2. Execute:
   ```bash
   cmd /c "node scripts/reset_local_passphrase.mjs"
   ```
3. Enter new passphrase with masked asterisks.
4. The script:
   - Computes a new random 16-byte salt.
   - Derives a 32-byte scrypt key (`N=16384, r=8, p=1`).
   - Creates a timestamped backup of `.env.local`.
   - Writes `ANALYTICS_ADMIN_HASH=scrypt$<salt>$<hash>` to `.env.local`.
   - Validates the new hash immediately in-memory before terminating.

