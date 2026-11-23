import React, { useState } from 'react';

export const CashRunwaySimulator: React.FC = () => {
  const [cashBalanceLakhs, setCashBalanceLakhs] = useState<number>(350); // ₹3.50 Cr
  const [monthlyCollectionsLakhs, setMonthlyCollectionsLakhs] = useState<number>(45); // ₹45L / month
  const [monthlyOpexLakhs, setMonthlyOpexLakhs] = useState<number>(65); // ₹65L / month

  const netBurnLakhs = Math.max(0, monthlyOpexLakhs - monthlyCollectionsLakhs);
  const projectedRunwayMonths = netBurnLakhs > 0 ? (cashBalanceLakhs / netBurnLakhs).toFixed(1) : '∞ (Self-Funding)';
  const runwayValue = netBurnLakhs > 0 ? parseFloat(projectedRunwayMonths as string) : 999;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Working Capital Stress-Test & Runway Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate collections volatility, OpEx burn variations, and projected liquidity survival horizons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border ${
            runwayValue < 6
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : runwayValue < 12
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            Status: {runwayValue < 6 ? 'CRITICAL DEFICIT' : runwayValue < 12 ? 'MODERATE BUFFER' : 'SOLVENT LIQUIDITY'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Total Liquid Treasury Balance</span>
              <span className="text-blue-400 font-bold">₹{cashBalanceLakhs} Lakhs (₹{(cashBalanceLakhs / 100).toFixed(2)} Cr)</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={cashBalanceLakhs}
              onChange={e => setCashBalanceLakhs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>₹50 Lakhs</span>
              <span>₹500 Lakhs (₹5 Cr)</span>
              <span>₹1000 Lakhs (₹10 Cr)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Monthly Operating Expenses (OpEx)</span>
              <span className="text-rose-400 font-bold">₹{monthlyOpexLakhs} Lakhs / mo</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={monthlyOpexLakhs}
              onChange={e => setMonthlyOpexLakhs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>₹10 Lakhs</span>
              <span>₹100 Lakhs (₹1 Cr)</span>
              <span>₹200 Lakhs (₹2 Cr)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Monthly Receivables Collections</span>
              <span className="text-emerald-400 font-bold">₹{monthlyCollectionsLakhs} Lakhs / mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={monthlyCollectionsLakhs}
              onChange={e => setMonthlyCollectionsLakhs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>₹0 (Total Disruption)</span>
              <span>₹100 Lakhs</span>
              <span>₹200 Lakhs (Surplus)</span>
            </div>
          </div>
        </div>

        {/* Projection summary card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Projected Solvency Horizon
            </span>
            <div className={`text-2xl font-bold font-mono mt-1 ${
              runwayValue < 6
                ? 'text-rose-400'
                : runwayValue < 12
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {projectedRunwayMonths} {typeof projectedRunwayMonths === 'string' && projectedRunwayMonths.includes('∞') ? '' : 'Months'}
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
              Net Monthly Burn: <strong className="text-rose-300 font-bold">₹{netBurnLakhs} Lakhs</strong>
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Working Capital Buffer:</span>
              <span className="text-slate-200">{((cashBalanceLakhs / monthlyOpexLakhs) * 0.85).toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recovery Breakeven:</span>
              <span className="text-slate-300">{monthlyOpexLakhs > monthlyCollectionsLakhs ? `+₹${monthlyOpexLakhs - monthlyCollectionsLakhs}L/mo needed` : 'Cash Flow Positive'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Governance Standard:</span>
              <span className="text-blue-400 font-semibold">Basel III / MSME Stated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

