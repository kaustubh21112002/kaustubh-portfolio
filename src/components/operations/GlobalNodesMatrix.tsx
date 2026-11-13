import React from 'react';
import type { NodeStatus } from './SLATicketQueue';

interface GlobalNodesMatrixProps {
  nodes: NodeStatus[];
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}

export const GlobalNodesMatrix: React.FC<GlobalNodesMatrixProps> = ({
  nodes,
  selectedRegion,
  onSelectRegion
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Global Support Data Center Nodes
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Regional infrastructure telemetry, edge latencies, and active operational ticket density.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Heavy Load</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map(node => {
          const isSelected = selectedRegion?.toLowerCase() === node.location.toLowerCase();
          return (
            <div
              key={node.id}
              onClick={() => onSelectRegion(isSelected ? null : node.location)}
              className={`p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
                    {node.name}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                    {node.location}
                  </h4>
                </div>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {node.health}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Latency</span>
                  <span className="font-semibold text-slate-200">
                    {node.latencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Active Load</span>
                  <span className="font-semibold text-cyan-400">
                    {node.activeTickets} Tickets
                  </span>
                </div>
              </div>

              {/* Capacity meter */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Capacity</span>
                  <span>{node.capacityUtilization}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      node.capacityUtilization > 75
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${node.capacityUtilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
