import React from 'react';

interface OperationsOSBannerProps {
  onOpenSLA?: () => void;
  onOpenCRM?: () => void;
  onOpenRender?: () => void;
}

export const OperationsOSBanner: React.FC<OperationsOSBannerProps> = ({
  onOpenSLA,
  onOpenCRM,
  onOpenRender
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#090A0F] border border-white/10 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                B2B Enterprise Operations OS • Live Telemetry Active
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Autonomous Systems & Multi-Region Compute Telemetry
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Explore real-time SLA incident queues, Headless Chrome lead generation dossier benchmarks, and GPU cluster spot arbitrage analytics powered by distributed serverless edge functions.
            </p>

            {/* Regional Edge Node Pulse Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Edge Clusters:</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Mumbai (14ms)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Hyderabad (19ms)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Singapore (42ms)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span> Frankfurt (112ms)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="#operations-command-center"
              onClick={e => {
                const el = document.getElementById('operations-command-center');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Explore Command OS</span>
              <span className="text-xs">→</span>
            </a>

            <a
              href="/Kaustubh_Nandurkar_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-mono text-xs font-semibold transition-all"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Verified PDF Resume</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
