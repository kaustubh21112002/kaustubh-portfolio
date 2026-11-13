-- Migration: 001_create_sla_tickets.sql
-- Description: B2B SLA Command Center ticket tracking and operational SLA monitoring

CREATE TABLE IF NOT EXISTS sla_tickets (
  id BIGSERIAL PRIMARY KEY,
  ticket_code VARCHAR(32) NOT NULL UNIQUE,
  client_name VARCHAR(128) NOT NULL,
  region VARCHAR(32) NOT NULL,
  severity VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
  sla_deadline TIMESTAMPTZ NOT NULL,
  agent_name VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound index for active operational queries
CREATE INDEX IF NOT EXISTS idx_sla_tickets_region_status ON sla_tickets (region, status, sla_deadline);
CREATE INDEX IF NOT EXISTS idx_sla_tickets_deadline ON sla_tickets (sla_deadline ASC);

-- Seed default active enterprise tickets if table is empty
INSERT INTO sla_tickets (ticket_code, client_name, region, severity, status, sla_deadline, agent_name, category)
SELECT * FROM (VALUES
  ('TKT-8921', 'FinTech Bharat Core', 'Mumbai', 'CRITICAL', 'IN_PROGRESS', NOW() + INTERVAL '42 minutes', 'Aarav Sharma', 'Payment Gateway Latency'),
  ('TKT-8924', 'TelcoGrid Cloud APAC', 'Singapore', 'HIGH', 'IN_PROGRESS', NOW() + INTERVAL '1 hour 15 minutes', 'Mei Ling Tan', 'Fiber Transit Peering'),
  ('TKT-8930', 'AeroLogistics Global', 'Frankfurt', 'HIGH', 'IN_PROGRESS', NOW() + INTERVAL '2 hours 40 minutes', 'Lukas Weber', 'EDI Manifest Ingestion'),
  ('TKT-8935', 'Deccan Cloud Systems', 'Hyderabad', 'MEDIUM', 'IN_PROGRESS', NOW() + INTERVAL '4 hours 20 minutes', 'Priya Reddy', 'Read Replica Drift'),
  ('TKT-8941', 'SG Capital Alpha', 'Singapore', 'LOW', 'PENDING', NOW() + INTERVAL '9 hours 10 minutes', 'Devon Vance', 'Telemetry Ingestion Lag'),
  ('TKT-8948', 'Bharat Commerce Stack', 'Mumbai', 'CRITICAL', 'IN_PROGRESS', NOW() + INTERVAL '18 minutes', 'Vikram Malhotra', 'Checkout Settlement Sync')
) AS v(ticket_code, client_name, region, severity, status, sla_deadline, agent_name, category)
WHERE NOT EXISTS (SELECT 1 FROM sla_tickets LIMIT 1);
