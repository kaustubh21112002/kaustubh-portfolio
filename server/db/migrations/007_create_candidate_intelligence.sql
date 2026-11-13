-- Migration 007: Create Candidate Intelligence and Grounded Tailoring Table
-- Tracks candidate profile ingestion, skill match scoring, and SHA-256 cryptographic approval gate services

CREATE TABLE IF NOT EXISTS candidate_intelligence (
    id SERIAL PRIMARY KEY,
    candidate_id VARCHAR(64) UNIQUE NOT NULL,
    profile_name VARCHAR(255) NOT NULL,
    target_role VARCHAR(255) NOT NULL,
    domain VARCHAR(128) NOT NULL,
    skill_match_score NUMERIC(5,2) NOT NULL CHECK (skill_match_score >= 0 AND skill_match_score <= 100),
    matched_skills TEXT[] NOT NULL DEFAULT '{}',
    missing_skills TEXT[] NOT NULL DEFAULT '{}',
    tailoring_status VARCHAR(64) NOT NULL CHECK (tailoring_status IN ('GROUNDED', 'IN_REVIEW', 'APPROVED', 'REQUIRES_AMENDMENT')),
    sha256_approval_hash VARCHAR(64) NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    document_version VARCHAR(32) NOT NULL DEFAULT 'v1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound indices for telemetry queries
CREATE INDEX IF NOT EXISTS idx_candidate_intelligence_status_score 
ON candidate_intelligence(tailoring_status, skill_match_score DESC);

CREATE INDEX IF NOT EXISTS idx_candidate_intelligence_role 
ON candidate_intelligence(target_role);

-- Seed realistic operational candidate intelligence telemetry
INSERT INTO candidate_intelligence (
    candidate_id, profile_name, target_role, domain, skill_match_score, matched_skills, missing_skills, tailoring_status, sha256_approval_hash, verified_at, document_version
) VALUES
('CAND-8021', 'Kaustubh Nandurkar', 'Staff AI / Enterprise Architect', 'Distributed Systems & GenAI', 98.50, ARRAY['TypeScript', 'PostgreSQL', 'Vercel Serverless', 'System Architecture', 'Financial DCF Modeling', 'SLA Governance'], ARRAY['COBOL'], 'APPROVED', '317857d88309548d9d05e8198ffbf8212c88470c000000000000000000000000', NOW() - INTERVAL '2 hours', 'v2.4.0'),
('CAND-7492', 'Vikram Malhotra', 'Principal Cloud Data Engineer', 'Data Warehousing & Lakehouse', 92.40, ARRAY['BigQuery', 'Apache Spark', 'Dataproc', 'Python', 'dbt'], ARRAY['Rust', 'Go'], 'APPROVED', 'a8f7c9e2d140e6b52819f074a35bc7d6201e549fb2a4d3107865c10fa89e2401', NOW() - INTERVAL '6 hours', 'v1.8.2'),
('CAND-6104', 'Ananya Deshmukh', 'Lead Full-Stack Security Engineer', 'AppSec & Zero-Trust', 88.75, ARRAY['OAuth 2.0', 'scrypt / Cryptography', 'Next.js', 'PostgreSQL', 'WAF Configuration'], ARRAY['Reverse Engineering', 'Assembly'], 'GROUNDED', 'e4b98c76fa1034d825c7a9021e54b689df0124ca65893e1074bc85023fa128cd', NOW() - INTERVAL '14 hours', 'v1.3.0'),
('CAND-5520', 'Rohan Kulkarni', 'Senior MLOps & Platform Engineer', 'Applied AI / Production ML', 94.10, ARRAY['Kubernetes', 'Ray / Triton', 'PyTorch', 'Model Quantization', 'CI/CD Pipelines'], ARRAY['FPGA Programming'], 'APPROVED', '7c8d92a104ef6b539820ca1475df890123e456ba7890cd1234ef567890ab1234', NOW() - INTERVAL '1 day', 'v2.1.0'),
('CAND-4918', 'Priya Ramanathan', 'Enterprise FinTech Product Lead', 'B2B SaaS & Financial Tech', 81.20, ARRAY['Product Roadmap', 'Statutory Compliance', 'UPI Ecosystem', 'Agile Governance'], ARRAY['Solidity', 'Web3'], 'IN_REVIEW', 'f1029384756acbdee12485906734120895bcfa1029384756acbdee1248590673', NOW() - INTERVAL '1 day', 'v1.1.0')
ON CONFLICT (candidate_id) DO NOTHING;
