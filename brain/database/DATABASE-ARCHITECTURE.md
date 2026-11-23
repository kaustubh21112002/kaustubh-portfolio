# Database Architecture & Relational Topology

> **Scope**: Neon Serverless PostgreSQL configuration, connection semantics, and persistence design.  
> **Status**: `VERIFIED`

---

## 1. Relational Database Topology

Persistent relational storage is provided by **Neon Serverless PostgreSQL** operating on AWS (`ap-southeast-1` region).

```
[Vercel Serverless Function]
            │
            │ HTTPS / TLS Encrypted REST Queries
            ▼
[Neon Serverless Proxy & Connection Pooler]
            │
            │ Internal High-Speed VPC
            ▼
[Neon Postgres Compute Engine (Lakebase Architecture)]
            │
            │ Storage / Compute Separation
            ▼
[Neon Distributed Cloud Object Storage]
```

---

## 2. Serverless Connection Semantics

The database integration is powered by `@neondatabase/serverless`:
- **Protocol**: HTTPS POST request per SQL query (`https://...pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`).
- **Connection String**: Loaded via `DATABASE_URL` or `POSTGRES_URL` in `.env.local` / Vercel Environment Variables.
- **Security**: Mandatory SSL encryption (`sslmode=require`).
- **Scale-to-Zero**: When no requests are active, the Neon compute instance scales down to zero CPU, eliminating idle costs while maintaining instant scale-up on demand.

