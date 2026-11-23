import type { VercelRequest, VercelResponse } from './types';
// Serverless Endpoint: Automated CRM Pipeline and PDF Lead Generation Telemetry
// Serves B2B outreach funnel metrics, lead scoring, and headless chrome generation benchmarks

import { neon } from '@neondatabase/serverless';
import { setStandardSecurityHeaders } from '../lib/rateLimiter.js';



declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export interface CRMLeadRecord {
  id: number;
  account_name: string;
  industry: string;
  contact_stage: 'DISCOVERY' | 'EXECUTIVE_REVIEW' | 'PROPOSAL_DELIVERED' | 'CONTRACT_NEGOTIATION' | 'CLOSED_WON';
  lead_score: number;
  response_time_hours: number;
  pdf_export_status: 'GENERATED' | 'QUEUED' | 'PENDING_RENDER' | 'FAILED';
  pdf_generation_ms: number;
  target_decision_maker: string;
  last_touchpoint_at: string;
  created_at: string;
}

export interface FunnelStageMetric {
  stage: string;
  count: number;
  conversionRatePct: number;
}

const FALLBACK_LEADS: CRMLeadRecord[] = [
  {
    id: 1,
    account_name: 'Reliance Digital Retail Stack',
    industry: 'Retail / Omni-channel',
    contact_stage: 'EXECUTIVE_REVIEW',
    lead_score: 94,
    response_time_hours: 1.2,
    pdf_export_status: 'GENERATED',
    pdf_generation_ms: 580,
    target_decision_maker: 'VP of Technology',
    last_touchpoint_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400 * 1000).toISOString()
  },
  {
    id: 2,
    account_name: 'Tata Capital Wealth FinTech',
    industry: 'Financial Services',
    contact_stage: 'PROPOSAL_DELIVERED',
    lead_score: 88,
    response_time_hours: 2.5,
    pdf_export_status: 'GENERATED',
    pdf_generation_ms: 640,
    target_decision_maker: 'Head of Digital Platforms',
    last_touchpoint_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString()
  },
  {
    id: 3,
    account_name: 'HDFC Sky Securities',
    industry: 'Capital Markets',
    contact_stage: 'DISCOVERY',
    lead_score: 76,
    response_time_hours: 4.1,
    pdf_export_status: 'QUEUED',
    pdf_generation_ms: 0,
    target_decision_maker: 'Chief Technology Officer',
    last_touchpoint_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
  },
  {
    id: 4,
    account_name: 'Zomato Infrastructure Hyperlocal',
    industry: 'Food Delivery & Logistics',
    contact_stage: 'CONTRACT_NEGOTIATION',
    lead_score: 96,
    response_time_hours: 0.8,
    pdf_export_status: 'GENERATED',
    pdf_generation_ms: 490,
    target_decision_maker: 'Director of Engineering',
    last_touchpoint_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 86400 * 1000).toISOString()
  },
  {
    id: 5,
    account_name: 'Razorpay Enterprise Settlement',
    industry: 'FinTech / Payments',
    contact_stage: 'PROPOSAL_DELIVERED',
    lead_score: 89,
    response_time_hours: 1.9,
    pdf_export_status: 'GENERATED',
    pdf_generation_ms: 530,
    target_decision_maker: 'Head of Enterprise Engineering',
    last_touchpoint_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 9 * 86400 * 1000).toISOString()
  },
  {
    id: 6,
    account_name: 'Flipkart Supply Chain Automation',
    industry: 'E-Commerce Logistics',
    contact_stage: 'DISCOVERY',
    lead_score: 82,
    response_time_hours: 3.2,
    pdf_export_status: 'PENDING_RENDER',
    pdf_generation_ms: 0,
    target_decision_maker: 'VP of Logistics Architecture',
    last_touchpoint_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString()
  }
];

function computeFunnelMetrics(leads: CRMLeadRecord[]): FunnelStageMetric[] {
  const stages: CRMLeadRecord['contact_stage'][] = [
    'DISCOVERY',
    'EXECUTIVE_REVIEW',
    'PROPOSAL_DELIVERED',
    'CONTRACT_NEGOTIATION',
    'CLOSED_WON'
  ];

  let previousCount = leads.length;

  return stages.map(stage => {
    const count = leads.filter(l => l.contact_stage === stage).length;
    const conversionRatePct = previousCount > 0 ? Math.round((count / previousCount) * 100) : 100;
    previousCount = count > 0 ? count : previousCount;

    return {
      stage: stage.replace(/_/g, ' '),
      count,
      conversionRatePct
    };
  });
}

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS crm_pipeline (
      id BIGSERIAL PRIMARY KEY,
      account_name VARCHAR(128) NOT NULL,
      industry VARCHAR(64) NOT NULL,
      contact_stage VARCHAR(32) NOT NULL DEFAULT 'DISCOVERY',
      lead_score INTEGER NOT NULL DEFAULT 50,
      response_time_hours NUMERIC(5, 2) NOT NULL DEFAULT 2.4,
      pdf_export_status VARCHAR(32) NOT NULL DEFAULT 'GENERATED',
      pdf_generation_ms INTEGER NOT NULL DEFAULT 620,
      target_decision_maker VARCHAR(64) NOT NULL,
      last_touchpoint_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
      leads: FALLBACK_LEADS,
      funnel: computeFunnelMetrics(FALLBACK_LEADS),
      avgPdfGenerationMs: 560,
      avgResponseTimeHours: 2.3
    });
    return;
  }

  try {
    const sql = neon(dbUrl);
    await ensureTableInitialized(sql);

    const rows = await sql`
      SELECT 
        id,
        account_name,
        industry,
        contact_stage,
        lead_score,
        response_time_hours::float as response_time_hours,
        pdf_export_status,
        pdf_generation_ms,
        target_decision_maker,
        last_touchpoint_at::text,
        created_at::text
      FROM crm_pipeline
      ORDER BY lead_score DESC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      for (const lead of FALLBACK_LEADS) {
        await sql`
          INSERT INTO crm_pipeline (
            account_name, industry, contact_stage, lead_score, response_time_hours, pdf_export_status, pdf_generation_ms, target_decision_maker, last_touchpoint_at
          ) VALUES (
            ${lead.account_name}, ${lead.industry}, ${lead.contact_stage}, ${lead.lead_score}, ${lead.response_time_hours}, ${lead.pdf_export_status}, ${lead.pdf_generation_ms}, ${lead.target_decision_maker}, ${lead.last_touchpoint_at}
          );
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        leads: FALLBACK_LEADS,
        funnel: computeFunnelMetrics(FALLBACK_LEADS),
        avgPdfGenerationMs: 560,
        avgResponseTimeHours: 2.3
      });
      return;
    }

    const leads: CRMLeadRecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      account_name: String(r.account_name),
      industry: String(r.industry),
      contact_stage: r.contact_stage as CRMLeadRecord['contact_stage'],
      lead_score: Number(r.lead_score),
      response_time_hours: Number(r.response_time_hours),
      pdf_export_status: r.pdf_export_status as CRMLeadRecord['pdf_export_status'],
      pdf_generation_ms: Number(r.pdf_generation_ms),
      target_decision_maker: String(r.target_decision_maker),
      last_touchpoint_at: String(r.last_touchpoint_at),
      created_at: String(r.created_at)
    }));

    const validPdfRenders = leads.filter(l => l.pdf_generation_ms > 0);
    const avgPdfGenerationMs = validPdfRenders.length > 0
      ? Math.round(validPdfRenders.reduce((sum, l) => sum + l.pdf_generation_ms, 0) / validPdfRenders.length)
      : 560;

    const avgResponseTimeHours = Number(
      (leads.reduce((sum, l) => sum + l.response_time_hours, 0) / leads.length).toFixed(1)
    );

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      leads,
      funnel: computeFunnelMetrics(leads),
      avgPdfGenerationMs,
      avgResponseTimeHours
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      leads: FALLBACK_LEADS,
      funnel: computeFunnelMetrics(FALLBACK_LEADS),
      avgPdfGenerationMs: 560,
      avgResponseTimeHours: 2.3,
      warning: error?.message || 'Database query failed; served fallback telemetry.'
    });
  }
}
