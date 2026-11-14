// Serverless Endpoint: Autonomous System Reliability & Chaos Engineering Simulator
// Serves synthetic fault injection, circuit breaker states, p99 latency, and autonomous self-healing telemetry

import { neon } from '@neondatabase/serverless';
import { setStandardSecurityHeaders } from '../../server/lib/rateLimiter.js';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export interface ReliabilityClusterRecord {
  id: number;
  cluster_id: string;
  cluster_name: string;
  region: string;
  health_score: number;
  circuit_breaker_state: 'CLOSED' | 'HALF_OPEN' | 'OPEN' | 'FORCED_OPEN';
  p99_latency_ms: number;
  simulated_failure_mode: string;
  remediation_status: 'HEALTHY' | 'SELF_HEALING' | 'DEGRADED' | 'RECOVERED';
  active_replicas: number;
  failover_target_region: string;
  last_chaos_injected_at: string;
  updated_at: string;
}

export interface ReliabilityMetrics {
  totalClusters: number;
  averageHealthScore: number;
  globalP99LatencyMs: number;
  healthyCount: number;
  selfHealingCount: number;
  openCircuitsCount: number;
  activeReplicasTotal: number;
}

const FALLBACK_CLUSTERS: ReliabilityClusterRecord[] = [
  {
    id: 1,
    cluster_id: 'CLUSTER-BOM-01',
    cluster_name: 'Core Transaction Ledger API',
    region: 'ap-south-1 (Mumbai)',
    health_score: 99.40,
    circuit_breaker_state: 'CLOSED',
    p99_latency_ms: 14.20,
    simulated_failure_mode: 'NONE',
    remediation_status: 'HEALTHY',
    active_replicas: 12,
    failover_target_region: 'ap-southeast-1 (Singapore)',
    last_chaos_injected_at: new Date(Date.now() - 720000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    cluster_id: 'CLUSTER-HYD-02',
    cluster_name: 'Async Event Processing Bus',
    region: 'ap-south-2 (Hyderabad)',
    health_score: 94.80,
    circuit_breaker_state: 'HALF_OPEN',
    p99_latency_ms: 42.50,
    simulated_failure_mode: 'PACKET_LOSS_15PCT',
    remediation_status: 'SELF_HEALING',
    active_replicas: 8,
    failover_target_region: 'ap-south-1 (Mumbai)',
    last_chaos_injected_at: new Date(Date.now() - 240000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    cluster_id: 'CLUSTER-SIN-01',
    cluster_name: 'Global Edge CDN & Telemetry',
    region: 'ap-southeast-1 (Singapore)',
    health_score: 99.95,
    circuit_breaker_state: 'CLOSED',
    p99_latency_ms: 8.10,
    simulated_failure_mode: 'NONE',
    remediation_status: 'HEALTHY',
    active_replicas: 16,
    failover_target_region: 'ap-northeast-1 (Tokyo)',
    last_chaos_injected_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    cluster_id: 'CLUSTER-FRA-01',
    cluster_name: 'European Compliance Archive',
    region: 'eu-central-1 (Frankfurt)',
    health_score: 91.20,
    circuit_breaker_state: 'CLOSED',
    p99_latency_ms: 68.40,
    simulated_failure_mode: 'DNS_THROTTLING_SIM',
    remediation_status: 'RECOVERED',
    active_replicas: 6,
    failover_target_region: 'eu-west-1 (Ireland)',
    last_chaos_injected_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    cluster_id: 'CLUSTER-IAD-01',
    cluster_name: 'Cross-Atlantic Backup Hub',
    region: 'us-east-1 (N. Virginia)',
    health_score: 87.50,
    circuit_breaker_state: 'OPEN',
    p99_latency_ms: 185.00,
    simulated_failure_mode: 'ZONAL_BLACKHOLE_SIM',
    remediation_status: 'DEGRADED',
    active_replicas: 4,
    failover_target_region: 'us-east-2 (Ohio)',
    last_chaos_injected_at: new Date(Date.now() - 120000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

function calculateMetrics(clusters: ReliabilityClusterRecord[]): ReliabilityMetrics {
  const totalClusters = clusters.length;
  if (totalClusters === 0) {
    return {
      totalClusters: 0,
      averageHealthScore: 0,
      globalP99LatencyMs: 0,
      healthyCount: 0,
      selfHealingCount: 0,
      openCircuitsCount: 0,
      activeReplicasTotal: 0
    };
  }

  const sumHealth = clusters.reduce((acc, c) => acc + Number(c.health_score), 0);
  const sumLatency = clusters.reduce((acc, c) => acc + Number(c.p99_latency_ms), 0);
  const healthyCount = clusters.filter(c => c.remediation_status === 'HEALTHY' || c.remediation_status === 'RECOVERED').length;
  const selfHealingCount = clusters.filter(c => c.remediation_status === 'SELF_HEALING').length;
  const openCircuitsCount = clusters.filter(c => c.circuit_breaker_state === 'OPEN' || c.circuit_breaker_state === 'FORCED_OPEN').length;
  const activeReplicasTotal = clusters.reduce((acc, c) => acc + Number(c.active_replicas), 0);

  return {
    totalClusters,
    averageHealthScore: parseFloat((sumHealth / totalClusters).toFixed(2)),
    globalP99LatencyMs: parseFloat((sumLatency / totalClusters).toFixed(2)),
    healthyCount,
    selfHealingCount,
    openCircuitsCount,
    activeReplicasTotal
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setStandardSecurityHeaders(res);

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    res.status(200).json({
      success: true,
      source: 'fallback',
      metrics: calculateMetrics(FALLBACK_CLUSTERS),
      clusters: FALLBACK_CLUSTERS
    });
    return;
  }

  try {
    const sql = neon(databaseUrl);

    // Auto-create table if not exists
    await sql`
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
      )
    `;

    const rows = await sql`
      SELECT 
        id,
        cluster_id,
        cluster_name,
        region,
        health_score::float,
        circuit_breaker_state,
        p99_latency_ms::float,
        simulated_failure_mode,
        remediation_status,
        active_replicas,
        failover_target_region,
        last_chaos_injected_at,
        updated_at
      FROM reliability_chaos_metrics
      ORDER BY health_score ASC, p99_latency_ms DESC
      LIMIT 50
    `;

    if (!rows || rows.length === 0) {
      for (const item of FALLBACK_CLUSTERS) {
        await sql`
          INSERT INTO reliability_chaos_metrics (
            cluster_id, cluster_name, region, health_score, circuit_breaker_state, p99_latency_ms, simulated_failure_mode, remediation_status, active_replicas, failover_target_region, last_chaos_injected_at
          ) VALUES (
            ${item.cluster_id},
            ${item.cluster_name},
            ${item.region},
            ${item.health_score},
            ${item.circuit_breaker_state},
            ${item.p99_latency_ms},
            ${item.simulated_failure_mode},
            ${item.remediation_status},
            ${item.active_replicas},
            ${item.failover_target_region},
            ${item.last_chaos_injected_at}
          )
          ON CONFLICT (cluster_id) DO NOTHING
        `;
      }

      res.status(200).json({
        success: true,
        source: 'database_seeded',
        metrics: calculateMetrics(FALLBACK_CLUSTERS),
        clusters: FALLBACK_CLUSTERS
      });
      return;
    }

    const clusters = rows as ReliabilityClusterRecord[];

    res.status(200).json({
      success: true,
      source: 'database',
      metrics: calculateMetrics(clusters),
      clusters
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Reliability chaos query error:', message);

    res.status(200).json({
      success: true,
      source: 'fallback_error',
      metrics: calculateMetrics(FALLBACK_CLUSTERS),
      clusters: FALLBACK_CLUSTERS,
      warning: 'Live database encountered a temporary error; showing governed cache'
    });
  }
}
