-- Migration: 004_create_sme_analytics.sql
-- Description: Predictive SME Analytics & Digital Transformation Hub telemetry

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

-- Compound index for sector queries and failure probability risk ranking
CREATE INDEX IF NOT EXISTS idx_sme_sector_risk ON sme_analytics (sector, equipment_failure_probability DESC);
CREATE INDEX IF NOT EXISTS idx_sme_maturity ON sme_analytics (digital_maturity_score DESC);

-- Seed default SME benchmark cohort if table is empty
INSERT INTO sme_analytics (enterprise_id, enterprise_name, sector, digital_maturity_score, equipment_failure_probability, predictive_savings_inr, downtime_hours_prevented, compliance_status)
SELECT * FROM (VALUES
  ('SME-PUN-01', 'Sahyadri Precision Auto-Components', 'Automotive Precision Engineering', 84, 0.032, 620000.00, 72, 'GOVERNED_COMPLIANT'),
  ('SME-AUR-02', 'Marathwada Agro-Processing Unit', 'Food & Agro Processing', 62, 0.125, 340000.00, 38, 'MONITORING_REQUIRED'),
  ('SME-THN-03', 'Konkan Specialty Polymers', 'Chemical & Industrial Polymers', 78, 0.048, 510000.00, 56, 'GOVERNED_COMPLIANT'),
  ('SME-NAS-04', 'Godavari Packaging Technologies', 'Packaging & Paper Systems', 58, 0.142, 290000.00, 32, 'REVIEW_PENDING'),
  ('SME-KOL-05', 'Deccan Heavy Foundry Solutions', 'Metal Casting & Fabrication', 71, 0.075, 480000.00, 46, 'GOVERNED_COMPLIANT'),
  ('SME-NAG-06', 'Vidarbha Logistics & Storage Hub', 'Cold Storage & Warehousing', 88, 0.021, 740000.00, 84, 'GOVERNED_COMPLIANT')
) AS v(enterprise_id, enterprise_name, sector, digital_maturity_score, equipment_failure_probability, predictive_savings_inr, downtime_hours_prevented, compliance_status)
WHERE NOT EXISTS (SELECT 1 FROM sme_analytics LIMIT 1);
