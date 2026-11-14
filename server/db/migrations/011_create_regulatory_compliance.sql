-- Migration 011: Create Regulatory Compliance and Statutory Audit Table
-- Tracks automated GST verification, Udyam MSME compliance, statutory tax reconciliation, and regulatory risk scoring

CREATE TABLE IF NOT EXISTS regulatory_compliance (
    id SERIAL PRIMARY KEY,
    compliance_id VARCHAR(64) UNIQUE NOT NULL,
    enterprise_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) NOT NULL,
    udyam_number VARCHAR(32) NOT NULL,
    tax_filing_status VARCHAR(64) NOT NULL CHECK (tax_filing_status IN ('GSTR_FILED_ON_TIME', 'GSTR_MATCHED_2B', 'RECONCILIATION_PENDING', 'STATUTORY_DEFICIT')),
    audit_risk_score NUMERIC(5,2) NOT NULL CHECK (audit_risk_score >= 0 AND audit_risk_score <= 100),
    penalty_exposure_inr NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    last_audit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    compliance_tier VARCHAR(32) NOT NULL DEFAULT 'TIER_1_EXEMPLARY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indexes for statutory compliance queries
CREATE INDEX IF NOT EXISTS idx_regulatory_compliance_risk 
ON regulatory_compliance(audit_risk_score ASC, tax_filing_status);

CREATE INDEX IF NOT EXISTS idx_regulatory_compliance_gstin 
ON regulatory_compliance(gstin);

-- Seed realistic regulatory and statutory enterprise records
INSERT INTO regulatory_compliance (
    compliance_id, enterprise_name, gstin, udyam_number, tax_filing_status, audit_risk_score, penalty_exposure_inr, last_audit_date, compliance_tier
) VALUES
('COMPL-MH-01', 'GruhLaxmi Agro Enterprise Ltd', '27AAACG0182N1Z4', 'UDYAM-MH-19-0028194', 'GSTR_MATCHED_2B', 4.50, 0.00, NOW() - INTERVAL '3 days', 'TIER_1_EXEMPLARY'),
('COMPL-MH-02', 'Pune Precision Tooling Works', '27AABCP8841M1ZG', 'UDYAM-MH-26-0049182', 'GSTR_FILED_ON_TIME', 8.20, 15000.00, NOW() - INTERVAL '5 days', 'TIER_1_EXEMPLARY'),
('COMPL-TS-01', 'Hyderabad FastLogistics Fleet', '36AABCS9102K1ZP', 'UDYAM-TS-02-0019284', 'RECONCILIATION_PENDING', 28.40, 142000.00, NOW() - INTERVAL '1 day', 'TIER_2_MODERATE'),
('COMPL-KA-01', 'Bengaluru FinCloud Infrastructure', '29AACCP4412L1ZS', 'UDYAM-KR-03-0098124', 'GSTR_MATCHED_2B', 2.10, 0.00, NOW() - INTERVAL '2 days', 'TIER_1_EXEMPLARY'),
('COMPL-DL-01', 'North India Consumer Goods Corp', '07AACCN1209D1ZH', 'UDYAM-DL-01-0044910', 'STATUTORY_DEFICIT', 64.80, 895000.00, NOW() - INTERVAL '12 hours', 'TIER_3_ELEVATED')
ON CONFLICT (compliance_id) DO NOTHING;
