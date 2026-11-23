import type { VercelRequest, VercelResponse } from './types';
// Serverless Endpoint: B2B SLA Command Center Tickets API
// Provides live operational queue, countdowns, and node telemetry

import { neon } from '@neondatabase/serverless';
import { setStandardSecurityHeaders } from '../lib/rateLimiter.js';



declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export interface SLATicketRecord {
  id: number;
  ticket_code: string;
  client_name: string;
  region: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED';
  sla_deadline: string;
  agent_name: string;
  category: string;
  created_at: string;
}

export interface NodeStatus {
  id: string;
  name: string;
  location: string;
  latencyMs: number;
  health: 'HEALTHY' | 'DEGRADED' | 'WARNING';
  activeTickets: number;
  capacityUtilization: number;
}

// Fallback synthetic dataset ensuring graceful degradation if Neon DB is offline
const FALLBACK_TICKETS: SLATicketRecord[] = [
  {
    id: 1,
    ticket_code: 'TKT-8921',
    client_name: 'FinTech Bharat Core',
    region: 'Mumbai',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(Date.now() + 42 * 60 * 1000).toISOString(),
    agent_name: 'Aarav Sharma',
    category: 'Payment Gateway Latency',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    ticket_code: 'TKT-8924',
    client_name: 'TelcoGrid Cloud APAC',
    region: 'Singapore',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    agent_name: 'Mei Ling Tan',
    category: 'Fiber Transit Peering',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    ticket_code: 'TKT-8930',
    client_name: 'AeroLogistics Global',
    region: 'Frankfurt',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(Date.now() + 160 * 60 * 1000).toISOString(),
    agent_name: 'Lukas Weber',
    category: 'EDI Manifest Ingestion',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    ticket_code: 'TKT-8935',
    client_name: 'Deccan Cloud Systems',
    region: 'Hyderabad',
    severity: 'MEDIUM',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(Date.now() + 260 * 60 * 1000).toISOString(),
    agent_name: 'Priya Reddy',
    category: 'Read Replica Drift',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    ticket_code: 'TKT-8941',
    client_name: 'SG Capital Alpha',
    region: 'Singapore',
    severity: 'LOW',
    status: 'PENDING',
    sla_deadline: new Date(Date.now() + 550 * 60 * 1000).toISOString(),
    agent_name: 'Devon Vance',
    category: 'Telemetry Ingestion Lag',
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    ticket_code: 'TKT-8948',
    client_name: 'Bharat Commerce Stack',
    region: 'Mumbai',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    sla_deadline: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
    agent_name: 'Vikram Malhotra',
    category: 'Checkout Settlement Sync',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

const GLOBAL_NODES: NodeStatus[] = [
  { id: 'node-bom', name: 'AP-WEST-1', location: 'Mumbai', latencyMs: 14, health: 'HEALTHY', activeTickets: 4, capacityUtilization: 78 },
  { id: 'node-hyd', name: 'AP-SOUTH-2', location: 'Hyderabad', latencyMs: 19, health: 'HEALTHY', activeTickets: 2, capacityUtilization: 62 },
  { id: 'node-sin', name: 'AP-SOUTHEAST-1', location: 'Singapore', latencyMs: 42, health: 'HEALTHY', activeTickets: 3, capacityUtilization: 71 },
  { id: 'node-fra', name: 'EU-CENTRAL-1', location: 'Frankfurt', latencyMs: 112, health: 'HEALTHY', activeTickets: 1, capacityUtilization: 54 }
];

async function ensureTableInitialized(sql: any): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS sla_tickets (
      id BIGSERIAL PRIMARY KEY,
      ticket_code VARCHAR(32) NOT NULL UNIQUE,
      client_name VARCHAR(128) NOT NULL,
      region VARCHAR(32) NOT NULL,
      severity VARCHAR(16) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
      sla_deadline TIMESTAMPTZ NOT NULL,
      agent_name VARCHAR(64) NOT NULL,
      category VARCHAR(64) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Inject governed perimeter security headers
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
    // Deliver graceful fallback with synthetic SLA telemetry
    res.status(200).json({
      success: true,
      source: 'LOCAL_FALLBACK',
      nodes: GLOBAL_NODES,
      tickets: FALLBACK_TICKETS,
      totalActive: FALLBACK_TICKETS.length
    });
    return;
  }

  try {
    const sql = neon(dbUrl);
    await ensureTableInitialized(sql);

    // Read active tickets
    const rows = await sql`
      SELECT 
        id,
        ticket_code,
        client_name,
        region,
        severity,
        status,
        sla_deadline::text,
        agent_name,
        category,
        created_at::text
      FROM sla_tickets
      ORDER BY sla_deadline ASC
      LIMIT 50;
    `;

    if (rows.length === 0) {
      // Seed default active tickets
      for (const t of FALLBACK_TICKETS) {
        await sql`
          INSERT INTO sla_tickets (
            ticket_code, client_name, region, severity, status, sla_deadline, agent_name, category
          ) VALUES (
            ${t.ticket_code}, ${t.client_name}, ${t.region}, ${t.severity}, ${t.status}, ${t.sla_deadline}, ${t.agent_name}, ${t.category}
          ) ON CONFLICT (ticket_code) DO NOTHING;
        `;
      }

      res.status(200).json({
        success: true,
        source: 'POSTGRES_INITIALIZED',
        nodes: GLOBAL_NODES,
        tickets: FALLBACK_TICKETS,
        totalActive: FALLBACK_TICKETS.length
      });
      return;
    }

    const tickets: SLATicketRecord[] = rows.map((r: any) => ({
      id: Number(r.id),
      ticket_code: String(r.ticket_code),
      client_name: String(r.client_name),
      region: String(r.region),
      severity: r.severity as SLATicketRecord['severity'],
      status: r.status as SLATicketRecord['status'],
      sla_deadline: String(r.sla_deadline),
      agent_name: String(r.agent_name),
      category: String(r.category),
      created_at: String(r.created_at)
    }));

    // Update node ticket counts based on real DB distribution
    const dynamicNodes = GLOBAL_NODES.map(node => {
      const activeCount = tickets.filter(t => t.region.toLowerCase() === node.location.toLowerCase()).length;
      return {
        ...node,
        activeTickets: activeCount
      };
    });

    res.status(200).json({
      success: true,
      source: 'POSTGRES_LIVE',
      nodes: dynamicNodes,
      tickets,
      totalActive: tickets.length
    });
  } catch (error: any) {
    // Fail resiliently to local fallback telemetry without crashing
    res.status(200).json({
      success: true,
      source: 'STORAGE_DEGRADED_FALLBACK',
      nodes: GLOBAL_NODES,
      tickets: FALLBACK_TICKETS,
      totalActive: FALLBACK_TICKETS.length,
      warning: error?.message || 'Database query failed; served governed fallback.'
    });
  }
}
