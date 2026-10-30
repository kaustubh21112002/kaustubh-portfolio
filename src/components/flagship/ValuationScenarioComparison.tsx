import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Layers, CheckCircle2 } from 'lucide-react';
import {
  ValuationScenarioId,
  ScenarioDefinition,
  PHONEPE_SCENARIO_DEFINITIONS
} from './valuationScenarios';

export type ScenarioDetail = ScenarioDefinition;

export interface ValuationScenarioComparisonProps {
  currentScenario?: ValuationScenarioId;
  onSelectScenario?: (scenarioId: ValuationScenarioId) => void;
}

export const SCENARIO_DATA = PHONEPE_SCENARIO_DEFINITIONS;

export const ValuationScenarioComparison: React.FC<ValuationScenarioComparisonProps> = ({
  currentScenario = 'base',
  onSelectScenario
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'deltas' | 'drivers'>('cards');
  const baseEquity = PHONEPE_SCENARIO_DEFINITIONS.base.equityValue;
  const baseEV = PHONEPE_SCENARIO_DEFINITIONS.base.enterpriseValue;

  const scenariosList = [
    PHONEPE_SCENARIO_DEFINITIONS.bear,
    PHONEPE_SCENARIO_DEFINITIONS.base,
    PHONEPE_SCENARIO_DEFINITIONS.bull
  ];

  return (
    <div className="space-y-6">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Scenario Sensitivity & Strategic Comparison
            </h3>
          </div>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Cross-scenario enterprise value, equity value, and valuation driver reconciliation (Base Case benchmarked)
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl self-start sm:self-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cards' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40' : 'text-white/60 hover:text-white'
            }`}
          >
            Scenario Cards
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deltas')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'deltas' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40' : 'text-white/60 hover:text-white'
            }`}
          >
            Base Case Deltas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'drivers' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40' : 'text-white/60 hover:text-white'
            }`}
          >
            Operating Drivers
          </button>
        </div>
      </div>

      {/* VIEW 1: SCENARIO CARDS */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scenariosList.map((sc) => {
            const isSelected = currentScenario === sc.id;
            const isBase = sc.id === 'base';

            let accentBg = 'bg-[#141722] border-white/10 hover:border-white/20';
            let badgeBg = 'bg-white/10 text-white/80';
            let titleColor = 'text-white';
            let highlightBorder = '';

            if (sc.id === 'bear') {
              badgeBg = 'bg-rose-500/15 border border-rose-500/30 text-rose-300';
              titleColor = 'text-rose-400';
              if (isSelected) {
                accentBg = 'bg-[#1a141b] border-rose-500/60 shadow-[0_0_24px_rgba(244,63,94,0.15)]';
                highlightBorder = 'ring-1 ring-rose-500/50';
              }
            } else if (sc.id === 'base') {
              badgeBg = 'bg-amber-500/15 border border-amber-500/30 text-amber-300';
              titleColor = 'text-amber-400';
              if (isSelected) {
                accentBg = 'bg-[#1d1920] border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.15)]';
                highlightBorder = 'ring-1 ring-amber-500/50';
              }
            } else {
              badgeBg = 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
              titleColor = 'text-emerald-400';
              if (isSelected) {
                accentBg = 'bg-[#121c17] border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.15)]';
                highlightBorder = 'ring-1 ring-emerald-500/50';
              }
            }

            return (
              <div
                key={sc.id}
                onClick={() => onSelectScenario && onSelectScenario(sc.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer ${accentBg} ${highlightBorder}`}
              >
                {/* Top Badge & Selector Indicator */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                      {sc.name}
                    </span>
                    {isBase && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        Primary Benchmark
                      </span>
                    )}
                    {isSelected && !isBase && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90">
                        Active View
                      </span>
                    )}
                  </div>

                  {/* Header Titles */}
                  <h4 className={`text-base font-bold ${titleColor} flex items-center justify-between`}>
                    <span>₹{sc.sharePrice} / share</span>
                    <span className="text-xs font-mono text-white/50">{sc.cagr} CAGR</span>
                  </h4>
                  <p className="text-xs text-white/60 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {sc.subtitle}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-white/50 uppercase block">Enterprise Value</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        ₹{sc.enterpriseValue.toLocaleString('en-IN')} Cr
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-white/50 uppercase block">Equity Value</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        ₹{sc.equityValue.toLocaleString('en-IN')} Cr
                      </span>
                    </div>
                  </div>

                  {/* Valuation Drivers */}
                  <div className="mt-3 space-y-1.5 text-[11px] font-mono text-white/70 bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-white/50">Exit Multiple:</span>
                      <span className="text-white font-semibold">{sc.exitMultipleLabel} EBITDA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Cost of Capital (WACC):</span>
                      <span className="text-white font-semibold">{sc.waccLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Net Liquidity Added:</span>
                      <span className="text-emerald-400 font-semibold">+₹8,199 Cr</span>
                    </div>
                  </div>
                </div>

                {/* Footer Selection Button */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50 font-sans">
                    {isSelected ? '✓ Currently Selected' : 'Click to select scenario'}
                  </span>
                  <div className="text-xs font-mono text-white/70 flex items-center gap-1 group-hover:text-white">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: BASE CASE DELTAS & VALUE WATERFALL */}
      {activeTab === 'deltas' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-red-400">
                Variance Analysis Against Governed Base Case (₹41,631 Cr)
              </h4>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Quantifying equity value spread, percentage dispersion, and share price impact.
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 self-start sm:self-auto">
              50.66 Cr Common Shares
            </span>
          </div>

          {/* Variance Rows */}
          <div className="space-y-4">
            {scenariosList.map((sc) => {
              const eqDelta = sc.equityValue - baseEquity;
              const evDelta = sc.enterpriseValue - baseEV;
              const pctDelta = ((eqDelta / baseEquity) * 100).toFixed(1);
              const isBase = sc.id === 'base';
              const isPositive = eqDelta > 0;

              return (
                <div
                  key={sc.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isBase
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : isPositive
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isBase
                            ? 'bg-amber-500/20 text-amber-300'
                            : isPositive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {isBase ? '0' : isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{sc.name}</span>
                          <span className="text-xs font-mono text-white/60">({sc.cagr} CAGR)</span>
                        </div>
                        <span className="text-xs font-mono text-white/60">
                          EV: ₹{sc.enterpriseValue.toLocaleString('en-IN')} Cr • Equity: ₹{sc.equityValue.toLocaleString('en-IN')} Cr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto text-right font-mono">
                      <div>
                        <span className="text-[10px] text-white/50 block uppercase">Equity Delta</span>
                        <span
                          className={`text-sm font-bold ${
                            isBase ? 'text-amber-300' : isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isBase ? 'Baseline' : `${isPositive ? '+' : ''}₹${eqDelta.toLocaleString('en-IN')} Cr (${pctDelta}%)`}
                        </span>
                      </div>

                      <div className="min-w-[90px]">
                        <span className="text-[10px] text-white/50 block uppercase">Share Price</span>
                        <span className="text-sm font-bold text-white">₹{sc.sharePrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Relative Spread Bar */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40 uppercase w-20">Dispersion</span>
                    <div className="flex-1 bg-black/40 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(sc.equityValue / PHONEPE_SCENARIO_DEFINITIONS.bull.equityValue) * 100}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBase ? 'bg-amber-400' : isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/60 w-12 text-right">
                      {((sc.equityValue / baseEquity) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: OPERATING DRIVERS & STRATEGIC CATALYSTS */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scenariosList.map((sc) => {
            return (
              <div
                key={sc.id}
                className="p-5 rounded-2xl bg-[#141722] border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {sc.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                      {sc.exitMultipleLabel} Multiple
                    </span>
                  </div>

                  <p className="text-xs text-white/70 font-sans mt-3 leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="mt-4">
                    <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider block mb-2">
                      Key Scenario Catalysts:
                    </span>
                    <ul className="space-y-2 text-xs text-white/80 font-sans leading-relaxed">
                      {sc.catalysts.map((cat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                  <span>WACC: {sc.waccLabel}</span>
                  <span className="text-red-400 font-bold">₹{sc.sharePrice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Governed Bridge Footnote */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/70">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            Constant Bridge Factor: Net Liquidity of <strong>+₹8,199 Cr</strong> (Cash + Investments - Debt) is preserved across all scenarios.
          </span>
        </div>
        <span className="text-[11px] text-white/50 shrink-0">
          Source: Flagship DCF Model (Tab 4 & 5)
        </span>
      </div>
    </div>
  );
};
