-- Migration 008: Create System Reliability & Chaos Engineering Simulator Table
-- Tracks synthetic cloud node failovers, circuit breaker state transitions, multi-region latency self-healing, and edge failover telemetry

CREATE TABLE IF NOT EXISTS reliability_chaos_metrics (
    id SERIAL PRIMARY KEY,
    cluster_id VARCHAR(64) UNIQUE NOT NULL,
    cluster_name VARCHAR(128) NOT NULL,
    region VARCHAR(64) NOT NULL,
    health_score NUMERIC(5,2) NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    circuit_breaker_state VARCHAR(32) NOT NULL CHECK (circuit_breaker_state IN ('CLOSED', 'HALF_OPEN', 'OPEN', 'FORCED_OPEN')),
    p99_latency_ms NUMERIC(6,2) NOT NULL,
    simulated_failure_mode VARCHAR(64) NOT NULL,
    remediation_status VARCHAR(64) NOT NULL CHECK (remediation_status IN ('HEALTHY', 'SELF_HEALING', 'DEGRADED', 'RECOVERED')),
    active_replicas INTEGER NOT NULL CHECK (active_replicas >= 0),
    failover_target_region VARCHAR(64),
    last_chaos_injected_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for reliability telemetry queries
CREATE INDEX IF NOT EXISTS idx_reliability_status 
ON reliability_chaos_metrics(remediation_status, circuit_breaker_state);

CREATE INDEX IF NOT EXISTS idx_reliability_region 
ON reliability_chaos_metrics(region);

-- Seed realistic chaos engineering and high-availability telemetry
INSERT INTO reliability_chaos_metrics (
    cluster_id, cluster_name, region, health_score, circuit_breaker_state, p99_latency_ms, simulated_failure_mode, remediation_status, active_replicas, failover_target_region, last_chaos_injected_at
) VALUES
('CLUSTER-BOM-01', 'Core Transaction Ledger API', 'ap-south-1 (Mumbai)', 99.40, 'CLOSED', 14.20, 'NONE', 'HEALTHY', 12, 'ap-southeast-1 (Singapore)', NOW() - INTERVAL '12 minutes'),
('CLUSTER-HYD-02', 'Async Event Processing Bus', 'ap-south-2 (Hyderabad)', 94.80, 'HALF_OPEN', 42.50, 'PACKET_LOSS_15PCT', 'SELF_HEALING', 8, 'ap-south-1 (Mumbai)', NOW() - INTERVAL '4 minutes'),
('CLUSTER-SIN-01', 'Global Edge CDN & Telemetry', 'ap-southeast-1 (Singapore)', 99.95, 'CLOSED', 8.10, 'NONE', 'HEALTHY', 16, 'ap-northeast-1 (Tokyo)', NOW() - INTERVAL '1 hour'),
('CLUSTER-FRA-01', 'European Compliance Archive', 'eu-central-1 (Frankfurt)', 91.20, 'CLOSED', 68.40, 'DNS_THROTTLING_SIM', 'RECOVERED', 6, 'eu-west-1 (Ireland)', NOW() - INTERVAL '30 minutes'),
('CLUSTER-IAD-01', 'Cross-Atlantic Backup Hub', 'us-east-1 (N. Virginia)', 87.50, 'OPEN', 185.00, 'ZONAL_BLACKHOLE_SIM', 'DEGRADED', 4, 'us-east-2 (Ohio)', NOW() - INTERVAL '2 minutes')
ON CONFLICT (cluster_id) DO NOTHING;
