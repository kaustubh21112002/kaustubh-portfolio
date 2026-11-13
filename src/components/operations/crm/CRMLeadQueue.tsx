import React from 'react';

export interface CRMLead {
  id: number;
  account_name: string;
  industry: string;
  contact_stage: 'DISCOVERY' | 'EXECUTIVE_REVIEW' | 'PROPOSAL_DELIVERED' | 'CONTRACT_NEGOTIATION' | 'CLOSED_WON';
  lead_score: number;
  response_time_hours: number;
  pdf_export_status: 'GENERATED' | 'QUEUED' | 'PENDING_RENDER' | 'FAILED';
  pdf_generation_ms: number;
  target_decision_maker: string;
  last_touchpoint_at: string;
}

interface CRMLeadQueueProps {
  leads: CRMLead[];
}

export const CRMLeadQueue: React.FC<CRMLeadQueueProps> = ({ leads }) => {
  const getStageBadge = (stage: CRMLead['contact_stage']) => {
    switch (stage) {
      case 'CONTRACT_NEGOTIATION':
      case 'CLOSED_WON':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'EXECUTIVE_REVIEW':
      case 'PROPOSAL_DELIVERED':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getPdfStatusBadge = (status: CRMLead['pdf_export_status']) => {
    switch (status) {
      case 'GENERATED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PENDING_RENDER':
      case 'QUEUED':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <h3 className="text-base font-semibold text-slate-100 tracking-wide font-mono uppercase">
              Automated Lead Generation & PDF Audit Logs
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking enterprise lead accounts, touchpoint latency, and Headless Chrome brief generation speeds.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3">Enterprise Target</th>
              <th className="py-2.5 px-3">Industry Vertical</th>
              <th className="py-2.5 px-3">Pipeline Stage</th>
              <th className="py-2.5 px-3">Target Persona</th>
              <th className="py-2.5 px-3 text-center">Lead Score</th>
              <th className="py-2.5 px-3 text-center">Response Latency</th>
              <th className="py-2.5 px-3 text-right">Headless PDF Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-100 font-sans">
                  {lead.account_name}
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans">
                  {lead.industry}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStageBadge(lead.contact_stage)}`}>
                    {lead.contact_stage.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  {lead.target_decision_maker}
                </td>
                <td className="py-3 px-3 text-center font-bold text-violet-400">
                  {lead.lead_score}/100
                </td>
                <td className="py-3 px-3 text-center text-slate-300">
                  {lead.response_time_hours} hrs
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${getPdfStatusBadge(lead.pdf_export_status)}`}>
                    {lead.pdf_export_status === 'GENERATED' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                    {lead.pdf_export_status}
                    {lead.pdf_generation_ms > 0 && ` (${lead.pdf_generation_ms}ms)`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
