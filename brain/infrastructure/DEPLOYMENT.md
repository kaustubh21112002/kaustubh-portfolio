# Deployment Architecture & Hosting Topology

> **Scope**: Vercel configuration, headers, routing policies, and CDN edge topology.  
> **Status**: `VERIFIED`

---

## 1. Hosting Architecture Overview

The application is deployed globally on the **Vercel Serverless Edge Network**:

```
[DNS: Cloudflare / Vercel Managed DNS]
            │
            ▼
[Anycast Edge Network (TLS 1.3 Termination, Global CDN)]
       │                                     │
       ├─ Static Asset Request               ├─ /api/* Dynamic Function Call
       │                                     │
       ▼                                     ▼
[Edge Cache (dist/)]               [Serverless Function Instance]
                                             │
                                             ▼
                                  [Neon PostgreSQL (AWS ap-southeast-1)]
```

---

## 2. Vercel Configuration Policy (`vercel.json`)

The deployment strictly configures security headers and caching behavior:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

