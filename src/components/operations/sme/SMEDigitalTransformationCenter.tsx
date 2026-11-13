import React, { useState, useEffect } from 'react';
import { SMERiskGrid, type SMERecord } from './SMERiskGrid';
import { SMEROICalculator } from './SMEROICalculator';

export interface SMESummary {
  totalEnterprises: number;
  avgMaturityScore: number;
  avgFailureProbability: number;
  totalSavingsInr: number;
  totalDowntimeHoursSaved: number;
  compliantRatioPct: number;
}

export const SMEDigitalTransformationCenter: React.FC = () => {
  const [enterprises, setEnterprises] = useState<SMERecord[]>([]);
  const [summary, setSummary] = useState<SMESummary>({
    totalEnterprises: 6,
    avgMaturityScore: 74,
    avgFailureProbability: 0.057,
    totalSavingsInr: 2980000.00,
    totalDowntimeHoursSaved: 348,
    compliantRatioPct: 67
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchSMEData() {
      try {
        const res = await fetch('/api/operations/smeAnalytics');
        if (!res.ok) throw new Error('API returned ' + res.status);
        const data = await res.json();
        if (isMounted && data.success) {
          setEnterprises(data.enterprises || []);
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

    fetchSMEData();
    const interval = setInterval(fetchSMEData, 30000);
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              PREDICTIVE SME ANALYTICS & DIGITAL MATURITY HUB
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical IoT breakdown modeling, MSME operational health metrics, and automated downtime prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-emerald-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {summary.totalEnterprises} Monitored Enterprises ({summary.avgMaturityScore}/100 Maturity)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Ingesting SME digital transformation metrics and failure risk models...
        </div>
      ) : (
        <>
          <SMEROICalculator />
          <SMERiskGrid enterprises={enterprises} />
        </>
      )}
    </div>
  );
};
