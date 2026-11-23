import React from 'react';
import type { ReliabilityClusterRecord } from '../../../../server/operations';

interface ReliabilityChaosTableProps {
  clusters: ReliabilityClusterRecord[];
}

export const ReliabilityChaosTable: React.FC<ReliabilityChaosTableProps> = ({ clusters }) => {
  const getCircuitBreakerBadge = (state: ReliabilityClusterRecord['circuit_breaker_state']) => {
    switch (state) {
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Closed (Nominal)
          </span>
        );
      case 'HALF_OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Half-Open (Testing)
          </span>
        );
      case 'OPEN':
      case 'FORCED_OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Open (Tripped)
          </span>
        );
      default:
        return null;
    }
  };

  const getRemediationBadge = (status: ReliabilityClusterRecord['remediation_status']) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Healthy
          </span>
        );
      case 'SELF_HEALING':
        return (
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Self-Healing
          </span>
        );
      case 'RECOVERED':
        return (
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
            Auto-Recovered
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Degraded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Cluster ID / Service</th>
            <th className="py-3 px-4 font-semibold">Region & Failover Target</th>
            <th className="py-3 px-4 font-semibold text-right">Health Score</th>
            <th className="py-3 px-4 font-semibold text-right">P99 Latency</th>
            <th className="py-3 px-4 font-semibold">Circuit Breaker</th>
            <th className="py-3 px-4 font-semibold">Active Chaos Mode</th>
            <th className="py-3 px-4 font-semibold">Remediation State</th>
            <th className="py-3 px-4 font-semibold text-right">Replicas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {clusters.map((cluster) => (
            <tr key={cluster.cluster_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {cluster.cluster_name}
                </div>
                <div className="text-[11px] font-mono text-rose-500 dark:text-rose-400">
                  {cluster.cluster_id}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  {cluster.region}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Target: {cluster.failover_target_region}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {Number(cluster.health_score).toFixed(1)}%
                </div>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cluster.health_score >= 95
                        ? 'bg-emerald-500'
                        : cluster.health_score >= 90
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cluster.health_score}%` }}
                  />
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono">
                <span className={`text-xs font-semibold ${
                  cluster.p99_latency_ms < 30
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : cluster.p99_latency_ms < 100
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-rose-500 dark:text-rose-400'
                }`}>
                  {Number(cluster.p99_latency_ms).toFixed(1)} ms
                </span>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getCircuitBreakerBadge(cluster.circuit_breaker_state)}
              </td>
              <td className="py-3.5 px-4">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${
                  cluster.simulated_failure_mode === 'NONE'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}>
                  {cluster.simulated_failure_mode}
                </span>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getRemediationBadge(cluster.remediation_status)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300 font-semibold">
                {cluster.active_replicas} pods
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

