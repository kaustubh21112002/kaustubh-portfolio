# Local Development & Operating Guide

> **Scope**: Developer environment setup, command execution rules on Windows, and debugging.  
> **Status**: `VERIFIED`

---

## 1. Prerequisites & Environment Setup

- **Node.js**: Version 20.x or higher (LTS recommended).
- **Operating System**: Windows 11 (PowerShell or Command Prompt).
- **Package Manager**: `npm`.

### Essential Commands (Windows Execution Protocol)
Due to PowerShell execution policies on Windows, always invoke Node and npm wrappers via `cmd /c`:

```bash
# Install dependencies
cmd /c "npm install"

# Start Vite client-only development server
cmd /c "npm run dev"

# Start Full-Stack Vercel Serverless local development server
cmd /c "npx vercel dev"

# Run complete TypeScript validation (App + API)
cmd /c "npm run typecheck"

# Run automated verification suites
cmd /c "node scripts/test_valuation_math.mjs"
cmd /c "node scripts/test_contact_api.mjs"
cmd /c "node scripts/test_dashboard_auth_flow.mjs"
cmd /c "npm run test:analytics"

# Execute production build
cmd /c "npm run build"

# RESTORE PROTECTED RESUME AFTER BUILD (MANDATORY)
git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf
```

---

## 2. Managing Environment Secrets (`.env.local`)

Ensure `.env.local` exists at the root with valid values:
```env
DATABASE_URL="postgresql://user:pass@host/neondb?sslmode=require"
ANALYTICS_ADMIN_HASH="scrypt$<32_hex_salt>$<64_hex_derived_key>"
GROQ_API_KEY="gsk_..."
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
```

To rotate your local admin passphrase safely without printing secrets, run:
```bash
cmd /c "node scripts/reset_local_passphrase.mjs"
```

