-- Migration: 003_create_render_fleet.sql
-- Description: Cinematic AI Render Fleet Analytics and Cloud Cost Optimization telemetry

CREATE TABLE IF NOT EXISTS render_fleet (
  id BIGSERIAL PRIMARY KEY,
  node_id VARCHAR(32) NOT NULL UNIQUE,
  cluster_name VARCHAR(64) NOT NULL,
  region VARCHAR(32) NOT NULL,
  gpu_type VARCHAR(32) NOT NULL DEFAULT 'NVIDIA A100 80GB',
  gpu_count INTEGER NOT NULL DEFAULT 8,
  active_render_jobs INTEGER NOT NULL DEFAULT 12,
  gpu_utilization_pct INTEGER NOT NULL DEFAULT 85,
  cost_per_frame_usd NUMERIC(6, 4) NOT NULL DEFAULT 0.0420,
  autoscaling_status VARCHAR(32) NOT NULL DEFAULT 'SCALED_OPTIMAL',
  frames_rendered_last_hr INTEGER NOT NULL DEFAULT 14200,
  spot_instance_savings_pct INTEGER NOT NULL DEFAULT 64,
  last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compound index for regional telemetry queries
CREATE INDEX IF NOT EXISTS idx_render_fleet_region ON render_fleet (region, autoscaling_status);
CREATE INDEX IF NOT EXISTS idx_render_fleet_util ON render_fleet (gpu_utilization_pct DESC);

-- Seed default enterprise cinematic render nodes if table is empty
INSERT INTO render_fleet (node_id, cluster_name, region, gpu_type, gpu_count, active_render_jobs, gpu_utilization_pct, cost_per_frame_usd, autoscaling_status, frames_rendered_last_hr, spot_instance_savings_pct)
SELECT * FROM (VALUES
  ('node-gpu-bom-01', 'Bharat-Chitra-Cluster-1', 'Mumbai', 'NVIDIA H100 80GB', 8, 24, 92, 0.0385, 'SCALED_OPTIMAL', 18400, 68),
  ('node-gpu-hyd-02', 'Deccan-FX-Cluster-2', 'Hyderabad', 'NVIDIA A100 80GB', 16, 38, 88, 0.0410, 'AUTOSCALING_UP', 26100, 62),
  ('node-gpu-sin-01', 'LionCity-RenderFarm', 'Singapore', 'NVIDIA L40S 48GB', 8, 14, 74, 0.0340, 'SCALED_OPTIMAL', 12800, 71),
  ('node-gpu-fra-03', 'Europa-CineVFX-Cluster', 'Frankfurt', 'NVIDIA A100 80GB', 8, 18, 81, 0.0450, 'SCALED_OPTIMAL', 15300, 58),
  ('node-gpu-bom-02', 'Bharat-Chitra-Cluster-2', 'Mumbai', 'NVIDIA RTX 6000 Ada', 12, 28, 95, 0.0390, 'BURST_CAPACITY', 21500, 65)
) AS v(node_id, cluster_name, region, gpu_type, gpu_count, active_render_jobs, gpu_utilization_pct, cost_per_frame_usd, autoscaling_status, frames_rendered_last_hr, spot_instance_savings_pct)
WHERE NOT EXISTS (SELECT 1 FROM render_fleet LIMIT 1);
