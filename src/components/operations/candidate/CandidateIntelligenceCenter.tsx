import React, { useState, useEffect, useCallback } from 'react';
import type { CandidateRecord, CandidateMetrics } from '../../../../server/operations';
import { CandidateSkillMatchTable } from './CandidateSkillMatchTable';

export const CandidateIntelligenceCenter: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [metrics, setMetrics] = useState<CandidateMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const fetchCandidateData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/candidateIntelligence', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch candidate intelligence telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse telemetry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidateData();
    const interval = setInterval(fetchCandidateData, 30000);
    return () => clearInterval(interval);
  }, [fetchCandidateData]);

  const filteredCandidates = candidates.filter((c) => {
    if (filterRole === 'ALL') return true;
    return c.tailoring_status === filterRole;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-mono text-sm font-bold">
            07
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Candidate Intelligence & Grounded Document Tailoring
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                SHA-256 Gate
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded candidate profile ingestion, semantic skill-match scoring, and cryptographic doc verification
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
            onClick={fetchCandidateData}
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
            Average Skill Match
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-500 dark:text-indigo-400 mt-1">
            {metrics ? `${metrics.averageMatchScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {metrics?.totalProfiles || 0} evaluated profiles
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Approved Documents
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-1">
            {metrics?.approvedCount ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Grounded & cryptographically signed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Under Review / Tailoring
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 mt-1">
            {metrics ? metrics.inReviewCount + metrics.groundedCount : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active validation pipeline
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            SHA-256 Hash Integrity
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-500 dark:text-cyan-400 mt-1">
            {metrics ? `${metrics.cryptographicIntegrityRatio}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Immutable document gate
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Filter Status:</span>
            <div className="flex gap-1">
              {(['ALL', 'APPROVED', 'GROUNDED', 'IN_REVIEW'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterRole(status)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterRole === status
                      ? 'bg-indigo-500 text-white font-semibold shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Showing {filteredCandidates.length} of {candidates.length} profiles
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <CandidateSkillMatchTable candidates={filteredCandidates} />
      </div>
    </div>
  );
};

