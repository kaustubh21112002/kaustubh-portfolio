import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileSearch,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Briefcase,
  Building2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { analyzeJobDescription } from '../../data/jobMatchEngine';
import { MatchAnalysisReport, RequirementVerdict } from '../../data/jobMatchKnowledge';
import { setProjectUrlParam } from '../projects/projectNavigation';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_JOB_PROFILES = [
  {
    label: 'Business Analyst (Retail / E-Commerce)',
    jobTitle: 'Senior Business Analyst',
    company: 'Retail Analytics Corp',
    description: `We are looking for a Business Analyst to design executive dashboards, build KPI trees, analyze operational SLA bottlenecks, and write complex SQL queries across PostgreSQL databases. Experience in dimensional modeling or star schema is preferred. Must communicate quantitative insights clearly to executive leadership.`
  },
  {
    label: 'Financial Analyst (Pre-IPO / Valuation)',
    jobTitle: 'Financial Analyst - Corporate Finance',
    company: 'Capital Partners',
    description: `Seeking a Financial Analyst with strong expertise in Discounted Cash Flow (DCF) modeling, WACC estimation, scenario sensitivity analysis, and Excel financial schedules. Knowledge of FinTech unit economics (CAC, LTV, capital adequacy) and terminal value reconciliation is a significant advantage.`
  },
  {
    label: 'Data Analyst (Operations & Tech)',
    jobTitle: 'Operations Data Analyst',
    company: 'Tech Solutions Inc',
    description: `Looking for a Data Analyst proficient with Python (Pandas & NumPy), Scikit-Learn regression, and Power BI DAX reporting. Candidate must perform exploratory data analysis (EDA), detect operational bottlenecks, and maintain strict data quality and reconciliation standards across 10,000+ support ticket logs.`
  }
];

export const JobMatchModal: React.FC<JobMatchModalProps> = ({ isOpen, onClose }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [report, setReport] = useState<MatchAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Set focus on textarea on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleAnalyze = () => {
    const trimmed = description.trim();
    if (!trimmed) {
      setErrorMessage('Please paste a job description to analyze.');
      return;
    }
    if (trimmed.length < 30) {
      setErrorMessage('Job description is too brief. Please paste at least 5-10 words describing requirements.');
      return;
    }
    if (trimmed.length > 10000) {
      setErrorMessage('Job description exceeds maximum length of 10,000 characters. Please shorten it.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    // Deterministic client-side analysis (fast, privacy-preserving, zero data sent to external servers)
    setTimeout(() => {
      try {
        const result = analyzeJobDescription(trimmed, { jobTitle, company });
        setReport(result);
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to evaluate job description.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 200);
  };

  const handleReset = () => {
    setReport(null);
    setDescription('');
    setJobTitle('');
    setCompany('');
    setErrorMessage(null);
  };

  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_JOB_PROFILES[sampleIndex];
    setJobTitle(sample.jobTitle);
    setCompany(sample.company);
    setDescription(sample.description);
    setErrorMessage(null);
  };

  const handleOpenCaseStudy = (projectId: string) => {
    onClose();
    // Use canonical project deep link
    setProjectUrlParam(projectId, 'case-study');
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-match-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={modalRef}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0f121d] border border-white/15 shadow-2xl overflow-hidden text-white my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wider">
              <FileSearch className="w-3.5 h-3.5" />
              <span>Evidence-Backed Fit Evaluation</span>
            </div>
            <h2 id="job-match-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Job Description Match Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-sans">
              Paste any job description to compare requirements against governed portfolio deliverables, workbooks, and case studies.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Job Description Match Analyzer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!report ? (
            /* INPUT SCREEN */
            <div className="space-y-5">
              {/* Optional Job Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="jd-job-title" className="block text-xs font-mono text-white/80 mb-1 font-semibold">
                    Target Role Title (Optional)
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="jd-job-title"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Business Analyst, Financial Modeling"
                      maxLength={100}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-red-400 text-xs sm:text-sm text-white placeholder-white/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="jd-company" className="block text-xs font-mono text-white/80 mb-1 font-semibold">
                    Company / Organization (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-white/40 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="jd-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. FinTech, Analytics Consulting"
                      maxLength={100}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-red-400 text-xs sm:text-sm text-white placeholder-white/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    />
                  </div>
                </div>
              </div>

              {/* Sample Profile Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-white/60 block">
                  Quick test with realistic recruiter profiles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_JOB_PROFILES.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleLoadSample(sIdx)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/90 hover:text-white transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="jd-textarea" className="text-xs font-mono text-white/90 font-semibold">
                    Job Description / Requirements *
                  </label>
                  <span className="text-[11px] font-mono text-white/50">
                    {description.length} / 10,000 characters
                  </span>
                </div>
                <textarea
                  id="jd-textarea"
                  ref={textareaRef}
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the full job posting, bulleted requirements, or responsibilities here..."
                  maxLength={10000}
                  className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/15 focus:border-red-400 text-xs sm:text-sm text-white placeholder-white/40 transition-colors font-sans focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 leading-relaxed"
                />
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3 text-xs text-white/70 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Privacy First:</strong> Your pasted job description is analyzed locally in your browser. It is never logged, stored, or transmitted to third-party databases.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 font-mono text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !description.trim()}
                  className={`min-h-[44px] px-6 py-2.5 rounded-full font-bold font-mono text-xs tracking-wide transition-all flex items-center gap-2 ${
                    isAnalyzing || !description.trim()
                      ? 'bg-white/20 text-white/40 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/95 shadow-lg active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Evidence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-red-600" />
                      <span>Analyze Requirements</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* RESULTS DASHBOARD */
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-white/50 block">Target Assessment</span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {report.jobTitle || 'Unspecified Role'} {report.company ? `• ${report.company}` : ''}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono border border-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>New Analysis</span>
                  </button>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                    <span className="text-[10px] text-white/50 uppercase block">Requirements</span>
                    <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
                      {report.totalRequirementsEvaluated}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono">
                    <span className="text-[10px] text-emerald-400 uppercase block">Demonstrated</span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-300 mt-0.5 block">
                      {report.demonstratedCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono">
                    <span className="text-[10px] text-amber-400 uppercase block">Partial Fit</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">
                      {report.partialCount}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 font-mono">
                    <span className="text-[10px] text-red-400 uppercase block">Evidence Gaps</span>
                    <span className="text-lg sm:text-xl font-bold text-red-300 mt-0.5 block">
                      {report.gapCount}
                    </span>
                  </div>
                </div>

                {/* Evidence Coverage Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/70">Evidence Alignment Coverage:</span>
                    <span className="font-bold text-white">{report.coveragePercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${report.coveragePercentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-white/50 font-sans leading-tight mt-1">
                    {report.calculationExplanation}
                  </p>
                </div>
              </div>

              {/* Top Matching Projects */}
              {report.topMatchingProjects.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white/90 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    <span>Strongest Evidence Projects</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.topMatchingProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                            {p.matchedRequirementsCount} Matches
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                            {p.title}
                          </h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.demonstratedSkills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="text-[10px] font-mono text-white/60 bg-black/40 px-1.5 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenCaseStudy(p.id)}
                          className="mt-3 pt-2 border-t border-white/5 inline-flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <span>Open Case Study</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirement Match Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white/90">
                  Requirement Verification Breakdown
                </h4>

                <div className="space-y-2.5">
                  {report.requirementMatches.map((m, idx) => {
                    const isDemonstrated = m.verdict === 'DEMONSTRATED';
                    const isPartial = m.verdict === 'PARTIAL';

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isDemonstrated
                            ? 'bg-emerald-500/[0.03] border-emerald-500/25'
                            : isPartial
                            ? 'bg-amber-500/[0.03] border-amber-500/25'
                            : 'bg-red-500/[0.03] border-red-500/20'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            {isDemonstrated ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isPartial ? (
                              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm font-bold text-white font-mono">
                              {m.jobRequirement}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                isDemonstrated
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isPartial
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {m.verdict}
                            </span>
                            <span className="text-white/40">Confidence: {m.confidence}</span>
                          </div>
                        </div>

                        <p className="text-xs text-white/80 font-sans mt-2 leading-relaxed">
                          {m.explanation}
                        </p>

                        {m.supportingProject && (
                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                            <span className="text-white/50">
                              Supporting Deliverable:{' '}
                              <strong className="text-white font-medium">{m.supportingProject.title}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenCaseStudy(m.supportingProject!.id)}
                              className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Inspect Evidence</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preparation Topics & Resume Alignment Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Recommended Preparation Topics</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80 font-sans">
                    {report.recommendedPreparationTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Interview & Resume Alignment</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80 font-sans">
                    {report.resumeAlignmentSuggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
