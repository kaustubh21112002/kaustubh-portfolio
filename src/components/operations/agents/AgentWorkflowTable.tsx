import React from 'react';
import type { AgentWorkflowRecord } from '../../../../api/operations/agenticWorkflows';

interface AgentWorkflowTableProps {
  workflows: AgentWorkflowRecord[];
}

export const AgentWorkflowTable: React.FC<AgentWorkflowTableProps> = ({ workflows }) => {
  const getStatusBadge = (status: AgentWorkflowRecord['execution_status']) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Running
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Queued
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Paused
          </span>
        );
    }
  };

  const getTaskBadge = (task: AgentWorkflowRecord['task_type']) => {
    switch (task) {
      case 'DATA_RECONCILIATION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Data Reconcile
          </span>
        );
      case 'SLA_BREACH_PREDICTION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            SLA Sentinel
          </span>
        );
      case 'DOCUMENT_TAILORING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Doc Tailoring
          </span>
        );
      case 'CHAOS_FAULT_INJECTION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Chaos Mesh
          </span>
        );
      case 'TAX_AUDIT_VERIFICATION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Statutory Audit
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Workflow ID / Agent</th>
            <th className="py-3 px-4 font-semibold">Autonomous Task Type</th>
            <th className="py-3 px-4 font-semibold">Execution State</th>
            <th className="py-3 px-4 font-semibold text-right">Tokens Consumed</th>
            <th className="py-3 px-4 font-semibold text-right">Inference Latency</th>
            <th className="py-3 px-4 font-semibold">Model Provider</th>
            <th className="py-3 px-4 font-semibold text-right">Last Execution</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {workflows.map((wf) => (
            <tr key={wf.workflow_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {wf.agent_name}
                </div>
                <div className="text-[11px] font-mono text-cyan-500 dark:text-cyan-400">
                  {wf.workflow_id}
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getTaskBadge(wf.task_type)}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getStatusBadge(wf.execution_status)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                {Number(wf.token_consumption).toLocaleString()}
                <span className="text-[10px] font-normal text-slate-400 ml-1">tokens</span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono">
                <span className={`text-xs font-semibold ${
                  wf.latency_ms < 300
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : wf.latency_ms < 700
                    ? 'text-cyan-500 dark:text-cyan-400'
                    : 'text-amber-500 dark:text-amber-400'
                }`}>
                  {Number(wf.latency_ms).toFixed(1)} ms
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-white/10">
                  {wf.model_provider}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                {new Date(wf.last_executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
