import React from 'react';

export interface RenderNode {
  id: number;
  node_id: string;
  cluster_name: string;
  region: string;
  gpu_type: string;
  gpu_count: number;
  active_render_jobs: number;
  gpu_utilization_pct: number;
  cost_per_frame_usd: number;
  autoscaling_status: 'SCALED_OPTIMAL' | 'AUTOSCALING_UP' | 'BURST_CAPACITY' | 'DRAINING';
  frames_rendered_last_hr: number;
  spot_instance_savings_pct: number;
}

interface ClusterNodeGridProps {
  nodes: RenderNode[];
}

export const ClusterNodeGrid: React.FC<ClusterNodeGridProps> = ({ nodes }) => {
  const getAutoscaleBadge = (status: RenderNode['autoscaling_status']) => {
    switch (status) {
      case 'SCALED_OPTIMAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'AUTOSCALING_UP':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'BURST_CAPACITY':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Active Cinematic GPU Render Nodes
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time compute nodes, GPU memory utilization, and cost-per-frame tracking across edge clusters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map(node => (
          <div
            key={node.id}
            className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  {node.region} • {node.node_id}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                  {node.cluster_name}
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getAutoscaleBadge(node.autoscaling_status)}`}>
                {node.autoscaling_status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">{node.gpu_count}x</span> {node.gpu_type}
            </div>

            {/* GPU Utilization progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">GPU Utilization</span>
                <span className={`font-semibold ${
                  node.gpu_utilization_pct >= 90
                    ? 'text-rose-400'
                    : node.gpu_utilization_pct >= 80
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {node.gpu_utilization_pct}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    node.gpu_utilization_pct >= 90
                      ? 'bg-rose-500'
                      : node.gpu_utilization_pct >= 80
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${node.gpu_utilization_pct}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Jobs</span>
                <span className="text-slate-200 font-semibold">{node.active_render_jobs}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cost/Frame</span>
                <span className="text-amber-300 font-semibold">${node.cost_per_frame_usd}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Spot Save</span>
                <span className="text-emerald-400 font-semibold">+{node.spot_instance_savings_pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
