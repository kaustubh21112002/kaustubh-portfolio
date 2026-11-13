import React from 'react';
import type { CandidateRecord } from '../../../../api/operations/candidateIntelligence';

interface CandidateSkillMatchTableProps {
  candidates: CandidateRecord[];
}

export const CandidateSkillMatchTable: React.FC<CandidateSkillMatchTableProps> = ({ candidates }) => {
  const getStatusBadge = (status: CandidateRecord['tailoring_status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Approved
          </span>
        );
      case 'GROUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Grounded
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Review
          </span>
        );
      case 'REQUIRES_AMENDMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Amendment Req.
          </span>
        );
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 80) return 'text-cyan-500 dark:text-cyan-400';
    if (score >= 70) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono">
            <th className="py-3 px-4 font-semibold">Candidate ID / Profile</th>
            <th className="py-3 px-4 font-semibold">Target Role & Domain</th>
            <th className="py-3 px-4 font-semibold text-right">Skill Match Score</th>
            <th className="py-3 px-4 font-semibold">Grounded Competencies</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Cryptographic Approval Hash</th>
            <th className="py-3 px-4 font-semibold text-right">Version</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
          {candidates.map((candidate) => (
            <tr key={candidate.candidate_id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {candidate.profile_name}
                </div>
                <div className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400">
                  {candidate.candidate_id}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  {candidate.target_role}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {candidate.domain}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className={`font-mono text-sm font-bold ${getScoreColor(Number(candidate.skill_match_score))}`}>
                  {Number(candidate.skill_match_score).toFixed(1)}%
                </div>
                <div className="w-20 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full ml-auto mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, candidate.skill_match_score)}%` }}
                  />
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {candidate.matched_skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.matched_skills.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 self-center">
                      +{candidate.matched_skills.length - 3} more
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                {getStatusBadge(candidate.tailoring_status)}
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span title={candidate.sha256_approval_hash}>
                    {candidate.sha256_approval_hash.substring(0, 8)}...{candidate.sha256_approval_hash.substring(56)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Verified: {new Date(candidate.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                {candidate.document_version}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
