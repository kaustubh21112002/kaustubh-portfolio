import React, { useState, useEffect } from 'react';

export interface SLATicket {
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

interface SLATicketQueueProps {
  tickets: SLATicket[];
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}

function calculateTimeRemaining(deadlineStr: string): { totalMs: number; formatted: string; isBreached: boolean } {
  const deadline = new Date(deadlineStr).getTime();
  const now = Date.now();
  const diff = deadline - now;

  if (diff <= 0) {
    const overdue = Math.abs(diff);
    const mins = Math.floor((overdue / (1000 * 60)) % 60);
    const hours = Math.floor(overdue / (1000 * 60 * 60));
    return {
      totalMs: diff,
      formatted: `BREACHED +${hours}h ${mins}m`,
      isBreached: true
    };
  }

  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return {
    totalMs: diff,
    formatted: `${hours}h ${mins}m remaining`,
    isBreached: false
  };
}

export const SLATicketQueue: React.FC<SLATicketQueueProps> = ({
  tickets,
  selectedRegion,
  onSelectRegion
}) => {
  const [, setTick] = useState(0);

  // Live countdown tick every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = selectedRegion
    ? tickets.filter(t => t.region.toLowerCase() === selectedRegion.toLowerCase())
    : tickets;

  const getSeverityBadge = (severity: SLATicket['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Operational SLA Queue
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant incident tracking with automated deadline breach indicators.
          </p>
        </div>

        {selectedRegion && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filtering:</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {selectedRegion}
            </span>
            <button
              onClick={() => onSelectRegion(null)}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3">Ticket</th>
              <th className="py-2.5 px-3">Enterprise Client</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Region Node</th>
              <th className="py-2.5 px-3">Assigned Agent</th>
              <th className="py-2.5 px-3 text-right">SLA Target Window</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredTickets.map(ticket => {
              const countdown = calculateTimeRemaining(ticket.sla_deadline);
              return (
                <tr key={ticket.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-emerald-400">
                    {ticket.ticket_code}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                    {ticket.client_name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">
                    {ticket.category}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityBadge(ticket.severity)}`}>
                      {ticket.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {ticket.region}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">
                    {ticket.agent_name}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      countdown.isBreached
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : countdown.totalMs < 30 * 60 * 1000
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        countdown.isBreached ? 'bg-rose-400' : countdown.totalMs < 30 * 60 * 1000 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}></span>
                      {countdown.formatted}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
