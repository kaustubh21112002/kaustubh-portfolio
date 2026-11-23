import React, { useState, useEffect } from 'react';
import { ERPReconciliationTable, type ERPSyncRecord } from './ERPReconciliationTable';

export interface ERPSummary {
  totalEnterprises: number;
  totalLedgersSynced: number;
  totalReconciledVolumeInr: number;
  totalUnreconciledTx: number;
  reconciliationRatePct: number;
  avgSyncLatencyMs: number;
}

export const ERPIntegrationCenter: React.FC = () => {
  const [records, setRecords] = useState<ERPSyncRecord[]>([]);
  const [summary, setSummary] = useState<ERPSummary>({
    totalEnterprises: 6,
    totalLedgersSynced: 333,
    totalReconciledVolumeInr: 121900000.00,
    totalUnreconciledTx: 16,
    reconciliationRatePct: 83,
    avgSyncLatencyMs: 440
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchERPData() {
      try {
        const res = await fetch('/api/operations/erpSync');
        if (!res.ok) throw new Error('API returned ' + res.status);
        const data = await res.json();
        if (isMounted && data.success) {
          setRecords(data.records || []);
          if (data.summary) setSummary(data.summary);
          setDataSource(data.source || 'LIVE');
        }
      } catch {
        if (isMounted) {
          setDataSource('LOCAL_CLIENT_FALLBACK');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchERPData();
    const interval = setInterval(fetchERPData, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              MSME ERP & TALLY DATA INTEGRATION HUB (GRUHLAXMI.AI)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated accounting synchronization, Tally/Vyapar ledger bridges, and statutory GST reconciliation telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-teal-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {summary.reconciliationRatePct}% Reconciled ({summary.totalLedgersSynced} Ledgers)
          </span>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Gross Reconciled Volume</span>
          <div className="text-lg font-bold font-mono text-teal-300 mt-1">
            ₹{(summary.totalReconciledVolumeInr / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-400">Across 6 regional MSME cohorts</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Ledger Count</span>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1">
            {summary.totalLedgersSynced} Accounts
          </div>
          <span className="text-[10px] text-slate-400">Tally, Vyapar, Zoho Books</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Pending Reconciliation</span>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            {summary.totalUnreconciledTx} Transactions
          </div>
          <span className="text-[10px] text-slate-400">Auto-matching active</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Bridge Latency</span>
          <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
            {summary.avgSyncLatencyMs} ms
          </div>
          <span className="text-[10px] text-slate-400">ODBC/XML bridge runtime</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Synchronizing Tally and ERP accounting ledgers...
        </div>
      ) : (
        <ERPReconciliationTable records={records} />
      )}
    </div>
  );
};

