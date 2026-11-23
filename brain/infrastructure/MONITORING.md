# Telemetry, Observability & Monitoring

> **Scope**: Ingestion monitoring, error tracking, performance metrics, and dashboard analytics.  
> **Status**: `VERIFIED`

---

## 1. Observability Architecture

Observability is maintained through three non-invasive layers:

1. **First-Party Telemetry Store (Neon Postgres)**:
   - Tracks engagement metrics across timeframes (`24h`, `7d`, `30d`).
   - Measures conversion funnels: `page_view` $\rightarrow$ `project_view` $\rightarrow$ `resume_download` $\rightarrow$ `contact_click`.
2. **Vercel Runtime Logs**:
   - Captures function invocation latencies, memory utilization, and unhandled errors.
3. **Local Audit Verification**:
   - `scripts/qa_audit.mjs` and `scripts/audit_canonical_evidence.mjs` provide automated CLI health checks.

---

## 2. Invariant Performance Telemetry

- **First Contentful Paint (FCP)**: $< 0.8$ seconds on standard 4G.
- **Largest Contentful Paint (LCP)**: $< 1.2$ seconds.
- **Cumulative Layout Shift (CLS)**: `0.000` (Strict invariant; zero layout shifts during font or asset loads).
- **Time to First Byte (TTFB)**: $< 80$ms globally via Vercel Edge caching.

