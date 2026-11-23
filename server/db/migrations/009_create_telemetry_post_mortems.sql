-- Migration 009: Create Global Telemetry and Automated Incident Post-Mortem Table
-- Tracks real-time telemetry streaming, incident MTTR, and automated root-cause post-mortem generation

CREATE TABLE IF NOT EXISTS telemetry_post_mortems (
    id SERIAL PRIMARY KEY,
    incident_id VARCHAR(64) UNIQUE NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('P1_CRITICAL', 'P2_HIGH', 'P3_MODERATE', 'P4_LOW')),
    mttr_minutes NUMERIC(6,2) NOT NULL CHECK (mttr_minutes >= 0),
    root_cause_summary TEXT NOT NULL,
    telemetry_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    incident_status VARCHAR(64) NOT NULL CHECK (incident_status IN ('RESOLVED', 'MITIGATED', 'INVESTIGATING', 'MONITORING')),
    sla_impact_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for telemetry post-mortem queries
CREATE INDEX IF NOT EXISTS idx_telemetry_post_mortems_severity_status 
ON telemetry_post_mortems(severity, incident_status);

CREATE INDEX IF NOT EXISTS idx_telemetry_post_mortems_service 
ON telemetry_post_mortems(service_name);

-- Seed realistic global telemetry and incident post-mortem records
INSERT INTO telemetry_post_mortems (
    incident_id, service_name, severity, mttr_minutes, root_cause_summary, telemetry_payload, incident_status, sla_impact_pct, generated_at
) VALUES
('INC-2026-801', 'Core UPI Ingestion Gateway', 'P1_CRITICAL', 8.50, 'Edge ingress buffer saturation during sudden peak traffic spike; auto-healed via dynamic rate throttling and replica scale-out.', '{"p99_latency_spike_ms": 340, "dropped_packets_pct": 2.1, "remediation_action": "AUTOSCALE_REPLICAS_3X"}'::jsonb, 'RESOLVED', 0.02, NOW() - INTERVAL '3 hours'),
('INC-2026-749', 'PostgreSQL Connection Pooler', 'P2_HIGH', 14.20, 'Exhaustion of active client connection slots on regional pooler; mitigated by circuit breaker activation and query routing.', '{"connection_spillover_count": 84, "pool_utilization_pct": 98.4, "remediation_action": "POOL_DRAIN_AND_EXPAND"}'::jsonb, 'RESOLVED', 0.05, NOW() - INTERVAL '11 hours'),
('INC-2026-612', 'Kafka Asynchronous Audit Stream', 'P3_MODERATE', 22.00, 'Consumer group rebalance latency caused brief offset lagging; offset lag resolved without message loss.', '{"lag_records": 14200, "rebalance_time_ms": 1200, "remediation_action": "REBALANCE_TOPIC_PARTITIONS"}'::jsonb, 'RESOLVED', 0.00, NOW() - INTERVAL '1 day'),
('INC-2026-584', 'Headless PDF Generation Cluster', 'P2_HIGH', 18.40, 'Chromium renderer V8 memory leak under concurrent batch reports; pods recycled via liveness probe trigger.', '{"pod_oom_restarts": 4, "heap_used_mb": 1840, "remediation_action": "POD_RECYCLE_AND_CONCURRENCY_CAP"}'::jsonb, 'MITIGATED', 0.04, NOW() - INTERVAL '2 days'),
('INC-2026-503', 'Cross-Region Replication Link', 'P3_MODERATE', 12.10, 'Transient fiber cut between Singapore and Mumbai edges; BGP rerouted packets via secondary transit peer.', '{"latency_jitter_ms": 48, "packet_loss_pre_reroute": 4.8, "remediation_action": "BGP_TRANSIT_FAILOVER"}'::jsonb, 'RESOLVED', 0.01, NOW() - INTERVAL '3 days')
ON CONFLICT (incident_id) DO NOTHING;

