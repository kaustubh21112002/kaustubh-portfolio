// Serverless Endpoint: MSME ERP & Tally Data Integration Hub (GruhLaxmi.AI)
// Serves automated ledger synchronization, unreconciled transaction queues, and GST/Udyam statutory telemetry

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

export interface ERPSyncRecord {
  id: number;
  enterprise_id: string;
  enterprise_name: string;
  erp_system: string;
  sync_status: 'RECONCILED_SYNCED' | 'DELTA_SYNCING' | 'RECONCILIATION_REQUIRED' | 'SYNC_STALLED';
  unreconciled_tx_count: number;
  ledger_count: number;
  reconciled_volume_inr: number;
  gst_status: 'GSTR1_MATCHED' | 'GSTR3B_FILED' | 'E_WAY_BILL_ALERT' | 'MISMATCH_DETECTED';
  udyam_number: string;
  sync_latency_ms: number;
  last_sync_at: string;
  created_at: string;
}

export interface ERPSummary {
  totalEnterprises: number;
  totalLedgersSynced: number;
  totalReconciledVolumeInr: number;
  totalUnreconciledTx: number;
  reconciliationRatePct: number;
  avgSyncLatencyMs: number;
}

const FALLBACK_ERP: ERPSyncRecord[] = [
  {
    id: 1,
    enterprise_id: 'ERP-PUN-01',
    enterprise_name: 'Sahyadri Engineering Works',
    erp_system: 'Tally Prime v4.1',
    sync_status: 'RECONCILED_SYNCED',
    unreconciled_tx_count: 0,
    ledger_count: 58,
    reconciled_volume_inr: 24800000.00,
    gst_status: 'GSTR1_MATCHED',
    udyam_number: 'UDYAM-MH-26-0018492',
    sync_latency_ms: 380,
    last_sync_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 2,
    enterprise_id: 'ERP-NAS-02',
    enterprise_name: 'Godavari Packaging Clusters',
    erp_system: 'Vyapar Desktop',
    sync_status: 'DELTA_SYNCING',
    unreconciled_tx_count: 4,
    ledger_count: 34,
    reconciled_volume_inr: 9400000.00,
    gst_status: 'GSTR3B_FILED',
    udyam_number: 'UDYAM-MH-26-0042819',
    sync_latency_ms: 510,
    last_sync_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 40 * 86400 * 1000).toISOString()
  },
  {
    id: 3,
    enterprise_id: 'ERP-THN-03',
    enterprise_name: 'Konkan Chemical Enterprises',
    erp_system: 'Zoho Books Enterprise',
    sync_status: 'RECONCILED_SYNCED',
    unreconciled_tx_count: 0,
    ledger_count: 82,
    reconciled_volume_inr: 38100000.00,
    gst_status: 'GSTR1_MATCHED',
    udyam_number: 'UDYAM-MH-12-0091840',
    sync_latency_ms: 290,
    last_sync_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  {
    id: 4,
    enterprise_id: 'ERP-AUR-04',
    enterprise_name: 'Marathwada Agro Seed Processing',
    erp_system: 'Tally Prime v4.1',
    sync_status: 'RECONCILIATION_REQUIRED',
    unreconciled_tx_count: 12,
    ledger_count: 45,
    reconciled_volume_inr: 14500000.00,
    gst_status: 'E_WAY_BILL_ALERT',
    udyam_number: 'UDYAM-MH-20-0038194',
    sync_latency_ms: 680,
    last_sync_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 50 * 86400 * 1000).toISOString()
  },
  {
    id: 5,
    enterprise_id: 'ERP-KOL-05',
    enterprise_name: 'Deccan Precision Valves',
    erp_system: 'Tally Prime v4.0',
    sync_status: 'RECONCILED_SYNCED',
    unreconciled_tx_count: 0,
    ledger_count: 64,
    reconciled_volume_inr: 18900000.00,
    gst_status: 'GSTR1_MATCHED',
    udyam_number: 'UDYAM-MH-19-0024918',
    sync_latency_ms: 420,
    last_sync_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  },
  {
    id: 6,
    enterprise_id: 'ERP-NAG-06',
    enterprise_name: 'Vidarbha Logistics Warehousing',
    erp_system: 'Busy Accounting',
    sync_status: 'RECONCILED_SYNCED',
    unreconciled_tx_count: 0,
    ledger_count: 51,
    reconciled_volume_inr: 16200000.00,
    gst_status: 'GSTR1_MATCHED',
    udyam_number: 'UDYAM-MH-31-0071842',
    sync_latency_ms: 460,
    last_sync_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
];

function computeERPSummary(records: ERPSyncRecord[]): ERPSummary {
  const totalEnterprises = records.length;
  const totalLedgersSynced = records.reduce((sum, r) => sum + r.ledger_count, 0);
  const totalReconciledVolumeInr = records.reduce((sum, r) => sum + r.reconciled_volume_inr, 0);
  const totalUnreconciledTx = records.reduce((sum, r) => sum + r.unreconciled_tx_count, 0);
  const reconciledCount = records.filter(r => r.sync_status === 'RECONCILED_SYNCED').length;
  const reconciliationRatePct = Math.round((reconciledCount / totalEnterprises) * 100);
  const avgSyncLatencyMs = Math.round(
    records.reduce((sum, r) => sum + r.sync_latency_ms, 0) / totalEnterprises
  );

  return {
    totalEnterprises,
    totalLedgersSynced,
    totalReconciledVolumeInr,
    totalUnreconciledTx,
    reconciliationRatePct,
    avgSyncLatencyMs
  };
}

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS msme_erp_sync (
      id BIGSERIAL PRIMARY KEY,
      enterprise_id VARCHAR(32) NOT NULL UNIQUE,
      enterprise_name VARCHAR(128) NOT NULL,
      erp_system VARCHAR(32) NOT NULL DEFAULT 'Tally Prime',
      sync_status VARCHAR(32) NOT NULL DEFAULT 'RECONCILED_SYNCED',
      unreconciled_tx_count INTEGER NOT NULL DEFAULT 0,
      ledger_count INTEGER NOT NULL DEFAULT 42,
      reconciled_volume_inr NUMERIC(14, 2) NOT NULL DEFAULT 14250000.00,
      gst_status VARCHAR(32) NOT NULL DEFAULT 'GSTR1_MATCHED',
      udyam_number VARCHAR(32) NOT NULL,
      sync_latency_ms INTEGER NOT NULL DEFAULT 420,
      last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
      records: FALLBACK_ERP,
      summary: computeERPSummary(FALLBACK_ERP)
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
        erp_system,
        sync_status,
        unreconciled_tx_count,
        ledger_count,
        reconciled_volume_inr::float as reconciled_volume_inr,
        gst_status,
        udyam_number,
        sync_latency_ms,
        last_sync_at::text,
        created_at::text
      FROM msme_erp_sync
      ORDER BY unreconciled_tx_count DESC, ledger_count DESC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      for (const r of FALLBACK_ERP) {
        await sql`
          INSERT INTO msme_erp_sync (
            enterprise_id, enterprise_name, erp_system, sync_status, unreconciled_tx_count, ledger_count, reconciled_volume_inr, gst_status, udyam_number, sync_latency_ms
          ) VALUES (
            ${r.enterprise_id}, ${r.enterprise_name}, ${r.erp_system}, ${r.sync_status}, ${r.unreconciled_tx_count}, ${r.ledger_count}, ${r.reconciled_volume_inr}, ${r.gst_status}, ${r.udyam_number}, ${r.sync_latency_ms}
          );
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        records: FALLBACK_ERP,
        summary: computeERPSummary(FALLBACK_ERP)
      });
      return;
    }

    const records: ERPSyncRecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      enterprise_id: String(r.enterprise_id),
      enterprise_name: String(r.enterprise_name),
      erp_system: String(r.erp_system),
      sync_status: r.sync_status as ERPSyncRecord['sync_status'],
      unreconciled_tx_count: Number(r.unreconciled_tx_count),
      ledger_count: Number(r.ledger_count),
      reconciled_volume_inr: Number(r.reconciled_volume_inr),
      gst_status: r.gst_status as ERPSyncRecord['gst_status'],
      udyam_number: String(r.udyam_number),
      sync_latency_ms: Number(r.sync_latency_ms),
      last_sync_at: String(r.last_sync_at),
      created_at: String(r.created_at)
    }));

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      records,
      summary: computeERPSummary(records)
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      records: FALLBACK_ERP,
      summary: computeERPSummary(FALLBACK_ERP),
      warning: error?.message || 'Database query failed; served fallback telemetry.'
    });
  }
}

