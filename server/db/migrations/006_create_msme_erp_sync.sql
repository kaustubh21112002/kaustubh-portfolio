-- Migration: 006_create_msme_erp_sync.sql
-- Description: MSME ERP & Tally Data Integration Hub (GruhLaxmi.AI) telemetry

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

-- Compound index for sync status and unreconciled transaction audits
CREATE INDEX IF NOT EXISTS idx_erp_sync_status ON msme_erp_sync (sync_status, unreconciled_tx_count DESC);
CREATE INDEX IF NOT EXISTS idx_erp_system ON msme_erp_sync (erp_system, gst_status);

-- Seed default enterprise ERP synchronization cohorts if table is empty
INSERT INTO msme_erp_sync (enterprise_id, enterprise_name, erp_system, sync_status, unreconciled_tx_count, ledger_count, reconciled_volume_inr, gst_status, udyam_number, sync_latency_ms)
SELECT * FROM (VALUES
  ('ERP-PUN-01', 'Sahyadri Engineering Works', 'Tally Prime v4.1', 'RECONCILED_SYNCED', 0, 58, 24800000.00, 'GSTR1_MATCHED', 'UDYAM-MH-26-0018492', 380),
  ('ERP-NAS-02', 'Godavari Packaging Clusters', 'Vyapar Desktop', 'DELTA_SYNCING', 4, 34, 9400000.00, 'GSTR3B_FILED', 'UDYAM-MH-26-0042819', 510),
  ('ERP-THN-03', 'Konkan Chemical Enterprises', 'Zoho Books Enterprise', 'RECONCILED_SYNCED', 0, 82, 38100000.00, 'GSTR1_MATCHED', 'UDYAM-MH-12-0091840', 290),
  ('ERP-AUR-04', 'Marathwada Agro Seed Processing', 'Tally Prime v4.1', 'RECONCILIATION_REQUIRED', 12, 45, 14500000.00, 'E_WAY_BILL_ALERT', 'UDYAM-MH-20-0038194', 680),
  ('ERP-KOL-05', 'Deccan Precision Valves', 'Tally Prime v4.0', 'RECONCILED_SYNCED', 0, 64, 18900000.00, 'GSTR1_MATCHED', 'UDYAM-MH-19-0024918', 420),
  ('ERP-NAG-06', 'Vidarbha Logistics Warehousing', 'Busy Accounting', 'RECONCILED_SYNCED', 0, 51, 16200000.00, 'GSTR1_MATCHED', 'UDYAM-MH-31-0071842', 460)
) AS v(enterprise_id, enterprise_name, erp_system, sync_status, unreconciled_tx_count, ledger_count, reconciled_volume_inr, gst_status, udyam_number, sync_latency_ms)
WHERE NOT EXISTS (SELECT 1 FROM msme_erp_sync LIMIT 1);

