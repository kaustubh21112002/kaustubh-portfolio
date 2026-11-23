import React, { useState, useEffect, useCallback } from 'react';
import type { CloudFinOpsRecord, FinOpsMetrics } from '../../../../server/operations';
import { CloudFinOpsTable } from './CloudFinOpsTable';

export const CloudFinOpsCenter: React.FC = () => {
  const [records, setRecords] = useState<CloudFinOpsRecord[]>([]);
  const [metrics, setMetrics] = useState<FinOpsMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterProvider, setFilterProvider] = useState<string>('ALL');

  const fetchFinOpsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/cloudFinOps', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch FinOps telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse FinOps telemetry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'FinOps telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinOpsData();
    const interval = setInterval(fetchFinOpsData, 30000);
    return () => clearInterval(interval);
  }, [fetchFinOpsData]);

  const filteredRecords = records.filter((r) => {
    if (filterProvider === 'ALL') return true;
    return r.service_provider === filterProvider;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono text-sm font-bold">
            15
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              CloudFinOps & Infrastructure Cost Optimization Center
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                FinOps Command
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compute expenditure attribution, serverless fleet sizing, database branch pooling, and automated cost reclamation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className={`w-2 h-2 rounded-full ${source.includes('fallback') ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="capitalize">{source.replace('_', ' ')}</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={fetchFinOpsData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Auditing...' : 'Audit Spend'}
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Monthly Spend
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ₹{metrics ? (metrics.totalMonthlySpendInr / 100000).toFixed(2) : '8.30'}L
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across {metrics?.workloadsCount ?? records.length} enterprise workloads
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Reclaimable Savings
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{metrics ? (metrics.totalOptimizationSavingsInr / 100000).toFixed(2) : '1.60'}L
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            Identified idle & unreserved capacity
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Fleet Efficiency
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
            {metrics ? `${metrics.averageEfficiencyPct.toFixed(1)}%` : '83.8%'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Mean resource utilization index
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Action Required
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-rose-500">
            {metrics ? metrics.actionRequiredCount : 1}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Oversized instances flagged
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {['ALL', 'AWS', 'GCP', 'VERCEL_EDGE', 'NEON_POSTGRES', 'CLOUDFLARE'].map((provider) => (
            <button
              key={provider}
              onClick={() => setFilterProvider(provider)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterProvider === provider
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {provider} {provider === 'ALL' ? `(${records.length})` : `(${records.filter(r => r.service_provider === provider).length})`}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-xs text-rose-500 font-mono bg-rose-500/10 px-3 py-1 rounded border border-rose-500/20">
            {error}
          </div>
        )}
      </div>

      {/* FinOps Attribution Table */}
      <CloudFinOpsTable records={filteredRecords} />

      {/* Governance Footnote */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/30 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Automated Spot/Reserved Instance Audit: Continuous evaluation across multi-cloud infrastructure</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Target Utilization SLA: &gt;85% Sizing Accuracy
        </div>
      </div>
    </div>
  );
};

