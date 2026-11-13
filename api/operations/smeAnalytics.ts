// Serverless Endpoint: Predictive SME Analytics & Digital Transformation Hub
// Serves MSME digital maturity benchmarks, predictive maintenance risk metrics, and cost savings telemetry

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

export interface SMERecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  sector: string;
  digital_maturity_score: number;
  equipment_failure_probability: number;
  predictive_savings_inr: number;
  downtime_hours_prevented: number;
  compliance_status: 'GOVERNED_COMPLIANT' | 'MONITORING_REQUIRED' | 'REVIEW_PENDING';
  last_assessment_at: string;
  created_at: string;
}

export interface SMESummary {
  totalEnterprises: number;
  avgMaturityScore: number;
  avgFailureProbability: number;
  totalSavingsInr: number;
  totalDowntimeHoursSaved: number;
  compliantRatioPct: number;
}

const FALLBACK_SMES: SMERecord[] = [
  {
    id: 1,
    enterprise_id: 'SME-PUN-01',
    enterprise_name: 'Sahyadri Precision Auto-Components',
    sector: 'Automotive Precision Engineering',
    digital_maturity_score: 84,
    equipment_failure_probability: 0.032,
    predictive_savings_inr: 620000.00,
    downtime_hours_prevented: 72,
    compliance_status: 'GOVERNED_COMPLIANT',
    last_assessment_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 2,
    enterprise_id: 'SME-AUR-02',
    enterprise_name: 'Marathwada Agro-Processing Unit',
    sector: 'Food & Agro Processing',
    digital_maturity_score: 62,
    equipment_failure_probability: 0.125,
    predictive_savings_inr: 340000.00,
    downtime_hours_prevented: 38,
    compliance_status: 'MONITORING_REQUIRED',
    last_assessment_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 40 * 86400 * 1000).toISOString()
  },
  {
    id: 3,
    enterprise_id: 'SME-THN-03',
    enterprise_name: 'Konkan Specialty Polymers',
    sector: 'Chemical & Industrial Polymers',
    digital_maturity_score: 78,
    equipment_failure_probability: 0.048,
    predictive_savings_inr: 510000.00,
    downtime_hours_prevented: 56,
    compliance_status: 'GOVERNED_COMPLIANT',
    last_assessment_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  {
    id: 4,
    enterprise_id: 'SME-NAS-04',
    enterprise_name: 'Godavari Packaging Technologies',
    sector: 'Packaging & Paper Systems',
    digital_maturity_score: 58,
    equipment_failure_probability: 0.142,
    predictive_savings_inr: 290000.00,
    downtime_hours_prevented: 32,
    compliance_status: 'REVIEW_PENDING',
    last_assessment_at: new Date(Date.now() - 8 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 50 * 86400 * 1000).toISOString()
  },
  {
    id: 5,
    enterprise_id: 'SME-KOL-05',
    enterprise_name: 'Deccan Heavy Foundry Solutions',
    sector: 'Metal Casting & Fabrication',
    digital_maturity_score: 71,
    equipment_failure_probability: 0.075,
    predictive_savings_inr: 480000.00,
    downtime_hours_prevented: 46,
    compliance_status: 'GOVERNED_COMPLIANT',
    last_assessment_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  },
  {
    id: 6,
    enterprise_id: 'SME-NAG-06',
    enterprise_name: 'Vidarbha Logistics & Storage Hub',
    sector: 'Cold Storage & Warehousing',
    digital_maturity_score: 88,
    equipment_failure_probability: 0.021,
    predictive_savings_inr: 740000.00,
    downtime_hours_prevented: 84,
    compliance_status: 'GOVERNED_COMPLIANT',
    last_assessment_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
];

function computeSMESummary(enterprises: SMERecord[]): SMESummary {
  const totalEnterprises = enterprises.length;
  const avgMaturityScore = Math.round(
    enterprises.reduce((sum, e) => sum + e.digital_maturity_score, 0) / totalEnterprises
  );
  const avgFailureProbability = Number(
    (enterprises.reduce((sum, e) => sum + e.equipment_failure_probability, 0) / totalEnterprises).toFixed(3)
  );
  const totalSavingsInr = enterprises.reduce((sum, e) => sum + e.predictive_savings_inr, 0);
  const totalDowntimeHoursSaved = enterprises.reduce((sum, e) => sum + e.downtime_hours_prevented, 0);
  const compliantCount = enterprises.filter(e => e.compliance_status === 'GOVERNED_COMPLIANT').length;
  const compliantRatioPct = Math.round((compliantCount / totalEnterprises) * 100);

  return {
    totalEnterprises,
    avgMaturityScore,
    avgFailureProbability,
    totalSavingsInr,
    totalDowntimeHoursSaved,
    compliantRatioPct
  };
}

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS sme_analytics (
      id BIGSERIAL PRIMARY KEY,
      enterprise_id VARCHAR(32) NOT NULL UNIQUE,
      enterprise_name VARCHAR(128) NOT NULL,
      sector VARCHAR(64) NOT NULL,
      digital_maturity_score INTEGER NOT NULL DEFAULT 65,
      equipment_failure_probability NUMERIC(4, 3) NOT NULL DEFAULT 0.085,
      predictive_savings_inr NUMERIC(12, 2) NOT NULL DEFAULT 450000.00,
      downtime_hours_prevented INTEGER NOT NULL DEFAULT 48,
      compliance_status VARCHAR(32) NOT NULL DEFAULT 'GOVERNED_COMPLIANT',
      last_assessment_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
      enterprises: FALLBACK_SMES,
      summary: computeSMESummary(FALLBACK_SMES)
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
        digital_maturity_score,
        equipment_failure_probability::float as equipment_failure_probability,
        predictive_savings_inr::float as predictive_savings_inr,
        downtime_hours_prevented,
        compliance_status,
        last_assessment_at::text,
        created_at::text
      FROM sme_analytics
      ORDER BY digital_maturity_score DESC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      for (const e of FALLBACK_SMES) {
        await sql`
          INSERT INTO sme_analytics (
            enterprise_id, enterprise_name, sector, digital_maturity_score, equipment_failure_probability, predictive_savings_inr, downtime_hours_prevented, compliance_status
          ) VALUES (
            ${e.enterprise_id}, ${e.enterprise_name}, ${e.sector}, ${e.digital_maturity_score}, ${e.equipment_failure_probability}, ${e.predictive_savings_inr}, ${e.downtime_hours_prevented}, ${e.compliance_status}
          );
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        enterprises: FALLBACK_SMES,
        summary: computeSMESummary(FALLBACK_SMES)
      });
      return;
    }

    const enterprises: SMERecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      enterprise_id: String(r.enterprise_id),
      enterprise_name: String(r.enterprise_name),
      sector: String(r.sector),
      digital_maturity_score: Number(r.digital_maturity_score),
      equipment_failure_probability: Number(r.equipment_failure_probability),
      predictive_savings_inr: Number(r.predictive_savings_inr),
      downtime_hours_prevented: Number(r.downtime_hours_prevented),
      compliance_status: r.compliance_status as SMERecord['compliance_status'],
      last_assessment_at: String(r.last_assessment_at),
      created_at: String(r.created_at)
    }));

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      enterprises,
      summary: computeSMESummary(enterprises)
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      enterprises: FALLBACK_SMES,
      summary: computeSMESummary(FALLBACK_SMES),
      warning: error?.message || 'Database query failed; served fallback telemetry.'
    });
  }
}
