import React from 'react';
import type { B2BCampaignRecord } from '../../../../api/operations/b2bCampaigns';

interface CampaignStatusTableProps {
  campaigns: B2BCampaignRecord[];
}

export const CampaignStatusTable: React.FC<CampaignStatusTableProps> = ({ campaigns }) => {
  const getChannelBadge = (channel: B2BCampaignRecord['channel']) => {
    switch (channel) {
      case 'LINKEDIN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            LinkedIn InMail
          </span>
        );
      case 'EMAIL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Direct Email
          </span>
        );
      case 'WHATSAPP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            WhatsApp Direct
          </span>
        );
    }
  };

  const getStageBadge = (stage: B2BCampaignRecord['sequence_stage']) => {
    switch (stage) {
      case 'DEMO_COMMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Demo Committed
          </span>
        );
      case 'REPLIED_WITH_INTEREST':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Replied (High Intent)
          </span>
        );
      case 'OPENED_AND_READ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Opened & Read
          </span>
        );
      case 'TOUCHPOINT_1_DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Initial Touchpoint
          </span>
        );
      case 'NURTURE_HOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Nurture Hold
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Campaign ID / Enterprise</th>
            <th className="py-3 px-4 font-semibold">Sector</th>
            <th className="py-3 px-4 font-semibold">Orchestration Channel</th>
            <th className="py-3 px-4 font-semibold text-right">Engagement Score</th>
            <th className="py-3 px-4 font-semibold text-right">SLA Exposure (USD)</th>
            <th className="py-3 px-4 font-semibold">Sequence Stage</th>
            <th className="py-3 px-4 font-semibold text-right">Last Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {campaigns.map((camp) => (
            <tr key={camp.campaign_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {camp.enterprise_name}
                </div>
                <div className="text-[11px] font-mono text-violet-500 dark:text-violet-400">
                  {camp.campaign_id}
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                {camp.sector}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getChannelBadge(camp.channel)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {Number(camp.engagement_score).toFixed(1)}
                </div>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    style={{ width: `${camp.engagement_score}%` }}
                  />
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                ${Number(camp.sla_penalty_exposure_usd).toLocaleString()}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getStageBadge(camp.sequence_stage)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                {new Date(camp.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
