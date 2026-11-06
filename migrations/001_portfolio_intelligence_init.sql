-- Portfolio Intelligence OS - Initial PostgreSQL Schema
-- Migration: 001_portfolio_intelligence_init.sql
-- Status: LOCAL MIGRATION SPECIFICATION ONLY (NOT EXECUTED AGAINST ANY DATABASE)
--
-- Migration Characteristics:
-- - Safe for a clean, empty PostgreSQL 14+ database instance.
-- - Strictly idempotent using standard CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS.
-- - Contains zero destructive commands (no DROP, TRUNCATE, or column mutations).
-- - Does NOT reconcile or migrate existing incompatible schema versions.
-- - Has NOT been executed against any remote or local database.

-- 1. Raw Analytics Ingestion Table (Cookieless, Strict Event & Project Rules)
CREATE TABLE IF NOT EXISTS analytics_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client_timestamp TIMESTAMPTZ NOT NULL,
    event_name VARCHAR(32) NOT NULL,
    page_path VARCHAR(128) NOT NULL,
    referrer_category VARCHAR(20) NOT NULL DEFAULT 'other',
    device_category VARCHAR(16) NOT NULL DEFAULT 'desktop',
    project_id VARCHAR(40) NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_aggregated BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT chk_event_name CHECK (
        event_name IN (
            'page_view', 'project_view', 'resume_download',
            'contact_click', 'whatsapp_click', 'email_click', 'job_match_use'
        )
    ),
    CONSTRAINT chk_page_path CHECK (
        page_path ~ '^(/|#contact|/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*)$'
        AND LENGTH(page_path) <= 128
    ),
    CONSTRAINT chk_referrer_category CHECK (
        referrer_category IN ('direct', 'search', 'social', 'internal', 'other')
    ),
    CONSTRAINT chk_device_category CHECK (
        device_category IN ('desktop', 'mobile', 'tablet')
    ),
    CONSTRAINT chk_event_project_id_rules CHECK (
        (
            event_name = 'project_view'
            AND project_id IS NOT NULL
            AND project_id IN (
                'phonepe-valuation',
                'stratos-governance',
                'spiideo-sports-analytics',
                'it-support-analytics',
                'smartbank-360',
                'equitrack-analytics-os'
            )
        )
        OR
        (
            event_name <> 'project_view'
            AND project_id IS NULL
        )
    ),
    CONSTRAINT chk_metadata_type CHECK (
        jsonb_typeof(metadata) = 'object'
    )
);

CREATE INDEX IF NOT EXISTS idx_events_received_at 
    ON analytics_events (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_unaggregated 
    ON analytics_events (received_at) 
    WHERE is_aggregated = FALSE;
CREATE INDEX IF NOT EXISTS idx_events_date_received 
    ON analytics_events ((DATE(received_at AT TIME ZONE 'UTC')), received_at);


-- 2. Daily Summary Table (Recomputable Rollup)
CREATE TABLE IF NOT EXISTS daily_analytics_summary (
    summary_date DATE PRIMARY KEY,
    page_views INTEGER NOT NULL DEFAULT 0,
    project_views INTEGER NOT NULL DEFAULT 0,
    resume_downloads INTEGER NOT NULL DEFAULT 0,
    contact_clicks INTEGER NOT NULL DEFAULT 0,
    whatsapp_clicks INTEGER NOT NULL DEFAULT 0,
    email_clicks INTEGER NOT NULL DEFAULT 0,
    job_match_uses INTEGER NOT NULL DEFAULT 0,
    project_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    referrer_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    device_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    recomputed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_source_event_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT chk_summary_metrics_non_negative CHECK (
        page_views >= 0 AND project_views >= 0 AND 
        resume_downloads >= 0 AND contact_clicks >= 0 AND
        whatsapp_clicks >= 0 AND email_clicks >= 0 AND
        job_match_uses >= 0
    )
);


-- 3. Maintenance & Operational Audit Log Table (Zero PII or Secrets)
CREATE TABLE IF NOT EXISTS maintenance_audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation VARCHAR(40) NOT NULL,
    target_date DATE NULL,
    status VARCHAR(20) NOT NULL,
    rows_affected INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_log_operation CHECK (
        operation IN ('AGGREGATION', 'RETENTION_PURGE')
    ),
    CONSTRAINT chk_log_status CHECK (
        status IN ('SUCCESS', 'WARNING', 'FAILED')
    )
);

CREATE INDEX IF NOT EXISTS idx_maintenance_log_op 
    ON maintenance_audit_log (operation, created_at DESC);


-- 4. Session State Table (Stateful Revocation & Invalidation)
CREATE TABLE IF NOT EXISTS auth_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token_hash CHAR(64) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_hash 
    ON auth_sessions (session_token_hash) 
    WHERE is_revoked = FALSE;
