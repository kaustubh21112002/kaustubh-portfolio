-- Migration 012: Create Autonomous Agentic Workflows Table
-- Tracks background agentic workers, automated task pipelines, LLM token throughput, and operational routing telemetry

CREATE TABLE IF NOT EXISTS agentic_workflows (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(64) UNIQUE NOT NULL,
    agent_name VARCHAR(128) NOT NULL,
    task_type VARCHAR(64) NOT NULL CHECK (task_type IN ('DATA_RECONCILIATION', 'SLA_BREACH_PREDICTION', 'DOCUMENT_TAILORING', 'CHAOS_FAULT_INJECTION', 'TAX_AUDIT_VERIFICATION')),
    execution_status VARCHAR(32) NOT NULL CHECK (execution_status IN ('RUNNING', 'COMPLETED', 'QUEUED', 'FAILED', 'PAUSED')),
    token_consumption INTEGER NOT NULL CHECK (token_consumption >= 0),
    latency_ms NUMERIC(7,2) NOT NULL CHECK (latency_ms >= 0),
    model_provider VARCHAR(64) NOT NULL DEFAULT 'Gemini-2.5-Pro',
    success_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    last_executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for agentic workflow telemetry queries
CREATE INDEX IF NOT EXISTS idx_agentic_workflows_status 
ON agentic_workflows(execution_status, task_type);

CREATE INDEX IF NOT EXISTS idx_agentic_workflows_tokens 
ON agentic_workflows(token_consumption DESC);

-- Seed realistic autonomous agent workflow records
INSERT INTO agentic_workflows (
    workflow_id, agent_name, task_type, execution_status, token_consumption, latency_ms, model_provider, success_rate_pct, last_executed_at
) VALUES
('WF-AGENT-01', 'Reconciliation Arbiter Agent', 'DATA_RECONCILIATION', 'RUNNING', 18450, 420.50, 'Gemini-2.5-Pro', 99.80, NOW() - INTERVAL '4 minutes'),
('WF-AGENT-02', 'SLA Predictive Sentinel', 'SLA_BREACH_PREDICTION', 'COMPLETED', 12100, 280.00, 'Gemini-2.5-Flash', 98.90, NOW() - INTERVAL '15 minutes'),
('WF-AGENT-03', 'Grounded Dossier Compiler', 'DOCUMENT_TAILORING', 'COMPLETED', 34200, 890.20, 'Claude-3.5-Sonnet', 99.40, NOW() - INTERVAL '1 hour'),
('WF-AGENT-04', 'Multi-Region Chaos Engine', 'CHAOS_FAULT_INJECTION', 'QUEUED', 8500, 195.40, 'Gemini-2.5-Flash', 97.50, NOW() - INTERVAL '30 minutes'),
('WF-AGENT-05', 'Statutory GST Auditor', 'TAX_AUDIT_VERIFICATION', 'COMPLETED', 26800, 640.80, 'Gemini-2.5-Pro', 100.00, NOW() - INTERVAL '2 hours')
ON CONFLICT (workflow_id) DO NOTHING;

