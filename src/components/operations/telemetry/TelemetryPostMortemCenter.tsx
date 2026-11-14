import React, { useState, useEffect, useCallback } from 'react';
import type { IncidentPostMortemRecord, TelemetryMetrics } from '../../../../api/operations/telemetryPostMortems';
import { TelemetryIncidentTable } from './TelemetryIncidentTable';

export const TelemetryPostMortemCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentPostMortemRecord[]>([]);
  const [metrics, setMetrics] = useState<TelemetryMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const fetchTelemetryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/telemetryPostMortems', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch incident telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setIncidents(data.incidents || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse telemetry data');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetryData();
    const interval = setInterval(fetchTelemetryData, 30000);
    return () => clearInterval(interval);
  }, [fetchTelemetryData]);

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono text-sm font-bold">
            10
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Global Telemetry & Automated Incident Post-Mortem Engine
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Automated RCA
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live telemetry streaming, mean time to recovery (MTTR), SLA impact scores, and structured post-mortem generation
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
            onClick={fetchTelemetryData}
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
            Mean Time To Recovery (MTTR)
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-1">
            {metrics ? `${metrics.averageMttrMinutes}m` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {metrics?.totalIncidents || 0} production incidents
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Overall SLA Uptime
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-500 dark:text-cyan-400 mt-1">
            {metrics ? `${metrics.overallUptimeSla}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Grounded enterprise availability
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Incident Resolution Rate
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-violet-500 dark:text-violet-400 mt-1">
            {metrics ? `${metrics.resolvedRatePct}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Auto-mitigated & resolved
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Priority Failures
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-500 dark:text-rose-400 mt-1">
            {metrics ? `${metrics.criticalP1Count} P1 / ${metrics.highP2Count} P2` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Managed under zero data loss SLA
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Severity:</span>
            <div className="flex gap-1">
              {(['ALL', 'P1_CRITICAL', 'P2_HIGH', 'P3_MODERATE'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterSeverity === sev
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sev === 'ALL' ? 'ALL' : sev.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <TelemetryIncidentTable incidents={filteredIncidents} />
      </div>
    </div>
  );
};
