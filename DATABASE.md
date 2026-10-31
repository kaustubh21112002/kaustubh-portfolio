# Data Architecture & Models (DATABASE.md)

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`

---

## 1. Database Architecture Disclosure

> [!NOTE]
> **No Remote Database Engine:**
> The portfolio frontend application **does not use a remote SQL, NoSQL, or external headless CMS database**. All data models, project records, academic dissertations, and financial calculations are embedded as strongly typed, immutable TypeScript data structures within `src/data/`.
>
> This architectural decision eliminates cold-start latency, prevents third-party data downtime, and guarantees deterministic data presentation for executive recruiters.

---

## 2. Governed Client-Side Data Schema

### 2.1 Canonical Project Schema (`src/types/project.ts`)

Every portfolio project conforms to the strict `Project` interface:

```typescript
export interface Project {
  id: string;                    // Canonical identifier (immutable URL slug)
  title: string;                 // Display title
  subtitle: string;              // High-level role & context
  category: 'Valuation & Finance' | 'Analytics & BI' | 'Machine Learning' | 'Business Strategy';
  duration: string;              // Academic or professional timeframe
  role: string;                  // Specific ownership role
  status: 'AUDITED' | 'PRODUCTION' | 'ACADEMIC' | 'PROTOTYPE';
  evidenceClassification: 'Governed Analysis' | 'Academic Dissertation' | 'Operational SLA' | 'Prototype Demo';
  headlineMetric: {
    value: string;               // Headline figure (e.g. "₹41,631 Cr")
    label: string;               // Metric description (e.g. "Implied Equity Value")
    qualification: string;       // Qualification badge (e.g. "MODEL ESTIMATE")
  };
  executiveSummary: string;      // 30-second recruiter brief
  businessProblem: string;       // The operational or financial challenge
  governedSolution: string;      // Analytical methodology
  keyFindings: string[];         // Bulleted quantifiable findings
  methodologySteps: {
    step: string;
    details: string;
  }[];
  dataQualityChecks?: {          // Used by STRATOS and PhonePe
    code: string;                // e.g. "DQ-10"
    name: string;
    status: 'PASS' | 'REVIEW' | 'FLAG';
    reconciliationNotes: string;
  }[];
  techStack: string[];
  artifacts: {
    label: string;
    type: 'pdf' | 'excel' | 'github' | 'live';
    url: string;
  }[];
}
```

---

## 3. The 6 Canonical Data Records (`src/data/projects.ts`)

| Canonical ID | Project Title | Evidence Type | Primary Governed Metrics |
| :--- | :--- | :--- | :--- |
| `phonepe-valuation` | PhonePe Pre-IPO Equity Research & DCF Valuation | Governed Analysis | Enterprise Value: ₹33,431.99 Cr; Equity Value: ₹41,631.22 Cr; WACC: 14.92%; Implied Share Price: ₹821.78. |
| `stratos-governance` | STRATOS Retail Decision Intelligence & KPI Governance | Governed Analysis | 50,000 orders; 30 controlled KPIs; 10 validation checks; 15,630 exceptions across 14,156 orders; DQ-10: REVIEW. |
| `spiideo-sports-analytics` | Sports Match Event Tracking & Video Analytics (SPIIDEO) | Operational SLA | 99.4% tagging precision; sub-15 min turnaround; 1,200+ match sequences. |
| `it-support-analytics` | IT Support Service Intelligence & Resolution Prediction | Academic Dissertation | 10,000+ support tickets; Star schema (MySQL); $R^2 = 0.81$ duration model. |
| `smartbank-360` | SmartBank 360 – FinTech Feasibility & Unit Economics | Business Case | CAC ₹450; 14-month payback; 16.2% Tier-1 capital adequacy. |
| `equitrack-analytics-os` | EquiTrack Analytics OS (Prototype) | Prototype Demo | Interactive portfolio governance interface prototype. |

---

## 4. Upstream Source of Truth Models

While the portfolio runs as a client-side bundle, its data models reflect external governed projects:

### 4.1 STRATOS Google Sheets + Apps Script Model
- **Entities:** `Orders`, `LineItems`, `Returns`, `Attribution`, `KPI_Definitions`.
- **Primary Keys:** `Order_ID`, `SKU`.
- **Known Data Anomaly (DQ-10):** `Net Revenue > Gross Revenue` in controlled totals. Preserved in `src/data/projects.ts` and `src/data/telemetryMetrics.ts` as `REVIEW`. Never imputed.

### 4.2 IT Support Star Schema (MySQL)
- **Fact Table:** `Fact_TicketResolution` (TicketID, CustomerID, AgentID, PriorityID, CategoryID, ResolutionDurationHours, SLA_Breached_Flag).
- **Dimensions:** `Dim_Customer`, `Dim_Agent`, `Dim_Priority`, `Dim_Category`, `Dim_Date`.

---

## 5. Client-Side Persistence Schema

The client browser persists specific non-sensitive state keys in `localStorage` and `sessionStorage`:

| Storage Engine | Key | Allowed Values | Purpose |
| :--- | :--- | :--- | :--- |
| `localStorage` | `portfolio-theme` | `'light' \| 'dark' \| 'system'` | User-selected color theme preference. |
| `sessionStorage` | `portfolio-persona` | `'recruiter' \| 'founder' \| 'enterprise'` | (Planned Portfolio OS) Active stakeholder view mode. |

---

## 6. Cross References
- System Architecture: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)
- Product Requirements: [`PRD.md`](file:///PRD.md)
- Data Governance: [`PROJECT_CONTEXT.md`](file:///PROJECT_CONTEXT.md)

