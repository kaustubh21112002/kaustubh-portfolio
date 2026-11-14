-- Migration 010: Create B2B Outreach Campaigns Table (OutreachPulse)
-- Tracks multi-channel outreach sequencing, SLA penalty analysis tracking across MSP and SaaS sectors, and automated engagement telemetry

CREATE TABLE IF NOT EXISTS b2b_outreach_campaigns (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(64) UNIQUE NOT NULL,
    enterprise_name VARCHAR(255) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    channel VARCHAR(32) NOT NULL CHECK (channel IN ('EMAIL', 'LINKEDIN', 'WHATSAPP')),
    sequence_stage VARCHAR(64) NOT NULL CHECK (sequence_stage IN ('TOUCHPOINT_1_DISPATCHED', 'OPENED_AND_READ', 'REPLIED_WITH_INTEREST', 'DEMO_COMMITTED', 'NURTURE_HOLD')),
    engagement_score NUMERIC(5,2) NOT NULL CHECK (engagement_score >= 0 AND engagement_score <= 100),
    conversion_status VARCHAR(64) NOT NULL CHECK (conversion_status IN ('ACTIVE', 'CONVERTED', 'UNSUBSCRIBED', 'STALLED')),
    sla_penalty_exposure_usd NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for B2B campaign telemetry queries
CREATE INDEX IF NOT EXISTS idx_b2b_campaigns_channel_status 
ON b2b_outreach_campaigns(channel, conversion_status);

CREATE INDEX IF NOT EXISTS idx_b2b_campaigns_score 
ON b2b_outreach_campaigns(engagement_score DESC);

-- Seed realistic multi-channel B2B campaign records
INSERT INTO b2b_outreach_campaigns (
    campaign_id, enterprise_name, sector, channel, sequence_stage, engagement_score, conversion_status, sla_penalty_exposure_usd, dispatched_at
) VALUES
('CMP-PULSE-101', 'CloudNative Networks Europe', 'Managed Services (MSP)', 'LINKEDIN', 'DEMO_COMMITTED', 96.50, 'CONVERTED', 185000.00, NOW() - INTERVAL '4 hours'),
('CMP-PULSE-102', 'Singapore Regional FinPay', 'FinTech & Banking', 'EMAIL', 'REPLIED_WITH_INTEREST', 91.20, 'ACTIVE', 320000.00, NOW() - INTERVAL '9 hours'),
('CMP-PULSE-103', 'Sahyadri HyperLogistics', 'Supply Chain / Freight', 'WHATSAPP', 'OPENED_AND_READ', 82.40, 'ACTIVE', 95000.00, NOW() - INTERVAL '1 day'),
('CMP-PULSE-104', 'OmniCommerce India Retail', 'Omnichannel Retail', 'EMAIL', 'DEMO_COMMITTED', 94.80, 'CONVERTED', 140000.00, NOW() - INTERVAL '2 days'),
('CMP-PULSE-105', 'Nordic Health Systems OS', 'HealthTech SaaS', 'LINKEDIN', 'TOUCHPOINT_1_DISPATCHED', 72.00, 'ACTIVE', 210000.00, NOW() - INTERVAL '3 days')
ON CONFLICT (campaign_id) DO NOTHING;
