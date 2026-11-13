import React from 'react';

export interface FunnelStageMetric {
  stage: string;
  count: number;
  conversionRatePct: number;
}

interface CRMFunnelProps {
  funnel: FunnelStageMetric[];
  avgPdfGenerationMs: number;
  avgResponseTimeHours: number;
}

export const CRMFunnel: React.FC<CRMFunnelProps> = ({
  funnel,
  avgPdfGenerationMs,
  avgResponseTimeHours
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              B2B Account Conversion Funnel
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stage conversion distribution with automated decision-maker touchpoint tracking.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-violet-500/10 px-2.5 py-1 rounded border border-violet-500/20 text-violet-300">
            <span>Avg Outreach Response:</span>
            <strong className="text-violet-200">{avgResponseTimeHours} hrs</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-emerald-300">
            <span>Avg Headless PDF Render:</span>
            <strong className="text-emerald-200">{avgPdfGenerationMs} ms</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {funnel.map((item, idx) => (
          <div
            key={item.stage}
            className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 relative overflow-hidden"
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Stage 0{idx + 1}
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1 truncate" title={item.stage}>
              {item.stage}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-violet-400">
                {item.count}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {item.conversionRatePct}% conv
              </span>
            </div>
            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, item.conversionRatePct)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
