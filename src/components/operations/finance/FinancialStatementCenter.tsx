import React, { useState, useEffect } from 'react';
import { WorkingCapitalGrid, type FinancialRecord } from './WorkingCapitalGrid';
import { CashRunwaySimulator } from './CashRunwaySimulator';

export interface FinanceSummary {
  totalEntities: number;
  avgRunwayMonths: number;
  avgWorkingCapitalRatio: number;
  avgQuickRatio: number;
  avgDscr: number;
  totalOperatingCashFlowInr: number;
  totalMonthlyBurnInr: number;
}

export const FinancialStatementCenter: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalEntities: 6,
    avgRunwayMonths: 16.6,
    avgWorkingCapitalRatio: 1.76,
    avgQuickRatio: 1.36,
    avgDscr: 2.06,
    totalOperatingCashFlowInr: 22450000.00,
    totalMonthlyBurnInr: 13550000.00
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchFinanceData() {
      try {
        const res = await fetch('/api/operations/financialAnalytics');
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

    fetchFinanceData();
    const interval = setInterval(fetchFinanceData, 30000);
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
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              FINANCIAL STATEMENT & WORKING CAPITAL COMMAND CENTER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated liquidity stress-testing, cash runway simulation, and debt service coverage (DSCR) monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-blue-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {summary.totalEntities} Corporate Entities ({summary.avgRunwayMonths} Mo Avg Runway)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Ingesting corporate financial statements and working capital ratios...
        </div>
      ) : (
        <>
          <CashRunwaySimulator />
          <WorkingCapitalGrid records={records} />
        </>
      )}
    </div>
  );
};

