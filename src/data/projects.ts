export interface MetricItem {
  label: string;
  value: string;
  subtext?: string;
}

export interface CaseStudySection {
  title: string;
  subtitle?: string;
  content: string[];
  metrics?: MetricItem[];
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
  callout?: {
    type: "note" | "warning" | "insight";
    text: string;
  };
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "Equity Research" | "Financial Analytics" | "Business Analytics" | "Data Governance" | "FinTech Strategy" | "Sports Analytics";
  featured: boolean;
  status: "Completed Independent Research" | "Production Architecture" | "Academic Dissertation" | "Professional Internship";
  date: string;
  summary: string;
  problemStatement: string;
  approach: string;
  keyFinding: string;
  businessImplication: string;
  tools: string[];
  keyMetrics: MetricItem[];
  methodsAndAssumptions?: string[];
  limitations?: string[];
  caseStudy: {
    researchQuestion: string;
    executiveSummary: string;
    sections: CaseStudySection[];
    disclaimer?: string;
  };
}

export const projects: Project[] = [
  {
    id: "phonepe-valuation",
    title: "PhonePe Pre-IPO Equity Research & Valuation",
    tagline: "Evaluating enterprise scale, monetization transition, and intrinsic DCF equity value.",
    category: "Equity Research",
    featured: true,
    status: "Completed Independent Research",
    date: "Q3 2026",
    summary: "Pre-IPO equity valuation model with explicit 5-year forecasts (FY26E–FY30E), blended terminal valuation, balance-sheet liquidity bridge, and workbook formula audit.",
    problemStatement: "Consumer UPI operates under a mandated 0% Merchant Discount Rate (zero MDR), making transaction volume alone structurally unmonetized. Can PhonePe transition from ~48.5% volume dominance to sustainable cash generation at an implied pre-IPO valuation of ₹41,631 Cr?",
    approach: "Built an explicit 5-year financial forecast model (FY26E–FY30E) across four revenue segments (Merchant Soundbox subscriptions, lending/insurance distribution, consumer recharges, and new platforms). Discounted unlevered free cash flows using CAPM WACC (14.92%) and blended terminal value (7.0% perpetuity growth and 13.15x exit EBITDA multiple).",
    keyFinding: "Sum of explicit cash flows (PV ₹13,878.15 Cr) and blended terminal value (PV ₹19,553.83 Cr) reconciles to Core Enterprise Value of ₹33,431.99 Cr. Adding cash (₹1,127.58 Cr) and marketable investments (₹7,787.65 Cr) and deducting long-term debt (₹716.00 Cr) establishes Implied Equity Value of ₹41,631.22 Cr.",
    businessImplication: "Device-based merchant subscriptions (SmartSpeakers) and high-margin credit distribution drive over 70% of incremental EBITDA; regulatory risk from the proposed NPCI 30% volume cap represents the primary ceiling on consumer acquisition.",
    tools: ["Financial Modeling (Excel)", "DCF / CAPM WACC (14.92%)", "EV/EBITDA Multiple (13.15x)", "EV-to-Equity Bridge", "Workbook Model Audit"],
    keyMetrics: [
      { label: "Implied Enterprise Value", value: "₹33,432 Cr", subtext: "PV FCF ₹13,878 Cr + PV TV ₹19,554 Cr" },
      { label: "Implied Equity Value", value: "₹41,631 Cr", subtext: "+₹8,915 Cr net liquidity, -₹716 Cr debt" },
      { label: "WACC Benchmark", value: "14.92%", subtext: "Beta: 1.35 | Rf: 3.0% | Rm: 11.82%" },
      { label: "Terminal Methodology", value: "Blended TV", subtext: "7% Perpetuity Growth + 13.15x EBITDA" }
    ],
    methodsAndAssumptions: [
      "Explicit 5-year forecast period (FY26E–FY30E) using 30% effective tax rate and historical working capital schedules.",
      "Terminal value blended equally between Perpetuity Growth (g = 7.00%) and Exit Multiple (EV/EBITDA = 13.15x).",
      "Cost of equity derived from CAPM: Risk-Free Rate Rf = 3.00%, Equity Beta = 1.35, Market Return Rm = 11.82%, yielding WACC = 14.92%.",
      "Shares outstanding: 50.66 Cr shares yielding implied share price of ₹821.78 per share."
    ],
    limitations: [
      "Valuation depends heavily on NBFC partner lending underwriting and default performance.",
      "NPCI implementation of a 30% volume market cap could force artificial throttling of user onboarding.",
      "Independent academic study based on public filings, not an official equity underwriting prospectus."
    ],
    caseStudy: {
      researchQuestion: "Can PhonePe convert its ecosystem scale into sustainable monetization, profitability, and cash generation at a reasonable valuation ahead of its proposed IPO?",
      executiveSummary: "This independent pre-IPO valuation analyzes PhonePe's transition from payments infrastructure to high-margin financial distribution. Built upon explicit segment forecasts (FY26E–FY30E) and a Discounted Cash Flow workbook, the analysis yields an Enterprise Value of ₹33,431.99 Cr and an Equity Value of ₹41,631.22 Cr after adjusting for ₹8,915.23 Cr in cash and marketable investments and ₹716.00 Cr in debt obligations.",
      sections: [
        {
          title: "1. Business Architecture & Monetization Engine",
          content: [
            "PhonePe processes approximately 48.5% of total UPI monthly volumes in India. However, consumer UPI operates under a zero Merchant Discount Rate (zero MDR) mandate.",
            "To generate recurring cash flows, PhonePe monetizes across four segments: Consumer Payments (retention anchor, recharge convenience fees), Merchant Payments (SmartSpeaker audio soundbox subscriptions and POS QR processing), Financial Services Distribution (lending distribution commissions and insurance brokerage), and New Platforms (Pincode e-commerce and Share.Market wealth tech)."
          ]
        },
        {
          title: "2. Historical Performance & Forecasted Cash Flows (FY26E - FY30E)",
          content: [
            "The model forecasts operating profit (EBIT) expanding from ₹2,884.32 Cr in Year 0 (FY26E) to ₹3,924.09 Cr in Year 4 (FY30E) as fixed technology infrastructure overhead stabilizes.",
            "Free Cash Flow to Firm (FCFF) expands from ₹3,538.70 Cr in Year 0 to ₹4,638.52 Cr in Year 4 at 7.0% annual compounding."
          ],
          table: {
            headers: ["Financial Metric (₹ Cr)", "FY26E (Year 0)", "FY27E (Year 1)", "FY28E (Year 2)", "FY29E (Year 3)", "FY30E (Year 4)"],
            rows: [
              ["Operating Profit (EBIT)", "₹2,884.32", "₹3,115.07", "₹3,364.27", "₹3,633.41", "₹3,924.09"],
              ["Adjusted Taxes (30%)", "-₹865.30", "-₹934.52", "-₹1,009.28", "-₹1,090.02", "-₹1,177.23"],
              ["(+) Depreciation & Amortization", "+₹567.74", "+₹607.48", "+₹650.01", "+₹695.51", "+₹744.19"],
              ["(-) Capital Expenditures (CapEx)", "-₹305.00", "-₹326.35", "-₹349.19", "-₹373.64", "-₹399.79"],
              ["(+) Non-Cash Working Capital Adj.", "+₹5,883.52", "+₹6,295.37", "+₹6,736.04", "+₹7,207.56", "+₹7,712.09"],
              ["Unlevered Free Cash Flow (FCF)", "₹3,538.70", "₹3,786.41", "₹4,051.46", "₹4,335.06", "₹4,638.52"],
              ["Discount Factor (WACC = 14.92%)", "0.8805", "0.7753", "0.6827", "0.6011", "0.5293"],
              ["Present Value of FCF (PV)", "₹3,115.88", "₹2,935.62", "₹2,765.80", "₹2,605.80", "₹2,455.05"]
            ]
          }
        },
        {
          title: "3. Terminal Value & Discounting Synthesis",
          content: [
            "The model blends two distinct terminal value methodologies: Perpetuity Growth Method (g = 7.00%) yielding ₹54,463.99 Cr, and Exit Multiple Method (EV/EBITDA = 13.15x on Year 5 EBITDA ₹1,477.19 Cr) yielding ₹19,425.05 Cr.",
            "The average blended terminal value is ₹36,944.52 Cr. Discounting this terminal value at Year 5 discount factor 0.52928 yields a PV of Terminal Value of ₹19,553.83 Cr.",
            "Summing the PV of explicit 5-year cash flows (₹13,878.15 Cr) and PV of Terminal Value (₹19,553.83 Cr) arrives at Core Enterprise Value of ₹33,431.99 Cr."
          ]
        },
        {
          title: "4. EV-to-Equity Value Bridge",
          content: [
            "To bridge Enterprise Value to Equity Value, liquid non-operating assets were added and debt liabilities deducted:",
            "Core Enterprise Value: ₹33,431.99 Cr",
            "(+) Cash & Bank Balances: ₹1,127.58 Cr",
            "(+) Marketable Securities & Investments: ₹7,787.65 Cr",
            "(-) Long-Term Debt Obligations: ₹716.00 Cr",
            "(=) Implied Equity Value: ₹41,631.22 Cr."
          ]
        },
        {
          title: "5. Transparent Model Audit & Documented Discrepancies",
          content: [
            "In strict adherence to governance standards, a complete audit of the underlying workbook (DCF of phonepe.xlsx) revealed the following specific findings:",
            "1. Share Price Formula Inconsistency: On the 'EV to Equity Value' sheet, cell C13 divided Equity Value (₹41,631 Cr) by cell C9 (Debt, ₹716 Cr) rather than cell C12 (Shares Outstanding, 50.66 Cr). When divided by 50.66 Cr shares, the implied share price evaluates to ₹821.78 per share.",
            "2. Stale Row Artifacts in 'DCF Full': Row 36 displays negative PV numbers from an earlier draft using negative EBITDA, whereas the live 'Discounting' sheet correctly evaluates positive FCFs matching the Enterprise Value of ₹33,431.99 Cr.",
            "3. Cost of Debt #DIV/0!: On the 'Assumptions' sheet, total debt was entered as 0, creating a division-by-zero error, while the 'EV to Equity Value' sheet enters debt as ₹716 Cr."
          ],
          callout: {
            type: "warning",
            text: "Model Governance Note: The valuation outputs displayed represent the actual calculated results of the governed Excel model. These discrepancies have been preserved and flagged transparently rather than silently altered."
          }
        }
      ],
      disclaimer: "Independent academic portfolio research project prepared for educational demonstration. This analysis does not constitute investment advice, equity research recommendations, or a solicitation to buy or sell securities."
    }
  },
  {
    id: "stratos-governance",
    title: "STRATOS AI | Controlled Business Analytics & KPI Governance",
    tagline: "Architecting governed analytical pipelines with zero silent imputation and forensic data quality auditing.",
    category: "Data Governance",
    featured: true,
    status: "Production Architecture",
    date: "Q4 2025",
    summary: "Controlled analytical system built upon a 50,000-order retail dataset, implementing 11 validation controls, forensic reconciliation of 14,465 financial exception occurrences, and 30/30 KPI traceability.",
    problemStatement: "Enterprise analytics pipelines routinely corrupt analytical truth by silently dropping or imputing missing transaction data, obscuring underlying balance-sheet and revenue irregularities from executive oversight.",
    approach: "Built a governed business analytics engine on a 50,000-order retail dataset, implementing 11 automated validation controls and enforcing the protocol PRESERVE → DOCUMENT → FLAG → GOVERN.",
    keyFinding: "Reconciled 14,465 financial exception occurrences across 12,787 affected orders. Flagged control DQ-10 where Net Revenue exceeded Gross Revenue due to untracked promotional clawbacks, preserving it transparently as REVIEW rather than silently forcing reconciliation.",
    businessImplication: "Establishing immutable audit ledgers ensures 100% KPI traceability (30/30 KPIs) and eliminates the risk of executive decision-making based on artificially sanitized source numbers.",
    tools: ["Data Quality (DQ-10 Governance)", "Attribution Auditing", "Forensic Data Reconciliation", "React + TypeScript + Vite", "Control Ledger Systems"],
    keyMetrics: [
      { label: "Orders Analyzed", value: "50,000", subtext: "Controlled transactional dataset" },
      { label: "Validation Controls", value: "11 Controls", subtext: "Automated QA & reconciliation" },
      { label: "Exceptions Reconciled", value: "14,465", subtext: "Across 12,787 affected orders" },
      { label: "KPI Traceability", value: "30 / 30", subtext: "100% governed audit coverage" }
    ],
    methodsAndAssumptions: [
      "Strict data immutability: source data rows are never mutated or dropped during ETL ingestion.",
      "Unspecified attribution taxonomy: unmapped channels explicitly retain 'Unspecified' designation.",
      "Controlled total reconciliation across all 30 KPIs comparing raw versus analytical layers."
    ],
    limitations: [
      "DQ-10 status remains REVIEW until upstream ERP ledger exports provide itemized promotional voucher logs.",
      "Transactional dataset captures retail order flow; returns settled outside the 30-day window require supplementary batch audits."
    ],
    caseStudy: {
      researchQuestion: "How can enterprise analytics maintain reliable managerial decision intelligence when dirty source transactions contain ledger imbalances?",
      executiveSummary: "STRATOS enforces a strict data governance doctrine: PRESERVE → DOCUMENT → FLAG → GOVERN. The platform audits 50,000 retail orders across 30 defined KPIs, detecting and transparently surfacing financial exception DQ-10 (where Net Revenue exceeds Gross Revenue in controlled totals) as REVIEW without silent imputation.",
      sections: [
        {
          title: "1. The Four-Stage Governance Protocol",
          content: [
            "Data pipelines follow PRESERVE → DOCUMENT → FLAG → GOVERN. Corrupted records are never dropped silently.",
            "Missing attribution is categorized as 'Unspecified' rather than converted to zero. Unspecified does NOT mean none; it signals that source logging was omitted."
          ]
        },
        {
          title: "2. Forensic Financial Reconciliation",
          content: [
            "Reconciled 14,465 exception occurrences across 12,787 unique orders.",
            "Monitored DQ-10 financial control anomaly where Net Revenue exceeded Gross Revenue due to untracked promotional credit clawbacks. In accordance with governance rules, this status remains REVIEW until the source ledger is rectified."
          ]
        }
      ]
    }
  },
  {
    id: "spiideo-sports-analytics",
    title: "Sports Match Event Tracking & Video Analytics",
    tagline: "Converting high-speed soccer and field hockey video footage into structured event datasets.",
    category: "Sports Analytics",
    featured: true,
    status: "Professional Internship",
    date: "June 2026 – Present",
    summary: "Sports data analyst internship at SPIIDEO tagging, verifying, and validating match events across soccer and field hockey footage to produce reliable downstream performance datasets.",
    problemStatement: "Automated multi-camera match recordings generate uncalibrated video feeds subject to annotator drift, missed tactical sequences, and spatial event discrepancies.",
    approach: "Tagged, verified, and structured match events (passes, set pieces, turnovers, fouls, shots) across soccer and field hockey footage using the Spiideo video tracking platform with standardized event taxonomies and multi-tier QA.",
    keyFinding: "Standardized multi-tier verification protocols eliminated timestamp desynchronization and ensured reliable player-attribution sequences across match datasets.",
    businessImplication: "High-fidelity structured event datasets provide coaching and analytical teams with dependable data for tactical performance modeling and spatial strategy evaluation.",
    tools: ["Spiideo Camera Systems", "Video Annotation & Tagging", "Data Quality Verification", "Event Pipeline QA"],
    keyMetrics: [
      { label: "Role", value: "Data Analyst", subtext: "SPIIDEO Internship" },
      { label: "Sports Covered", value: "Soccer & Hockey", subtext: "Multi-event video annotation" },
      { label: "Quality Checks", value: "Multi-tier QA", subtext: "Standardized event taxonomy" }
    ],
    methodsAndAssumptions: [
      "Spatial coordinate calibration aligned with standardized FIFA and FIH pitch dimensions.",
      "Dual-pass verification for high-impact events (goals, penalty incidents, card infractions)."
    ],
    limitations: [
      "Occlusion caused by dense defensive clusters requires secondary high-angle camera verification.",
      "Live operational constraints require sub-2-minute post-match turnaround for key tactical metrics."
    ],
    caseStudy: {
      researchQuestion: "How can structured video annotation frameworks ensure high data fidelity for tactical performance analytics?",
      executiveSummary: "During the sports data analyst internship at SPIIDEO, match events (passes, set pieces, turnovers, fouls, goals) were tagged and validated from automated multi-angle pitch cameras into standardized tabular event datasets.",
      sections: [
        {
          title: "1. Event Tagging & Data Pipeline Workflow",
          content: [
            "Converted multi-angle camera feeds into time-stamped, player-attributed match event sequences.",
            "Enforced strict validation checks to prevent event duplication and timing desynchronization."
          ]
        }
      ]
    }
  },
  {
    id: "it-support-analytics",
    title: "IT Support Service Intelligence & Resolution Prediction",
    tagline: "Empirical analysis of 10,000+ support ticket records for SLA bottleneck detection.",
    category: "Business Analytics",
    featured: true,
    status: "Academic Dissertation",
    date: "Q2 2026",
    summary: "End-to-end analytics pipeline analyzing support ticket records in MySQL, Power BI DAX KPIs, and exploratory regression modeling in Python.",
    problemStatement: "Enterprise IT service desks struggle with SLA breaches and ticket backlogs due to unoptimized triage, lack of dimensional visibility, and shift-change communication bottlenecks.",
    approach: "Engineered an end-to-end analytics workflow: cleaned and transformed 10,000+ support ticket records in Python, designed a star-schema relational model in MySQL (Fact_Tickets, Dim_Priority, Dim_Category, Dim_Agent, Dim_Department), and built Power BI DAX dashboards with exploratory regression.",
    keyFinding: "High-priority incidents resolved in 4.2 hours average; SLA compliance achieved 92.4% (against 95% target). Ticket resolution variance was heavily concentrated around shift-change handoffs and tier-2 escalation delays.",
    businessImplication: "Staggering tier-2 agent shifts during peak ticket creation windows and automating priority classification directly addresses resolution bottlenecks to recover SLA compliance.",
    tools: ["Python (Scikit-Learn, Pandas)", "MySQL Relational Model", "Power BI & DAX Measures", "Excel Advanced Analytics"],
    keyMetrics: [
      { label: "Dataset Scale", value: "10,000+ Records", subtext: "Academic demonstration logs" },
      { label: "SLA Benchmark", value: "92.4%", subtext: "Target 95% threshold" },
      { label: "Mean Resolution", value: "4.2 hrs", subtext: "High-priority incidents" }
    ],
    methodsAndAssumptions: [
      "Star schema design linking 10,000+ Fact_Tickets rows to 4 dimension tables.",
      "DAX calculated measures for Mean Time to Acknowledge (MTTA), Mean Time to Resolve (MTTR), and SLA compliance.",
      "Exploratory Ordinary Least Squares (OLS) regression modeling in Python for ticket duration driver identification."
    ],
    limitations: [
      "Model evaluated on historical incident tickets; newly introduced software stack issues may exhibit divergent resolution distributions.",
      "Agent subjective notes and unstructured chat transcripts were not incorporated into the tabular model."
    ],
    caseStudy: {
      researchQuestion: "Can historical IT support ticket attributes identify systemic bottlenecks and estimate resolution latency in ITSM workflows?",
      executiveSummary: "An academic dissertation project establishing an end-to-end analytics pipeline: Raw Ticket Logs → Data Preparation in Python → Star-Schema MySQL Database → Power BI KPI Measurement → Resolution Prediction. Identified shift-change staffing imbalances as the primary contributor to SLA breach variance.",
      sections: [
        {
          title: "1. Data Modeling & Dimensional Architecture",
          content: [
            "Modeled ticket records into a star schema: Fact_Tickets linked to Dim_Priority, Dim_Category, Dim_Agent, and Dim_Department.",
            "Computed Mean Time to Acknowledge (MTTA), Mean Time to Resolve (MTTR), and SLA compliance rate in DAX."
          ]
        }
      ],
      disclaimer: "Academic dissertation project conducted with demonstration ticket datasets."
    }
  },
  {
    id: "smartbank-360",
    title: "SmartBank 360 – FinTech Business Model Credibility Report",
    tagline: "Evaluating commercial viability, unit economics, and Basel III regulatory risk for an AI digital bank.",
    category: "FinTech Strategy",
    featured: false,
    status: "Academic Dissertation",
    date: "Q1 2026",
    summary: "MBA strategic evaluation examining commercial feasibility, customer acquisition cost amortization (CAC:LTV), and regulatory compliance for an AI-first neobank.",
    problemStatement: "Digital neobanks encounter severe unit economic compression caused by surging customer acquisition costs (CAC), rapid account churn, and regulatory restrictions on direct balance-sheet deposit mobilization.",
    approach: "Conducted an MBA Business Model Credibility Report evaluating commercial viability, customer lifetime value payback horizons (LTV:CAC), and regulatory compliance under RBI guidelines and Basel III norms.",
    keyFinding: "Sustainable unit economics requires a minimum 3.4x LTV:CAC with an operational payback horizon within 14 months, supported by high-margin credit cross-sell and a 15% Basel III capital buffer.",
    businessImplication: "Standalone consumer payment neobanks are economically unsustainable without scheduled commercial bank co-branding or NBFC lending balance sheets.",
    tools: ["FinTech Unit Economics", "CAC:LTV Modeling", "Basel III & RBI Compliance", "Financial Viability Framework"],
    keyMetrics: [
      { label: "Target LTV:CAC", value: "3.4x", subtext: "Modeled steady-state ratio" },
      { label: "Payback Horizon", value: "14 Months", subtext: "Subscription & cross-sell model" },
      { label: "Capital Adequacy", value: "15.0%", subtext: "Basel III buffer standard" }
    ],
    methodsAndAssumptions: [
      "CAC model assumes blended organic payroll referrals (₹350) and paid digital marketing (₹1,250).",
      "LTV model based on 3-year customer horizon with 3.5% annualized churn and 18% credit cross-sell penetration.",
      "Capital adequacy calculated against standardized risk-weighted assets following RBI Master Directions."
    ],
    limitations: [
      "Credit loss provision models assume benign macroeconomic default rates (~2.5% NPA).",
      "Regulatory policy changes regarding digital lending guidelines may alter partner bank commission structures."
    ],
    caseStudy: {
      researchQuestion: "Is an AI-first digital neobanking platform commercially viable and defensible under strict regulatory frameworks?",
      executiveSummary: "An MBA-level academic Business Model Credibility Report evaluating customer acquisition unit economics, regulatory co-branding pathways, and operational viability for an AI digital banking concept.",
      sections: [
        {
          title: "1. Unit Economics & Customer Lifetime Value",
          content: [
            "Evaluated customer acquisition channels across digital performance marketing versus organic viral payroll integration.",
            "Modeled subscription fee tiers alongside transaction interchange revenue to evaluate payback horizons."
          ]
        }
      ],
      disclaimer: "MBA academic project prepared for educational purposes in the banking and digital strategy domain."
    }
  }
];
