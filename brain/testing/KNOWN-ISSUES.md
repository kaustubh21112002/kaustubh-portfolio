# Known Issues, Edge Cases & Technical Debt

> **Scope**: Documented limitations, open audit items, and technical debt ledger.  
> **Status**: `VERIFIED`

---

## 1. Governed Analytical Issue: STRATOS DQ-10

- **Symptom**: Net Revenue ($42.3M) exceeds Gross Revenue ($41.8M) in controlled ERP dataset rollups.
- **Classification**: Governed Data Quality Anomaly.
- **Current Status**: `REVIEW`.
- **Operating Constraint**: Under strict data governance guidelines, this anomaly must **never** be silently cleaned, imputed, or marked as resolved in the UI without an authorized upstream reconciliation from the governed Google Sheet source of truth.

---

## 2. In-Flight Technical Gaps & Limitations

1. **Standalone Vite SPA vs Vercel Serverless in Local Dev**:
   - Running `npm run dev` (`vite`) starts only the client-side SPA.
   - Calling `/api/*` endpoints against port `5173` returns HTTP `404 Not Found` because Vite does not execute Vercel serverless functions natively.
   - **Resolution**: Use `cmd /c "npx vercel dev"` for full-stack local testing.
2. **Resume PDF Regeneration Artifacts**:
   - Running `npm run build` triggers `build:resume`, which invokes headless Chrome to regenerate the resume PDF.
   - Due to rendering variations across Chrome versions, the generated file size fluctuates to 96,442 bytes (vs. the protected invariant of 96,435 bytes).
   - **Mandatory Procedure**: After running `npm run build`, restore the protected resume using `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`.

