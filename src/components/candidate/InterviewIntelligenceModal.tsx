import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Cpu,
  ShieldCheck,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Sparkles,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  type CompanyIntelligenceBriefing,
  type CareerFunnelAnalytics,
  generateInterviewIntelligenceBriefing,
  computeCareerFunnelAnalytics
} from '../../data/interviewIntelligenceEngine';
import type { CandidateFitReport } from '../../data/candidateJobFitScorer';
import { setProjectUrlParam } from '../projects/projectNavigation';

interface InterviewIntelligenceModalProps {
  companyName: string;
  fitReport: CandidateFitReport;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const InterviewIntelligenceModal: React.FC<InterviewIntelligenceModalProps> = ({
  companyName,
  fitReport,
  onClose,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'BRIEFING' | 'REHEARSAL_QUESTIONS' | 'FUNNEL_ANALYTICS'>('BRIEFING');
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  const briefing = generateInterviewIntelligenceBriefing(companyName, fitReport);

  // In-browser mock history for funnel demonstration
  const mockHistory = [
    { applicationId: 'app_1', status: 'APPROVED', requiredSkills: ['PostgreSQL', 'Data Governance'] },
    { applicationId: 'app_2', status: 'SUBMITTED', requiredSkills: ['Financial Modeling', 'WACC'] },
    { applicationId: 'app_3', status: 'PENDING_APPROVAL', requiredSkills: ['Python', 'SQL'] },
    { applicationId: 'app_4', status: 'DISCOVERED', requiredSkills: ['Tableau', 'Power BI'] }
  ];
  const funnelAnalytics = computeCareerFunnelAnalytics(mockHistory);

  const handleOpenProject = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      setProjectUrlParam(projectId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0e111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Interview Intelligence & Company Briefing
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {briefing.inferredIndustry}
                </span>
              </div>
              <p className="text-xs text-white/60">
                Target: <strong className="text-white">{briefing.companyName}</strong> &middot; Role: {fitReport.jobTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-white/10 flex gap-4 bg-black/40">
          <button
            onClick={() => setActiveTab('BRIEFING')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'BRIEFING'
                ? 'border-purple-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Briefing</span>
          </button>

          <button
            onClick={() => setActiveTab('REHEARSAL_QUESTIONS')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'REHEARSAL_QUESTIONS'
                ? 'border-purple-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Interview Rehearsal Coach</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {briefing.interviewRehearsalQuestions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('FUNNEL_ANALYTICS')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'FUNNEL_ANALYTICS'
                ? 'border-purple-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Career Funnel Velocity</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* TAB 1: COMPANY BRIEFING */}
          {activeTab === 'BRIEFING' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-sans">
                This briefing breaks down the inferred business model, unit economics, and data architecture for{' '}
                <strong className="text-white">{briefing.companyName}</strong>, tailored to your candidate strengths.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Monetization Model</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {briefing.businessModelAnalysis.primaryRevenueStreams.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Unit Economics</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {briefing.businessModelAnalysis.coreUnitEconomics.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Data Governance Risks</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {briefing.businessModelAnalysis.potentialDataChallenges.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-400">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERVIEW REHEARSAL COACH */}
          {activeTab === 'REHEARSAL_QUESTIONS' && (
            <div className="space-y-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/70">
                Anticipated interview scenarios linked directly to your verified portfolio evidence deliverables.
              </div>

              {briefing.interviewRehearsalQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionIdx === idx;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div
                      onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                      className="flex items-start justify-between cursor-pointer select-none"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-white/70">
                            {q.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white/95">{q.questionText}</h3>
                      </div>
                      <button className="text-white/40 hover:text-white pt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 space-y-3 border-t border-white/5 mt-2">
                        <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase text-purple-300 block">
                            Suggested Answer Framework:
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            {q.suggestedResponseFramework}
                          </p>
                        </div>

                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                          <div>
                            <span className="text-white/50 block text-[10px]">CITED DELIVERABLE:</span>
                            <span className="text-white font-semibold">{q.linkedPortfolioProject.projectTitle}</span>
                            <p className="text-[11px] text-white/60 font-sans mt-0.5">
                              {q.linkedPortfolioProject.evidenceHighlight}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenProject(q.linkedPortfolioProject.projectId)}
                            className="text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                          >
                            <span>Inspect Case Study</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: FUNNEL ANALYTICS */}
          {activeTab === 'FUNNEL_ANALYTICS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                  <span className="text-[10px] text-white/50 uppercase block">Discovered</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {funnelAnalytics.totalOpportunitiesDiscovered}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                  <span className="text-[10px] text-white/50 uppercase block">Reviewed</span>
                  <span className="text-xl font-bold text-amber-300 mt-1 block">
                    {funnelAnalytics.totalApplicationsReviewed}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                  <span className="text-[10px] text-white/50 uppercase block">Approved</span>
                  <span className="text-xl font-bold text-purple-300 mt-1 block">
                    {funnelAnalytics.totalApprovedPackages}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
                  <span className="text-[10px] text-white/50 uppercase block">Submitted</span>
                  <span className="text-xl font-bold text-emerald-300 mt-1 block">
                    {funnelAnalytics.totalSubmittedApplications}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/70">Candidate Review Conversion Velocity:</span>
                  <span className="font-bold text-emerald-400">{funnelAnalytics.funnelConversionRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${funnelAnalytics.funnelConversionRate}%` }}
                  />
                </div>
              </div>

              {funnelAnalytics.inDemandSkillsFrequency.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-xs font-mono uppercase text-white/60 block">
                    In-Demand Skills Frequency Across Applications:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {funnelAnalytics.inDemandSkillsFrequency.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-xs font-mono text-white/80"
                      >
                        {s.skill} <strong className="text-purple-300">({s.occurrences})</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <span className="text-xs font-mono text-white/40">
            Phase 8.6 Intelligence &middot; Zero Third-Party Trackers
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
          >
            Close Briefing
          </button>
        </div>

      </div>
    </div>
  );
};

