export interface TelemetryMetric {
  id: string;
  value: string;
  unit?: string;
  label: string;
  category: 'Valuation' | 'Data Quality' | 'Database Architecture' | 'Event Analytics';
  type: 'Financial Model Output' | 'Governed Dataset Volume' | 'Relational Architecture Volume';
  sourceFile: string;
  sourceLocation: string;
  extractionMethod: string;
  contextAndCaveats: string;
  targetSectionHref: string;
}

export const telemetryMetrics: TelemetryMetric[] = [
  {
    id: 'phonepe-implied-equity',
    value: '₹41,631',
    unit: 'Cr',
    label: 'Model-Implied Equity Value',
    category: 'Valuation',
    type: 'Financial Model Output',
    sourceFile: 'scripts/phonepe_valuation.py',
    sourceLocation: 'Flagship Section (02) & Excel Model (MCA/NPCI public data)',
    extractionMethod: 'PhonePe educational 5-year explicit DCF (FY26E–FY30E) discounted at 14.92% CAPM WACC, plus ₹8,915.23 Cr liquid assets less ₹716.00 Cr debt = +₹8,199.23 Cr net liquidity.',
    contextAndCaveats: 'Method: 5-year explicit DCF (FY26E–FY30E) | Discount Rate: 14.92% WACC | Terminal Value: Exit Multiple & Perpetuity Blend. Independent educational model output.',
    targetSectionHref: '#flagship'
  },
  {
    id: 'stratos-order-governance',
    value: '50,000',
    unit: 'Orders',
    label: 'Audited Order Transactions',
    category: 'Data Quality',
    type: 'Governed Dataset Volume',
    sourceFile: 'src/data/projects.ts',
    sourceLocation: 'STRATOS Case Study (03) • DQ Audit Register',
    extractionMethod: 'Total audited transaction corpus of 50,000 orders across 10 validation controls (DQ-01–DQ-10), uncovering 15,630 exception flags across 14,156 unique orders.',
    contextAndCaveats: 'Audit Scope: 50,000 total orders evaluated | Affected Volume: 14,156 unique orders flagged | Exception Count: 15,630 rule breaches across 10 controls.',
    targetSectionHref: '#projects'
  },
  {
    id: 'mysql-support-pipeline',
    value: '8,000',
    unit: 'Tickets',
    label: 'Support Tickets Modeled',
    category: 'Database Architecture',
    type: 'Relational Architecture Volume',
    sourceFile: 'src/data/projects.ts',
    sourceLocation: 'IT Support Analytics Platform Case Study',
    extractionMethod: 'Star-schema dimensional warehouse modeling (tickets fact + 5 conformed dimensions), calendar-hour SLA compliance evaluation (87.9%), and intake duration prediction.',
    contextAndCaveats: 'Dataset Scope: 8,000 synthetic ticket transactions (CY 2024) | Completed: 6,612 (87.9% SLA) | Backlog: 1,388 open tickets.',
    targetSectionHref: '#projects'
  },
  {
    id: 'spiideo-sports-tracking',
    value: '100%',
    unit: 'Match QC',
    label: 'Sports Tracking Event Validation',
    category: 'Event Analytics',
    type: 'Governed Dataset Volume',
    sourceFile: 'src/config/portfolio.ts',
    sourceLocation: 'Experience Section: Sports Data Analyst Intern @ SPIIDEO',
    extractionMethod: 'Video tracking annotation and multi-stage verification for soccer and field hockey matches.',
    contextAndCaveats: 'Professional internship operational quality control on recorded match event feeds.',
    targetSectionHref: '#journey'
  }
];
