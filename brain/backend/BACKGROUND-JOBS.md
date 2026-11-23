# Background Jobs, Cron & Asynchronous Workflows

> **Scope**: Background data synchronization, automated cleanup jobs, and scheduled GitHub Actions.  
> **Status**: `VERIFIED`

---

## 1. Asynchronous Architecture Model

Due to the serverless nature of the Vercel deployment, persistent background daemon processes (such as Celery or Bull workers) are not maintained on the server. Instead, asynchronous and scheduled tasks are orchestrated via:

1. **Client-Side Non-Blocking Dispatch**:
   - Telemetry events in `src/lib/analytics.ts` are queued client-side and dispatched asynchronously using `navigator.sendBeacon` or un-awaited `fetch()` requests during page transitions.
2. **Scheduled GitHub Action Workflows (`.github/workflows/`)**:
   - Automated testing and integrity verification run on every pull request and push to main branches.
3. **Database Session Expiration**:
   - Expired authentication sessions (`expires_at < NOW()`) are automatically filtered out during queries and purged periodically via SQL maintenance queries.

---

## 2. GitHub Automation Pipelines

### Pipeline A: CI Verification (`.github/workflows/ci.yml`)
- Triggers on: Pull Requests and Push to `main` and `feature/*` branches.
- Jobs:
  1. `setup-node`: Installs Node.js 20.x with caching.
  2. `typecheck`: Runs `npm run typecheck` across app and API targets.
  3. `test:valuation`: Runs `node scripts/test_valuation_math.mjs`.
  4. `test:contact`: Runs `node scripts/test_contact_api.mjs`.
  5. `test:auth`: Runs `node scripts/test_dashboard_auth_flow.mjs`.
  6. `test:analytics`: Runs `npm run test:analytics`.
  7. `build`: Verifies Vite production build without bundle errors.

### Pipeline B: Slack Event Notifications (`.github/workflows/notify-slack.yml`)
- Triggers on: Production deployment status changes.
- Dispatches deployment summaries and commit links to private Slack administrative channels.

