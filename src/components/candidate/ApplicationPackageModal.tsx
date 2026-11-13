import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  AlertCircle,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { DocumentTailoringPackage } from '../../data/documentTailoringAssistant.ts';
import { ApprovalGateService, type ApplicationPackageSnapshot, type ApplicationApprovalRecord } from '../../data/approvalGateService.ts';

interface ApplicationPackageModalProps {
  tailoringPackage: DocumentTailoringPackage;
  onClose: () => void;
  onApproved?: (approvalRecord: ApplicationApprovalRecord) => void;
}

export const ApplicationPackageModal: React.FC<ApplicationPackageModalProps> = ({
  tailoringPackage,
  onClose,
  onApproved
}) => {
  const [activeTab, setActiveTab] = useState<'RESUME_BULLETS' | 'COVER_LETTER' | 'SCREENING_ANSWERS'>('RESUME_BULLETS');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [approvalRecord, setApprovalRecord] = useState<ApplicationApprovalRecord | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [candidateSignerName, setCandidateSignerName] = useState('Candidate Principal');

  const snapshot: ApplicationPackageSnapshot = {
    targetJobUrl: `https://careers.${tailoringPackage.targetCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    targetCompany: tailoringPackage.targetCompany,
    targetTitle: tailoringPackage.targetJobTitle,
    resumeVersionId: 'v1.0-governed',
    resumeSha256: 'sha256_canonical_resume_verified',
    coverLetterText: `${tailoringPackage.coverLetterDraft.salutation}\n\n${tailoringPackage.coverLetterDraft.openingHook}\n\n${tailoringPackage.coverLetterDraft.coreValueProposition}\n\n${tailoringPackage.coverLetterDraft.projectEvidenceHighlight}\n\n${tailoringPackage.coverLetterDraft.closingCallToAction}`,
    screeningAnswers: tailoringPackage.screeningQuestionsAnswers.map((sq) => ({
      question: sq.question,
      answer: sq.suggestedAnswer
    }))
  };

  const packageHash = ApprovalGateService.computePackageHash(snapshot);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApprovePackage = () => {
    const service = new ApprovalGateService();
    const prepRecord = service.prepareApprovalRecord(
      `app_${Date.now()}`,
      snapshot,
      candidateSignerName
    );
    const confirmedRecord = service.confirmApproval(
      prepRecord.approvalId,
      candidateSignerName
    );
    setApprovalRecord(confirmedRecord);
    if (onApproved) {
      onApproved(confirmedRecord);
    }
  };

  const handleExportJson = () => {
    const exportData = {
      package: tailoringPackage,
      snapshot,
      packageHash,
      approvalRecord
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application_package_${tailoringPackage.targetCompany.toLowerCase()}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0d0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Tailored Application Package
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Grounded Claims Only
                </span>
              </div>
              <p className="text-xs text-white/60">
                {tailoringPackage.targetJobTitle} &middot; {tailoringPackage.targetCompany}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-white/10 flex gap-4 bg-black/40">
          <button
            onClick={() => setActiveTab('RESUME_BULLETS')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'RESUME_BULLETS'
                ? 'border-red-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span>Resume Bullets</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {tailoringPackage.tailoredBulletPoints.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COVER_LETTER')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'COVER_LETTER'
                ? 'border-red-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span>Cover Letter</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">Ready</span>
          </button>

          <button
            onClick={() => setActiveTab('SCREENING_ANSWERS')}
            className={`pb-3 text-xs font-mono border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'SCREENING_ANSWERS'
                ? 'border-red-400 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <span>Screening Q&A</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
              {tailoringPackage.screeningQuestionsAnswers.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: RESUME BULLETS */}
          {activeTab === 'RESUME_BULLETS' && (
            <div className="space-y-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/70">
                These bullet points were synthesized strictly from confirmed audit claims matching the target job description requirements.
              </div>
              {tailoringPackage.tailoredBulletPoints.map((bp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-red-400 font-bold uppercase">{bp.category}</span>
                    <button
                      onClick={() => handleCopy(bp.tailoredText, `bp_${idx}`)}
                      className="inline-flex items-center gap-1 text-white/50 hover:text-white"
                    >
                      {copiedKey === `bp_${idx}` ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed font-sans">{bp.tailoredText}</p>
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/50">
                    <span>Target: {bp.targetRequirementMatched}</span>
                    <span className="text-white/40">Evidence: {bp.evidenceReference}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: COVER LETTER */}
          {activeTab === 'COVER_LETTER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/60">Structured Formal Draft</span>
                <button
                  onClick={() => handleCopy(snapshot.coverLetterText, 'full_cl')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 flex items-center gap-1.5"
                >
                  {copiedKey === 'full_cl' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Entire Letter</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4 text-sm text-white/90 leading-relaxed font-sans">
                <p>{tailoringPackage.coverLetterDraft.salutation}</p>
                <p>{tailoringPackage.coverLetterDraft.openingHook}</p>
                <p>{tailoringPackage.coverLetterDraft.coreValueProposition}</p>
                <p>{tailoringPackage.coverLetterDraft.projectEvidenceHighlight}</p>
                <p>{tailoringPackage.coverLetterDraft.closingCallToAction}</p>
              </div>
            </div>
          )}

          {/* TAB 3: SCREENING QUESTIONS */}
          {activeTab === 'SCREENING_ANSWERS' && (
            <div className="space-y-3">
              {tailoringPackage.screeningQuestionsAnswers.map((sq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <h3 className="text-sm font-semibold text-white/90 pr-4">{sq.question}</h3>
                      <button className="text-white/40 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 space-y-3">
                        <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs text-white/80 leading-relaxed font-sans">
                          {sq.suggestedAnswer}
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                          <span>Grounding: {sq.groundedClaimsUsed.join(', ')}</span>
                          <button
                            onClick={() => handleCopy(sq.suggestedAnswer, `sq_${idx}`)}
                            className="inline-flex items-center gap-1 text-white/60 hover:text-white"
                          >
                            {copiedKey === `sq_${idx}` ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Human Approval Gate & Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-mono text-white/70 block">
                Deterministic Package Digest: <strong className="text-white font-mono">{packageHash}</strong>
              </span>
              <span className="text-[11px] text-white/40">
                Phase 8.5 Mandate: Zero autonomous dispatch. Sign-off freezes immutable snapshot.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Package</span>
            </button>

            {approvalRecord ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Signed: {approvalRecord.approvalId}</span>
              </div>
            ) : (
              <button
                onClick={handleApprovePackage}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign & Freeze Package</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
