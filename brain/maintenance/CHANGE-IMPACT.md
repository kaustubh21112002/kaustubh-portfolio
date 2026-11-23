# Change Impact Analysis & Regression Checklists

> **Scope**: Blast radius assessment, regression checklists, and boundary rules.  
> **Status**: `VERIFIED`

---

## 1. Impact Radius Matrix

| Area Being Modified | Potential Ripple Effects & Impacted Systems | Mandatory Verification Gates |
| :--- | :--- | :--- |
| **`src/components/flagship/*`** | Valuation math, SVG rendering, share links, CSV/JSON export. | `node scripts/test_valuation_math.mjs` + `npm run typecheck` |
| **`server/lib/authService.ts`** | Admin dashboard login, cookie parsing, session verification. | `node scripts/test_dashboard_auth_flow.mjs` |
| **`api/analytics/*`** | Public event collection, telemetry rollups, Neon writes. | `npm run test:analytics` |
| **`src/components/contact/*`** | Honeypot filtering, Slack notifications, email validation. | `node scripts/test_contact_api.mjs` |
| **`public/Kaustubh_Nandurkar_Resume.pdf`** | Executive resume downloads, recruiter candidate verification. | File size (96,435 bytes) & SHA-1 checksum check. |

---

## 2. Pre-Commit Checklist

Before staging or committing any code changes:
- [ ] Active branch confirmed (`feature/*`).
- [ ] No untracked scratch files staged.
- [ ] Protected resume verified: `96,435 bytes` and SHA-1 `317857D88309548D9D05E8198FFBF8212C88470C`.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] All 4 core test suites pass (`22/22`, `9/9`, `15/15`, `28/28`).
- [ ] No secrets or plaintext passphrases exposed in code or commits.

