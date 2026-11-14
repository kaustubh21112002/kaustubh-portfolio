-- Migration 013: Create Automated System Watchdog & Self-Healing Health Check Table
-- Tracks real-time health telemetry across operational services, latency, error rates, and automated remediation protocols

CREATE TABLE IF NOT EXISTS system_watchdog (
    id SERIAL PRIMARY KEY,
    service_id VARCHAR(64) UNIQUE NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    health_status VARCHAR(32) NOT NULL CHECK (health_status IN ('HEALTHY', 'DEGRADED', 'CRITICAL', 'HEALING', 'MAINTENANCE')),
    latency_ms NUMERIC(7,2) NOT NULL CHECK (latency_ms >= 0),
    error_rate_pct NUMERIC(5,2) NOT NULL CHECK (error_rate_pct >= 0 AND error_rate_pct <= 100),
    self_healing_action VARCHAR(128) NOT NULL,
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for system watchdog telemetry queries
CREATE INDEX IF NOT EXISTS idx_system_watchdog_status 
ON system_watchdog(health_status, last_checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_watchdog_latency 
ON system_watchdog(latency_ms DESC);

-- Seed realistic system watchdog telemetry records
INSERT INTO system_watchdog (
    service_id, service_name, health_status, latency_ms, error_rate_pct, self_healing_action, last_checked_at
) VALUES
('SVC-API-GATEWAY', 'Vercel Edge API Gateway', 'HEALTHY', 42.50, 0.02, 'Rate-limit sliding window recalibration', NOW() - INTERVAL '45 seconds'),
('SVC-NEON-DB', 'Neon Serverless PostgreSQL (ap-southeast-1)', 'HEALTHY', 18.20, 0.00, 'Connection pool scaling (120 max active)', NOW() - INTERVAL '1 minute'),
('SVC-SLA-ARBITER', 'Enterprise SLA Breach Arbiter', 'HEALING', 310.80, 1.45, 'Pod worker auto-restart & cache invalidation', NOW() - INTERVAL '2 minutes'),
('SVC-FIN-SIM', 'Financial Runway & DCF Simulation Engine', 'HEALTHY', 65.40, 0.05, 'WASM memory heap garbage collection', NOW() - INTERVAL '3 minutes'),
('SVC-MSME-SYNC', 'Tally Prime & MSME GST Sync Pipeline', 'DEGRADED', 480.10, 3.80, 'Exponential backoff queue failover triggered', NOW() - INTERVAL '5 minutes'),
('SVC-AGENT-MESH', 'Autonomous Gemini AI Worker Mesh', 'HEALTHY', 145.00, 0.12, 'Model inference quota balancing to Flash pool', NOW() - INTERVAL '30 seconds')
ON CONFLICT (service_id) DO NOTHING;

