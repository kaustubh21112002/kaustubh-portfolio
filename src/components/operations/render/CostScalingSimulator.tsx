import React, { useState } from 'react';

interface CostSimulatorProps {
  baseCostPerFrame: number;
  baseSpotSavingsPct: number;
}

export const CostScalingSimulator: React.FC<CostSimulatorProps> = ({
  baseCostPerFrame,
  baseSpotSavingsPct
}) => {
  const [targetFrames, setTargetFrames] = useState<number>(100000);
  const [spotAllocationPct, setSpotAllocationPct] = useState<number>(baseSpotSavingsPct);
  const [resolutionTier, setResolutionTier] = useState<'2K' | '4K' | '8K'>('4K');

  const resolutionMultiplier = resolutionTier === '2K' ? 0.65 : resolutionTier === '4K' ? 1.0 : 2.4;
  const onDemandCost = targetFrames * baseCostPerFrame * resolutionMultiplier;
  const spotDiscount = (spotAllocationPct / 100) * 0.68; // Up to 68% discount on spot instances
  const optimizedCost = onDemandCost * (1 - spotDiscount);
  const totalSavingsUsd = onDemandCost - optimizedCost;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Cloud Render Cost-Scaling Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate GPU spot instance arbitrage and multi-tier resolution economics under peak batch workloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['2K', '4K', '8K'] as const).map(res => (
            <button
              key={res}
              onClick={() => setResolutionTier(res)}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all ${
                resolutionTier === res
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {res} Resolution
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Production Batch Volume</span>
              <span className="text-amber-400 font-bold">{targetFrames.toLocaleString()} Frames</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={targetFrames}
              onChange={e => setTargetFrames(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>10K (Short Clip)</span>
              <span>500K (Commercial)</span>
              <span>1M (Feature Film)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-300">Spot Instance Arbitrage Ratio</span>
              <span className="text-emerald-400 font-bold">{spotAllocationPct}% Spot Fleet</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={spotAllocationPct}
              onChange={e => setSpotAllocationPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0% (Full On-Demand)</span>
              <span>50% (Balanced)</span>
              <span>90% (Maximum Arbitrage)</span>
            </div>
          </div>
        </div>

        {/* Projection summary card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Projected Batch Cost
            </span>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
              ${optimizedCost.toFixed(2)}
            </div>
            <span className="text-[11px] font-mono text-slate-400 line-through block mt-0.5">
              Standard On-Demand: ${onDemandCost.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Cost per Frame</span>
              <span className="text-amber-300 font-semibold">
                ${(optimizedCost / targetFrames).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Total Savings</span>
              <span className="text-emerald-400 font-semibold">
                +${totalSavingsUsd.toFixed(2)} ({Math.round(spotDiscount * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
