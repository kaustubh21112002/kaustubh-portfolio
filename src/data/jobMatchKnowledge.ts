// Governed Portfolio Knowledge Base for Job Description Evidence Matching
// Sourced strictly from projects.json, skills.ts, and resume.txt without extrapolation.

export type RequirementVerdict = 'DEMONSTRATED' | 'PARTIAL' | 'GAP';
export type RequirementCategory =
  | 'TECHNICAL_SKILL'
  | 'BUSINESS_CAPABILITY'
  | 'FINANCIAL_KNOWLEDGE'
  | 'TOOL'
  | 'DOMAIN_KNOWLEDGE'
  | 'EXPERIENCE_QUALIFICATION';

export interface EvidenceSourceItem {
  id: string;
  name: string;
  category: RequirementCategory;
  primaryProject: string;
  projectTitle: string;
  evidenceText: string;
  keywords: string[];
  partialKeywords: string[];
}

export const PORTFOLIO_EVIDENCE_REPOSITORY: EvidenceSourceItem[] = [
  // Financial Valuation & Modeling
  {
    id: 'dcf-modeling',
    name: 'Discounted Cash Flow (DCF) Valuation',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: '5-year explicit FCFF forecasting, mid-year discounting, working capital schedules, terminal value blending, and EV-to-Equity bridging yielding ₹41,631.22 Cr.',
    keywords: ['dcf', 'discounted cash flow', 'fcff', 'cash flow modeling', 'free cash flow', 'valuation model', 'financial modeling'],
    partialKeywords: ['valuation', 'cash flow', 'discounting', 'financial projections']
  },
  {
    id: 'wacc-capm',
    name: 'Cost of Capital (WACC / CAPM)',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: 'Calibrated 14.92% WACC using CAPM (Rf=3.0%, FinTech beta=1.35, Rm=11.82%, market risk premium=8.82%).',
    keywords: ['wacc', 'capm', 'cost of capital', 'beta', 'risk free rate', 'equity risk premium'],
    partialKeywords: ['cost of equity', 'hurdle rate', 'capital structure']
  },
  {
    id: 'terminal-value-reconciliation',
    name: 'Terminal Value Reconciliation & Multiples',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: 'Gordon Growth perpetuity (4.0% growth, ₹54,464 Cr) reconciled against Exit Multiple (13.15x Year 5 EBITDA, ₹19,425 Cr) yielding ₹19,554 Cr PV.',
    keywords: ['terminal value', 'exit multiple', 'perpetuity growth', 'gordon growth', 'ebitda multiple'],
    partialKeywords: ['multiples', 'ebitda', 'terminal growth']
  },
  {
    id: 'sensitivity-scenario-analysis',
    name: 'Sensitivity & Scenario Analysis',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: 'Interactive multi-variable WACC and exit multiple flex tables with bull/base/bear cases and per-share price impacts.',
    keywords: ['sensitivity analysis', 'scenario modeling', 'scenario analysis', 'sensitivity matrix', 'stress test', 'flex tables', 'bull bear'],
    partialKeywords: ['scenarios', 'stress testing', 'what if']
  },
  {
    id: 'fintech-unit-economics',
    name: 'FinTech Unit Economics & Capital Adequacy',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'smartbank-360',
    projectTitle: 'SmartBank 360',
    evidenceText: 'Customer acquisition cost (CAC) vs. LTV horizon, Basel III capital adequacy ratio (CAR) evaluation, net interest margin (NIM).',
    keywords: ['unit economics', 'cac', 'ltv', 'basel iii', 'capital adequacy', 'fintech', 'customer acquisition cost', 'lifetime value'],
    partialKeywords: ['financial services', 'banking', 'nim', 'car']
  },

  // Analytics & Business Intelligence
  {
    id: 'power-bi-dax',
    name: 'Power BI & DAX Reporting',
    category: 'TOOL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Interactive dashboard pipelines with custom DAX calculated measures for MTTA, MTTR, SLA adherence, and moving averages across 10,000+ support ticket records.',
    keywords: ['power bi', 'dax', 'powerbi', 'pbi', 'business intelligence dashboard', 'bi dashboard', 'power bi reporting'],
    partialKeywords: ['dashboard', 'reporting', 'bi', 'visualization', 'kpi dashboard']
  },
  {
    id: 'kpi-tree-modeling',
    name: 'KPI Hierarchy & Tree Modeling',
    category: 'BUSINESS_CAPABILITY',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: '30/30 corporate KPI traceability from executive net revenue down to channel and unit conversion metrics.',
    keywords: ['kpi tree', 'kpi hierarchy', 'kpi modeling', 'metrics framework', 'kpi definition', 'kpi governance', 'kpi frameworks & metrics tree'],
    partialKeywords: ['kpi', 'metrics', 'key performance indicators']
  },
  {
    id: 'operational-bottlenecks',
    name: 'Operational Bottleneck & SLA Latency Analysis',
    category: 'BUSINESS_CAPABILITY',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Queue theory, shift-change handover variance, and tier escalation latency detection across 10,000+ incident ticket logs.',
    keywords: ['bottleneck detection', 'sla analysis', 'operational analytics', 'queue theory', 'escalation latency', 'incident analytics', 'turnaround time', 'operational & sla analytics'],
    partialKeywords: ['process improvement', 'operations', 'sla', 'incident management', 'service delivery']
  },
  {
    id: 'executive-storytelling',
    name: 'Executive Decision Storytelling',
    category: 'BUSINESS_CAPABILITY',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: 'Translating quantitative anomalies into structured What Matters → What Changed → Why → What To Do Next management narratives.',
    keywords: ['executive storytelling', 'stakeholder communication', 'business presentation', 'executive reporting', 'data storytelling', 'decision intelligence'],
    partialKeywords: ['communication', 'storytelling', 'presentation', 'business insights', 'recommendations']
  },

  // SQL & Relational Data Architecture
  {
    id: 'star-schema-dimensional',
    name: 'Star-Schema & Dimensional Modeling',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Multi-table star schema with central incident fact table connected to agent, category, priority, and date dimension tables with surrogate keys.',
    keywords: ['star schema', 'dimensional modeling', 'fact table', 'dimension table', 'data modeling', 'surrogate keys', 'schema design', 'dw modeling'],
    partialKeywords: ['data warehouse', 'normalization', 'schema', 'relational design']
  },
  {
    id: 'sql-querying',
    name: 'SQL (PostgreSQL / MySQL)',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: 'Complex SQL queries, window functions (ROW_NUMBER, DENSE_RANK), multi-table CTEs, self-joins, and aggregations across 50,000+ retail order rows.',
    keywords: ['sql', 'postgresql', 'postgres', 'mysql', 'window functions', 'cte', 'joins', 'group by', 'relational database', 'complex sql'],
    partialKeywords: ['database', 'queries', 'relational', 'dbms']
  },
  {
    id: 'data-normalization',
    name: 'Relational Data Normalization',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: '3NF relational normalization to eliminate redundancy across IT support queues and transaction logs.',
    keywords: ['normalization', '3nf', 'third normal form', 'database normalization', 'relational normalization'],
    partialKeywords: ['data integrity', 'redundancy elimination']
  },

  // Python & Statistical Modeling
  {
    id: 'python-pandas-numpy',
    name: 'Python (Pandas & NumPy)',
    category: 'TOOL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Automated data wrangling, group-by aggregations, missing value profiling, and vector operations across 10,000+ incident ticket logs.',
    keywords: ['python', 'pandas', 'numpy', 'python scripting', 'data manipulation', 'data wrangling'],
    partialKeywords: ['jupyter', 'data analysis', 'scripting']
  },
  {
    id: 'scikit-learn-regression',
    name: 'Statistical Modeling & Regression (Scikit-Learn)',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Ordinary Least Squares (OLS) and regression modeling to predict incident resolution duration based on tier, priority, and team assignment.',
    keywords: ['scikit learn', 'scikit-learn', 'sklearn', 'regression', 'ols', 'predictive modeling', 'statistical modeling', 'linear regression'],
    partialKeywords: ['machine learning', 'ml', 'statistics', 'predictive analytics']
  },
  {
    id: 'exploratory-data-analysis',
    name: 'Exploratory Data Analysis (EDA)',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Correlation matrices, distribution skewness checks, outlier detection, and IQR filtering.',
    keywords: ['eda', 'exploratory data analysis', 'outlier detection', 'correlation matrix', 'distribution analysis'],
    partialKeywords: ['data exploration', 'hypothesis testing', 'statistical analysis']
  },
  {
    id: 'matplotlib-seaborn',
    name: 'Python Data Visualization (Matplotlib & Seaborn)',
    category: 'TOOL',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'Statistical distribution plotting, regression residual analysis, correlation heatmaps, and publication-ready charts.',
    keywords: ['matplotlib', 'seaborn', 'python visualization', 'heatmaps', 'distribution plotting'],
    partialKeywords: ['charts', 'plotting', 'data visualization']
  },

  // Data Governance & Quality
  {
    id: 'data-governance-protocol',
    name: 'Data Governance (PRESERVE → DOCUMENT → FLAG → GOVERN)',
    category: 'BUSINESS_CAPABILITY',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: 'Zero silent data imputation; unmapped channels preserved explicitly as Unspecified; strict lineage tracing.',
    keywords: ['data governance', 'governance framework', 'data quality', 'zero imputation', 'data lineage', 'data stewardship', 'metadata management'],
    partialKeywords: ['governance', 'compliance', 'audit trail']
  },
  {
    id: 'forensic-reconciliation',
    name: 'Forensic Transaction Reconciliation',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: '15,630 exception occurrences audited across 14,156 unique orders across 10 controlled reconciliation rules.',
    keywords: ['forensic reconciliation', 'data reconciliation', 'reconciliation', 'exception tracking', 'transaction audit', 'ledger audit'],
    partialKeywords: ['audit', 'discrepancy detection', 'reconciliation checks']
  },
  {
    id: 'validation-controls',
    name: 'Automated Validation Control Design',
    category: 'TECHNICAL_SKILL',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: '10 automated validation controls (DQ-01 to DQ-10) checking ledger imbalances, negative values, and attribution gaps.',
    keywords: ['validation controls', 'data validation', 'quality controls', 'dq rules', 'automated controls', 'control design'],
    partialKeywords: ['controls', 'validation', 'quality checks']
  },
  {
    id: 'financial-control-audit',
    name: 'Financial Control DQ-10 Ledger Audit',
    category: 'FINANCIAL_KNOWLEDGE',
    primaryProject: 'stratos-governance',
    projectTitle: 'STRATOS AI Governance',
    evidenceText: 'Surfacing Net Revenue > Gross Revenue controlled total anomaly transparently as REVIEW without synthetic force-balancing.',
    keywords: ['financial controls', 'dq-10', 'revenue recognition', 'ledger control', 'accounting audit', 'internal controls'],
    partialKeywords: ['financial audit', 'ledger', 'accounting controls']
  },

  // Operational Platforms & Tools
  {
    id: 'advanced-excel',
    name: 'Advanced Microsoft Excel Modeling',
    category: 'TOOL',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: 'Complex financial workbooks, Goal Seek, two-way Data Tables, INDEX/MATCH, XLOOKUP, dynamic schedules, and cell audit documentation.',
    keywords: ['excel', 'advanced excel', 'microsoft excel', 'spreadsheet modeling', 'xlookup', 'index match', 'data tables', 'goal seek'],
    partialKeywords: ['spreadsheets', 'vlookup', 'pivots', 'pivot tables']
  },
  {
    id: 'version-control-git',
    name: 'Version Control (Git & GitHub)',
    category: 'TOOL',
    primaryProject: 'equitrack-analytics-os',
    projectTitle: 'EquiTrack OS',
    evidenceText: 'Branch management, semantic commits, GitHub Actions CI workflows, and multi-developer repository hygiene.',
    keywords: ['git', 'github', 'version control', 'ci/cd', 'github actions', 'branch management'],
    partialKeywords: ['gitlab', 'vcs', 'repo']
  },
  {
    id: 'react-typescript',
    name: 'Frontend & UI Development (React 18 & TypeScript)',
    category: 'TOOL',
    primaryProject: 'equitrack-analytics-os',
    projectTitle: 'EquiTrack OS',
    evidenceText: 'Interactive analytical dashboards, Canvas 2D graphics, strict typecheck, and Vite production bundle optimization.',
    keywords: ['react', 'typescript', 'vite', 'javascript', 'frontend development', 'ui development', 'web development'],
    partialKeywords: ['html', 'css', 'tailwind', 'front end']
  },
  {
    id: 'sports-video-tracking',
    name: 'Computer Vision & Match Event Tagging',
    category: 'DOMAIN_KNOWLEDGE',
    primaryProject: 'spiideo-sports-analytics',
    projectTitle: 'Spiideo Sports',
    evidenceText: 'Multi-camera match event tagging, spatial coordinate alignment, and quality assurance during professional sports analytics internship.',
    keywords: ['spiideo', 'sports analytics', 'event tagging', 'video analytics', 'coordinate tracking', 'match analysis'],
    partialKeywords: ['tracking', 'video analysis', 'sports data']
  },

  // Education & Academic Background
  {
    id: 'mba-business-analytics',
    name: 'MBA in Business Analytics',
    category: 'EXPERIENCE_QUALIFICATION',
    primaryProject: 'phonepe-valuation',
    projectTitle: 'PhonePe Valuation',
    evidenceText: 'MBA candidate in Business Analytics (Sandip University, 2025-2027 Cohort) combining finance, operational analytics, and database systems.',
    keywords: ['mba', 'master of business administration', 'business analytics degree', 'mba candidate', 'postgraduate business'],
    partialKeywords: ['masters', 'business administration', 'degree in analytics']
  },
  {
    id: 'bsc-computer-science',
    name: 'BSc in Computer Science',
    category: 'EXPERIENCE_QUALIFICATION',
    primaryProject: 'it-support-analytics',
    projectTitle: 'IT Support Intelligence',
    evidenceText: 'BSc in Computer Science (Kamla Nehru Mahavidyalaya, Nagpur, 2021-2025) providing foundational software, database, and algorithm engineering.',
    keywords: ['bsc computer science', 'computer science degree', 'bachelor of science', 'cs degree', 'computer science graduate'],
    partialKeywords: ['bachelor', 'undergraduate', 'b.sc', 'bsc']
  }
];

export interface RequirementMatchResult {
  jobRequirement: string;
  category: RequirementCategory;
  verdict: RequirementVerdict;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedEvidence: string | null;
  supportingProject: {
    id: string;
    title: string;
  } | null;
  supportingSkillName: string | null;
  explanation: string;
}

export interface MatchAnalysisReport {
  jobTitle?: string;
  company?: string;
  timestamp: string;
  inputWordCount: number;
  totalRequirementsEvaluated: number;
  demonstratedCount: number;
  partialCount: number;
  gapCount: number;
  coveragePercentage: number;
  calculationExplanation: string;
  topMatchingProjects: Array<{
    id: string;
    title: string;
    matchedRequirementsCount: number;
    demonstratedSkills: string[];
  }>;
  relevantSkills: string[];
  identifiedGaps: string[];
  recommendedPreparationTopics: string[];
  resumeAlignmentSuggestions: string[];
  requirementMatches: RequirementMatchResult[];
}
