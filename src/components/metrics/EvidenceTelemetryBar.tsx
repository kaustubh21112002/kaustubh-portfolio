import React from 'react';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { telemetryMetrics, TelemetryMetric } from '../../data/telemetryMetrics';

export const EvidenceTelemetryBar: React.FC = () => {
  const handleScrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Quantitative Evidence Telemetry"
      className="relative z-20 w-full border-y border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#0e111a]/85 backdrop-blur-md transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Subtle Category Eyebrow */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200/60 dark:border-white/5 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-white/50 uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" aria-hidden="true" />
            <span>Verified Quantitative Telemetry</span>
          </div>
          <span className="hidden sm:inline text-neutral-400 dark:text-white/40 text-[10px]">
            Model Outputs & Governed Data Volumes • Click to Inspect Evidence
          </span>
        </div>

        {/* 4-Column Responsive Evidence Metrics Grid */}
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {telemetryMetrics.map((item: TelemetryMetric) => (
            <div
              key={item.id}
              onClick={() => handleScrollTo(item.targetSectionHref)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleScrollTo(item.targetSectionHref);
                }
              }}
              title={`${item.label}: ${item.value} ${item.unit || ''}. ${item.contextAndCaveats} Source: ${item.sourceFile}`}
              aria-label={`${item.label}: ${item.value} ${item.unit || ''}. Type: ${item.type}. Click to jump to evidence.`}
              className="group p-4 sm:p-4.5 rounded-2xl bg-neutral-100/70 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 flex flex-col justify-between"
            >
              <div>
                {/* Metric Type Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-white/40 truncate font-semibold">
                    {item.type}
                  </span>
                  <ExternalLink
                    className="w-3 h-3 text-neutral-400 dark:text-white/30 group-hover:text-red-500 transition-colors shrink-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Quantitative Value */}
                <dd className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-none my-1">
                  {item.value}
                  {item.unit && (
                    <span className="text-xs sm:text-sm font-semibold ml-1.5 text-neutral-500 dark:text-white/60">
                      {item.unit}
                    </span>
                  )}
                </dd>
              </div>

              {/* Metric Label & Extraction Subtext */}
              <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-white/5">
                <dt className="text-xs font-semibold text-neutral-800 dark:text-white/90 leading-tight">
                  {item.label}
                </dt>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-white/40 truncate mt-1">
                  {item.sourceLocation}
                </p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
