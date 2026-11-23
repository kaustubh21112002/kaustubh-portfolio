import React, { useState, useEffect, useCallback } from 'react';
import type { ReliabilityClusterRecord, ReliabilityMetrics } from '../../../../server/operations';
import { ReliabilityChaosTable } from './ReliabilityChaosTable';

export const ReliabilityChaosCenter: React.FC = () => {
  const [clusters, setClusters] = useState<ReliabilityClusterRecord[]>([]);
  const [metrics, setMetrics] = useState<ReliabilityMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterBreaker, setFilterBreaker] = useState<string>('ALL');

  const fetchReliabilityData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/reliabilityChaos', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch reliability chaos telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setClusters(data.clusters || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse reliability telemetry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReliabilityData();
    const interval = setInterval(fetchReliabilityData, 30000);
    return () => clearInterval(interval);
  }, [fetchReliabilityData]);

  const filteredClusters = clusters.filter((c) => {
    if (filterBreaker === 'ALL') return true;
    return c.circuit_breaker_state === filterBreaker;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-mono text-sm font-bold">
            08
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Autonomous System Reliability & Chaos Engineering Simulator
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Self-Healing Mesh
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synthetic fault injection, circuit breaker automation, P99 latency tracking, and autonomous multi-region failover
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
            onClick={fetchReliabilityData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Polling...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Mean Cluster Health
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-1">
            {metrics ? `${metrics.averageHealthScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {metrics?.totalClusters || 0} monitored clusters
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Global P99 Latency
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-500 dark:text-cyan-400 mt-1">
            {metrics ? `${metrics.globalP99LatencyMs} ms` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Multi-region weighted p99
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Circuit Breaker State
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-500 dark:text-rose-400 mt-1">
            {metrics ? `${metrics.openCircuitsCount} Open` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.selfHealingCount || 0} in active self-healing
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Compute Mesh
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-500 dark:text-indigo-400 mt-1">
            {metrics ? `${metrics.activeReplicasTotal} Replicas` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Autoscaled high-availability pods
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Circuit State:</span>
            <div className="flex gap-1">
              {(['ALL', 'CLOSED', 'HALF_OPEN', 'OPEN'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setFilterBreaker(state)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterBreaker === state
                      ? 'bg-rose-500 text-white font-semibold shadow-sm shadow-rose-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Showing {filteredClusters.length} of {clusters.length} clusters
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <ReliabilityChaosTable clusters={filteredClusters} />
      </div>
    </div>
  );
};

