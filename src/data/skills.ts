export interface SkillItem {
  name: string;
  context: string;
  evidence: string;
  isCoreTool?: boolean;
}

export interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'TrendingUp' | 'BarChart3' | 'Database' | 'Code2' | 'ShieldCheck' | 'Cpu';
  accent: string;
  skills: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'financial-valuation',
    title: 'Financial Valuation & Corporate Modeling',
    subtitle: 'Quantitative DCF, capital structure, and investment multiples',
    iconName: 'TrendingUp',
    accent: 'border-red-500/30 hover:border-red-500/50',
    skills: [
      { name: 'DCF Modeling', context: '5-year explicit FCFF forecasting, mid-year discounting, working capital schedules', evidence: 'PhonePe Pre-IPO DCF Workbook', isCoreTool: true },
      { name: 'CAPM / WACC Analysis', context: 'Beta estimation (1.35), risk-free rate calibration, market equity risk premium', evidence: 'PhonePe Cost of Capital (14.92%)' },
      { name: 'Terminal Value Reconciliation', context: 'Gordon Growth perpetuity vs. Exit Multiple (13.15x EBITDA) blending', evidence: '₹19,554 Cr PV Terminal Value' },
      { name: 'EV-to-Equity Bridge', context: 'Liquid investments, treasury cash additions, debt obligation deductions', evidence: '₹41,631 Cr Implied Equity Value' },
      { name: 'Sensitivity & Scenario Matrix', context: 'Multi-variable WACC and exit multiple flex tables with bull/base/bear cases', evidence: 'PhonePe Scenario Module' },
      { name: 'FinTech Unit Economics', context: 'Customer acquisition cost (CAC) vs. LTV horizon, Basel III capital adequacy', evidence: 'SmartBank 360 Credibility Report' }
    ]
  },
  {
    id: 'data-analytics-bi',
    title: 'Analytics & Business Intelligence',
    subtitle: 'Descriptive, diagnostic, and decision intelligence pipelines',
    iconName: 'BarChart3',
    accent: 'border-emerald-500/30 hover:border-emerald-500/50',
    skills: [
      { name: 'Power BI & DAX', context: 'Calculated measures for MTTA, MTTR, SLA compliance, moving averages', evidence: 'IT Support Incident Analytics', isCoreTool: true },
      { name: 'KPI Tree Modeling', context: '30/30 corporate KPI traceability from revenue down to unit conversion', evidence: 'STRATOS AI KPI Engine', isCoreTool: true },
      { name: 'Operational Bottleneck Detection', context: 'Queue theory, shift-change handover variance, tier escalation latency', evidence: '10,000+ Support Ticket Logs' },
      { name: 'Executive Storytelling', context: 'Translating quantitative anomalies into What Matters → What Changed → Why', evidence: 'STRATOS Decision Architecture' }
    ]
  },
  {
    id: 'sql-data-management',
    title: 'SQL & Relational Data Architecture',
    subtitle: 'Star-schema dimensional modeling and query execution',
    iconName: 'Database',
    accent: 'border-blue-500/30 hover:border-blue-500/50',
    skills: [
      { name: 'Star-Schema Architecture', context: 'Fact tables linked to normalized dimension tables (Category, Department, Agent)', evidence: 'MySQL Fact_Tickets Schema', isCoreTool: true },
      { name: 'Relational Modeling (MySQL / PostgreSQL)', context: 'Primary/foreign key constraints, indexing for aggregations, referential integrity', evidence: 'IT Support Database & STRATOS', isCoreTool: true },
      { name: 'Complex SQL Aggregations', context: 'Window functions, CTEs, partition-by time series groupings, joins', evidence: 'Forensic Transaction Reconciliation', isCoreTool: true },
      { name: 'Data Normalization', context: '3NF normalization reducing redundancy while supporting analytical star schemas', evidence: 'Undergraduate Database Foundations' }
    ]
  },
  {
    id: 'python-statistical',
    title: 'Python & Statistical Modeling',
    subtitle: 'Data manipulation, regression modeling, and pipeline automation',
    iconName: 'Code2',
    accent: 'border-amber-500/30 hover:border-amber-500/50',
    skills: [
      { name: 'Pandas & NumPy', context: 'Data cleaning, pivot tables, vectorized operations, missingness profiling', evidence: '10,000+ Incident Ticket Dataset', isCoreTool: true },
      { name: 'Scikit-Learn Regression', context: 'Ordinary Least Squares (OLS) and tree ensembles for duration driver prediction', evidence: 'IT Ticket Duration Regression' },
      { name: 'Exploratory Data Analysis (EDA)', context: 'Correlation matrices, distribution skewness checks, outlier detection', evidence: 'Academic Dissertation Pipeline' },
      { name: 'Matplotlib & Seaborn', context: 'Statistical distribution plotting, regression residuals, heatmaps', evidence: 'Python Analytics Notebooks' }
    ]
  },
  {
    id: 'data-governance-quality',
    title: 'Data Governance & Financial Integrity',
    subtitle: 'Audit exception tracking and controlled total reconciliation',
    iconName: 'ShieldCheck',
    accent: 'border-purple-500/30 hover:border-purple-500/50',
    skills: [
      { name: 'PRESERVE → DOCUMENT → FLAG → GOVERN', context: 'Zero silent data imputation; unmapped channels preserved as Unspecified', evidence: 'STRATOS Core Governance Protocol', isCoreTool: true },
      { name: 'Forensic Data Reconciliation', context: '14,465 financial exception occurrences audited across 12,787 orders', evidence: 'STRATOS Transaction Audit', isCoreTool: true },
      { name: 'Validation Control Design', context: '11 automated validation controls covering ledger imbalances and attribution gaps', evidence: 'Control Ledger Systems (DQ-10)', isCoreTool: true },
      { name: 'Financial Control DQ-10 Audit', context: 'Surfacing Net Revenue > Gross Revenue anomalies transparently as REVIEW', evidence: 'PhonePe & STRATOS Model Audits' }
    ]
  },
  {
    id: 'operational-platforms',
    title: 'Operational Platforms & Technical Tools',
    subtitle: 'Enterprise software, tracking platforms, and front-end tools',
    iconName: 'Cpu',
    accent: 'border-cyan-500/30 hover:border-cyan-500/50',
    skills: [
      { name: 'Spiideo Camera & Tracking Systems', context: 'Multi-camera match event tagging, spatial coordinate alignment, quality assurance', evidence: 'SPIIDEO Sports Analytics Internship' },
      { name: 'Microsoft Excel Advanced Modeling', context: 'Financial workbooks, Goal Seek, Data Tables, index/match, financial formulas', evidence: 'DCF of PhonePe.xlsx Audit', isCoreTool: true },
      { name: 'Version Control (Git & GitHub)', context: 'Branch management, semantic commits, GitHub repository deployment', evidence: 'kaustubh-portfolio Repository' },
      { name: 'React 18 & TypeScript', context: 'Interactive analytical dashboards, Canvas 2D graphics, Vite build pipeline', evidence: 'Portfolio & STRATOS Prototype', isCoreTool: true }
    ]
  }
];

export const getCoreResumeSkills = (): string[] => {
  const tools = new Set<string>();
  skillGroups.forEach((group) => {
    group.skills.forEach((skill) => {
      if (skill.isCoreTool) {
        tools.add(skill.name);
      }
    });
  });
  return Array.from(tools);
};

export interface ResumeSkillCategory {
  category: string;
  skills: string[];
}

export const getResumeSkillCategories = (): ResumeSkillCategory[] => [
  {
    category: 'Analytics & Business Intelligence',
    skills: ['Power BI & DAX', 'SQL (PostgreSQL, MySQL)', 'Star-Schema Dimensional Modeling', 'KPI Tree Architecture', 'Data Pipeline QA']
  },
  {
    category: 'Financial Valuation & Corporate Modeling',
    skills: ['DCF Modeling', 'CAPM / WACC Analysis', 'EV/EBITDA Multiples', 'EV-to-Equity Bridge', 'Scenario & Sensitivity Matrix']
  },
  {
    category: 'Python & Statistical Modeling',
    skills: ['Python (Pandas, NumPy, Scikit-Learn)', 'OLS Regression', 'Exploratory Data Analysis (EDA)', 'Statistical Data Profiling']
  },
  {
    category: 'Data Governance & Financial Integrity',
    skills: ['PRESERVE → DOCUMENT → FLAG → GOVERN', 'Forensic Data Reconciliation', 'Validation Control Design (DQ-10)', 'Audit Ledger Architecture']
  },
  {
    category: 'Platforms & Tools',
    skills: ['Advanced Excel Modeling', 'Spiideo Sports Tracking Systems', 'Git & GitHub', 'REST APIs', 'React 18 & TypeScript']
  }
];

