-- Migration: 005_create_financial_analytics.sql
-- Description: Automated Financial Statement and Working Capital Command Center telemetry

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

-- Compound index for liquidity risk and working capital health queries
CREATE INDEX IF NOT EXISTS idx_finance_risk ON financial_analytics (liquidity_risk_status, cash_runway_months ASC);
CREATE INDEX IF NOT EXISTS idx_finance_ratios ON financial_analytics (working_capital_ratio DESC, quick_ratio DESC);

-- Seed default enterprise working capital accounts if table is empty
INSERT INTO financial_analytics (enterprise_id, enterprise_name, sector, cash_runway_months, working_capital_ratio, quick_ratio, dscr, monthly_burn_rate_inr, operating_cash_flow_inr, liquidity_risk_status)
SELECT * FROM (VALUES
  ('FIN-CORP-01', 'Bharat Tech Logistics Core', 'Enterprise Logistics', 22.4, 2.15, 1.78, 2.65, 2400000.00, 5800000.00, 'LIQUIDITY_OPTIMAL'),
  ('FIN-CORP-02', 'Deccan Cloud & Colocation', 'Data Center Infrastructure', 16.8, 1.82, 1.45, 2.10, 3100000.00, 4900000.00, 'LIQUIDITY_OPTIMAL'),
  ('FIN-CORP-03', 'Sahyadri Precision Robotics', 'Industrial Robotics', 11.2, 1.35, 0.95, 1.45, 1850000.00, 2100000.00, 'MONITOR_RUNWAY'),
  ('FIN-CORP-04', 'Maratha Specialty Chemicals', 'Advanced Polymers', 8.4, 1.15, 0.78, 1.18, 2200000.00, 1950000.00, 'CAPITAL_STRESS'),
  ('FIN-CORP-05', 'Godavari Agro-Exporters', 'Cold Storage & Agro-Supply', 28.5, 2.45, 1.92, 3.10, 1400000.00, 4100000.00, 'LIQUIDITY_OPTIMAL'),
  ('FIN-CORP-06', 'Vidarbha Steel Fab & Tube', 'Heavy Metal Fabrication', 14.1, 1.65, 1.25, 1.85, 2600000.00, 3600000.00, 'LIQUIDITY_OPTIMAL')
) AS v(enterprise_id, enterprise_name, sector, cash_runway_months, working_capital_ratio, quick_ratio, dscr, monthly_burn_rate_inr, operating_cash_flow_inr, liquidity_risk_status)
WHERE NOT EXISTS (SELECT 1 FROM financial_analytics LIMIT 1);

