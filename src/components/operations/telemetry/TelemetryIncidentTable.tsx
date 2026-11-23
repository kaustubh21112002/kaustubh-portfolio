import React, { useState } from 'react';
import type { IncidentPostMortemRecord } from '../../../../server/operations';

interface TelemetryIncidentTableProps {
  incidents: IncidentPostMortemRecord[];
}

export const TelemetryIncidentTable: React.FC<TelemetryIncidentTableProps> = ({ incidents }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentPostMortemRecord | null>(null);

  const getSeverityBadge = (severity: IncidentPostMortemRecord['severity']) => {
    switch (severity) {
      case 'P1_CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            P1 Critical
          </span>
        );
      case 'P2_HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            P2 High
          </span>
        );
      case 'P3_MODERATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            P3 Moderate
          </span>
        );
      case 'P4_LOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            P4 Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentPostMortemRecord['incident_status']) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Resolved
          </span>
        );
      case 'MITIGATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Mitigated
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Investigating
          </span>
        );
      case 'MONITORING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Monitoring
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
              <th className="py-3 px-4 font-semibold">Incident ID / Service</th>
              <th className="py-3 px-4 font-semibold">Severity</th>
              <th className="py-3 px-4 font-semibold text-right">MTTR</th>
              <th className="py-3 px-4 font-semibold">Root Cause Summary</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
            {incidents.map((inc) => (
              <tr key={inc.incident_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {inc.service_name}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-500 dark:text-cyan-400">
                    {inc.incident_id}
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getSeverityBadge(inc.severity)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  <span className={`text-xs font-bold ${
                    inc.mttr_minutes < 10
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : inc.mttr_minutes < 20
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-rose-500 dark:text-rose-400'
                  }`}>
                    {Number(inc.mttr_minutes).toFixed(1)}m
                  </span>
                </td>
                <td className="py-3.5 px-4 max-w-md">
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                    {inc.root_cause_summary}
                  </p>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(inc.incident_status)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedIncident(selectedIncident?.incident_id === inc.incident_id ? null : inc)}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-white/10"
                  >
                    {selectedIncident?.incident_id === inc.incident_id ? 'Close' : 'Inspect'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Post-Mortem RCA Telemetry Drawer */}
      {selectedIncident && (
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-950/20 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Automated Post-Mortem Payload: {selectedIncident.incident_id}
            </div>
            <div className="text-[11px] text-slate-400">
              Generated: {new Date(selectedIncident.generated_at).toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
            <pre>{JSON.stringify(selectedIncident.telemetry_payload, null, 2)}</pre>
          </div>

          <div className="text-slate-600 dark:text-slate-400 text-[11px]">
            <span className="font-bold">Corrective Action Summary:</span> {selectedIncident.root_cause_summary}
          </div>
        </div>
      )}
    </div>
  );
};

