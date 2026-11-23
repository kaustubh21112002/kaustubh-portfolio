# Business Logic & Governance Rules

> **Scope**: Core analytical definitions, financial models, and governance invariants.  
> **Status**: `VERIFIED`

---

## 1. PhonePe DCF Valuation Invariants

- **Enterprise Value Anchor**: ₹33,431.99 Cr ($4.03B USD).
- **Equity Value Anchor**: ₹41,631.22 Cr across 50,660,000 shares.
- **Implied Share Price Anchor**: ₹821.78 per share.
- **Cash & Debt Adjustments**:
  - Cash & Cash Equivalents: +₹8,449.23 Cr
  - Total Debt: -₹250.00 Cr
- **Terminal Growth Asymptote Protection**:
  - If $WACC \le g$, calculation must return `NaN` or display an error notice to prevent infinite or negative valuation artifacts.

---

## 2. STRATOS Retail Decision Intelligence Invariants

- **Protocol**: `PRESERVE → DOCUMENT → FLAG → GOVERN`.
- **Known Production Anomaly (DQ-10)**:
  - Metric: Net Revenue > Gross Revenue in controlled rollups.
  - Value: $42.3M Net vs $41.8M Gross.
  - Status: Must permanently remain `REVIEW`.
  - Prohibitions: No synthetic reconciliation, no imputation, no assumption of promotional discounts unless explicitly documented in upstream Apps Script.

---

## 3. Executive Resume Invariants

- **Target File**: `public/Kaustubh_Nandurkar_Resume.pdf`
- **File Size**: Exactly **96,435 bytes**.
- **SHA-1 Checksum**: Exactly `317857D88309548D9D05E8198FFBF8212C88470C`.
- **Restoration Policy**: If `npm run build` regenerates the PDF (yielding a 96,442-byte file), it must immediately be restored using `git checkout HEAD -- public/Kaustubh_Nandurkar_Resume.pdf`.

