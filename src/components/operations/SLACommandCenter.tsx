import React, { useState, useEffect } from 'react';
import { SLATicketQueue, type SLATicket, type NodeStatus } from './SLATicketQueue';
import { GlobalNodesMatrix } from './GlobalNodesMatrix';

interface SLACommandCenterProps {
  initialRegion?: string | null;
}

export const SLACommandCenter: React.FC<SLACommandCenterProps> = ({ initialRegion = null }) => {
  const [tickets, setTickets] = useState<SLATicket[]>([]);
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(initialRegion);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchOperationsData() {
      try {
        const res = await fetch('/api/operations/tickets');
        if (!res.ok) throw new Error('API returned ' + res.status);
        const data = await res.json();
        if (isMounted && data.success) {
          setTickets(data.tickets || []);
          setNodes(data.nodes || []);
          setDataSource(data.source || 'LIVE');
        }
      } catch {
        if (isMounted) {
          // Graceful in-browser fallback
          setDataSource('LOCAL_CLIENT_FALLBACK');
          setNodes([
            { id: 'node-bom', name: 'AP-WEST-1', location: 'Mumbai', latencyMs: 14, health: 'HEALTHY', activeTickets: 2, capacityUtilization: 78 },
            { id: 'node-hyd', name: 'AP-SOUTH-2', location: 'Hyderabad', latencyMs: 19, health: 'HEALTHY', activeTickets: 1, capacityUtilization: 62 },
            { id: 'node-sin', name: 'AP-SOUTHEAST-1', location: 'Singapore', latencyMs: 42, health: 'HEALTHY', activeTickets: 2, capacityUtilization: 71 },
            { id: 'node-fra', name: 'EU-CENTRAL-1', location: 'Frankfurt', latencyMs: 112, health: 'HEALTHY', activeTickets: 1, capacityUtilization: 54 }
          ]);
          setTickets([
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
              created_at: new Date().toISOString()
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
              created_at: new Date().toISOString()
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
              created_at: new Date().toISOString()
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
              created_at: new Date().toISOString()
            }
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchOperationsData();

    // Auto-refresh operations telemetry every 30 seconds
    const interval = setInterval(fetchOperationsData, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full my-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              B2B SLA COMMAND CENTER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-region incident triage, SLA countdown clocks, and distributed edge telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-cyan-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {tickets.length} Active Tickets
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Establishing secure link to operations telemetry...
        </div>
      ) : (
        <>
          <GlobalNodesMatrix
            nodes={nodes}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />

          <SLATicketQueue
            tickets={tickets}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </>
      )}
    </div>
  );
};
