import React from 'react';
import type { CloudFinOpsRecord } from '../../../../server/operations';

interface CloudFinOpsTableProps {
  records: CloudFinOpsRecord[];
}

export const CloudFinOpsTable: React.FC<CloudFinOpsTableProps> = ({ records }) => {
  const getProviderBadge = (provider: CloudFinOpsRecord['service_provider']) => {
    switch (provider) {
      case 'AWS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            AWS Cloud
          </span>
        );
      case 'GCP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Google Cloud
          </span>
        );
      case 'VERCEL_EDGE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-500/10 text-slate-800 dark:text-slate-200 border border-slate-500/20">
            ▲ Vercel Edge
          </span>
        );
      case 'NEON_POSTGRES':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Neon Postgres
          </span>
        );
      case 'CLOUDFLARE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            Cloudflare
          </span>
        );
    }
  };

  const getGovernanceBadge = (status: CloudFinOpsRecord['governance_status']) => {
    switch (status) {
      case 'OPTIMIZED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Optimized
          </span>
        );
      case 'RESERVED_INSTANCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Reserved / Spot
          </span>
        );
      case 'AUTOSCALED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Autoscaled
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Under Review
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Action Required
          </span>
        );
    }
  };

  const getEfficiencyIndicator = (pct: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-cyan-500' : 'bg-rose-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {pct.toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-mono">
          <tr>
            <th scope="col" className="px-4 py-3">Workload & Resource ID</th>
            <th scope="col" className="px-4 py-3">Cloud Provider</th>
            <th scope="col" className="px-4 py-3">Monthly Spend</th>
            <th scope="col" className="px-4 py-3">Efficiency</th>
            <th scope="col" className="px-4 py-3">Optimization Potential</th>
            <th scope="col" className="px-4 py-3">Governance Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {records.map((r) => (
            <tr key={r.resource_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{r.workload_name}</div>
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{r.resource_id}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getProviderBadge(r.service_provider)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-semibold text-slate-900 dark:text-white">
                ₹{r.monthly_spend_inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getEfficiencyIndicator(r.utilization_efficiency_pct)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ₹{r.optimization_potential_inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getGovernanceBadge(r.governance_status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

