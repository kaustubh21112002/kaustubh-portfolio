import React, { useState, useEffect, useCallback } from 'react';
import type { RegulatoryComplianceRecord, ComplianceMetrics } from '../../../../api/operations/regulatoryCompliance';
import { ComplianceAuditTable } from './ComplianceAuditTable';

export const ComplianceAuditCenter: React.FC = () => {
  const [records, setRecords] = useState<RegulatoryComplianceRecord[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchComplianceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/regulatoryCompliance', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch compliance telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse compliance telemetry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplianceData();
    const interval = setInterval(fetchComplianceData, 30000);
    return () => clearInterval(interval);
  }, [fetchComplianceData]);

  const filteredRecords = records.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.tax_filing_status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 font-mono text-sm font-bold">
            12
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Global Compliance & Statutory Audit Center
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                GST / Udyam Gate
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated GST 2B reconciliation, Udyam MSME verification, statutory penalty audits, and compliance risk scoring
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
            onClick={fetchComplianceData}
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
            Compliance Health Rate
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-teal-500 dark:text-teal-400 mt-1">
            {metrics ? `${metrics.complianceHealthRate}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {metrics?.totalEnterprises || 0} evaluated enterprises
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Mean Audit Risk Score
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-1">
            {metrics ? `${metrics.averageAuditRiskScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.fullyMatchedCount || 0} fully reconciled (2B)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Penalty Exposure
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-500 dark:text-rose-400 mt-1">
            {metrics ? `₹${(metrics.totalPenaltyExposureInr / 100000).toFixed(2)}L` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.statutoryDeficitCount || 0} statutory deficits flagged
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Reconciliations
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 mt-1">
            {metrics ? metrics.reconciliationPendingCount : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active GST pipeline queue
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Filing Status:</span>
            <div className="flex gap-1">
              {(['ALL', 'GSTR_MATCHED_2B', 'GSTR_FILED_ON_TIME', 'RECONCILIATION_PENDING', 'STATUTORY_DEFICIT'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterStatus === status
                      ? 'bg-teal-500 text-white font-semibold shadow-sm shadow-teal-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status === 'ALL' ? 'ALL' : status.replace('GSTR_', '')}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Showing {filteredRecords.length} of {records.length} enterprise audits
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <ComplianceAuditTable records={filteredRecords} />
      </div>
    </div>
  );
};

