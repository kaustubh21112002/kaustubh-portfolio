// Serverless Endpoint: Financial Statement & Working Capital Command Center
// Serves liquidity metrics, working capital ratios, DSCR coverage, and cash runway projections

import { neon } from '@neondatabase/serverless';
import { setStandardSecurityHeaders } from '../../server/lib/rateLimiter.js';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  end: () => void;
}

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export interface FinancialRecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  sector: string;
  cash_runway_months: number;
  working_capital_ratio: number;
  quick_ratio: number;
  dscr: number;
  monthly_burn_rate_inr: number;
  operating_cash_flow_inr: number;
  liquidity_risk_status: 'LIQUIDITY_OPTIMAL' | 'MONITOR_RUNWAY' | 'CAPITAL_STRESS';
  last_audit_at: string;
  created_at: string;
}

export interface FinanceSummary {
  totalEntities: number;
  avgRunwayMonths: number;
  avgWorkingCapitalRatio: number;
  avgQuickRatio: number;
  avgDscr: number;
  totalOperatingCashFlowInr: number;
  totalMonthlyBurnInr: number;
}

const FALLBACK_FINANCE: FinancialRecord[] = [
  {
    id: 1,
    enterprise_id: 'FIN-CORP-01',
    enterprise_name: 'Bharat Tech Logistics Core',
    sector: 'Enterprise Logistics',
    cash_runway_months: 22.4,
    working_capital_ratio: 2.15,
    quick_ratio: 1.78,
    dscr: 2.65,
    monthly_burn_rate_inr: 2400000.00,
    operating_cash_flow_inr: 5800000.00,
    liquidity_risk_status: 'LIQUIDITY_OPTIMAL',
    last_audit_at: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 2,
    enterprise_id: 'FIN-CORP-02',
    enterprise_name: 'Deccan Cloud & Colocation',
    sector: 'Data Center Infrastructure',
    cash_runway_months: 16.8,
    working_capital_ratio: 1.82,
    quick_ratio: 1.45,
    dscr: 2.10,
    monthly_burn_rate_inr: 3100000.00,
    operating_cash_flow_inr: 4900000.00,
    liquidity_risk_status: 'LIQUIDITY_OPTIMAL',
    last_audit_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 45 * 86400 * 1000).toISOString()
  },
  {
    id: 3,
    enterprise_id: 'FIN-CORP-03',
    enterprise_name: 'Sahyadri Precision Robotics',
    sector: 'Industrial Robotics',
    cash_runway_months: 11.2,
    working_capital_ratio: 1.35,
    quick_ratio: 0.95,
    dscr: 1.45,
    monthly_burn_rate_inr: 1850000.00,
    operating_cash_flow_inr: 2100000.00,
    liquidity_risk_status: 'MONITOR_RUNWAY',
    last_audit_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  {
    id: 4,
    enterprise_id: 'FIN-CORP-04',
    enterprise_name: 'Maratha Specialty Chemicals',
    sector: 'Advanced Polymers',
    cash_runway_months: 8.4,
    working_capital_ratio: 1.15,
    quick_ratio: 0.78,
    dscr: 1.18,
    monthly_burn_rate_inr: 2200000.00,
    operating_cash_flow_inr: 1950000.00,
    liquidity_risk_status: 'CAPITAL_STRESS',
    last_audit_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 86400 * 1000).toISOString()
  },
  {
    id: 5,
    enterprise_id: 'FIN-CORP-05',
    enterprise_name: 'Godavari Agro-Exporters',
    sector: 'Cold Storage & Agro-Supply',
    cash_runway_months: 28.5,
    working_capital_ratio: 2.45,
    quick_ratio: 1.92,
    dscr: 3.10,
    monthly_burn_rate_inr: 1400000.00,
    operating_cash_flow_inr: 4100000.00,
    liquidity_risk_status: 'LIQUIDITY_OPTIMAL',
    last_audit_at: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  },
  {
    id: 6,
    enterprise_id: 'FIN-CORP-06',
    enterprise_name: 'Vidarbha Steel Fab & Tube',
    sector: 'Heavy Metal Fabrication',
    cash_runway_months: 14.1,
    working_capital_ratio: 1.65,
    quick_ratio: 1.25,
    dscr: 1.85,
    monthly_burn_rate_inr: 2600000.00,
    operating_cash_flow_inr: 3600000.00,
    liquidity_risk_status: 'LIQUIDITY_OPTIMAL',
    last_audit_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
];

function computeFinanceSummary(records: FinancialRecord[]): FinanceSummary {
  const totalEntities = records.length;
  const avgRunwayMonths = Number(
    (records.reduce((sum, r) => sum + r.cash_runway_months, 0) / totalEntities).toFixed(1)
  );
  const avgWorkingCapitalRatio = Number(
    (records.reduce((sum, r) => sum + r.working_capital_ratio, 0) / totalEntities).toFixed(2)
  );
  const avgQuickRatio = Number(
    (records.reduce((sum, r) => sum + r.quick_ratio, 0) / totalEntities).toFixed(2)
  );
  const avgDscr = Number(
    (records.reduce((sum, r) => sum + r.dscr, 0) / totalEntities).toFixed(2)
  );
  const totalOperatingCashFlowInr = records.reduce((sum, r) => sum + r.operating_cash_flow_inr, 0);
  const totalMonthlyBurnInr = records.reduce((sum, r) => sum + r.monthly_burn_rate_inr, 0);

  return {
    totalEntities,
    avgRunwayMonths,
    avgWorkingCapitalRatio,
    avgQuickRatio,
    avgDscr,
    totalOperatingCashFlowInr,
    totalMonthlyBurnInr
  };
}

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS financial_analytics (
      id BIGSERIAL PRIMARY KEY,
      enterprise_id VARCHAR(32) NOT NULL UNIQUE,
      enterprise_name VARCHAR(128) NOT NULL,
      sector VARCHAR(64) NOT NULL,
      cash_runway_months NUMERIC(4, 1) NOT NULL DEFAULT 14.5,
      working_capital_ratio NUMERIC(4, 2) NOT NULL DEFAULT 1.85,
      quick_ratio NUMERIC(4, 2) NOT NULL DEFAULT 1.42,
      dscr NUMERIC(4, 2) NOT NULL DEFAULT 2.15,
      monthly_burn_rate_inr NUMERIC(12, 2) NOT NULL DEFAULT 1850000.00,
      operating_cash_flow_inr NUMERIC(12, 2) NOT NULL DEFAULT 3200000.00,
      liquidity_risk_status VARCHAR(32) NOT NULL DEFAULT 'LIQUIDITY_OPTIMAL',
      last_audit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setStandardSecurityHeaders(res);
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are permitted.'
    });
    return;
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!dbUrl) {
    res.status(200).json({
      success: true,
      source: 'LOCAL_FALLBACK',
      records: FALLBACK_FINANCE,
      summary: computeFinanceSummary(FALLBACK_FINANCE)
    });
    return;
  }

  try {
    const sql = neon(dbUrl);
    await ensureTableInitialized(sql);

    const rows = await sql`
      SELECT 
        id,
        enterprise_id,
        enterprise_name,
        sector,
        cash_runway_months::float as cash_runway_months,
        working_capital_ratio::float as working_capital_ratio,
        quick_ratio::float as quick_ratio,
        dscr::float as dscr,
        monthly_burn_rate_inr::float as monthly_burn_rate_inr,
        operating_cash_flow_inr::float as operating_cash_flow_inr,
        liquidity_risk_status,
        last_audit_at::text,
        created_at::text
      FROM financial_analytics
      ORDER BY cash_runway_months DESC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      for (const r of FALLBACK_FINANCE) {
        await sql`
          INSERT INTO financial_analytics (
            enterprise_id, enterprise_name, sector, cash_runway_months, working_capital_ratio, quick_ratio, dscr, monthly_burn_rate_inr, operating_cash_flow_inr, liquidity_risk_status
          ) VALUES (
            ${r.enterprise_id}, ${r.enterprise_name}, ${r.sector}, ${r.cash_runway_months}, ${r.working_capital_ratio}, ${r.quick_ratio}, ${r.dscr}, ${r.monthly_burn_rate_inr}, ${r.operating_cash_flow_inr}, ${r.liquidity_risk_status}
          );
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        records: FALLBACK_FINANCE,
        summary: computeFinanceSummary(FALLBACK_FINANCE)
      });
      return;
    }

    const records: FinancialRecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      enterprise_id: String(r.enterprise_id),
      enterprise_name: String(r.enterprise_name),
      sector: String(r.sector),
      cash_runway_months: Number(r.cash_runway_months),
      working_capital_ratio: Number(r.working_capital_ratio),
      quick_ratio: Number(r.quick_ratio),
      dscr: Number(r.dscr),
      monthly_burn_rate_inr: Number(r.monthly_burn_rate_inr),
      operating_cash_flow_inr: Number(r.operating_cash_flow_inr),
      liquidity_risk_status: r.liquidity_risk_status as FinancialRecord['liquidity_risk_status'],
      last_audit_at: String(r.last_audit_at),
      created_at: String(r.created_at)
    }));

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      records,
      summary: computeFinanceSummary(records)
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      records: FALLBACK_FINANCE,
      summary: computeFinanceSummary(FALLBACK_FINANCE),
      warning: error?.message || 'Database query failed; served fallback telemetry.'
    });
  }
}
