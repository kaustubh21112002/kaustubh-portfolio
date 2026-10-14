export interface ResearchPaper {
  id: string;
  title: string;
  topic: string;
  date: string;
  abstract: string;
  methodology: string;
  principalFindings: string[];
  limitations: string[];
  documentUrl?: string;
  fileType: "ACADEMIC RESEARCH" | "FINANCIAL MODEL" | "GOVERNANCE REPORT";
  status: "Completed Portfolio Research" | "In Review / Available on Request";
}

export const researchPapers: ResearchPaper[] = [
  {
    id: "phonepe-pre-ipo-report",
    title: "PhonePe Pre-IPO Equity Valuation & Monetization Trajectory",
    topic: "Equity Valuation / FinTech Infrastructure",
    date: "September 2026",
    abstract: "An independent pre-IPO equity valuation evaluating PhonePe's transition from zero-MDR payments infrastructure to high-margin merchant and credit monetization. Combines explicit 5-year forecasts (FY26E–FY30E) with blended terminal valuation.",
    methodology: "Discounted Cash Flow (DCF) with CAPM-derived WACC (14.92%, Beta: 1.35, Rf: 3.0%), Perpetuity Growth (7.0%), Exit EBITDA Multiple (13.15x), and EV-to-Equity reconciliation.",
    principalFindings: [
      "Estimated Core Enterprise Value of ₹33,431.99 Cr and Implied Equity Value of ₹41,631.22 Cr after net liquidity additions.",
      "Hardware subscription fees (SmartSpeaker) provide recurring revenue stability against zero-MDR consumer transaction costs.",
      "Lending distribution and micro-insurance distribution account for the fastest-growing margin contribution."
    ],
    limitations: [
      "Regulatory risk regarding NPCI's 30% UPI volume cap enforcement could constrain market share expansion.",
      "Unsecured digital lending credit cycles and partner NBFC risk weight adjustments may fluctuate distribution commissions."
    ],
    fileType: "FINANCIAL MODEL",
    status: "Completed Portfolio Research"
  },
  {
    id: "stratos-governance-framework",
    title: "STRATOS: Data Governance & Reconciliation in Transactional Analytics",
    topic: "Analytics Engineering & Financial Governance",
    date: "December 2025",
    abstract: "Establishes the governance doctrine 'PRESERVE → DOCUMENT → FLAG → GOVERN' for high-stakes retail and financial decision intelligence. Demonstrates how silent data cleaning and imputed attributions degrade executive decision making.",
    methodology: "Deterministic reconciliation algorithms, controlled total verification, exception audit tables, and anomaly status management (DQ-10).",
    principalFindings: [
      "Silent imputation of missing values artificially inflates confidence scores and obscures underlying transactional pipeline errors.",
      "Treating missing attribution as 'Unspecified' rather than dropping rows preserves ledger completeness and audited controlled totals."
    ],
    limitations: [
      "Requires explicit organizational culture buy-in to accept unresolved flags rather than superficial green dashboard metrics."
    ],
    fileType: "GOVERNANCE REPORT",
    status: "Completed Portfolio Research"
  },
  {
    id: "smartbank-360-credibility",
    title: "SmartBank 360: AI Neobank Business Model Credibility Report",
    topic: "Digital Banking Strategy & Basel III Feasibility",
    date: "May 2026",
    abstract: "MBA academic evaluation of neobank commercial viability in high-compliance jurisdictions. Examines customer acquisition cost amortization, unit economics, regulatory capital requirements, and technological feasibility.",
    methodology: "Design Thinking combined with financial feasibility modeling, Basel III CAR testing, and regulatory partnership structure evaluation.",
    principalFindings: [
      "Traditional neobanks incur unsustainable CAC relative to deposit margin under zero-fee structures.",
      "A B2B payroll and corporate expense management wedge lowers customer acquisition payback from 28 months to 14 months.",
      "Co-branding partnership with scheduled commercial banks eliminates immediate need for a standalone banking license."
    ],
    limitations: [
      "High reliance on sponsor bank technology uptime and revenue sharing caps net interchange margin."
    ],
    fileType: "ACADEMIC RESEARCH",
    status: "In Review / Available on Request"
  },
  {
    id: "it-support-ticket-dissertation",
    title: "Predictive Service Intelligence: Empirical Resolution Modeling in ITSM",
    topic: "Operational Analytics & Machine Learning",
    date: "March 2026",
    abstract: "An empirical investigation into 10,000+ IT helpdesk incidents, analyzing resolution bottlenecks, staffing capacity mismatches, and regression-based ticket duration forecasting.",
    methodology: "Exploratory data analysis, MySQL relational star schema design, Scikit-Learn tree ensembles for resolution regression, and Power BI DAX dashboards.",
    principalFindings: [
      "Ticket category and department of origin correlate more strongly with resolution time variance than ticket priority alone.",
      "Staffing allocation imbalances during morning shift handovers account for 41% of all SLA breaches.",
      "Gradient Boosting model achieved R² 0.81 in predicting resolution latency at ticket ingestion."
    ],
    limitations: [
      "Observational logs reflect specific organizational workflows; generalized predictive transfer requires organization-specific calibration."
    ],
    fileType: "ACADEMIC RESEARCH",
    status: "In Review / Available on Request"
  }
];
