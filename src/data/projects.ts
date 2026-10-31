export interface MetricItem {
  label: string;
  value: string;
  subtext?: string;
  classification?: "DEMONSTRATED" | "MODEL ESTIMATE" | "PROTOTYPE DEMO" | "STUDY ESTIMATE" | "OPERATIONAL SLA" | "BENCHMARK PARAMETER";
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

export interface DatasetScope {
  scale: string;
  structure: string;
  qualityNote: string;
}

export interface VerifiedLink {
  label: string;
  url: string;
  isInternal?: boolean;
  type?: 'evidence' | 'repository' | 'internal' | 'document';
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
  personalContribution?: string;
  cardBrief?: {
    objective: string;
    methods: string;
    keyDeliverable: string;
  };
  tools: string[];
  keyMetrics: MetricItem[];
  methodsAndAssumptions?: string[];
  limitations?: string[];
  datasetScope?: DatasetScope;
  verifiedLinks?: VerifiedLink[];
  evidenceUrl?: string;
  evidenceLabel?: string;
  caseStudy: {
    researchQuestion: string;
    executiveSummary: string;
    sections: CaseStudySection[];
    disclaimer?: string;
  };
  includeInResume?: boolean;
  resumeHighlight?: ResumeHighlight;
}

/**
 * Helper to validate external evidence URLs.
 * Rejects empty strings, internal hashes (#), or malformed protocols.
 */
export function isValidEvidenceUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.startsWith('#')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns the primary verified evidence link for a project if one is available.
 * Returns null if no valid external evidence link has been supplied.
 */
export function getProjectEvidenceLink(project: Project): VerifiedLink | null {
  if (isValidEvidenceUrl(project.evidenceUrl)) {
    return {
      label: project.evidenceLabel || "View Project Evidence",
      url: project.evidenceUrl!.trim(),
      isInternal: false,
      type: "evidence"
    };
  }

  if (project.verifiedLinks && project.verifiedLinks.length > 0) {
    const explicit = project.verifiedLinks.find(
      (l) => !l.isInternal && isValidEvidenceUrl(l.url) && (
        l.type === 'evidence' ||
        l.label.toLowerCase().includes('evidence') ||
        l.url.includes('docs.google.com/spreadsheets') ||
        l.url.includes('sheets.google.com')
      )
    );
    if (explicit) return explicit;
  }

  return null;
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
    datasetScope: {
      scale: "5-Year Historical Financials (FY20–FY24) + Explicit 5-Yr Forecast (FY26E–FY30E)",
      structure: "Multi-tab DCF Workbook, 4 Segment Revenue Schedules, CAPM WACC, EV-to-Equity Bridge",
      qualityNote: "Forensically audited cell-by-cell; documented 6 workbook calculation and formula findings"
    },
    evidenceUrl: "https://docs.google.com/spreadsheets/d/1cMNSnvCHVaetYt_8RJKIlBYUGRiMwRTQ81unk3-e9X4/edit?usp=sharing",
    evidenceLabel: "View DCF Valuation Workbook",
    verifiedLinks: [
      { label: "Interactive DCF Valuation (Section 02)", url: "#flagship", isInternal: true },
      { label: "Paytm Peer Benchmarking", url: "#flagship", isInternal: true }
    ],
    problemStatement: "Consumer UPI operates under a mandated 0% Merchant Discount Rate (zero MDR), making transaction volume alone structurally unmonetized. Can PhonePe transition from ~48.5% volume dominance to sustainable cash generation at an implied pre-IPO valuation of ₹41,631 Cr?",
    approach: "Built an explicit 5-year financial forecast model (FY26E–FY30E) across four revenue segments (Merchant Soundbox subscriptions, lending/insurance distribution, consumer recharges, and new platforms). Discounted unlevered free cash flows using CAPM WACC (14.92%) and blended terminal value (7.0% perpetuity growth and 13.15x exit EBITDA multiple).",
    keyFinding: "Sum of explicit cash flows (PV ₹13,878.15 Cr) and blended terminal value (PV ₹19,553.83 Cr) reconciles to Core Enterprise Value of ₹33,431.99 Cr. Adding cash (₹1,127.58 Cr) and marketable investments (₹7,787.65 Cr) and deducting long-term debt (₹716.00 Cr) establishes Implied Equity Value of ₹41,631.22 Cr (₹821.78 per share across 50.66 Cr shares).",
    businessImplication: "Device-based merchant subscriptions (SmartSpeakers) and high-margin credit distribution drive over 70% of incremental EBITDA; regulatory risk from the proposed NPCI 30% volume cap represents the primary ceiling on consumer acquisition.",
    personalContribution: "Built independent 5-year explicit revenue segment forecast schedules, established CAPM Cost of Equity / WACC parameters, structured the blended terminal valuation synthesis, and performed forensic cell-by-cell audit documenting 6 model discrepancies.",
    cardBrief: {
      objective: "Evaluate whether PhonePe's zero-MDR consumer payments scale converts into sustainable FCF at an implied pre-IPO equity value of ₹41,631 Cr.",
      methods: "5-year segment forecast (FY26E–FY30E) • DCF with 14.92% WACC • Blended terminal value (7.0% g + 13.15x multiple) • EV-to-equity bridge",
      keyDeliverable: "8-tab interactive valuation dashboard with Base/Bear/Bull scenario model, sensitivity matrix, and audited Excel workbook."
    },
    tools: ["Financial Modeling (Excel)", "DCF / CAPM WACC (14.92%)", "EV/EBITDA Multiple (13.15x)", "EV-to-Equity Bridge", "Workbook Model Audit"],
    keyMetrics: [
      { label: "Implied Enterprise Value", value: "₹33,432 Cr", subtext: "PV FCF ₹13,878 Cr + PV TV ₹19,554 Cr", classification: "MODEL ESTIMATE" },
      { label: "Implied Equity Value", value: "₹41,631 Cr", subtext: "+₹8,915 Cr cash/investments, -₹716 Cr debt (+₹8,199 Cr net)", classification: "MODEL ESTIMATE" },
      { label: "Implied Share Price", value: "₹821.78", subtext: "50.66 Cr common shares outstanding", classification: "MODEL ESTIMATE" },
      { label: "WACC Benchmark", value: "14.92%", subtext: "Beta: 1.35 | Rf: 3.0% | Rm: 11.82%", classification: "BENCHMARK PARAMETER" }
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
        "Implemented 10 validation controls (DQ-01 to DQ-10) and a DQ governance framework, reconciling 15,630 rule occurrences across 14,156 unique affected orders with immutable audit logs.",
        "Developed executive KPI reporting, dashboard insights, and management recommendations with 30/30 KPI traceability and QA coverage."
      ]
    },
    summary: "Controlled analytical system built upon a 50,000-order retail dataset, implementing 10 automated validation controls (DQ-01 to DQ-10), forensic reconciliation of 15,630 exception occurrences across 14,156 unique affected orders, and 30/30 KPI lineage traceability.",
    datasetScope: {
      scale: "50,000 Granular Retail Transaction Orders",
      structure: "Relational Star Schema (Orders, Customers, Sales Reps, Campaigns, Deliveries)",
      qualityNote: "10 Automated DQ Validation Rules; Control DQ-10 strictly preserved in REVIEW without silent imputation"
    },
    evidenceUrl: "https://docs.google.com/spreadsheets/d/1wwDMvKUXHAWiXvJNiPEmZjkjCtF0X8KzhLyuncwwq-w/edit?usp=sharing",
    evidenceLabel: "View Transaction Audit & Data Quality Workbook",
    verifiedLinks: [
      { label: "Governed GitHub Repository", url: "https://github.com/kaustubh21112002/kaustubh-portfolio", isInternal: false },
      { label: "Live Governed Decision Intelligence", url: "#projects", isInternal: true }
    ],
    problemStatement: "Enterprise business intelligence pipelines routinely corrupt analytical truth by silently dropping non-conforming rows or imputing missing attributes, obscuring underlying balance-sheet and revenue irregularities from executive oversight.",
    approach: "Built a governed business analytics engine on a 50,000-order retail transactional dataset, implementing 10 automated validation controls (DQ-01 through DQ-10) and enforcing the operational protocol PRESERVE → DOCUMENT → FLAG → GOVERN.",
    keyFinding: "Forensically distinguished 15,630 algorithmically detected DQ-10 exception occurrences (8,073 revenue + 7,557 profit) from 14,156 unique affected orders (accounting for 1,474 compound multi-factor overlaps across 35,844 orders free of financial balancing discrepancies). Flagged control DQ-10 where Net Revenue exceeded Gross Revenue in controlled totals due to untracked promotional clawbacks, preserving it strictly as REVIEW rather than silently forcing mathematical reconciliation.",
    businessImplication: "Establishing immutable audit ledgers ensures 100% KPI traceability (30/30 KPIs) and eliminates executive decision-making based on artificially sanitized source numbers.",
    personalContribution: "Designed the 30-KPI dimensional framework, implemented automated verification for controls DQ-01 to DQ-10, forensically audited the 1,474 multi-rule overlap records, and enforced strict zero-imputation policy on financial measure DQ-10.",
    cardBrief: {
      objective: "Deliver trustworthy managerial intelligence across 50,000 retail transactions without masking balance-sheet or margin discrepancies through silent data imputation.",
      methods: "Relational star schema • 10 automated DQ rules • Immutable ledger audit • 30 KPI lineage tracing • PRESERVE-DOCUMENT-FLAG-GOVERN doctrine",
      keyDeliverable: "Governed decision intelligence console with verified data quality register, order exception triage, and audited KPI store."
    },
    tools: ["Data Quality (DQ-10 Governance)", "Attribution Auditing", "Forensic Data Reconciliation", "React + TypeScript + Vite", "Control Ledger Systems"],
    keyMetrics: [
      { label: "Orders Analyzed", value: "50,000", subtext: "Controlled transactional dataset", classification: "DEMONSTRATED" },
      { label: "Validation Controls", value: "10 Rules", subtext: "Governed QA: DQ-01 to DQ-10 (9 Validated, 1 Review)", classification: "DEMONSTRATED" },
      { label: "DQ-10 Occurrences", value: "15,630", subtext: "8,073 Revenue + 7,557 Profit", classification: "DEMONSTRATED" },
      { label: "Unique Affected Orders", value: "14,156", subtext: "1,474 Overlap | 35,844 Clean of DQ-10", classification: "DEMONSTRATED" }
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
            "• Scope & Timing Basis: Source A ('27_Dashboard_Data', controlled by '25_Apps_Script_Control_Log' on 9/1/2026) evaluated the full 50,000-order population with programmatic multi-rule overlap logic, identifying 15,630 occurrences (8,073 revenue + 7,557 profit) across 14,156 unique orders. Source B ('02_DQ_Register') recorded an initial narrative investigative audit (7,560 + 6,905 = 14,465 occurrences across an early preliminary sample of 12,787 orders) prior to automated overlap deduplication.",
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
              ["Unique Affected Orders", "14,156 Orders", "12,787 (Preliminary Sample) / 14,465 (Narrative)", "8,073 + 7,557 - 1,474 = 14,156 unique orders"],
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
    date: "June 2026 – Oct 2026",
    summary: "Sports data analyst internship at SPIIDEO tagging, verifying, and validating match events across soccer and field hockey footage to produce reliable downstream tactical performance datasets.",
    datasetScope: {
      scale: "Multi-fixture soccer and field hockey match footage; <2 min delivery target for tactical clip exports",
      structure: "Calibrated optical x/y pitch coordinate event streams (FIFA 105x68m / FIH 91.4x55m)",
      qualityNote: "Dual-pass validation protocol eliminates subjective human drift and clock desynchronization"
    },
    verifiedLinks: [
      { label: "Verified Career Journey Timeline", url: "#journey", isInternal: true }
    ],
    problemStatement: "Automated multi-camera match recordings generate uncalibrated video feeds subject to annotator drift, missed tactical sequences, and spatial event discrepancies.",
    approach: "Tagged, verified, and structured match events (passes, set pieces, turnovers, fouls, shots) across soccer and field hockey footage using the Spiideo video tracking platform with standardized event taxonomies and multi-tier QA.",
    keyFinding: "Standardized multi-tier verification protocols eliminated timestamp desynchronization and ensured reliable player-attribution sequences across match datasets.",
    businessImplication: "High-fidelity structured event datasets provide coaching and analytical teams with dependable data for tactical performance modeling and spatial strategy evaluation.",
    personalContribution: "Executed primary event annotation and secondary dual-pass verification across live match recordings, conducted pitch-grid spatial calibration, and delivered indexed tactical clip playlists within strict <2-minute operational SLAs.",
    cardBrief: {
      objective: "Transform uncalibrated panoramic match video into structured, timestamp-synchronized event datasets for coaching and tactical strategy.",
      methods: "Spiideo panoramic tracking • FIFA/FIH pitch coordinate calibration • Dual-pass event tagging • Sub-second clock synchronization",
      keyDeliverable: "Standardized tabular match event logs (CSV/database) and indexed tactical video playlists delivered within <2-min turnaround."
    },
    tools: ["Spiideo Camera Systems", "Video Annotation & Tagging", "Data Quality Verification", "Event Pipeline QA"],
    keyMetrics: [
      { label: "Role", value: "Data Analyst", subtext: "SPIIDEO Internship", classification: "DEMONSTRATED" },
      { label: "Sports Covered", value: "Soccer & Hockey", subtext: "Multi-event video annotation", classification: "DEMONSTRATED" },
      { label: "Verification Protocol", value: "Dual-Pass QA", subtext: "Standardized event taxonomy", classification: "DEMONSTRATED" },
      { label: "Turnaround Target", value: "<2 Minutes", subtext: "Post-match tactical clip SLA", classification: "OPERATIONAL SLA" }
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
          ],
          table: {
            headers: ["Tactical Event Category", "Monitored Dimensional Attributes", "Spatial & Temporal Resolution", "Verification Protocol"],
            rows: [
              ["Ball Possession & Passing Chains", "Pass origin/target vectors, player ID, completion tag", "Sub-second sync (<0.5s)", "Automated sequence continuity check"],
              ["Penalty Corner & Set Pieces", "Zonal alignment, execution angles, shot trajectories", "Calibrated pitch grid coordinates", "100% mandatory dual-pass human review"],
              ["High-Press Transition Phases", "Pressing compact distance, ball recovery coordinates", "Synchronized multi-camera angles", "Secondary formation shift cross-check"],
              ["Disciplinary & Stoppage Events", "Card infractions, referee intervention timestamps", "Official match clock alignment", "Dual-angle optical review"]
            ]
          },
          callout: {
            type: "insight",
            text: "Operational QA Standard: High-stakes tactical events (penalty set-pieces and scoring actions) require mandatory dual-pass human verification to eliminate single-annotator subjective bias."
          }
        },
        {
          title: "5. Key Operational Findings & Annotation Fidelity",
          content: [
            "Implementing standardized event taxonomies and dual-pass validation eliminated timestamp desynchronization across multi-angle recordings in audited match sequences.",
            "Achieved complete event attribution completeness across critical penalty set pieces and scoring actions, providing coaching staffs with verified event streams."
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
            "• Operational Turnaround Pressures: In-fixture delivery targets (<2 minutes) require prioritizing primary scoring and set-piece events for immediate review, while secondary possession sequences undergo post-fixture batch validation."
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
    tagline: "Interactive IT operations analytics exploring ticket demand, backlog composition, SLA compliance, and resolution prediction.",
    category: "Business Analytics",
    featured: true,
    status: "Completed Independent Research",
    date: "Q4 2024",
    summary: "High-fidelity enterprise service-intelligence SaaS workspace analyzing 8,000 synthetic ticket transactions across calendar year 2024 with operational triage, SLA compliance analytics, and resolution-time modeling.",
    datasetScope: {
      scale: "8,000 Synthetic Support Ticket Transactions (CY 2024)",
      structure: "Snowflake/Star Relational Schema (tickets Fact + 5 Conformed Dimensions: departments, teams, agents, categories, sla_rules)",
      qualityNote: "Controlled clean reference vs. 120 injected defect variant in data workbench; 24/7 calendar-hour resolution metrics; synthetic data disclosure"
    },
    verifiedLinks: [
      { label: "Live Interactive Application", url: "https://it-support-analytics.vercel.app/", isInternal: false, type: "evidence" },
      { label: "GitHub Source Repository", url: "https://github.com/kaustubh21112002/it-support-analytics", isInternal: false, type: "repository" },
      { label: "Applied Technical Skills", url: "#skills", isInternal: true }
    ],
    problemStatement: "Enterprise IT support desks face severe operational opacity: individual ticket backlogs obscure macro demand patterns, triage bottlenecks delay high-impact incidents, and retrospective SLA reporting often lacks denominator governance.",
    approach: "Architected a full-featured SaaS analytics platform using React 18, TypeScript, and Recharts, backed by a governed stateful data-service layer (dataService.ts) analyzing 8,000 synthetic ticket records across calendar year 2024. Implemented role-based workspaces, SLA threshold auditing, and an intake-stage resolution time prediction interface.",
    keyFinding: "Analysis of 8,000 synthetic tickets revealed 6,612 completed tickets with an 87.9% overall retrospective SLA compliance rate (5,814 compliant vs. 798 breached). Turnaround times exhibit strong positive right-skew: mean resolution of 14.9 hours vs. median of 7.32 hours (a 50.9% variance), proving that high-duration infrastructure outages distort arithmetic averages.",
    businessImplication: "Service leaders should monitor median turnaround time alongside SLA compliance to prevent right-tail infrastructure outages from skewing operational performance assessments, while prioritizing automated intake triage for high-volume Access and Network categories.",
    personalContribution: "Engineered the end-to-end frontend SaaS architecture, implemented the decoupled TypeScript data-service layer (dataService.ts and dataNormalizer.ts) with useSyncExternalStore, designed the relational star-schema specification and DDL, and formulated the intake resolution estimation engine.",
    cardBrief: {
      objective: "Explore support ticket demand, backlog composition, SLA compliance, and reported resolution-time predictions across 8,000 synthetic incident records.",
      methods: "React 18 + TypeScript • dataService.ts abstraction • 5-table star schema • Multi-tier SLA rules • LightGBM evaluation & heuristic",
      keyDeliverable: "Deployed enterprise analytics workspace on Vercel with role-based routing, interactive prediction tool, and comprehensive data workbench."
    },
    tools: ["React 18 & TypeScript", "Tailwind CSS & Recharts", "dataService.ts Abstraction", "MySQL Relational Schema", "LightGBM Regression (Offline)"],
    keyMetrics: [
      { label: "Dataset Scale", value: "8,000 Records", subtext: "Synthetic transactions (CY 2024)", classification: "DEMONSTRATED" },
      { label: "SLA Compliance", value: "87.9%", subtext: "5,814 / 6,612 completed tickets", classification: "OPERATIONAL SLA" },
      { label: "Mean vs Median", value: "14.9h / 7.3h", subtext: "Turnaround distribution skew", classification: "DEMONSTRATED" },
      { label: "Model Baseline", value: "3.42h MAE", subtext: "Offline LightGBM (R² 0.784)", classification: "STUDY ESTIMATE" }
    ],
    methodsAndAssumptions: [
      "Synthetic Data Scope: Exactly 8,000 synthetic ticket records across calendar year 2024 generated for academic and demonstration purposes; no confidential production records are utilized.",
      "Resolution Time Metric: Calculated as (resolved_at - created_at) / 3600 seconds, evaluated continuously across 24/7 calendar hours.",
      "SLA Denominator Governance: Retrospective compliance evaluates strictly against completed tickets (6,612 resolved/closed), never diluting breach rates with the active 1,388 open backlog tickets.",
      "Model Evaluation Context: Reported metrics (MAE 3.42h, RMSE 5.18h, R² 0.784) reflect an offline LightGBM regressor on an 80/20 chronological split; the running web client utilizes a calibrated client-side regression heuristic mirroring these weights."
    ],
    limitations: [
      "Synthetic Data Constraint: Dataset parameters reflect parameterized operational distributions; real-world enterprise environments exhibit unmodeled vendor outages, multi-hop escalations, and unstructured communication delays.",
      "Frontend Heuristic vs. Live Server: The live prediction tab executes a calibrated client-side regression heuristic matching LightGBM weights rather than invoking a live containerized ML microservice.",
      "Prototype Authentication: Demo logins and two-factor OTP (123456) operate client-side without external SSO/SAML identity provider integration."
    ],
    caseStudy: {
      researchQuestion: "How can operational ticket logs be transformed into governed service intelligence, multi-tier SLA monitoring, and reliable intake resolution-time estimates?",
      executiveSummary: "An end-to-end enterprise service-intelligence SaaS workspace developed in React 18, TypeScript, and Recharts, backed by a stateful service-layer abstraction (dataService.ts) and a 5-table relational star schema. Analyzes 8,000 synthetic support ticket transactions across CY 2024 to uncover backlog distribution, turnaround right-skew (14.9h mean vs. 7.3h median), department demand drivers, and reported LightGBM resolution prediction capabilities.",
      sections: [
        {
          title: "1. Executive Summary & Interactive Architecture",
          subtitle: "Decoupled 5-tier architecture connecting synthetic fact logs to responsive analytics views",
          content: [
            "Enterprise IT Service Management (ITSM) operations generate massive transactional ticket volumes that overwhelm static spreadsheets and standard ticketing queues.",
            "The IT Support Analytics Platform was built to bridge operational triage with executive decision support. It features four dedicated role-based workspaces: Employee Self-Service, Support Agent Queue, Management Service Intelligence, and Administrator Data Workbench.",
            "In accordance with governed engineering standards, the interactive workspace below illustrates the system architecture, verified KPIs, predictive modeling audit, and high-fidelity product gallery captured from the live deployment:"
          ]
        },
        {
          title: "2. Business Problem & Operational Analytical Questions",
          subtitle: "Addressing visibility bottlenecks in high-volume IT support desks",
          content: [
            "At enterprise scale, support desks process thousands of concurrent requests across disparate departments, technical tiers, and urgency levels. Individual ticket logs fail to provide macro operational answers to essential questions:",
            "• Ticket Demand & Seasonality: How is request demand distributed across calendar months, and does ticket creation outpace team resolution throughput?",
            "• Backlog Distribution: How is unresolved work divided between new Open requests (552), active In Progress tickets (523), and external Pending tickets (313)?",
            "• SLA Compliance Integrity: What proportion of eligible resolved tickets satisfied tier-specific SLA thresholds, and which categories suffer highest breach rates?",
            "• Turnaround Time Distribution: Why do average resolution metrics mask operational reality, and how significant is right-tail latency skew?",
            "• Intake Predictive Estimation: What can features available at intake (priority, category, department, issue type) tell service desks about expected turnaround duration?"
          ]
        },
        {
          title: "3. Governed KPI Framework & Mathematical Formulations",
          subtitle: "Rigorous metric definitions anchored to the 8,000-ticket dataset",
          content: [
            "Following the PRESERVE → DOCUMENT → FLAG → GOVERN methodology, every metric in the platform is derived from formal mathematical rules evaluated in dataNormalizer.ts and analysis_queries.sql:",
            "1. Resolution Duration (Elapsed Calendar Hours): Evaluated as (resolved_at - created_at) / 3600 seconds, operating across 24/7 calendar time.",
            "2. Retrospective SLA Compliance Rate: Evaluated strictly as Compliant Resolved Tickets ÷ Total Completed Tickets (6,612). Unresolved tickets (Open, In Progress, Pending) are never mixed into retrospective compliance denominators.",
            "3. Multi-Tier Target SLAs: Critical (4.0h), High (8.0h), Medium (24.0h), and Low (72.0h).",
            "The table below details performance across each priority tier from the authoritative dataset:"
          ],
          table: {
            headers: ["Priority Tier", "Target SLA Window", "Resolved Tickets", "Compliant Tickets", "Breached Tickets", "SLA Compliance %"],
            rows: [
              ["Critical (P1)", "4.0 Calendar Hours", 687, 598, 89, "87.0%"],
              ["High (P2)", "8.0 Calendar Hours", 1632, 1419, 213, "86.9%"],
              ["Medium (P3)", "24.0 Calendar Hours", 2955, 2624, 331, "88.8%"],
              ["Low (P4)", "72.0 Calendar Hours", 1338, 1173, 165, "87.7%"],
              ["Portfolio Total", "Multi-Tier Target", 6612, 5814, 798, "87.9% (Breach: 12.1%)"]
            ]
          },
          callout: {
            type: "insight",
            text: "Denominator Discipline: Retrospective SLA compliance evaluates strictly against completed tickets (6,612). Active backlog tickets (1,388) are monitored separately in operational queues with countdown timers rather than diluting historical compliance rates."
          }
        },
        {
          title: "4. Operational Analysis: Turnaround Skew & Department Demand",
          subtitle: "Empirical insights across turnaround times, categories, and business units",
          content: [
            "• Turnaround Skew: The mean resolution time is 14.9 hours, whereas the median is 7.32 hours (a 50.9% variance). This substantial positive right-skew indicates that while over half of all requests resolve within 7.3 hours, complex multi-team escalations and vendor dependencies extend the arithmetic mean.",
            "• Department Demand Distribution: Ticket volume is evenly distributed across the 5 corporate business units: Human Resources (1,648 tickets, 14.6h avg), Finance & Administration (1,640 tickets, 15.4h avg), Engineering & DevOps (1,618 tickets, 14.6h avg), Corporate IT (1,555 tickets, 15.0h avg), and Customer Support & Operations (1,539 tickets, 15.0h avg).",
            "• Recurring Issue Hotspots: Battery health critical (302 occurrences, 15.6h avg, 13.1% breach rate), DNS lookup failure (301 occurrences, 14.6h avg, 10.7% breach rate), and Okta SSO login failure (290 occurrences, 16.0h avg, 12.1% breach rate) represent the primary drivers of recurring support demand."
          ],
          callout: {
            type: "note",
            text: "Managerial Guidance: Reporting solely average resolution time creates a false impression of poor general service desk productivity. Median resolution (7.32h) more accurately reflects typical user experience, while right-tail mean variance isolates systemic infrastructure bottlenecks."
          }
        },
        {
          title: "5. Predictive Analytics: Intake Estimation & Governance Audit",
          subtitle: "Reconciling offline LightGBM evaluation with the running client heuristic",
          content: [
            "The platform addresses resolution latency modeling through an intake-stage prediction framework:",
            "• Prediction Target: Total calendar hours to resolution, modeled as a continuous regression target.",
            "• Features Available at Intake: Priority tier (Critical/High/Medium/Low), Category ID, Requesting Department ID, and Issue Type description. Features generated during triage (agent assignment, reassignment counts, internal notes) are strictly excluded to prevent data leakage.",
            "• Offline LightGBM Baseline: In Python experimentation across 8,000 synthetic records using an 80/20 chronological time-aware split (6,400 training / 1,600 test), a LightGBM regressor achieved MAE of 3.42 hours, RMSE of 5.18 hours, and R² of 0.784.",
            "• Running Web Application Implementation: In dataService.ts (predictResolutionTime), the running client evaluates an intake feature heuristic matching the baseline model weights with parametric confidence intervals (65% lower bound to 160% upper bound). This provides instant interactive feedback on the live Vercel deployment without requiring an external containerized inference service."
          ],
          callout: {
            type: "warning",
            text: "Transparency Disclosure: The interactive prediction UI uses a calibrated client-side regression heuristic matching LightGBM weights. No live cloud ML inference microservice is currently invoked."
          }
        },
        {
          title: "6. Engineering Architecture & Data Governance",
          subtitle: "Component design, state isolation, and data-quality workbench",
          content: [
            "• Decoupled Service Abstraction: UI components interact exclusively with dataService.ts via useSyncExternalStore. No page directly imports raw mock data or executes inline SQL transformations.",
            "• Relational Snowflake Schema: Supported by production-ready DDL scripts in MySQL/PostgreSQL with InnoDB engines, foreign key constraints, and multi-column indexes across ticket timestamps and priority tiers.",
            "• Data Workbench & QA Audit Tooling: Embedded /admin/data workbench validates schema compliance against clean (8,000 rows) and dirty (8,040 rows, 120 defects) datasets, verifying 100% key uniqueness and zero orphan foreign keys in the production reference.",
            "• Role-Based Route Guards: React Router v6 architecture with client-side role authorization separating employee runbooks from confidential agent internal notes and administrative settings."
          ]
        },
        {
          title: "7. Author's Personal Contributions & Demonstrated Competencies",
          subtitle: "Mapping project engineering to professional analytical roles",
          content: [
            "This project demonstrates applied competencies across core analytics, financial modeling, and software engineering domains:",
            "• Business & Operational Analytics: Designed the complete ITIL metric framework (MTTR, SLA compliance, backlog aging), formulated denominator governance rules, and evaluated right-tail turnaround skew.",
            "• Relational Data Architecture: Authored the 5-table relational schema DDL, indexed foreign keys, and wrote verified analytical SQL queries reproducing all dashboard metrics.",
            "• Predictive Modeling & ML Governance: Formulated intake feature boundaries, audited leakage risks, recorded LightGBM performance metrics (MAE 3.42h, R² 0.784), and transparently documented prototype heuristic execution.",
            "• Full-Stack Frontend Engineering: Developed 18+ responsive view routes in React 18, TypeScript, and Tailwind CSS with custom Recharts visualizations, deterministic OTP demo authentication, and stateful data hydration."
          ]
        },
        {
          title: "8. Methodological Lessons & Future Production Roadmap",
          subtitle: "Key takeaways and planned production enhancements",
          content: [
            "1. Denominator Discipline Matters: Mixing unresolved backlog tickets into historical SLA compliance metrics distorts operational reality; maintaining strict eligibility boundaries is essential for management credibility.",
            "2. Mean vs. Median in Operations: Highly right-skewed operational distributions require dual reporting; medians capture typical user experience while arithmetic means highlight tail risk.",
            "3. Production Roadmap: Next planned engineering phases include replacing simulated demo authentication with Okta/Azure AD SAML 2.0 SSO, linking dataService.ts to an active Supabase/PostgreSQL instance, and deploying a containerized FastAPI endpoint on Google Cloud Run for live LightGBM inference."
          ]
        }
      ],
      disclaimer: "Independent academic case study based on 8,000 synthetic ticket transactions across calendar year 2024. Does not represent actual corporate incident records or commercial enterprise endorsement."
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
    datasetScope: {
      scale: "36-Month Cohort Models & Industry Benchmark FinTech Metrics",
      structure: "Cohort Unit Economics Ledger, RBI Digital Lending Regulatory Matrix, Basel III Capital Table",
      qualityNote: "Stress-tested against credit default shocks (2.5% to 5.0% NPA) and digital acquisition cost escalation"
    },
    verifiedLinks: [
      { label: "Applied Financial Modeling Skills", url: "#skills", isInternal: true },
      { label: "Academic Research Manuscripts", url: "#research", isInternal: true }
    ],
    problemStatement: "Digital neobanks encounter severe unit economic compression caused by surging customer acquisition costs (CAC), rapid account churn, and regulatory restrictions on direct balance-sheet deposit mobilization.",
    approach: "Conducted an MBA Business Model Credibility Report evaluating commercial viability, customer lifetime value payback horizons (LTV:CAC), and regulatory compliance under RBI guidelines and Basel III norms.",
    keyFinding: "In the simulated unit-economics model, achieving commercial viability required a minimum 3.4x LTV:CAC with an estimated 14-month payback horizon, driven by high-margin credit cross-sell and anchored by a 15% Basel III capital buffer.",
    businessImplication: "Standalone consumer payment neobanks are economically unsustainable without scheduled commercial bank co-branding or partner NBFC lending balance sheets under current RBI regulatory directives.",
    personalContribution: "Formulated the 36-month cohort LTV:CAC financial model, stress-tested capital adequacy against Basel III Tier-1 requirements, and synthesized RBI Master Directions on digital co-branding risk.",
    cardBrief: {
      objective: "Evaluate commercial feasibility, CAC payback dynamics, and RBI regulatory capital compliance for an AI-first neobanking concept.",
      methods: "36-month cohort unit economics • LTV:CAC amortization • Basel III Tier-1 buffer stress testing • RBI regulatory matrix",
      keyDeliverable: "Comprehensive 25-page MBA strategic credibility report with interactive financial model and regulatory compliance audit."
    },
    tools: ["FinTech Unit Economics", "CAC:LTV Modeling", "Basel III & RBI Compliance", "Financial Viability Framework"],
    keyMetrics: [
      { label: "Target LTV:CAC", value: "3.4x", subtext: "Modeled steady-state ratio", classification: "STUDY ESTIMATE" },
      { label: "Payback Horizon", value: "14 Months", subtext: "Subscription & cross-sell model", classification: "STUDY ESTIMATE" },
      { label: "Capital Adequacy", value: "15.0%", subtext: "Basel III buffer standard", classification: "BENCHMARK PARAMETER" },
      { label: "Blended CAC", value: "₹650", subtext: "Organic payroll + digital acquisition", classification: "STUDY ESTIMATE" }
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
            "The evaluation synthesizes unit-economics benchmarks from public FinTech operators (Revolut, Monzo, Jupiter, Fi), regulatory directives from the Reserve Bank of India (RBI Master Directions on Digital Lending and Outsourcing of Financial Services), and Basel III Tier-1 capital adequacy standards."
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
  },
  {
    id: "equitrack-analytics-os",
    title: "EquiTrack Analytics OS — Financial News Intelligence & Data Governance",
    tagline: "Structured financial news intelligence, review-velocity tracking, and data-quality governance dashboard.",
    category: "Data Governance",
    featured: false,
    status: "Completed Independent Research",
    date: "October 2026",
    summary: "Spreadsheet-based financial news intelligence and business reporting prototype combining structured register management, source compliance rules, analyst review workflows, and executive KPI monitoring across reported demonstration records.",
    datasetScope: {
      scale: "7 Reported Demonstration Records (Prototype Dataset)",
      structure: "Financial News Register, Source Classification Directory, DQ Audit Rules, KPI Summary & Executive Dashboard",
      qualityNote: "Controlled prototype demonstration dataset; reported acceptance metrics reflect configured workbook scoring logic, not independent factual verification."
    },
    evidenceUrl: "https://docs.google.com/spreadsheets/d/1kYoHioEEruwGpU0QJxqu3Ntk3JnnGSqb-e94ei4yjy0/edit?usp=drivesdk",
    evidenceLabel: "View Project Workbook",
    verifiedLinks: [
      {
        label: "View Project Workbook",
        url: "https://docs.google.com/spreadsheets/d/1kYoHioEEruwGpU0QJxqu3Ntk3JnnGSqb-e94ei4yjy0/edit?usp=drivesdk",
        isInternal: false,
        type: "evidence"
      }
    ],
    problemStatement: "Financial news ingested from multi-channel media feeds lacks standardized structure, verification traceability, and source governance. Without disciplined schema validation, duplicate detection, and review-queue monitoring, decision-makers face information noise, unvetted speculation, and operational review bottlenecks.",
    approach: "Designed a structured spreadsheet-based intelligence operating system featuring a normalized news register, source authority directory, automated data-quality audit rules, analyst workflow queue tracking, and an executive KPI summary dashboard.",
    keyFinding: "Reported prototype testing across 7 demonstration records achieved 100% mandatory-field completeness, 100% official-source compliance, and a 100/100 system audit health score with 0 failed rules. However, review completion velocity stood at 57.1% against a 70% operational benchmark—transparently identifying a workflow backlog across pending (2) and in-review (1) records.",
    businessImplication: "Separating data completeness from factual verification and monitoring review velocity reveals operational workflow bottlenecks before intelligence reaches executive consumers. Structured governance prevents speculative dissemination while preserving auditability.",
    personalContribution: "Architected the data dictionary, source classification hierarchy, multi-point data quality formulas, review queue velocity calculation, and executive dashboard layout in Google Sheets.",
    cardBrief: {
      objective: "Organize financial news in a governed register, monitor source compliance, track analyst review workflows, and deliver executive KPI oversight.",
      methods: "Structured news register • Source compliance directory • DQ audit rules • Review queue monitoring • Executive dashboard",
      keyDeliverable: "Governed Google Sheets financial intelligence prototype with audit scorecards and review velocity tracking."
    },
    tools: ["Google Sheets", "Financial Intelligence", "Data Governance", "KPI Frameworks", "Workflow Quality Assurance"],
    keyMetrics: [
      { label: "Reported Records", value: "7", subtext: "Prototype Demonstration Dataset", classification: "PROTOTYPE DEMO" },
      { label: "Audit Health Score", value: "100/100", subtext: "Reported: 0 Failed Audit Rules", classification: "PROTOTYPE DEMO" },
      { label: "Source Compliance", value: "100%", subtext: "Configured Approved-Source List", classification: "PROTOTYPE DEMO" },
      { label: "Review Velocity", value: "57.1%", subtext: "Below 70% Target (Backlog Flag)", classification: "PROTOTYPE DEMO" }
    ],
    methodsAndAssumptions: [
      "Structured News Register: Normalized schema capturing publication timestamp, headline, classified topic, official source URL, priority tier, sentiment classification, and analyst verification status.",
      "Source Directory & Classification: Maintained approved-source list categorizing media authority, regulatory disclosures, and wire services.",
      "Operational Review Queue: Multi-state workflow tracking (Pending Review, In Review, Reviewed) measuring completion velocity against a 70% target threshold.",
      "Data Quality Rules: Formulas checking mandatory-field completeness, duplicate headline detection, and freshness tiers."
    ],
    limitations: [
      "Prototype Scale Limitation: Built and tested on a reported 7-record demonstration dataset; not currently deployed at enterprise production throughput.",
      "Completeness vs. Accuracy: A technically complete record with a valid source URL does not guarantee factual market truth; editorial verification remains essential.",
      "Automated Regulatory Ingestion (Roadmap): Direct automated ingestion from regulatory portals (SEBI/RBI) or stock exchange announcements (NSE/BSE) is under feasibility study and not yet implemented.",
      "Audit Score Scope: The 100/100 audit health score reflects configured formula checks within the workbook and does not imply independent third-party verification."
    ],
    caseStudy: {
      researchQuestion: "How can financial organizations systematically structure, validate, and govern high-velocity news intelligence while identifying operational review bottlenecks before information reaches decision-makers?",
      executiveSummary: "EquiTrack Analytics OS is a financial news intelligence and data-governance prototype constructed in Google Sheets. It addresses information fragmentation through a structured register, source compliance directories, formulaic quality audits, and an executive KPI dashboard. Evaluated across 7 demonstration records, the prototype achieved 100% field completeness and source compliance, while diagnostic tracking uncovered a 57.1% review completion velocity against a 70% benchmark—surfacing workflow backlogs as an actionable management insight.",
      sections: [
        {
          title: "1. Project Overview & Business Problem",
          content: [
            "In modern financial markets, news arrives constantly from disparate sources, ranging from primary regulatory filings to secondary market commentary.",
            "Without a structured operational process, teams face multiple failure modes: missing contextual fields, unverified rumors passed off as vetted intelligence, duplicate reporting distorting sentiment, and unmonitored backlogs in analyst review queues.",
            "EquiTrack Analytics OS was designed to solve this governance challenge through an accessible, spreadsheet-based intelligence operating system that structures incoming items, enforces source compliance, monitors analyst workflows, and surfaces operational KPIs to leadership."
          ]
        },
        {
          title: "2. Project Objectives & Operational Scope",
          content: [
            "The system was engineered around seven clear operational objectives:",
            "• Organize Financial News: Normalize heterogeneous market reports into a consistent register with explicit attributes (headline, company, sector, timestamp, priority, sentiment).",
            "• Monitor Source Compliance: Validate incoming source URLs against an approved source directory to ensure lineage traceability.",
            "• Track Review Workflows: Monitor items across 'Pending Review', 'In Review', and 'Reviewed' states to measure operational throughput.",
            "• Evaluate Data Quality & Duplicates: Implement formula-driven checks for missing mandatory fields and flag redundant reporting.",
            "• Monitor Priority & Freshness: Highlight breaking news and high-priority disclosures requiring expedited analyst attention.",
            "• Executive KPI Dashboard: Synthesize operational health, workflow velocity, and exposure distributions into a single-pane executive summary.",
            "• Document Governance Boundaries: Maintain clear documentation of validation rules, scoring logic, and structural limitations."
          ]
        },
        {
          title: "3. Spreadsheet Architecture & Components",
          content: [
            "The architecture consists of six interconnected functional modules within the workbook:",
            "• Financial News Register: The operational core storing individual intelligence entries with standardized metadata fields.",
            "• Source Classification Directory: A lookup table defining approved news providers, official publication types, and trust categories.",
            "• Data-Quality Audit Engine: Formula-based validation rules auditing record completeness, duplicate presence, and URL validity.",
            "• Workflow Queue Manager: Tracks review cycle progression and calculates analyst velocity.",
            "• KPI Summary Aggregator: Computes roll-up metrics, ratio calculations, and target variances.",
            "• Executive Dashboard: Visual management interface displaying KPI cards, audit scorecards, and operational distributions."
          ]
        },
        {
          title: "4. KPI Framework & Management Purpose",
          content: [
            "EquiTrack defines operational indicators specifically aligned with decision intelligence rather than vanity metrics:",
            "• Mandatory Completeness (Reported 100%): Measures whether all critical attributes (timestamp, source, category, headline) are populated before distribution.",
            "• Official-Source Compliance (Reported 100%): Audits whether stories originate from configured approved publications, preventing unvetted hearsay.",
            "• Verified Intelligence Ratio (Reported 100%): Tracks the proportion of records that have completed primary source corroboration.",
            "• Review Completion Velocity (Reported 57.1% vs 70% Benchmark): Diagnostic indicator measuring the ratio of completed reviews to total records. Falling below the 70% target flags an operational review backlog (2 Pending, 1 In Review, 4 Reviewed).",
            "• High-Priority Exposure (Reported 71.4%): Quantifies the concentration of high-impact news requiring immediate risk assessment.",
            "• Breaking-News Count (Reported 2): Highlights real-time flash bulletins requiring rapid editorial escalation.",
            "• Duplicate Ratio (Reported 0%): Verifies deduplication controls to prevent over-weighting repeated media stories.",
            "• System Audit Health Score (Reported 100/100): Composite index scoring compliance across configured quality checks (0 failed rules)."
          ]
        },
        {
          title: "5. Reported Prototype Test Results",
          content: [
            "Note: The figures below represent user-reported acceptance-test results from the prototype demonstration workbook, not independently verified production metrics."
          ],
          table: {
            headers: ["Metric", "Reported Result", "Configured Target / Benchmark", "Operational Interpretation"],
            rows: [
              ["Total Intelligence Records", "7", "Prototype Demo Dataset", "Demonstration corpus illustrating register workflows"],
              ["Mandatory-Field Completeness", "100%", "100%", "All required fields populated across all 7 records"],
              ["Official-Source Compliance", "100%", "100%", "All records linked to approved source directory entities"],
              ["Verified Intelligence Ratio", "100%", "100%", "All active records corroborate with primary source citations"],
              ["Unverified Records", "0", "0", "Zero uncorroborated items currently active"],
              ["Pending Review Queue", "2", "0 (Queue Goal)", "2 items awaiting initial analyst evaluation"],
              ["In Review Items", "1", "Active Work", "1 item currently under active verification"],
              ["Reviewed Items", "4", "4 Completed", "4 items completed through full verification cycle"],
              ["Review Completion Velocity", "57.1%", "70.0% Target", "Below target: identifies review workflow backlog"],
              ["High-Priority Exposure", "71.4%", "Risk Indicator", "5 of 7 records classified as high commercial priority"],
              ["Duplicate Ratio", "0%", "0%", "Zero redundant records detected in demonstration corpus"],
              ["Breaking-News Count", "2", "Alert Count", "2 real-time bulletins flagged for executive notification"],
              ["System Audit Health Score", "100/100", "100/100", "All configured workbook audit checks passed"],
              ["Failed Audit Rules", "0", "0", "Zero formulaic validation rule failures reported"]
            ]
          },
          callout: {
            type: "warning",
            text: "Operational Diagnosis: While the workbook achieved a reported 100/100 audit health score on schema validation and source compliance, the Review Completion Velocity of 57.1% falls significantly below the configured 70.0% operational benchmark. This variance surfaces an active analyst workflow backlog (2 Pending, 1 In Review out of 7 total records) that requires workload redistribution before downstream distribution."
          }
        },
        {
          title: "6. Data Governance, Controls & Structural Limitations",
          content: [
            "Honest analytical storytelling requires distinguishing technical completeness from absolute market truth:",
            "• Completeness Does Not Equal Truth: A news record can be 100% complete with a working URL, yet still report speculative or conflicting market claims. Quality audit scores reflect schema conformity, not infallible financial truth.",
            "• Prototype Demonstration Scale: The current implementation operates on a reported 7-record dataset. It serves as an architectural prototype demonstrating governance design, not an enterprise-scale streaming engine.",
            "• Feasibility of Ingestion Pipelines: Automatic scraping of regulatory publications (SEBI / RBI) or stock exchange announcements (NSE / BSE) is not implemented in the current workbook and remains subject to technical and legal feasibility studies."
          ]
        },
        {
          title: "7. Planned Roadmap: Regulatory Ingestion Architecture",
          content: [
            "To evolve EquiTrack beyond manual register logging, a 4-phase controlled roadmap is planned for feasibility evaluation:",
            "• Phase 1 — Source Feasibility Study: Assess official SEBI and RBI regulatory publication structures, retrieval permissions, rate constraints, and metadata formats.",
            "• Phase 2 — Read-Only Staging Layer: Design an isolated staging table to capture raw external feeds without directly touching or altering production registers.",
            "• Phase 3 — Data-Quality & Deduplication Engine: Apply automated validation for required fields, timestamp synchronization, and fuzzy headline deduplication before review queues.",
            "• Phase 4 — Controlled Analyst Review & Acceptance: Enforce mandatory analyst verification and sign-off before any record is promoted to executive reporting."
          ]
        }
      ],
      disclaimer: "EquiTrack Analytics OS is an independent financial analytics and data-governance demonstration prototype built in Google Sheets. All reported metrics reflect workbook prototype acceptance testing on demonstration data."
    }
  }
];
