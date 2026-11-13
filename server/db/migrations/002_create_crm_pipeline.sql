-- Migration: 002_create_crm_pipeline.sql
-- Description: Automated CRM Pipeline and Headless Chrome PDF Lead Generation telemetry

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

-- Compound index for funnel stage and account filtering
CREATE INDEX IF NOT EXISTS idx_crm_stage_score ON crm_pipeline (contact_stage, lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_crm_last_touch ON crm_pipeline (last_touchpoint_at DESC);

-- Seed default enterprise lead records if table is empty
INSERT INTO crm_pipeline (account_name, industry, contact_stage, lead_score, response_time_hours, pdf_export_status, pdf_generation_ms, target_decision_maker, last_touchpoint_at)
SELECT * FROM (VALUES
  ('Reliance Digital Retail Stack', 'Retail / Omni-channel', 'EXECUTIVE_REVIEW', 94, 1.2, 'GENERATED', 580, 'VP of Technology', NOW() - INTERVAL '2 hours'),
  ('Tata Capital Wealth FinTech', 'Financial Services', 'PROPOSAL_DELIVERED', 88, 2.5, 'GENERATED', 640, 'Head of Digital Platforms', NOW() - INTERVAL '5 hours'),
  ('HDFC Sky Securities', 'Capital Markets', 'DISCOVERY', 76, 4.1, 'QUEUED', 0, 'Chief Technology Officer', NOW() - INTERVAL '1 day'),
  ('Zomato Infrastructure Hyperlocal', 'Food Delivery & Logistics', 'CONTRACT_NEGOTIATION', 96, 0.8, 'GENERATED', 490, 'Director of Engineering', NOW() - INTERVAL '3 hours'),
  ('Razorpay Enterprise Settlement', 'FinTech / Payments', 'PROPOSAL_DELIVERED', 89, 1.9, 'GENERATED', 530, 'Head of Enterprise Engineering', NOW() - INTERVAL '8 hours'),
  ('Flipkart Supply Chain Automation', 'E-Commerce Logistics', 'DISCOVERY', 82, 3.2, 'PENDING_RENDER', 0, 'VP of Logistics Architecture', NOW() - INTERVAL '2 days')
) AS v(account_name, industry, contact_stage, lead_score, response_time_hours, pdf_export_status, pdf_generation_ms, target_decision_maker, last_touchpoint_at)
WHERE NOT EXISTS (SELECT 1 FROM crm_pipeline LIMIT 1);
