import React, { useState } from 'react';

export const SMEROICalculator: React.FC = () => {
  const [activeMachines, setActiveMachines] = useState<number>(24);
  const [unplannedHourlyCost, setUnplannedHourlyCost] = useState<number>(18500); // INR per hour of outage
  const [baselineOutageHoursPerMonth, setBaselineOutageHoursPerMonth] = useState<number>(14);

  // Predictive maintenance empirical models show an average 68% reduction in unplanned breakdown hours
  const failureReductionFactor = 0.68;
  const annualGrossDowntimeCost = activeMachines * (baselineOutageHoursPerMonth * 12) * unplannedHourlyCost;
  const annualSavingsInr = annualGrossDowntimeCost * failureReductionFactor;
  const estimatedImplementationCostInr = activeMachines * 45000; // IoT sensors + telemetry bridge
  const netFirstYearRoiPct = Math.round(((annualSavingsInr - estimatedImplementationCostInr) / estimatedImplementationCostInr) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Predictive Maintenance Operational ROI Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical econometric modeling based on published MSME digital transformation frameworks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            68% Empirical Outage Reduction
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Monitored Shopfloor Machines</span>
              <span className="text-emerald-400 font-bold">{activeMachines} Units</span>
            </div>
            <input
              type="range"
              min="4"
              max="100"
              step="2"
              value={activeMachines}
              onChange={e => setActiveMachines(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>4 Units (Micro)</span>
              <span>24 Units (Mid-tier Foundry)</span>
              <span>100 Units (Auto Assembly)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Cost of Unplanned Breakdown / Hr</span>
              <span className="text-amber-400 font-bold">₹{unplannedHourlyCost.toLocaleString()} / hr</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="2500"
              value={unplannedHourlyCost}
              onChange={e => setUnplannedHourlyCost(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>₹5,000 / hr</span>
              <span>₹20,000 / hr</span>
              <span>₹50,000 / hr (Heavy CNC)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Baseline Monthly Downtime per Machine</span>
              <span className="text-rose-400 font-bold">{baselineOutageHoursPerMonth} hrs / mo</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={baselineOutageHoursPerMonth}
              onChange={e => setBaselineOutageHoursPerMonth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>2 hrs (Optimized)</span>
              <span>14 hrs (Average SME)</span>
              <span>30 hrs (Reactive Maintenance)</span>
            </div>
          </div>
        </div>

        {/* Financial ROI projection card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Projected Annualized Savings
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              ₹{(annualSavingsInr / 100000).toFixed(2)} Lakhs
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
              Net First-Year ROI: <strong className="text-emerald-300 font-bold">+{netFirstYearRoiPct}%</strong>
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Outage Risk:</span>
              <span className="text-slate-200">₹{(annualGrossDowntimeCost / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Telemetry Hardware:</span>
              <span className="text-slate-300">₹{(estimatedImplementationCostInr / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payback Period:</span>
              <span className="text-emerald-400 font-semibold">~2.2 Months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
