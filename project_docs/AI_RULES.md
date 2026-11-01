# AI Development Operating Rules & Safety Protocols

**Confidence:** [VERIFIED]  
**Applies To:** All AI coding assistants (Antigravity, Claude Code, Cursor, Codex, Gemini CLI)

---

## 1. Prime Directives Before Coding

1. **Mandatory Pre-Read:**
   - Read [`project_docs/PROJECT_CONTEXT.md`](file:///project_docs/PROJECT_CONTEXT.md) and [`project_docs/AI_RULES.md`](file:///project_docs/AI_RULES.md).
   - Review [`CHANGE-SCOPE.md`](file:///CHANGE-SCOPE.md) and verify explicit allowlist for the current task.
2. **Inspect Git State:**
   - Confirm active branch is `feature/phonepe-valuation-waterfall`.
   - Record HEAD commit hash.
   - Inspect unstaged tracked and untracked files before modifying anything.
3. **Zero Assumptions:**
   - Never assume APIs, databases, or libraries exist based on filenames. Verify active imports.

---

## 2. Non-Negotiable Operational Rules

### Rule 1: Protected Resume Immutability
- File: [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf)
- Byte count must remain exactly **96,435 bytes**.
- SHA-1 must remain exactly `317857D88309548D9D05E8198FFBF8212C88470C`.
- If modified by automated build scripts, restore immediately:
  `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`

### Rule 2: Absolute Data Governance (Zero Fabrication)
- Follow: `PRESERVE → DOCUMENT → FLAG → GOVERN`.
- Never silently impute missing data, fabricate synthetic benchmarks, or claim causal certainty from observational data.
- **STRATOS DQ-10:** Anomaly `Net Revenue > Gross Revenue` must permanently remain marked as `REVIEW`.
- **PhonePe Valuation:** Preserve ₹33,431.99 Cr Enterprise Value and ₹41,631.22 Cr Equity Value.

### Rule 3: Zero Destructive Git Commands
- Never execute `git reset --hard`, `git clean -fd`, `git checkout .`, or `git restore .`.
- Never use `git add .` or `git add -A`.
- Never commit, push, merge, or deploy without explicit, unambiguous user confirmation.

### Rule 4: Minimal, Scoped Changes
- Strictly avoid "while I'm here" refactorings.
- Do not modify files outside the explicitly agreed scope in `CHANGE-SCOPE.md`.
- If an out-of-scope dependency must change: **STOP AND ASK**.

### Rule 5: Run Verification Suites
Following meaningful modifications, execute:
- `npm run typecheck` (tsc & tsc -p tsconfig.api.json)
- `npm run build` (production Vite build verification)
- `node scripts/test_valuation_math.mjs` (22/22 valuation formula tests)
- `node scripts/test_contact_api.mjs` (9/9 contact endpoint tests)
- `node scripts/test_projects_json_schema.mjs` (project record integrity)

### Rule 6: Zero Secret Exposure
- Never hardcode or echo API keys, webhook URLs, credentials, or private contact details.
- Environment variables must remain documented in `.env.example` only.

