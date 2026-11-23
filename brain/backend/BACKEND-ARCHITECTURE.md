# Backend Architecture & Serverless Runtime

> **Scope**: Vercel Node.js serverless execution, cold-start characteristics, memory boundaries, and error handlers.  
> **Status**: `VERIFIED`

---

## 1. Serverless Execution Environment

All backend capabilities are implemented as stateless, isolated **Serverless Functions** running on the Vercel infrastructure under Node.js runtime.

```
Incoming Request (HTTP / HTTPS)
       │
       ▼
[Vercel Global Edge Network]
       │ (TLS Termination, Routing via vercel.json)
       ▼
[Serverless Function Instance: Node.js 20.x]
       ├── Execution Lifecycle: Spin up -> Execute Handler -> Terminate
       ├── Context: Stateless memory, ephemerally shared during warm calls
       └── Timeout Limit: 10s default execution threshold
```

---

## 2. Serverless Function Inventory

| Route Entry Point | Implementation File | HTTP Methods | Target Memory / Timeout | Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| `/api/analytics/collect` | `api/analytics/collect.ts` | `POST` | 256MB / 10s | Public telemetry ingestion with origin check & rate limits. |
| `/api/analytics/dashboard/login` | `api/analytics/dashboard/login.ts` | `POST` | 256MB / 10s | Admin passphrase validation via scrypt & cookie issuance. |
| `/api/analytics/dashboard/stats` | `api/analytics/dashboard/stats.ts` | `GET` | 256MB / 10s | Authenticated telemetry aggregation rollups. |
| `/api/analytics/dashboard/logout` | `api/analytics/dashboard/logout.ts` | `POST` | 256MB / 10s | Session revocation and cookie clearance. |
| `/api/analytics/stats` | `api/analytics/stats.ts` | `ALL` | 128MB / 5s | **Deprecated Endpoint**; permanently returns HTTP 410 Gone. |
| `/api/assistant` | `api/assistant.ts` | `POST` | 512MB / 15s | Streaming AI assistant using Groq Llama-3.3-70b. |
| `/api/contact` | `api/contact.ts` | `POST` | 256MB / 10s | Recruiter inquiry handler dispatching to Slack. |
| `/api/feedback` | `api/feedback.ts` | `POST` | 256MB / 10s | Recruiter feedback persistence handler. |

---

## 3. Cold Start & Connection Pooling Strategy

Because serverless functions spin up and spin down dynamically, traditional PostgreSQL connection pools (e.g., standard `pg` Pool maintaining 10-20 TCP sockets) can quickly exhaust database connections.

To solve this:
- The system exclusively uses `@neondatabase/serverless` over **HTTPS POST queries**.
- Each query is dispatched as an atomic HTTP request to Neon's connection pooler.
- No persistent socket connections are maintained across lambda freeze/thaw cycles, resulting in **zero connection leaks** and instant connection establishment even during sudden traffic spikes.

