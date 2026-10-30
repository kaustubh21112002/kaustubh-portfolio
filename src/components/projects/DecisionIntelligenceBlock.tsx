import React from 'react';
import { Target, Cpu, TrendingUp, Compass, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { Project, MetricItem } from '../../data/projects';

export interface DecisionIntelligenceBlockProps {
  project: Project;
  layout?: 'modal' | 'card' | 'standalone';
  showMetricsGrid?: boolean;
  className?: string;
}

/**
 * Returns a standardized badge styling and label based on evidence metric classification
 */
function getClassificationBadge(classification?: MetricItem['classification']) {
  switch (classification) {
    case 'DEMONSTRATED':
      return {
        label: 'Verified Empirical Record',
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        icon: CheckCircle2,
      };
    case 'MODEL ESTIMATE':
      return {
        label: 'Model / DCF Calculation',
        badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        icon: TrendingUp,
      };
    case 'BENCHMARK PARAMETER':
      return {
        label: 'Governed Benchmark',
        badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        icon: Cpu,
      };
    case 'STUDY ESTIMATE':
      return {
        label: 'Empirical Study Estimate',
        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        icon: Target,
      };
    case 'OPERATIONAL SLA':
      return {
        label: 'Operational SLA Target',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: AlertCircle,
      };
    case 'PROTOTYPE DEMO':
      return {
        label: 'Prototype Audit Finding',
        badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        icon: CheckCircle2,
      };
    default:
      return {
        label: 'Governed Evidence',
        badgeClass: 'bg-white/10 text-white/80 border-white/20',
        icon: CheckCircle2,
      };
  }
}

/**
 * Reusable Decision Intelligence Layer component that communicates:
 * 1. Business Problem (commercial dilemma)
 * 2. Analytical Approach & Methods
 * 3. Key Quantitative Evidence (with explicit classification labels)
 * 4. Decision Relevance (commercial implications and decisions informed)
 * 5. Analytical Governance & Evidence Status
 */
export const DecisionIntelligenceBlock: React.FC<DecisionIntelligenceBlockProps> = ({
  project,
  layout = 'modal',
  showMetricsGrid = true,
  className = '',
}) => {
  const isStratos = project.id === 'stratos-governance';
  const isPhonePe = project.id === 'phonepe-valuation';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Business Problem */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/25">
            <Target className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
            1. Commercial Dilemma & Business Problem
          </span>
        </div>
        <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-sans">
          {project.problemStatement}
        </p>
      </div>

      {/* 2. Analytical Approach & Methods */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25">
            <Cpu className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            2. Quantitative Methodology & Analytical Framework
          </span>
        </div>
        <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-sans mb-3">
          {project.approach}
        </p>
        {project.tools && project.tools.length > 0 && (
          <div className="pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-mono text-white/50 mr-1">Methods / Stack:</span>
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-white/80"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Key Quantitative Evidence & Verification Ledger */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141722] border border-emerald-500/30 hover:border-emerald-500/50 transition-all bg-gradient-to-b from-[#141722] to-emerald-950/10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              3. Key Quantitative Evidence & Reconciled Findings
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {project.category === 'Equity Research' ? 'MODEL RECONCILED' : 'GOVERNED ARTIFACT'}
          </span>
        </div>

        <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-sans mb-3">
          {project.keyFinding}
        </p>

        {/* Evidence Metrics Grid with explicit Classification Badges */}
        {showMetricsGrid && project.keyMetrics && project.keyMetrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-emerald-500/20">
            {project.keyMetrics.map((metric, idx) => {
              const meta = getClassificationBadge(metric.classification);
              const Icon = meta.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-white/60 line-clamp-1">
                        {metric.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${meta.badgeClass} shrink-0`}
                        title={meta.label}
                      >
                        {metric.classification || 'DEMONSTRATED'}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-bold font-mono text-white">
                      {metric.value}
                    </div>
                  </div>
                  {metric.subtext && (
                    <div className="text-[10px] text-white/50 font-sans mt-1 pt-1 border-t border-white/5 line-clamp-2">
                      {metric.subtext}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Strategic & Commercial Decision Relevance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141722] border border-amber-500/30 hover:border-amber-500/50 transition-all bg-gradient-to-b from-[#141722] to-amber-950/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            4. Commercial Relevance & Management Decision Context
          </span>
        </div>
        <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-sans">
          {project.businessImplication}
        </p>
      </div>

      {/* 5. Evidence Status & Governance Guardrails */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
        <div className="text-[11px] sm:text-xs text-white/75 font-sans leading-relaxed">
          <strong className="text-white font-mono uppercase tracking-wider">
            Evidence Status & Analytical Integrity:
          </strong>{' '}
          {isStratos ? (
            <span>
              Follows strict protocol <strong className="text-white font-mono">PRESERVE → DOCUMENT → FLAG → GOVERN</strong>. Control DQ-10 remains explicitly in <strong className="text-amber-300 font-mono">REVIEW</strong> (Net Revenue &gt; Gross Revenue in controlled totals) with zero silent data imputation.
            </span>
          ) : isPhonePe ? (
            <span>
              Distinguishes verified MCA filings / NPCI transaction statistics from explicit 5-year DCF parameter estimates. Forensic audit identified and documented 6 workbook calculation discrepancies.
            </span>
          ) : (
            <span>
              All quantitative metrics strictly describe recorded operational logs and governed workbook models. No hypothetical outcomes or speculative benchmarks have been fabricated.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

