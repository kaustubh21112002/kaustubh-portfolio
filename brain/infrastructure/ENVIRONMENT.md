# Environment Variables & Configuration Contracts

> **Scope**: Environment configuration, default values, sensitivity levels, and build secrets.  
> **Status**: `VERIFIED`

---

## 1. Environment Variable Inventory

| Variable Name | Required Scope | Sensitivity | Target Consumers | Description & Format |
| :--- | :--- | :--- | :--- | :--- |
| **`DATABASE_URL`** | Backend (Serverless) | **CRITICAL** | `server/lib/analyticsStorage.ts`, `authService.ts` | Neon Postgres pooled connection URI (`postgresql://...@...neon.tech/neondb?sslmode=require`). |
| **`POSTGRES_URL`** | Backend (Serverless) | **CRITICAL** | `server/lib/analyticsStorage.ts` | Fallback connection string matching Neon format. |
| **`ANALYTICS_ADMIN_HASH`**| Backend (Serverless) | **CRITICAL** | `server/lib/authService.ts`, `api/analytics/dashboard/login.ts` | Scrypt hash string (`scrypt$<32_hex_salt>$<64_hex_derived_key>`). |
| **`GROQ_API_KEY`** | Backend (Serverless) | **CRITICAL** | `server/lib/groqProvider.ts`, `api/assistant.ts` | Groq Cloud API authentication key (`gsk_...`). |
| **`SLACK_WEBHOOK_URL`** | Backend (Serverless) | **HIGH** | `api/contact.ts` | Incoming Slack Webhook endpoint (`https://hooks.slack.com/services/...`). |
| **`VERCEL_URL`** | Backend (System) | Low | `server/lib/originValidator.ts` | Automatic Vercel deployment hostname for dynamic preview origin validation. |

---

## 2. Environment Precedence & Local Setup

1. **Local Development**:
   - Stored in untracked `.env.local` at repository root.
   - Automatically loaded by `vercel dev` or scripts utilizing Node standard libraries.
2. **Production Deployment**:
   - Configured securely in the Vercel Project Dashboard under **Settings > Environment Variables**.
   - Encrypted at rest and injected into serverless function memory at runtime.

