-- Migration 014: Create Cloud FinOps & Infrastructure Cost Optimization Table
-- Models cloud compute spend, serverless attribution, database provisioning costs, and optimization savings

CREATE TABLE IF NOT EXISTS cloud_finops (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(64) UNIQUE NOT NULL,
    workload_name VARCHAR(128) NOT NULL,
    service_provider VARCHAR(64) NOT NULL CHECK (service_provider IN ('AWS', 'GCP', 'VERCEL_EDGE', 'NEON_POSTGRES', 'CLOUDFLARE')),
    monthly_spend_inr NUMERIC(12,2) NOT NULL CHECK (monthly_spend_inr >= 0),
    utilization_efficiency_pct NUMERIC(5,2) NOT NULL CHECK (utilization_efficiency_pct >= 0 AND utilization_efficiency_pct <= 100),
    optimization_potential_inr NUMERIC(12,2) NOT NULL CHECK (optimization_potential_inr >= 0),
    governance_status VARCHAR(32) NOT NULL CHECK (governance_status IN ('OPTIMIZED', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'RESERVED_INSTANCE', 'AUTOSCALED')),
    last_audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for FinOps telemetry queries
CREATE INDEX IF NOT EXISTS idx_cloud_finops_governance 
ON cloud_finops(governance_status, service_provider);

CREATE INDEX IF NOT EXISTS idx_cloud_finops_spend 
ON cloud_finops(monthly_spend_inr DESC);

-- Seed realistic enterprise FinOps workload telemetry records
INSERT INTO cloud_finops (
    resource_id, workload_name, service_provider, monthly_spend_inr, utilization_efficiency_pct, optimization_potential_inr, governance_status, last_audited_at
) VALUES
('FIN-RES-001', 'Serverless Edge API & Middleware Fleet', 'VERCEL_EDGE', 64500.00, 94.20, 4800.00, 'OPTIMIZED', NOW() - INTERVAL '2 hours'),
('FIN-RES-002', 'High-Availability PostgreSQL Branch Pool', 'NEON_POSTGRES', 142000.00, 81.50, 28500.00, 'AUTOSCALED', NOW() - INTERVAL '4 hours'),
('FIN-RES-003', 'Render Fleet EKS Cluster (c5.4xlarge)', 'AWS', 315000.00, 68.40, 89000.00, 'ACTION_REQUIRED', NOW() - INTERVAL '1 day'),
('FIN-RES-004', 'Gemini Multi-Agent BigQuery Dataflow', 'GCP', 188500.00, 89.00, 19200.00, 'OPTIMIZED', NOW() - INTERVAL '6 hours'),
('FIN-RES-005', 'Global CDN Edge Caching & WAF Protection', 'CLOUDFLARE', 42000.00, 97.60, 1500.00, 'RESERVED_INSTANCE', NOW() - INTERVAL '12 hours'),
('FIN-RES-006', 'Cold Storage & Disaster Recovery S3 Vault', 'AWS', 78400.00, 72.10, 16800.00, 'UNDER_REVIEW', NOW() - INTERVAL '8 hours')
ON CONFLICT (resource_id) DO NOTHING;

