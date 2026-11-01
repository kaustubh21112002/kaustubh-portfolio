# Change Scope Agreement (CHANGE-SCOPE.md)

**Document Status:** Reusable Governance Template & Protocol  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`  
**Prime Directive:** Strict change boundary control. Unspecified resource categories are strictly **READ-ONLY**.

---

## 1. Purpose & Core Scope Rule

This document governs the operational boundaries for any human engineer or AI coding assistant (Antigravity, Claude Code, Cursor, Codex, etc.) modifying this repository.

> **CORE SCOPE RULE:**
> An engineer or AI assistant may **ONLY** create, modify, or delete files explicitly listed under the **Active Task Boundary** below. Everything outside this scope is strictly **READ-ONLY**.
>
> If a task requires modifying `CHANGE-SCOPE.md` itself, the task authorization must explicitly include permission to update `CHANGE-SCOPE.md`.

---

## 2. Active Task Boundary (Fill Out Before Editing)

```markdown
### Task Identity
- Task ID / Name: [DESCRIBE CURRENT TASK]
- Objective: [SUMMARIZE INTENDED OUTCOME]
- Authorized By: [USER / TECH LEAD / ARCHITECT]
- Date & Timestamp: [YYYY-MM-DDTHH:MM:SS]

### Explicit Allowlist
1. Allowed Files:
   - [LIST ALLOWED FILES]
2. Allowed Directories:
   - [LIST ALLOWED DIRECTORIES]
3. Allowed Modules / Components:
   - [LIST ALLOWED MODULES]
4. Allowed API Resources:
   - [LIST ALLOWED API RESOURCES]
5. Allowed Configuration Files:
   - [LIST ALLOWED CONFIGURATION FILES]
```

*Note: Any file or category left as a placeholder or unlisted is strictly **READ-ONLY**.*

---

## 3. Global Restrictions & Change Protocols

### A. Minimal-Change Principle
- Introduce the smallest functional change required to satisfy the objective.
- Do not refactor unrelated code.
- Do not make stylistic or cosmetic edits outside the designated files.
- Strictly adhere to: **No "while I'm here" changes.**

### B. Shared-Code & Library Boundaries
- Modifying shared utilities, core abstractions, or base layouts (`src/components/common/`, `src/context/`, `src/data/`) requires explicit task authorization.
- Never introduce new third-party dependencies (`npm install`) or edit `package.json` / `package-lock.json` unless explicitly authorized.

### C. Backend, Database & API Safety
- The repository utilizes a single Vercel Serverless Function at `api/contact.ts`. Do not invent or add secondary backend endpoints, background workers, or databases without explicit instruction.
- Never modify API rate-limiting or security validation without authorization.

### D. Protected Resume Immutability (Absolute Protection)
- Path: `public/Kaustubh_Nandurkar_Resume.pdf`
- **Baseline Invariants:**
  - File Size: Exactly **96,435 bytes**
  - SHA-1: Exactly `317857D88309548D9D05E8198FFBF8212C88470C`
- If any build step alters this file, it must be restored immediately before completing the turn.

### E. Analytical Truth & Data Governance
- Adhere to: **PRESERVE → DOCUMENT → FLAG → GOVERN**.
- Never silently impute missing data, fabricate synthetic benchmarks, convert unassigned attribution to zero, or state causal certainty from observational models.
- **STRATOS DQ-10:** Data anomaly `Net Revenue > Gross Revenue` in controlled totals **MUST REMAIN `REVIEW`**. Never mark it as resolved.
- **PhonePe DCF:** Enterprise Value ₹33,431.99 Cr and Equity Value ₹41,631.22 Cr are canonical invariants.

### F. Git & Changeset Boundaries
- **NEVER** run `git add .` or `git add -A`.
- **NEVER** stage files without an explicit list of approved filenames.
- **NEVER** commit, push, or deploy without explicit user confirmation.
- **NEVER** run `git reset --hard`, `git clean -fd`, `git checkout .`, or `git restore .` unless directed with exact file targets.

---

## 4. Scope-Violation & Dependency Expansion Protocol

If during task execution you discover that an out-of-scope file must be modified:
1. **STOP IMMEDIATELY.** Do not touch the out-of-scope file.
2. Formulate a scope expansion request detailing:
   - The file/resource needed.
   - Why the change is strictly necessary.
   - The potential impact on existing invariants.
3. Wait for explicit user approval before proceeding.

---

## 5. Required Final Change Report

Every completed task must conclude with a standardized change report stating:
1. Exact files modified, created, or deleted.
2. Confirmation that 0 out-of-scope files were touched.
3. Verification test outcomes (typecheck, build, unit test pass/fail counts).
4. Protected resume checksum and byte count.
5. Exact final `git status --short`.

---

## 6. Final Hard Rule

> **No code modification may proceed without an active scope definition agreed upon in this document.**

