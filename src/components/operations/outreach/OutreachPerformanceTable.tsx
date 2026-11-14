import React from 'react';
import type { ExecutiveOutreachRecord } from '../../../../api/operations/executiveOutreach';

interface OutreachPerformanceTableProps {
  leads: ExecutiveOutreachRecord[];
}

export const OutreachPerformanceTable: React.FC<OutreachPerformanceTableProps> = ({ leads }) => {
  const getStageBadge = (stage: ExecutiveOutreachRecord['conversion_stage']) => {
    switch (stage) {
      case 'PROPOSAL_DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Proposal Dispatched
          </span>
        );
      case 'MEETING_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Meeting Scheduled
          </span>
        );
      case 'ENGAGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Engaged
          </span>
        );
      case 'DOWNLOADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Downloaded
          </span>
        );
      default:
        return null;
    }
  };

  const getReportTag = (report: ExecutiveOutreachRecord['downloaded_report']) => {
    switch (report) {
      case 'MSP_SLA_Bottleneck':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            MSP SLA Report
          </span>
        );
      case 'Data_SLA_Bottleneck':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Data Pipeline Report
          </span>
        );
      case 'Mobility_SLA_Bottleneck':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Mobility Fleet Report
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Lead ID / Executive</th>
            <th className="py-3 px-4 font-semibold">Organization & Sector</th>
            <th className="py-3 px-4 font-semibold">Downloaded Micro-Report</th>
            <th className="py-3 px-4 font-semibold text-right">Lead Score</th>
            <th className="py-3 px-4 font-semibold">Funnel Stage</th>
            <th className="py-3 px-4 font-semibold text-right">Dispatched At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {leads.map((lead) => (
            <tr key={lead.lead_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {lead.executive_title}
                </div>
                <div className="text-[11px] font-mono text-cyan-500 dark:text-cyan-400">
                  {lead.lead_id}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  {lead.organization_name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lead.target_sector}
                </div>
              </td>
              <td className="py-3.5 px-4">
                {getReportTag(lead.downloaded_report)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {Number(lead.lead_score).toFixed(1)}
                </div>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${lead.lead_score}%` }}
                  />
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getStageBadge(lead.conversion_stage)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                {new Date(lead.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
