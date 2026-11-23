import type { VercelRequest, VercelResponse } from './types';
// Serverless Endpoint: Cinematic AI Render Fleet Analytics & Cloud Cost Optimization
// Provides compute node telemetry, GPU utilization meters, and spot instance arbitrage metrics

import { neon } from '@neondatabase/serverless';
import { setStandardSecurityHeaders } from '../lib/rateLimiter.js';



declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export interface RenderNodeRecord {
  id: number;
  node_id: string;
  cluster_name: string;
  region: string;
  gpu_type: string;
  gpu_count: number;
  active_render_jobs: number;
  gpu_utilization_pct: number;
  cost_per_frame_usd: number;
  autoscaling_status: 'SCALED_OPTIMAL' | 'AUTOSCALING_UP' | 'BURST_CAPACITY' | 'DRAINING';
  frames_rendered_last_hr: number;
  spot_instance_savings_pct: number;
  last_heartbeat_at: string;
  created_at: string;
}

export interface FleetSummary {
  totalGpus: number;
  totalActiveJobs: number;
  avgGpuUtilizationPct: number;
  avgCostPerFrameUsd: number;
  totalFramesLastHr: number;
  avgSpotSavingsPct: number;
}

const FALLBACK_FLEET: RenderNodeRecord[] = [
  {
    id: 1,
    node_id: 'node-gpu-bom-01',
    cluster_name: 'Bharat-Chitra-Cluster-1',
    region: 'Mumbai',
    gpu_type: 'NVIDIA H100 80GB',
    gpu_count: 8,
    active_render_jobs: 24,
    gpu_utilization_pct: 92,
    cost_per_frame_usd: 0.0385,
    autoscaling_status: 'SCALED_OPTIMAL',
    frames_rendered_last_hr: 18400,
    spot_instance_savings_pct: 68,
    last_heartbeat_at: new Date(Date.now() - 30 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
  },
  {
    id: 2,
    node_id: 'node-gpu-hyd-02',
    cluster_name: 'Deccan-FX-Cluster-2',
    region: 'Hyderabad',
    gpu_type: 'NVIDIA A100 80GB',
    gpu_count: 16,
    active_render_jobs: 38,
    gpu_utilization_pct: 88,
    cost_per_frame_usd: 0.0410,
    autoscaling_status: 'AUTOSCALING_UP',
    frames_rendered_last_hr: 26100,
    spot_instance_savings_pct: 62,
    last_heartbeat_at: new Date(Date.now() - 20 * 1000).toISOString(),
    created_at: new Date(Date.now() - 25 * 86400 * 1000).toISOString()
  },
  {
    id: 3,
    node_id: 'node-gpu-sin-01',
    cluster_name: 'LionCity-RenderFarm',
    region: 'Singapore',
    gpu_type: 'NVIDIA L40S 48GB',
    gpu_count: 8,
    active_render_jobs: 14,
    gpu_utilization_pct: 74,
    cost_per_frame_usd: 0.0340,
    autoscaling_status: 'SCALED_OPTIMAL',
    frames_rendered_last_hr: 12800,
    spot_instance_savings_pct: 71,
    last_heartbeat_at: new Date(Date.now() - 45 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400 * 1000).toISOString()
  },
  {
    id: 4,
    node_id: 'node-gpu-fra-03',
    cluster_name: 'Europa-CineVFX-Cluster',
    region: 'Frankfurt',
    gpu_type: 'NVIDIA A100 80GB',
    gpu_count: 8,
    active_render_jobs: 18,
    gpu_utilization_pct: 81,
    cost_per_frame_usd: 0.0450,
    autoscaling_status: 'SCALED_OPTIMAL',
    frames_rendered_last_hr: 15300,
    spot_instance_savings_pct: 58,
    last_heartbeat_at: new Date(Date.now() - 15 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400 * 1000).toISOString()
  },
  {
    id: 5,
    node_id: 'node-gpu-bom-02',
    cluster_name: 'Bharat-Chitra-Cluster-2',
    region: 'Mumbai',
    gpu_type: 'NVIDIA RTX 6000 Ada',
    gpu_count: 12,
    active_render_jobs: 28,
    gpu_utilization_pct: 95,
    cost_per_frame_usd: 0.0390,
    autoscaling_status: 'BURST_CAPACITY',
    frames_rendered_last_hr: 21500,
    spot_instance_savings_pct: 65,
    last_heartbeat_at: new Date(Date.now() - 10 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString()
  }
];

function computeFleetSummary(nodes: RenderNodeRecord[]): FleetSummary {
  const totalGpus = nodes.reduce((sum, n) => sum + n.gpu_count, 0);
  const totalActiveJobs = nodes.reduce((sum, n) => sum + n.active_render_jobs, 0);
  const avgGpuUtilizationPct = Math.round(
    nodes.reduce((sum, n) => sum + n.gpu_utilization_pct, 0) / nodes.length
  );
  const avgCostPerFrameUsd = Number(
    (nodes.reduce((sum, n) => sum + n.cost_per_frame_usd, 0) / nodes.length).toFixed(4)
  );
  const totalFramesLastHr = nodes.reduce((sum, n) => sum + n.frames_rendered_last_hr, 0);
  const avgSpotSavingsPct = Math.round(
    nodes.reduce((sum, n) => sum + n.spot_instance_savings_pct, 0) / nodes.length
  );

  return {
    totalGpus,
    totalActiveJobs,
    avgGpuUtilizationPct,
    avgCostPerFrameUsd,
    totalFramesLastHr,
    avgSpotSavingsPct
  };
}

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
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
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setStandardSecurityHeaders(res);
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are permitted.'
    });
    return;
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!dbUrl) {
    res.status(200).json({
      success: true,
      source: 'LOCAL_FALLBACK',
      nodes: FALLBACK_FLEET,
      summary: computeFleetSummary(FALLBACK_FLEET)
    });
    return;
  }

  try {
    const sql = neon(dbUrl);
    await ensureTableInitialized(sql);

    const rows = await sql`
      SELECT 
        id,
        node_id,
        cluster_name,
        region,
        gpu_type,
        gpu_count,
        active_render_jobs,
        gpu_utilization_pct,
        cost_per_frame_usd::float as cost_per_frame_usd,
        autoscaling_status,
        frames_rendered_last_hr,
        spot_instance_savings_pct,
        last_heartbeat_at::text,
        created_at::text
      FROM render_fleet
      ORDER BY gpu_utilization_pct DESC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      for (const node of FALLBACK_FLEET) {
        await sql`
          INSERT INTO render_fleet (
            node_id, cluster_name, region, gpu_type, gpu_count, active_render_jobs, gpu_utilization_pct, cost_per_frame_usd, autoscaling_status, frames_rendered_last_hr, spot_instance_savings_pct
          ) VALUES (
            ${node.node_id}, ${node.cluster_name}, ${node.region}, ${node.gpu_type}, ${node.gpu_count}, ${node.active_render_jobs}, ${node.gpu_utilization_pct}, ${node.cost_per_frame_usd}, ${node.autoscaling_status}, ${node.frames_rendered_last_hr}, ${node.spot_instance_savings_pct}
          );
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        nodes: FALLBACK_FLEET,
        summary: computeFleetSummary(FALLBACK_FLEET)
      });
      return;
    }

    const nodes: RenderNodeRecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      node_id: String(r.node_id),
      cluster_name: String(r.cluster_name),
      region: String(r.region),
      gpu_type: String(r.gpu_type),
      gpu_count: Number(r.gpu_count),
      active_render_jobs: Number(r.active_render_jobs),
      gpu_utilization_pct: Number(r.gpu_utilization_pct),
      cost_per_frame_usd: Number(r.cost_per_frame_usd),
      autoscaling_status: r.autoscaling_status as RenderNodeRecord['autoscaling_status'],
      frames_rendered_last_hr: Number(r.frames_rendered_last_hr),
      spot_instance_savings_pct: Number(r.spot_instance_savings_pct),
      last_heartbeat_at: String(r.last_heartbeat_at),
      created_at: String(r.created_at)
    }));

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      nodes,
      summary: computeFleetSummary(nodes)
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      nodes: FALLBACK_FLEET,
      summary: computeFleetSummary(FALLBACK_FLEET),
      warning: error?.message || 'Database query failed; served fallback telemetry.'
    });
  }
}
