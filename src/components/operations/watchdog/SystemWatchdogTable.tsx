import React from 'react';
import type { SystemWatchdogRecord } from '../../../../api/operations/systemWatchdog';

interface SystemWatchdogTableProps {
  services: SystemWatchdogRecord[];
}

export const SystemWatchdogTable: React.FC<SystemWatchdogTableProps> = ({ services }) => {
  const getStatusBadge = (status: SystemWatchdogRecord['health_status']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Healthy
          </span>
        );
      case 'HEALING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Self-Healing
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Degraded
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Critical
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Maintenance
          </span>
        );
    }
  };

  const getLatencyBadge = (latency: number) => {
    if (latency < 50) {
      return (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          {latency.toFixed(1)} ms
        </span>
      );
    }
    if (latency < 250) {
      return (
        <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
          {latency.toFixed(1)} ms
        </span>
      );
    }
    return (
      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
        {latency.toFixed(1)} ms
      </span>
    );
  };

  const getErrorRateBadge = (rate: number) => {
    if (rate === 0) {
      return <span className="text-xs font-mono text-slate-500 dark:text-slate-400">0.00%</span>;
    }
    if (rate < 1.0) {
      return <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-medium">{rate.toFixed(2)}%</span>;
    }
    return <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">{rate.toFixed(2)}%</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-mono">
          <tr>
            <th scope="col" className="px-4 py-3">Service & ID</th>
            <th scope="col" className="px-4 py-3">Health Status</th>
            <th scope="col" className="px-4 py-3">Latency</th>
            <th scope="col" className="px-4 py-3">Error Rate</th>
            <th scope="col" className="px-4 py-3">Self-Healing Protocol</th>
            <th scope="col" className="px-4 py-3">Telemetry Sync</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {services.map((svc) => (
            <tr key={svc.service_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{svc.service_name}</div>
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{svc.service_id}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getStatusBadge(svc.health_status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getLatencyBadge(svc.latency_ms)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getErrorRateBadge(svc.error_rate_pct)}
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  {svc.self_healing_action}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {new Date(svc.last_checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

