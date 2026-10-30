export type ValuationScenarioId = 'bear' | 'base' | 'bull';

export interface ScenarioDefinition {
  id: ValuationScenarioId;
  name: string;
  subtitle: string;
  cagr: string;
  revenueCagr: string;
  exitMultiple: number;
  exitMultipleLabel: string;
  wacc: number;
  waccLabel: string;
  enterpriseValue: number;
  netLiquidity: number;
  equityValue: number;
  sharesOutstanding: number;
  sharePrice: string;
  description: string;
  catalysts: string[];
  risks: string[];
}

export const PHONEPE_SCENARIO_DEFINITIONS: Record<ValuationScenarioId, ScenarioDefinition> = {
  bear: {
    id: 'bear',
    name: 'Bear Case',
    subtitle: 'Regulatory Throttling & Slower Expansion',
    cagr: '18.0%',
    revenueCagr: '18.0%',
    exitMultiple: 10.0,
    exitMultipleLabel: '10.00x',
    wacc: 14.92,
    waccLabel: '14.92%',
    enterpriseValue: 24500,
    netLiquidity: 8199,
    equityValue: 32699,
    sharesOutstanding: 50.66,
    sharePrice: '645.46',
    description: 'Models NPCI UPI 30% volume cap enforcement, slowing user acquisition, and lower cross-sell margins.',
    catalysts: [
      'Digital lending conversion stays constrained below 1.5%',
      'Merchant POS / Soundbox attrition rises under intense bank competition',
      'NPCI volume cap enforcement restricts payment processing market share'
    ],
    risks: ['Severe margin contraction', 'Hardware subsidization pressure']
  },
  base: {
    id: 'base',
    name: 'Base Case (Workbook Baseline)',
    subtitle: 'Governed Model Target & Stable Execution',
    cagr: '27.0%',
    revenueCagr: '27.0%',
    exitMultiple: 13.15,
    exitMultipleLabel: '13.15x',
    wacc: 14.92,
    waccLabel: '14.92%',
    enterpriseValue: 33432,
    netLiquidity: 8199,
    equityValue: 41631,
    sharesOutstanding: 50.66,
    sharePrice: '821.78',
    description: 'Reconciled model baseline with sustained UPI market leadership (~48.5%) and scaling merchant subscriptions.',
    catalysts: [
      'Stable ~48.5% UPI volume dominance with deferred market cap deadlines',
      'Merchant SmartSpeaker installed base reaches 7.5M+ devices by FY28E',
      'Digital lending credit disbursement scales steadily at 3.5% conversion'
    ],
    risks: ['Competitive rate pressures', 'Fintech compliance tightening']
  },
  bull: {
    id: 'bull',
    name: 'Bull Case',
    subtitle: 'Accelerated Financial Services & Ecosystem Flywheel',
    cagr: '38.0%',
    revenueCagr: '38.0%',
    exitMultiple: 16.0,
    exitMultipleLabel: '16.00x',
    wacc: 14.92,
    waccLabel: '14.92%',
    enterpriseValue: 45800,
    netLiquidity: 8199,
    equityValue: 53999,
    sharesOutstanding: 50.66,
    sharePrice: '1,065.91',
    description: 'Captures MDR merchant monetization tailwinds, rapid Pincode adoption, and high-margin credit distribution.',
    catalysts: [
      'Regulatory approvals allow merchant MDR incentive sharing across QR rails',
      'Pincode (hyperlocal ONDC) and Share.Market scale to meaningful market shares',
      'Credit facilitation and insurance distribution generate 60%+ contribution margins'
    ],
    risks: ['High growth reinvestment requirements', 'Macro credit cycles']
  }
};
