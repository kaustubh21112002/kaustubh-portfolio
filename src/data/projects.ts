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

export interface ResumeHighlight {
  role?: string;
  bulletPoints: string[];
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "Equity Research" | "Financial Analytics" | "Business Analytics" | "Data Governance" | "FinTech Strategy" | "Sports Analytics";
  featured: boolean;
  status: "Completed Independent Research" | "Production Architecture" | "Academic Dissertation" | "Professional Internship" | "In Progress";
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
  includeInResume?: boolean;
  resumeHighlight?: ResumeHighlight;
}

export const projects: Project[] = [
  {
    id: "phonepe-valuation",
    title: "PhonePe Pre-IPO Equity Research & Valuation",
    tagline: "Evaluating enterprise scale, zero-MDR monetization transition, and intrinsic DCF equity value.",
    category: "Equity Research",
    featured: true,
    status: "Completed Independent Research",
    date: "Q3 2026",
    includeInResume: true,
    resumeHighlight: {
      role: "Pre-IPO Equity Research & Valuation",
      order: 2,
      bulletPoints: [
        "Built an independent equity research model analyzing PhonePe's financial performance, UPI market position, business segments, regulatory risks, and profitability trajectory.",
        "Constructed 5-year explicit revenue segment forecasts (FY26E–FY30E), DCF model (WACC 14.92%, Exit Multiple 13.15x), and Bull/Base/Bear scenario analysis.",
        "Derived Core Enterprise Value ₹33,432 Cr and Implied Equity Value ₹41,631 Cr, adjusting for ₹8,915 Cr cash/investments and ₹716 Cr debt."
      ]
    },
    summary: "Pre-IPO equity valuation model with explicit 5-year forecasts (FY26E–FY30E), blended terminal valuation, balance-sheet liquidity bridge, and forensic workbook formula audit.",
    problemStatement: "Consumer UPI operates under a mandated 0% Merchant Discount Rate (zero MDR), making transaction volume alone structurally unmonetized. Can PhonePe transition from ~48.5% volume dominance to sustainable cash generation at an implied pre-IPO valuation of ₹41,631 Cr?",
    approach: "Built an explicit 5-year financial forecast model (FY26E–FY30E) across four revenue segments (Merchant Soundbox subscriptions, lending/insurance distribution, consumer recharges, and new platforms). Discounted unlevered free cash flows using CAPM WACC (14.92%) and blended terminal value (7.0% perpetuity growth and 13.15x exit EBITDA multiple).",
    keyFinding: "Sum of explicit cash flows (PV ₹13,878.15 Cr) and blended terminal value (PV ₹19,553.83 Cr) reconciles to Core Enterprise Value of ₹33,431.99 Cr. Adding cash (₹1,127.58 Cr) and marketable investments (₹7,787.65 Cr) and deducting long-term debt (₹716.00 Cr) establishes Implied Equity Value of ₹41,631.22 Cr (₹821.78 per share across 50.66 Cr shares).",
    businessImplication: "Device-based merchant subscriptions (SmartSpeakers) and high-margin credit distribution drive over 70% of incremental EBITDA; regulatory risk from the proposed NPCI 30% volume cap represents the primary ceiling on consumer acquisition.",
    tools: ["Financial Modeling (Excel)", "DCF / CAPM WACC (14.92%)", "EV/EBITDA Multiple (13.15x)", "EV-to-Equity Bridge", "Workbook Model Audit"],
    keyMetrics: [
      { label: "Implied Enterprise Value", value: "₹33,432 Cr", subtext: "PV FCF ₹13,878 Cr + PV TV ₹19,554 Cr" },
      { label: "Implied Equity Value", value: "₹41,631 Cr", subtext: "+₹8,915 Cr net liquidity, -₹716 Cr debt" },
      { label: "Implied Share Price", value: "₹821.78", subtext: "50.66 Cr common shares outstanding" },
      { label: "WACC Benchmark", value: "14.92%", subtext: "Beta: 1.35 | Rf: 3.0% | Rm: 11.82%" }
    ],
    methodsAndAssumptions: [
      "Explicit 5-year forecast period (FY26E–FY30E) using 30% effective corporate tax rate and historical working capital schedules.",
      "Terminal value blended equally between Perpetuity Growth Method (g = 7.00%) and Exit Multiple Method (EV/EBITDA = 13.15x).",
      "Cost of equity derived from CAPM: Risk-Free Rate Rf = 3.00%, Equity Beta = 1.35, Market Return Rm = 11.82%, yielding Cost of Equity = 14.92% (Debt weight 0% in WACC).",
      "Common shares outstanding: 50.66 Cr shares yielding implied intrinsic share price of ₹821.78 per share."
    ],
    limitations: [
      "Credit distribution fee realization depends heavily on partner NBFC underwriting appetite and non-performing asset (NPA) cycles.",
      "Proposed NPCI 30% volume market cap implementation could mandate artificial throttling of consumer onboarding.",
      "Independent academic valuation prepared using public financial disclosures and industry benchmarks; not an underwriting prospectus or price guarantee."
    ],
    caseStudy: {
      researchQuestion: "Can PhonePe convert its ecosystem scale into sustainable monetization, operating profitability, and free cash flow generation ahead of its proposed IPO?",
      executiveSummary: "This independent pre-IPO valuation analyzes PhonePe’s transition from zero-MDR payments infrastructure to high-margin merchant and financial distribution. Built upon explicit 5-year segment forecasts (FY26E–FY30E) and a Discounted Cash Flow workbook, the analysis yields an Enterprise Value of ₹33,431.99 Cr and an Equity Value of ₹41,631.22 Cr after adjusting for ₹8,915.23 Cr in cash and marketable investments and ₹716.00 Cr in debt obligations.",
      sections: [
        {
          title: "1. Project Objective & Strategic Pre-IPO Context",
          content: [
            "PhonePe commands ~48.5% volume dominance across India’s Unified Payments Interface (UPI), processing tens of billions of annualized payment transactions.",
            "However, because consumer UPI operates under a mandated zero Merchant Discount Rate (zero MDR), payments processing alone generates negative-to-neutral unit contribution margins.",
            "The objective of this research model is to evaluate whether PhonePe’s monetization engines—merchant hardware subscriptions, loan origination, insurance distribution, and wealth tech—can generate sufficient free cash flow to justify a pre-IPO Enterprise Value of ₹33,431.99 Cr and an Implied Equity Value of ₹41,631.22 Cr."
          ]
        },
        {
          title: "2. Core Valuation Question & The Zero-MDR Dilemma",
          content: [
            "How does a payments utility processing trillions of rupees in transaction value create enterprise value when the core transaction cannot be taxed?",
            "PhonePe addresses this structural constraint through four distinct monetization engines:",
            "• Merchant Payments (42% of revenue): High-margin recurring audio hardware subscriptions (SmartSpeaker / Soundbox) and point-of-sale QR processing services.",
            "• Financial Services Distribution (28% of revenue): Zero-balance-sheet distribution commissions from partner NBFCs and banks for personal loans, merchant credit, and insurance policies.",
            "• Consumer Payments & Utilities (20% of revenue): Convenience fees on mobile recharges, bill payments, and credit card processing.",
            "• New Digital Platforms (10% of revenue): Pincode (hyperlocal ONDC e-commerce) and Share.Market (discount stockbroking and wealth management)."
          ]
        },
        {
          title: "3. Source Data, Public Filings & WACC Architecture",
          content: [
            "Financial inputs were synthesized from PhonePe’s public MCA annual reports, NPCI monthly operational statistics, and comparable listed FinTech benchmarks (One97 Communications / Paytm).",
            "To maintain analytical credibility, model inputs strictly distinguish between verified market facts and parameterized valuation estimates:"
          ],
          table: {
            headers: ["Parameter / Benchmark", "Verified Value", "Classification", "Analytical Role"],
            rows: [
              ["Consumer UPI Volume Share", "~48.5%", "Verified Market Fact", "NPCI Monthly Operational Reports"],
              ["Common Shares Outstanding", "50.66 Cr Shares", "Verified Market Fact", "MCA Regulatory Capital Filings (Cell C12)"],
              ["Cash & Bank Balances", "₹1,127.58 Cr", "Verified Balance Sheet", "Audited Standalone Balance Sheet"],
              ["Marketable Investments", "₹7,787.65 Cr", "Verified Balance Sheet", "Liquid Mutual Funds & Current Investments"],
              ["Total Long-Term Debt", "₹716.00 Cr", "Verified Balance Sheet", "Long-Term Borrowings & Lease Obligations"],
              ["Net Non-Operating Liquidity", "+₹8,199.23 Cr", "Reconciled Fact", "Cash + Investments less Debt Obligations"],
              ["Risk-Free Rate (Rf)", "3.00%", "Model Estimate", "Baseline sovereign risk-free proxy benchmark"],
              ["Equity Beta (β)", "1.35", "Model Estimate", "Peer FinTech sensitivity reflecting operating leverage"],
              ["Market Return (Rm)", "11.82%", "Model Estimate", "Long-term Indian equity index benchmark return"],
              ["Cost of Equity (Ke) / WACC", "14.92%", "Model Estimate", "CAPM discount rate applied across explicit 5-year FCFs"]
            ]
          }
        },
        {
          title: "4. Explicit 5-Year DCF Forecast & Free Cash Flow Mechanics (FY26E–FY30E)",
          content: [
            "Operating profit (EBIT) is projected to expand from ₹2,884.32 Cr in Year 0 (FY26E) to ₹3,924.09 Cr in Year 4 (FY30E) as fixed software infrastructure costs decouple from recurring device subscription revenue.",
            "Free Cash Flow to Firm (FCFF) expands from ₹3,538.70 Cr in Year 0 to ₹4,638.52 Cr in Year 4. The present value of the 5-year explicit cash flow stream discounted at WACC 14.92% totals ₹13,878.15 Cr."
          ],
          table: {
            headers: ["Financial Line Item (₹ Cr)", "FY26E (Yr 0)", "FY27E (Yr 1)", "FY28E (Yr 2)", "FY29E (Yr 3)", "FY30E (Yr 4)"],
            rows: [
              ["Operating Profit (EBIT)", "₹2,884.32", "₹3,115.07", "₹3,364.27", "₹3,633.41", "₹3,924.09"],
              ["(-) Adjusted Taxes (30%)", "-₹865.30", "-₹934.52", "-₹1,009.28", "-₹1,090.02", "-₹1,177.23"],
              ["(+) Depreciation & Amortization", "+₹567.74", "+₹607.48", "+₹650.01", "+₹695.51", "+₹744.19"],
              ["(-) Capital Expenditures (CapEx)", "-₹305.00", "-₹326.35", "-₹349.19", "-₹373.64", "-₹399.79"],
              ["(+) Non-Cash Working Capital Adj.", "+₹5,883.52", "+₹6,295.37", "+₹6,736.04", "+₹7,207.56", "+₹7,712.09"],
              ["Unlevered Free Cash Flow (FCF)", "₹3,538.70", "₹3,786.41", "₹4,051.46", "₹4,335.06", "₹4,638.52"],
              ["Discount Factor (WACC = 14.92%)", "0.8805", "0.7753", "0.6827", "0.6011", "0.5293"],
              ["Present Value of FCF (PV)", "₹3,115.88", "₹2,935.62", "₹2,765.80", "₹2,605.80", "₹2,455.05"]
            ]
          },
          callout: {
            type: "note",
            text: "Source Workbook Formula Lineage: In the author's Excel model ('DCF Full'), Row 20 (Unlevered Free Cash Flow) does not compute from the draft line items in Rows 15–19. Instead, Cell C20 links directly to '=FCF!C18' (evaluating base-year FCF of ₹3,538.70 Cr based on historical EBIT of ₹909.26 Cr, 30% tax, D&A ₹567.74 Cr, CapEx ₹305.00 Cr, and working capital adjustments) and projects subsequent cash flows using a constant 7.00% annual compounding factor ('=C20*(1+0.07)')."
          }
        },
        {
          title: "5. Terminal Value Synthesis: Perpetuity Growth vs. Exit Multiple",
          content: [
            "To mitigate terminal estimation bias, the workbook synthesizes two independent terminal valuation methodologies:",
            "1. Perpetuity Growth Method (g = 7.00%): Capitalizing Year 5 FCF at (WACC - g) yields ₹54,463.99 Cr.",
            "2. Exit Multiple Method (13.15x FY30E EBITDA): Applying 13.15x to Year 5 EBITDA (₹1,477.19 Cr) yields ₹19,425.05 Cr.",
            "The equal-weighted blended terminal value is ₹36,944.52 Cr. Discounting this sum to present value via Year 5 discount factor (0.52928) yields PV of Terminal Value of ₹19,553.83 Cr.",
            "Reconciliation: PV of 5-year explicit FCFs (₹13,878.15 Cr) + PV of Terminal Value (₹19,553.83 Cr) = Core Operating Enterprise Value of ₹33,431.99 Cr."
          ]
        },
        {
          title: "6. Enterprise-Value-to-Equity-Value Bridge & Per-Share Implication",
          content: [
            "Corporate finance dictates that operating Enterprise Value belongs to all capital providers. To establish common equity value, non-operating liquid balance-sheet assets are added and financial liabilities are deducted:",
            "• Core Operating Enterprise Value (EV): ₹33,431.99 Cr",
            "• (+) Cash & Bank Balances: +₹1,127.58 Cr",
            "• (+) Marketable Securities & Liquid Investments: +₹7,787.65 Cr",
            "• (-) Total Long-Term Debt Obligations: -₹716.00 Cr",
            "• (=) Implied Pre-IPO Common Equity Value: ₹41,631.22 Cr",
            "Dividing the implied equity value of ₹41,631.22 Cr across 50.66 Cr common shares outstanding establishes an intrinsic share price of ₹821.78 per share."
          ]
        },
        {
          title: "7. Scenario Analysis & Macro Sensitivity Evaluation",
          content: [
            "To account for regulatory and execution variability, the model evaluates three discrete scenarios alongside macroeconomic WACC shifts:",
            "• Bear Case (18% CAGR, EV ₹24,500 Cr, Equity Value ₹32,699 Cr, ₹645.46/share): NPCI strictly enforces 30% volume market cap; lending conversion drops below 1.5%; merchant soundbox churn increases in Tier 2/3 markets.",
            "• Base Case (27% CAGR, EV ₹33,432 Cr, Equity Value ₹41,631 Cr, ₹821.78/share): Workbook baseline; volume cap deadline extended; SmartSpeaker active base expands to 7.5M units; loan distribution maintains 3.5% conversion.",
            "• Bull Case (38% CAGR, EV ₹45,800 Cr, Equity Value ₹53,999 Cr, ₹1,065.91/share): Regulatory authorization for merchant MDR cost-sharing; accelerated cross-selling across Pincode and Share.Market; credit distribution achieves 60%+ contribution margin."
          ],
          table: {
            headers: ["Scenario Metric", "Bear Case (Throttling)", "Base Case (Workbook)", "Bull Case (Expansion)"],
            rows: [
              ["Revenue 5-Yr CAGR", "18.0%", "27.0%", "38.0%"],
              ["Terminal Multiple (EV/EBITDA)", "10.00x", "13.15x", "16.00x"],
              ["Implied Enterprise Value", "₹24,500 Cr", "₹33,432 Cr", "₹45,800 Cr"],
              ["(+) Net Liquidity Bridge", "+₹8,199 Cr", "+₹8,199 Cr", "+₹8,199 Cr"],
              ["Implied Common Equity Value", "₹32,699 Cr", "₹41,631 Cr", "₹53,999 Cr"],
              ["Implied Price Per Share", "₹645.46", "₹821.78", "₹1,065.91"]
            ]
          },
          callout: {
            type: "note",
            text: "Model Scenario Estimates: Scenario outputs represent exploratory DCF parameter variations for academic research and sensitivity evaluation, not guaranteed price targets, trading recommendations, or secondary market quotes."
          }
        },
        {
          title: "8. Comparative FinTech Benchmarking: PhonePe vs. Paytm",
          content: [
            "Contrasting PhonePe’s pre-IPO profile against listed peer One97 Communications (Paytm) illuminates fundamental differences in regulatory risk and monetization strategy:"
          ],
          table: {
            headers: ["Operating Dimension", "PhonePe (Model Estimates)", "Paytm / One97 (Verified Filings)", "Strategic Analytical Interpretation"],
            rows: [
              ["Consumer UPI Volume Share", "~48.5%", "~8.5%", "PhonePe maintains a 5.7x volume advantage in consumer payments"],
              ["Merchant Soundbox Fleet", "4.5M+ active devices", "10M+ deployed devices", "Paytm holds first-mover hardware scale; PhonePe expanding rapidly"],
              ["Regulatory Architecture", "Third-Party App (TPAP)", "Payments Bank (PPBL)", "PhonePe avoided bank licensing overhead and direct regulatory embargoes"],
              ["Implied / Trading Valuation", "13.15x FY30E EBITDA", "~3.5x EV/Sales (Volatile)", "PhonePe commands premium due to market share and Walmart parentage"]
            ]
          }
        },
        {
          title: "9. Forensic Model Audit Findings & Governance Integrity",
          content: [
            "In accordance with STRATOS governance principles (PRESERVE → DOCUMENT → FLAG → GOVERN), a forensic cell-by-cell audit of DCF of phonepe.xlsx identified technical model discrepancies. Rather than silently altering the file, each discrepancy was preserved and documented:",
            "1. Share Price Cell Inconsistency: On sheet 'EV to Equity Value', cell C13 contained the formula =C10/C9, dividing Equity Value (₹41,631.22 Cr) by Long Term Debt (C9 = 716 Cr) yielding 58.14. Dividing by Shares Outstanding (C12 = 50.66 Cr shares) correctly establishes the model-implied share price of ₹821.78 per share.",
            "2. Stale Row 36 Formula Artifacts in 'DCF Full': Row 36 retained negative present value numbers (-₹515 Cr, -₹116 Cr) from an earlier draft with negative historical EBIT. However, cell C38 pulls from =Discounting!C15, which correctly evaluates the positive explicit FCF present values (₹13,878.15 Cr) and Terminal Value PV (₹19,553.83 Cr), reconciling to the model-implied Enterprise Value of ₹33,431.99 Cr.",
            "3. Cost of Debt #DIV/0! on 'Assumptions': Cell B20 entered total debt as 0, creating a #DIV/0! error in the debt weight calculation. Consequently, the model applied 100% equity weighting, equating WACC to the Cost of Equity (14.92%).",
            "4. Terminal Value Blending Verified: Confirmed equal 50/50 weighting of Perpetuity Growth (₹54,463.99 Cr) and Exit Multiple (₹19,425.05 Cr) yielding blended terminal value of ₹36,944.52 Cr (PV ₹19,553.83 Cr).",
            "5. Balance Sheet Liquidity Bridge Arithmetic Confirmed: Core EV (₹33,431.99 Cr) + Cash (₹1,127.58 Cr) + Investments (₹7,787.65 Cr) - Debt (₹716.00 Cr) = Implied Equity Value (₹41,631.22 Cr).",
            "6. Free Cash Flow Linkage in 'DCF Full': Confirmed that Row 20 (Unlevered FCF) links directly to '=FCF!C18' (base FCF ₹3,538.70 Cr) and compounds at 7.00% annually, rather than computing from Rows 15–19 (which were draft working schedules)."
          ],
          callout: {
            type: "warning",
            text: "Model Governance Note: These findings document technical model construction defects and calculation mechanics within the workbook. They are transparently preserved and flagged rather than silently altered, and do not imply that the model is fully validated or suitable for actual investment decisions."
          }
        },
        {
          title: "10. Strategic Implications for Pre-IPO Investors",
          content: [
            "1. Monetization Quality: Over 70% of incremental operating profit expansion is driven by recurring merchant device subscriptions and zero-balance-sheet credit distribution, proving that PhonePe is no longer merely a zero-MDR utility.",
            "2. Regulatory Ceiling: The proposed NPCI 30% volume market cap represents the single largest external liability; pre-IPO valuation sustainability relies on extending deadline moratoriums while scaling monetization on existing users.",
            "3. Capital Structure Strength: Net cash liquidity of +₹8,199.23 Cr insulates the business from near-term capital expenditure shocks as it builds out server infrastructure."
          ]
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
    includeInResume: true,
    resumeHighlight: {
      role: "Controlled Business Analytics & KPI Governance",
      order: 1,
      bulletPoints: [
        "Built a controlled analytical dataset of 50,000 orders and designed a 30-KPI framework spanning financial, customer, promotion, campaign, sales, and delivery analytics.",
        "Implemented 11 validation controls and a DQ governance framework, including forensic reconciliation of 14,465 financial exception occurrences across 12,787 unique affected orders.",
        "Developed executive KPI reporting, dashboard insights, and management recommendations with 30/30 KPI traceability and QA coverage."
      ]
    },
    summary: "Controlled analytical system built upon a 50,000-order retail dataset, implementing 10 automated validation controls (DQ-01 to DQ-10), forensic reconciliation of 15,630 exception occurrences across 14,156 unique affected orders, and 30/30 KPI lineage traceability.",
    problemStatement: "Enterprise business intelligence pipelines routinely corrupt analytical truth by silently dropping non-conforming rows or imputing missing attributes, obscuring underlying balance-sheet and revenue irregularities from executive oversight.",
    approach: "Built a governed business analytics engine on a 50,000-order retail transactional dataset, implementing 10 automated validation controls (DQ-01 through DQ-10) and enforcing the operational protocol PRESERVE → DOCUMENT → FLAG → GOVERN.",
    keyFinding: "Forensically distinguished 15,630 algorithmically detected DQ-10 exception occurrences (8,073 revenue + 7,557 profit) from 14,156 unique affected orders (accounting for 1,474 compound multi-factor overlaps across 35,844 orders free of financial balancing discrepancies). Flagged control DQ-10 where Net Revenue exceeded Gross Revenue in controlled totals due to untracked promotional clawbacks, preserving it strictly as REVIEW rather than silently forcing mathematical reconciliation.",
    businessImplication: "Establishing immutable audit ledgers ensures 100% KPI traceability (30/30 KPIs) and eliminates executive decision-making based on artificially sanitized source numbers.",
    tools: ["Data Quality (DQ-10 Governance)", "Attribution Auditing", "Forensic Data Reconciliation", "React + TypeScript + Vite", "Control Ledger Systems"],
    keyMetrics: [
      { label: "Orders Analyzed", value: "50,000", subtext: "Controlled transactional dataset" },
      { label: "Validation Controls", value: "10 Rules", subtext: "Governed QA: DQ-01 to DQ-10 (9 Validated, 1 Review)" },
      { label: "DQ-10 Occurrences", value: "15,630", subtext: "8,073 Revenue + 7,557 Profit" },
      { label: "Unique Affected Orders", value: "14,156", subtext: "1,474 Overlap | 35,844 Clean of DQ-10" }
    ],
    methodsAndAssumptions: [
      "Strict data immutability: source transaction rows are never mutated, imputed, or dropped during ETL ingestion.",
      "Unspecified attribution taxonomy: unmapped channels explicitly retain 'Unspecified' designation ('Unspecified' does NOT mean 'none').",
      "Controlled total reconciliation across all 30 KPIs comparing raw source ledger versus analytical store.",
      "Financial governance rule: Control DQ-10 remains in REVIEW status until upstream source ledgers provide itemized promotional offsets."
    ],
    limitations: [
      "Control DQ-10 status remains REVIEW until upstream ERP ledger exports provide itemized promotional voucher logs.",
      "Transactional dataset captures 50,000 retail order flows; returns settled outside the 30-day reporting window require supplementary batch reconciliation.",
      "Observational data reflects recorded transactional anomalies; causality is not inferred without controlled A/B ledger logging."
    ],
    caseStudy: {
      researchQuestion: "How can enterprise analytics maintain reliable managerial decision intelligence when dirty source transactions contain ledger imbalances?",
      executiveSummary: "STRATOS enforces a strict data governance doctrine: PRESERVE → DOCUMENT → FLAG → GOVERN. The platform audits 50,000 retail orders across 30 defined KPIs, detecting and transparently surfacing financial exception DQ-10 (where Net Revenue exceeds Gross Revenue in controlled totals) as REVIEW without silent imputation.",
      sections: [
        {
          title: "1. Project Objective & Strategic Governance Context",
          content: [
            "In modern corporate analytics, data engineering pipelines frequently apply automated 'cleaning' scripts that silently coerce NULL values to defaults, discard non-conforming transaction records, or force financial figures into balance.",
            "This silent imputation creates a dangerous illusion of data hygiene while obscuring genuine ledger anomalies, unlinked discounts, and revenue leakage from executive leadership.",
            "STRATOS was engineered to pioneer an immutable, governed analytical architecture where raw transaction truth is preserved end-to-end, exceptions are forensically ledgered, and data quality controls surface anomalies directly to management."
          ]
        },
        {
          title: "2. Business Problem & Core Governance Question: The Silent Imputation Hazard",
          content: [
            "How can business intelligence systems deliver dependable managerial decision intelligence without altering or sanitizing imperfect source transactional data?",
            "STRATOS answers this by replacing heuristic 'cleaning' with a 4-stage operational governance protocol: PRESERVE → DOCUMENT → FLAG → GOVERN.",
            "• PRESERVE: Raw transaction rows are never dropped, filtered, or overwritten during ingestion.",
            "• DOCUMENT: Every transformation, schema mapping, and ledger calculation is recorded in an immutable audit ledger.",
            "• FLAG: Every data quality violation is isolated with an explicit control code and status.",
            "• GOVERN: Management makes decisions based on audited operational realities rather than sanitized mathematical fictions."
          ]
        },
        {
          title: "3. Transaction Dataset Scope & Attribution Taxonomies",
          content: [
            "The governed dataset encompasses exactly 50,000 granular retail order transactions spanning omni-channel sales, item-level promotional discounts, customer acquisition channels, and logistics fulfillment timestamps.",
            "Attribution Policy: Missing marketing attribution or unmapped customer acquisition channels are strictly categorized as 'Unspecified'. In accordance with governance principles, 'Unspecified' does NOT mean 'none'—it explicitly signals that source telemetry was omitted or unlinked at the time of transaction capture."
          ]
        },
        {
          title: "4. Governance Approach & 10 Governed Validation Controls (DQ-01 to DQ-10)",
          content: [
            "The platform executes 10 governed validation controls (DQ-01 through DQ-10) directly mapped to the governed data quality register (02_DQ_Register). In accordance with Phase 10 QA, 9 controls are Validated and 1 control (DQ-10) remains in REVIEW:"
          ],
          table: {
            headers: ["Control ID", "Target Table & Field", "Observed Finding / Exception Count", "Governance Classification & Status"],
            rows: [
              ["DQ-01", "customers.email", "613 missing values (8.17%)", "Investigate • Validated (Preserve missing values)"],
              ["DQ-02", "customers.phone", "442 missing values (5.89%)", "Investigate • Validated (Preserve missing values)"],
              ["DQ-03", "customers.loyalty_tier", "2,748 missing tier values (36.64%)", "Structural Nulls • Validated (Member: 4,752 / Non-Member: 2,748)"],
              ["DQ-04", "customer_rep_bridge.relationship_end_date", "2,810 missing end dates (74.95%)", "Contextual • Validated (Open relationships retain no end date)"],
              ["DQ-05", "orders.sales_rep_id", "39,785 missing rep assignments (79.57%)", "NA-Digital • Validated (Digital: 33,232, Recorded: 10,215, Missing-Physical: 6,553)"],
              ["DQ-06", "orders.promo_code", "38,879 unprompted orders (77.76%)", "Contextual • Validated (Preserve promo_code; create promo_classification)"],
              ["DQ-07", "orders.campaign_id", "20,044 unmapped campaign IDs (40.09%)", "Unspecified • Validated (Recorded: 29,956 / Unspecified: 20,044; 'Unspecified ≠ none')"],
              ["DQ-08", "orders.delivery_days", "6,603 unavailable delivery logs (13.21%)", "Contextual • Validated (Recorded: 26,629, In-Store Zero-Day: 16,768, Unavailable: 6,603)"],
              ["DQ-09", "orders.customer_id", "1,524 orphan customer references (3.05%)", "Referential Integrity • Validated (Preserve transaction, flag linkage unresolved)"],
              ["DQ-10", "orders.financial_measures", "15,630 occurrences across 14,156 orders", "Financial Consistency • STRICTLY REVIEW (Net Revenue > Gross Revenue)"]
            ]
          }
        },
        {
          title: "5. Key Empirical Findings: Exception Occurrences vs. Unique Affected Orders",
          content: [
            "A critical analytical distinction in data governance is separating rule occurrence volume (how many times rules fired) from affected transaction entities (how many unique customer orders were impacted).",
            "In STRATOS, this distinction was reconciled across governed artifacts:",
            "• Scope & Timing Basis: Source A ('27_Dashboard_Data', controlled by '25_Apps_Script_Control_Log' on 9/1/2026) evaluated the full 50,000-order population with programmatic overlap logic. Source B ('02_DQ_Register') reported a historical narrative investigative sum (7,560 + 6,905 = 14,465) without overlap deduplication.",
            "• Overlap Logic: Orders failing both Revenue and Profit rules (1,474 orders) are deducted from total occurrences to establish unique affected orders: 8,073 + 7,557 - 1,474 = 14,156 orders."
          ],
          table: {
            headers: ["Audit Measure / Dimension", "Source A: 27_Dashboard_Data", "Source B: 02_DQ_Register", "Arithmetic Reconciliation & Meaning"],
            rows: [
              ["Total Controlled Orders", "50,000 Orders", "50,000 Orders", "Complete controlled order population baseline"],
              ["Revenue Rule Exceptions", "8,073 Occurrences", "7,560 Exceptions", "Net Revenue > Gross Revenue calculation checks"],
              ["Profit Rule Exceptions", "7,557 Occurrences", "6,905 Exceptions", "Net Profit > Net Revenue calculation checks"],
              ["Total Exception Occurrences", "15,630 Occurrences", "14,465 Exceptions", "Sum of revenue and profit rule exception firings"],
              ["Compound Overlap Orders", "1,474 Orders", "Not Specified", "Orders where BOTH revenue & profit checks failed"],
              ["Unique Affected Orders", "14,156 Orders", "14,465 (Narrative)", "8,073 + 7,557 - 1,474 = 14,156 unique orders"],
              ["DQ-10 Clean Orders", "35,844 Orders", "Not Specified", "50,000 - 14,156 = 35,844 orders free of DQ-10 balancing errors"]
            ]
          },
          callout: {
            type: "insight",
            text: "Scope & Governance Clarification: The 35,844 clean orders metric strictly reflects orders free of DQ-10 financial calculation discrepancies (revenue and profit balancing rules). It does not imply that these orders are free from other field-level missingness (such as DQ-05 digital sales rep exclusions or DQ-07 unmapped campaign IDs), which are governed under separate contextual validation rules."
          }
        },
        {
          title: "6. Forensic Financial Reconciliation: Control DQ-10 Under REVIEW",
          content: [
            "Forensic Deep Dive on Control DQ-10:",
            "• In controlled totals, Net Revenue was recorded at an inverted value exceeding Gross Revenue.",
            "• Root Cause Analysis: Post-settlement promotional voucher clawbacks and manual credit memos were ingested into the net settlement ledger without corresponding gross transaction offset line items.",
            "• Governance Enforcement: In conventional BI, an ETL script might silently set Net Revenue equal to Gross Revenue to 'fix the dashboard'. Under STRATOS, this status remains strictly in REVIEW. It is never represented as resolved until the upstream source ledger exports itemized promotional adjustments."
          ],
          callout: {
            type: "warning",
            text: "Financial Governance Doctrine: Control DQ-10 remains in REVIEW status. Net Revenue > Gross Revenue is an active source anomaly. Never represent this issue as resolved or force artificial reconciliation."
          }
        },
        {
          title: "7. Controlled Deliverables & Decision Intelligence Platform",
          content: [
            "The project delivered an operational decision intelligence architecture built in React, TypeScript, and Vite:",
            "• Executive Metric Ledger: 30/30 KPIs reconciled with 100% audit coverage comparing raw transaction totals to analytical store figures.",
            "• Automated Exception Triage Console: Real-time filtering across all 10 governed DQ controls with itemized order-level diagnostic drill-downs.",
            "• Dimensional Governance Service: Decoupled service layer preventing ad-hoc UI mutations and enforcing governed terminology across components."
          ]
        },
        {
          title: "8. Methodological Limitations & Follow-Up Actions",
          content: [
            "1. ERP Ledger Dependency: Final resolution of DQ-10 requires upstream itemized credit adjustment feeds from enterprise billing systems that are currently batched weekly.",
            "2. Return Horizons: Transactions with returns initiated beyond the 30-day reporting window require asynchronous batch reconciliations rather than immediate stream processing.",
            "3. Observational Rigor: Analytical insights describe observed correlations in transaction logs; causal attributions are never claimed without controlled A/B ledger logging."
          ]
        },
        {
          title: "9. Strategic Implications for Executive Decision-Making",
          content: [
            "By establishing immutable audit ledgers and refusing silent imputation, STRATOS protects executive leadership from three critical corporate failure modes:",
            "1. Misallocated Capital: Eliminates marketing budget deployment toward channels falsely credited by silent default imputation.",
            "2. Revenue Restatements: Protects corporate earnings reports from unrecorded promotional clawbacks by transparently ledgering DQ-10.",
            "3. Audit Defensibility: Provides internal and external auditors with 100% verifiable lineage from raw transactional source files to final executive dashboard KPIs."
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
    summary: "Sports data analyst internship at SPIIDEO tagging, verifying, and validating match events across soccer and field hockey footage to produce reliable downstream tactical performance datasets.",
    problemStatement: "Automated multi-camera match recordings generate uncalibrated video feeds subject to annotator drift, missed tactical sequences, and spatial event discrepancies.",
    approach: "Tagged, verified, and structured match events (passes, set pieces, turnovers, fouls, shots) across soccer and field hockey footage using the Spiideo video tracking platform with standardized event taxonomies and multi-tier QA.",
    keyFinding: "Standardized multi-tier verification protocols eliminated timestamp desynchronization and ensured reliable player-attribution sequences across match datasets.",
    businessImplication: "High-fidelity structured event datasets provide coaching and analytical teams with dependable data for tactical performance modeling and spatial strategy evaluation.",
    tools: ["Spiideo Camera Systems", "Video Annotation & Tagging", "Data Quality Verification", "Event Pipeline QA"],
    keyMetrics: [
      { label: "Role", value: "Data Analyst", subtext: "SPIIDEO Internship" },
      { label: "Sports Covered", value: "Soccer & Hockey", subtext: "Multi-event video annotation" },
      { label: "Verification Protocol", value: "Dual-Pass QA", subtext: "Standardized event taxonomy" },
      { label: "Turnaround Target", value: "<2 Minutes", subtext: "Post-match tactical delivery" }
    ],
    methodsAndAssumptions: [
      "Spatial coordinate calibration aligned with standardized FIFA (105m x 68m) and FIH (91.4m x 55m) pitch dimensions.",
      "Dual-pass verification for high-impact events (goals, penalty incidents, disciplinary card infractions).",
      "Synchronized multi-camera perspective switching to resolve spatial ambiguities during crowded set pieces."
    ],
    limitations: [
      "Visual occlusion caused by dense defensive clusters in goal-mouth scrambles requires secondary high-angle camera verification.",
      "Live operational turnaround constraints require balancing sub-2-minute delivery against exhaustive manual cross-checks."
    ],
    caseStudy: {
      researchQuestion: "How can structured video annotation frameworks ensure high data fidelity for tactical performance analytics?",
      executiveSummary: "During the sports data analyst internship at SPIIDEO, match events (passes, set pieces, turnovers, fouls, goals) were tagged and validated from automated multi-angle pitch cameras into standardized tabular event datasets.",
      sections: [
        {
          title: "1. Project Objective & Tactical Video Context",
          content: [
            "Modern sports coaching staffs rely heavily on event-level tracking data to evaluate tactical execution, spatial pressing structures, and player work rates.",
            "The objective of the Sports Data Analyst role at SPIIDEO is to convert high-resolution multi-camera match recordings into verified, timestamped event datasets across soccer and field hockey fixtures."
          ]
        },
        {
          title: "2. Core Operational & Annotation Question",
          content: [
            "How can video annotation protocols eliminate human subjective drift and maintain sub-second timestamp synchronization across high-velocity match events?",
            "With events occurring simultaneously across 22 players on soccer pitches and high-frequency stick work in field hockey, unstructured video tagging yields duplicate events, missed ball touches, and spatial coordinate distortion."
          ]
        },
        {
          title: "3. Video Ingestion & Spiideo Platform Architecture",
          content: [
            "Raw match video is ingested through automated, high-resolution Spiideo panoramic camera systems mounted along pitch perimeters.",
            "The platform stitches wide-angle optical feeds into an interactive tactical canvas, allowing analysts to zoom, rotate perspective, and track individual player movements without optical distortion."
          ]
        },
        {
          title: "4. Multi-Tier Event Tagging & Verification Methodology",
          content: [
            "Every match sequence follows a rigorous multi-tier event tagging protocol:",
            "• Primary Event Pass: Real-time logging of primary ball possessions, directional passes, shots on goal, fouls, and set-piece triggers.",
            "• Spatial Coordinate Calibration: Mapping event coordinates against normalized pitch grid overlays aligned with FIFA and FIH standards.",
            "• Secondary Verification Pass: Dedicated review of critical tactical moments (goals, penalty circle infractions, counter-pressing transitions) to eliminate annotator bias."
          ]
        },
        {
          title: "5. Key Operational Findings & Annotation Fidelity",
          content: [
            "Implementing standardized event taxonomies and dual-pass validation eliminated timestamp desynchronization across multi-angle recordings.",
            "Achieved 100% event attribution completeness across critical set pieces, ensuring downstream analysts received reliable player-attributed event streams."
          ]
        },
        {
          title: "6. Analytical Deliverables & Tactical Coaching Assets",
          content: [
            "• Standardized Tabular Event Datasets: CSV and database exports containing timestamp, event type, x/y pitch coordinates, player ID, and outcome.",
            "• Tactical Video Clip Playlists: Indexed visual catalogs linked to specific tactical phases for rapid coaching staff review.",
            "• Set-Piece Breakdown Sheets: Detailed spatial logs summarizing penalty corner execution and defensive zonal alignment."
          ]
        },
        {
          title: "7. Operational Limitations & Visual Occlusion",
          content: [
            "• Goal-Mouth Scramble Occlusion: In dense defensive clusters, physical player overlap can temporarily obscure ball contact points, requiring secondary high-angle confirmation.",
            "• Turnaround Time Pressures: Live post-match delivery deadlines (<2 minutes) require strict prioritization of primary scoring events over secondary possession chains."
          ]
        },
        {
          title: "8. Tactical Implications for Coaching Decisions",
          content: [
            "Verified event datasets empower coaching staffs to make objective tactical adjustments based on measurable spatial patterns rather than subjective recollection.",
            "Helps clubs quantify pressing efficiency, transition turnaround latency, and player fatigue curves across competitive fixtures."
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
      { label: "SLA Benchmark", value: "92.4%", subtext: "Target 95.0% threshold" },
      { label: "Mean Resolution", value: "4.2 hrs", subtext: "High-priority incidents" },
      { label: "Escalation Delay", value: "+3.1 hrs", subtext: "Shift-change handoff latency" }
    ],
    methodsAndAssumptions: [
      "Star schema relational architecture linking 10,000+ Fact_Tickets rows to 4 dimension tables (Priority, Category, Agent, Department).",
      "DAX calculated measures for Mean Time to Acknowledge (MTTA), Mean Time to Resolve (MTTR), and SLA compliance percentage.",
      "Exploratory Ordinary Least Squares (OLS) regression modeling in Python evaluating ticket duration drivers."
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
          title: "1. Project Objective & ITSM Service Context",
          content: [
            "Enterprise IT Service Management (ITSM) operations face increasing complexity across cloud infrastructure, application access, and hardware provisioning.",
            "The objective of this research project was to construct an end-to-end analytics pipeline analyzing historical incident logs to uncover root causes of service-level agreement (SLA) breaches and model ticket resolution duration."
          ]
        },
        {
          title: "2. Core Analytical & SLA Bottleneck Question",
          content: [
            "What factors drive SLA breaches across multi-tiered enterprise IT support environments, and how accurately can resolution latency be modeled from initial ticket attributes?",
            "Organizations frequently assume agent individual productivity is the primary determinant of resolution speed; this research empirically tests whether structural triage and schedule handoffs drive variance."
          ]
        },
        {
          title: "3. Dataset Scope & MySQL Star Schema",
          content: [
            "The underlying dataset encompasses 10,000+ support ticket records modeled into a normalized star-schema database in MySQL:",
            "• Fact_Tickets: Granular transaction table storing ticket IDs, open/close timestamps, satisfaction scores, and resolution duration.",
            "• Dim_Priority: SLA threshold rules (Critical: 2h, High: 6h, Medium: 24h, Low: 48h).",
            "• Dim_Category: ITIL incident categories (Hardware, Software, Access, Network).",
            "• Dim_Agent: Support tier, shift assignment, and department link.",
            "• Dim_Department: Corporate business units originating support requests."
          ]
        },
        {
          title: "4. Metric Engineering & Statistical Methodology",
          content: [
            "Implemented calculated measures in Power BI DAX for core ITIL performance indicators:",
            "• Mean Time to Acknowledge (MTTA) = AVERAGE(Fact_Tickets[AcknowledgeTimestamp] - Fact_Tickets[CreatedTimestamp])",
            "• Mean Time to Resolve (MTTR) = AVERAGE(Fact_Tickets[ResolvedTimestamp] - Fact_Tickets[CreatedTimestamp])",
            "• SLA Compliance Rate = DIVIDE(COUNTROWS(FILTER(Fact_Tickets, Fact_Tickets[MTTR] <= Related_SLA[Target])), COUNTROWS(Fact_Tickets))",
            "Exploratory OLS regression in Python tested relationships between ticket priority, category complexity, creation hour, and resolution latency."
          ]
        },
        {
          title: "5. Key Verified Findings & Incident Resolution Table",
          content: [
            "Empirical analysis revealed an overall SLA compliance rate of 92.4% against a corporate target of 95.0%.",
            "Critical Insight: Resolution duration variance was not driven by technical category complexity, but by handoff latency during shift-change windows (07:00–09:00 and 15:00–17:00), which added an average of +3.1 hours to unresolved tickets."
          ],
          table: {
            headers: ["Priority Level", "Target SLA Threshold", "Actual Mean Resolution", "SLA Compliance Rate"],
            rows: [
              ["Critical (P1)", "2.0 Hours", "1.8 Hours", "96.2%"],
              ["High (P2)", "6.0 Hours", "4.2 Hours", "94.1%"],
              ["Medium (P3)", "24.0 Hours", "21.6 Hours", "91.8%"],
              ["Low (P4)", "48.0 Hours", "41.5 Hours", "89.5%"],
              ["Portfolio Average", "Blended 20.0h", "17.3 Hours", "92.4% (Target: 95.0%)"]
            ]
          }
        },
        {
          title: "6. Analytical Deliverables & Decision Tools",
          content: [
            "• Interactive Power BI Executive Dashboard: Dynamic filtering across departments, agent tiers, and incident categories with automated breach alerts.",
            "• MySQL Analytical Star-Schema: Production-ready DDL script with indexed surrogate keys for high-performance reporting.",
            "• Python Predictive Notebooks: Cleaned data transformation pipelines and regression models evaluating ticket backlog accumulation."
          ]
        },
        {
          title: "7. Methodological Limitations",
          content: [
            "• Unstructured Chat Exclusion: The structured tabular dataset did not incorporate free-text communication logs between agents and users, which may contain contextual delay explanations.",
            "• External Vendor Dependencies: Third-party SaaS outage incidents were recorded under generic Network categories without external API status verification."
          ]
        },
        {
          title: "8. Operational Implications for IT Leadership",
          content: [
            "1. Shift Schedule Rebalancing: Staggering Tier-2 agent shifts to overlap during peak ticket transition hours (07:00–09:00 and 15:00–17:00) eliminates the +3.1-hour handoff bottleneck.",
            "2. Automated Priority Classification: Rule-based routing of incoming tickets directly to specialized teams bypasses the 45-minute manual triage queue, recovering overall SLA compliance to the 95.0% target."
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
      { label: "Capital Adequacy", value: "15.0%", subtext: "Basel III buffer standard" },
      { label: "Blended CAC", value: "₹650", subtext: "Organic payroll + digital acquisition" }
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
          title: "1. Project Objective & Strategic FinTech Context",
          content: [
            "Over the past decade, standalone digital neobanks captured millions of app downloads but struggled to achieve operational profitability.",
            "This MBA Credibility Report evaluates whether an AI-first neobanking model can establish sustainable unit economics and defensible operating margins within India's regulated banking ecosystem."
          ]
        },
        {
          title: "2. Core Strategic Viability Question",
          content: [
            "Can a digital-only neobanking concept survive the economic scissors of rising digital acquisition costs and zero-interchange payment processing without an independent banking license?",
            "Under Reserve Bank of India (RBI) regulations, non-bank FinTechs cannot accept deposits directly onto their balance sheets, forcing reliance on licensed commercial bank co-branding agreements."
          ]
        },
        {
          title: "3. Financial Datasets, Regulatory Frameworks & Modeling Tools",
          content: [
            "The model synthesized unit economics benchmarks from Indian and global FinTech operators (Revolut, Monzo, Jupiter, Fi), regulatory guidelines from RBI Master Directions on Digital Lending, and Basel III capital adequacy accords."
          ]
        },
        {
          title: "4. Cohort Unit Economics & LTV:CAC Payback Methodology",
          content: [
            "Customer Lifetime Value (LTV) and Acquisition Cost (CAC) were modeled across 36-month customer cohort horizons:",
            "• Blended Customer Acquisition Cost (CAC): Weighted at ₹650 (60% organic corporate payroll integrations at ₹350, 40% performance digital marketing at ₹1,250).",
            "• Revenue Streams: Subscription fee tiers (Smart VIP), transaction interchange sharing, and unsecured personal loan distribution commissions (2.25% fee on disbursed volume).",
            "• Payback Horizon: Calculated as the point in time where cumulative net contribution margins offset initial blended CAC."
          ]
        },
        {
          title: "5. Key Financial Findings & Viability Thresholds",
          content: [
            "The research established that standalone consumer payment neobanks generate an unviable LTV:CAC of only 1.2x with an infinite payback horizon due to zero MDR constraints.",
            "In contrast, integrating high-margin lending distribution and corporate payroll accounts achieves a viable 3.4x LTV:CAC with a 14-month payback horizon and a robust 15.0% capital adequacy buffer."
          ],
          table: {
            headers: ["Operating Model", "Blended CAC", "3-Year Modeled LTV", "LTV:CAC Ratio", "Payback Horizon", "Commercial Viability"],
            rows: [
              ["Standalone Payments", "₹1,100", "₹1,320", "1.2x", "Unviable (>36 mo)", "High Burn / Failure"],
              ["Co-Branded Neo-Accounts", "₹650", "₹2,210", "3.4x", "14 Months", "Sustainable Break-Even"],
              ["Full-Stack NBFC Model", "₹1,450", "₹5,800", "4.0x", "18 Months", "Capital-Intensive"]
            ]
          }
        },
        {
          title: "6. Strategic Deliverables & Executive Report",
          content: [
            "• MBA Business Model Credibility Report: 25-page comprehensive strategic evaluation document.",
            "• Unit Economics Financial Model: Interactive Excel workbook with dynamic cohort churn, CAC sensitivity, and interchange fee toggles.",
            "• Regulatory Risk Compliance Matrix: Auditing requirements across RBI KYC directives, data localization, and partner bank escrow accounts."
          ]
        },
        {
          title: "7. Regulatory Policy & Credit Risk Limitations",
          content: [
            "• Regulatory Counterparty Dependency: Reliance on partner scheduled commercial banks exposes the neobank to sudden co-branding policy shifts or regulatory embargoes.",
            "• Credit Default Provisioning: The model assumes benign retail default rates (~2.5% NPA); sudden macroeconomic contraction would severely compress partner bank lending appetite."
          ]
        },
        {
          title: "8. Strategic Implications for Digital Banking Ventures",
          content: [
            "Digital banking ventures cannot succeed as generic consumer payment interfaces.",
            "Long-term commercial survival requires anchoring acquisition around sticky B2B enterprise payroll relationships and monetizing through high-margin credit cross-sell under rigorous risk governance."
          ]
        }
      ],
      disclaimer: "MBA academic project prepared for educational purposes in the banking and digital strategy domain."
    }
  }
];
