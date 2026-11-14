-- Migration 009: Create Executive Outreach and Micro-Report Intelligence Table
-- Tracks executive micro-report downloads (MSP, Data, Mobility SLA bottleneck reports), conversion rates, and automated outreach telemetry

CREATE TABLE IF NOT EXISTS executive_outreach (
    id SERIAL PRIMARY KEY,
    lead_id VARCHAR(64) UNIQUE NOT NULL,
    executive_title VARCHAR(128) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    target_sector VARCHAR(128) NOT NULL,
    downloaded_report VARCHAR(64) NOT NULL CHECK (downloaded_report IN ('MSP_SLA_Bottleneck', 'Data_SLA_Bottleneck', 'Mobility_SLA_Bottleneck')),
    conversion_stage VARCHAR(64) NOT NULL CHECK (conversion_stage IN ('DOWNLOADED', 'ENGAGED', 'MEETING_SCHEDULED', 'PROPOSAL_DISPATCHED')),
    lead_score NUMERIC(5,2) NOT NULL CHECK (lead_score >= 0 AND lead_score <= 100),
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for executive outreach telemetry queries
CREATE INDEX IF NOT EXISTS idx_executive_outreach_report_stage 
ON executive_outreach(downloaded_report, conversion_stage);

CREATE INDEX IF NOT EXISTS idx_executive_outreach_sector 
ON executive_outreach(target_sector);

-- Seed realistic executive micro-report download and outreach telemetry
INSERT INTO executive_outreach (
    lead_id, executive_title, organization_name, target_sector, downloaded_report, conversion_stage, lead_score, dispatched_at
) VALUES
('LEAD-901', 'VP of Infrastructure & Cloud Operations', 'Global FinTech Payments Corp', 'Financial Services', 'MSP_SLA_Bottleneck', 'MEETING_SCHEDULED', 94.50, NOW() - INTERVAL '2 hours'),
('LEAD-884', 'Chief Data Officer', 'Deccan Retail & Commerce Group', 'Omnichannel Retail', 'Data_SLA_Bottleneck', 'PROPOSAL_DISPATCHED', 98.00, NOW() - INTERVAL '5 hours'),
('LEAD-852', 'Head of Fleet & Mobility Logistics', 'Sahyadri Inter-State Freight', 'Supply Chain & Mobility', 'Mobility_SLA_Bottleneck', 'ENGAGED', 86.20, NOW() - INTERVAL '14 hours'),
('LEAD-819', 'Managing Director & CTO', 'Apex Cloud Solutions Singapore', 'Managed Services (MSP)', 'MSP_SLA_Bottleneck', 'ENGAGED', 89.40, NOW() - INTERVAL '1 day'),
('LEAD-793', 'Enterprise Architect', 'Bharat Banking Consortium', 'Core Banking Tech', 'Data_SLA_Bottleneck', 'DOWNLOADED', 78.50, NOW() - INTERVAL '2 days')
ON CONFLICT (lead_id) DO NOTHING;
