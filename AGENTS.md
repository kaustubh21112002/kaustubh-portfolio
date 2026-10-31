# Agent Operating Protocols & Guidelines (AGENTS.md)

**Document Version:** 1.0.0  
**Scope:** Mandatory rules for all autonomous AI agents, assistants, and human engineers operating in this repository.  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Prime Directive & Core Mandates

All AI coding assistants (including Antigravity, Claude Code, Cursor, Codex, and Gemini CLI) **MUST STRICTLY COMPLY** with the following protocols before, during, and after any repository operation.

### Rule 1: Mandatory Pre-Read
Before reading, editing, or creating any project code or architecture, **you MUST read**:
1. [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md) (Analytical source of truth, positioning, and metrics).
2. [`DECISIONS.md`](file:///DECISIONS.md) (Governed decisions marked `CONFIRMED`).
3. Relevant architectural specs ([`ARCHITECTURE.md`](file:///ARCHITECTURE.md), [`PRD.md`](file:///PRD.md)).

### Rule 2: Inspect Git State Before Any Edit
Before modifying any file, inspect the active Git status:
- Confirm active branch is `feature/phonepe-valuation-waterfall` (or designated feature branch).
- Confirm HEAD commit hash.
- Note already modified tracked files and preserve existing unstaged changes.
- Identify untracked files and leave them untouched.

### Rule 3: Zero Destructive Operations
- **NEVER** run `git reset --hard`, `git clean -fd`, `git checkout .`, or `git restore .` unless explicitly directed with exact file targets by the user.
- **NEVER** discard, stash, overwrite, or clean untracked test scripts, logs, `.codex/`, or documentation files.

### Rule 4: Zero Unauthorized Staging, Committing, Pushing, or Deploying
- **NEVER** run `git add .` or `git add -A`.
- **NEVER** stage files without an explicit list of approved filenames.
- **NEVER** run `git commit`, `git push`, or `vercel deploy` without explicit, unambiguous user confirmation.

### Rule 5: Protected Resume Immutability (Strict Protection)
- The executive resume file at [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) is strictly protected.
- **Baseline Invariants:**
  - File Size: Exactly **96,435 bytes**
  - SHA-1 Checksum: Exactly `317857D88309548D9D05E8198FFBF8212C88470C`
- Note: Running `npm run build` triggers `build:resume`, which regenerates a 96,442-byte file. **You must immediately restore the protected resume using:**
  `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`
  and verify the 96,435-byte hash before concluding any task.

### Rule 6: Absolute Data Governance (Zero Fabrication)
- Adhere to: **PRESERVE → DOCUMENT → FLAG → GOVERN**.
- Never silently impute missing data, fabricate synthetic benchmarks, convert unassigned attribution to zero, or state causal certainty from observational models.
- **STRATOS DQ-10:** Data anomaly `Net Revenue > Gross Revenue` in controlled totals **MUST REMAIN `REVIEW`**. Never mark it as resolved or clean it.
- **PhonePe DCF:** Preserve Enterprise Value ₹33,431.99 Cr and Equity Value ₹41,631.22 Cr. Formulas and cell audit notes (e.g. Cell C13) must be preserved as documented.

### Rule 7: Minimal, Scoped Changes
- Do not refactor unrelated components.
- Do not introduce new third-party libraries without explicit approval.
- Do not modify `package.json` or `package-lock.json` unless requested.

### Rule 8: Run Validation Suites After Any Modification
Following meaningful code edits, execute and report:
1. `npm run typecheck` (TypeScript validation for app and API).
2. `node scripts/test_valuation_math.mjs` (Valuation formula verification: 22/22 tests).
3. `node scripts/test_contact_api.mjs` (Contact API contract: 9/9 tests).
4. `node scripts/test_shareable_urls.mjs` (Deep link routing: 6/6 tests).
5. Build verification: `npm run build` (and restore the protected resume).

### Rule 9: Transparent Reporting
Always report:
- Exact files modified, created, or deleted.
- Validation test outcomes (exact pass/fail counts).
- Status of the protected resume PDF.
- Final `git status --short`.

### Rule 10: Stop & Ask Protocol
If a user prompt or requirement contradicts [`DECISIONS.md`](file:///DECISIONS.md), [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md), or these rules, **STOP IMMEDIATELY**. State the exact conflict and ask for human clarification before altering code.

---

## 2. Command Execution Guidelines on Windows
- Operating System is **Windows 11**; shell is **PowerShell**.
- PowerShell blocks running unsigned `.ps1` wrapper scripts. Always invoke Node/npm tools via `cmd /c`:
  - `cmd /c "npm run ..."`
  - `cmd /c "npx ..."`
- For inline Node execution, avoid PowerShell double-quote mangling by creating small `.mjs` scripts in `scripts/` or escaping quotes carefully.

---

## 3. Cross References
- Master Context: [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md)
- Decisions: [`DECISIONS.md`](file:///DECISIONS.md)
- Testing Suites: [`TESTING.md`](file:///TESTING.md)

