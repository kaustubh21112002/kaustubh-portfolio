import React, { useState, useEffect } from 'react';
import { CRMFunnel, type FunnelStageMetric } from './CRMFunnel';
import { CRMLeadQueue, type CRMLead } from './CRMLeadQueue';

export const CRMPipelineCenter: React.FC = () => {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [funnel, setFunnel] = useState<FunnelStageMetric[]>([]);
  const [avgPdfGenerationMs, setAvgPdfGenerationMs] = useState<number>(560);
  const [avgResponseTimeHours, setAvgResponseTimeHours] = useState<number>(2.3);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchCRMData() {
      try {
        const res = await fetch('/api/operations/crm');
        if (!res.ok) throw new Error('API returned ' + res.status);
        const data = await res.json();
        if (isMounted && data.success) {
          setLeads(data.leads || []);
          setFunnel(data.funnel || []);
          setAvgPdfGenerationMs(data.avgPdfGenerationMs || 560);
          setAvgResponseTimeHours(data.avgResponseTimeHours || 2.3);
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

    fetchCRMData();
    const interval = setInterval(fetchCRMData, 30000);
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
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              B2B AUTOMATED CRM & LEAD DOSSIER TELEMETRY
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Enterprise pipeline staging, outbound response metrics, and Headless Chrome PDF generation benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-violet-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {leads.length} Tracked Accounts
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Ingesting CRM pipeline and PDF generation telemetry...
        </div>
      ) : (
        <>
          <CRMFunnel
            funnel={funnel}
            avgPdfGenerationMs={avgPdfGenerationMs}
            avgResponseTimeHours={avgResponseTimeHours}
          />
          <CRMLeadQueue leads={leads} />
        </>
      )}
    </div>
  );
};
