import React, { useState, useEffect } from 'react';
import { ClusterNodeGrid, type RenderNode } from './ClusterNodeGrid';
import { CostScalingSimulator } from './CostScalingSimulator';

export interface FleetSummary {
  totalGpus: number;
  totalActiveJobs: number;
  avgGpuUtilizationPct: number;
  avgCostPerFrameUsd: number;
  totalFramesLastHr: number;
  avgSpotSavingsPct: number;
}

export const RenderFleetCenter: React.FC = () => {
  const [nodes, setNodes] = useState<RenderNode[]>([]);
  const [summary, setSummary] = useState<FleetSummary>({
    totalGpus: 52,
    totalActiveJobs: 122,
    avgGpuUtilizationPct: 86,
    avgCostPerFrameUsd: 0.0395,
    totalFramesLastHr: 94100,
    avgSpotSavingsPct: 65
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CONNECTING');

  useEffect(() => {
    let isMounted = true;

    async function fetchFleetData() {
      try {
        const res = await fetch('/api/operations/renderFleet');
        if (!res.ok) throw new Error('API returned ' + res.status);
        const data = await res.json();
        if (isMounted && data.success) {
          setNodes(data.nodes || []);
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

    fetchFleetData();
    const interval = setInterval(fetchFleetData, 30000);
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
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              CINEMATIC AI RENDER FLEET & GPU ARBITRAGE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed GPU cluster autoscaling, spot instance efficiency metrics, and cost-per-frame analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Source: <strong className="text-cyan-300 font-semibold">{dataSource}</strong>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {summary.totalGpus} Active GPUs ({summary.avgGpuUtilizationPct}% Util)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm border border-slate-800 rounded-xl bg-slate-900/30">
          <span className="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>
          Ingesting GPU cluster render telemetry and spot pricing curves...
        </div>
      ) : (
        <>
          <CostScalingSimulator
            baseCostPerFrame={summary.avgCostPerFrameUsd}
            baseSpotSavingsPct={summary.avgSpotSavingsPct}
          />
          <ClusterNodeGrid nodes={nodes} />
        </>
      )}
    </div>
  );
};
