import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Edit3,
  HelpCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  History,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { CandidateClaimStore } from '../../lib/candidateClaimStore';
import { DynamicButton } from '../common/DynamicButton';
import type {
  CandidateClaim,
  VerificationStatus,
  ClaimType,
  PermittedApplicationUse
} from '../../types/candidate';

export interface CandidateReviewProps {
  store: CandidateClaimStore;
  actorName?: string;
  onExit?: () => void;
}

export type StatusFilter = 'ALL' | VerificationStatus;

export const CandidateReview: React.FC<CandidateReviewProps> = ({
  store,
  actorName = 'candidate_user',
  onExit
}) => {
  // Local state triggered by claim store notifications
  const [claims, setClaims] = useState<CandidateClaim[]>(() => store.listClaims());
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Correction Modal / Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Subscribe to store mutations
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setClaims(store.listClaims());
    });
    return unsubscribe;
  }, [store]);

  // Derived Summary Counts
  const summary = useMemo(() => {
    let confirmed = 0;
    let corrected = 0;
    let rejected = 0;
    let unknown = 0;
    let extracted = 0;
    let suggestions = 0;

    for (const c of claims) {
      switch (c.verificationStatus) {
        case 'CONFIRMED':
          confirmed++;
          break;
        case 'CORRECTED':
          corrected++;
          break;
        case 'REJECTED':
          rejected++;
          break;
        case 'UNKNOWN':
          unknown++;
          break;
        case 'EXTRACTED':
          extracted++;
          break;
        case 'AI_SUGGESTION':
          suggestions++;
          break;
      }
    }

    return {
      total: claims.length,
      confirmed,
      corrected,
      rejected,
      unknown,
      extracted,
      suggestions,
      awaitingReview: extracted + suggestions
    };
  }, [claims]);

  // Filtered claims list
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      const matchStatus = statusFilter === 'ALL' || c.verificationStatus === statusFilter;
      const matchType = typeFilter === 'ALL' || c.claimType === typeFilter;
      return matchStatus && matchType;
    });
  }, [claims, statusFilter, typeFilter]);

  // Selected claim object
  const selectedClaim = useMemo(() => {
    if (!selectedClaimId && filteredClaims.length > 0) {
      return filteredClaims[0];
    }
    return claims.find((c) => c.claimId === selectedClaimId) || null;
  }, [claims, selectedClaimId, filteredClaims]);

  // Pre-fill edit modal when selected claim changes
  useEffect(() => {
    if (selectedClaim) {
      if (typeof selectedClaim.claimValue === 'string') {
        setEditValue(selectedClaim.claimValue);
      } else if (typeof selectedClaim.claimValue === 'object' && selectedClaim.claimValue !== null) {
        setEditValue(JSON.stringify(selectedClaim.claimValue, null, 2));
      } else {
        setEditValue(String(selectedClaim.claimValue ?? ''));
      }
      setEditReason('');
      setIsEditing(false);
      setActionError(null);
    }
  }, [selectedClaim?.claimId]);

  // Actions
  const handleConfirm = useCallback(() => {
    if (!selectedClaim) return;
    try {
      setActionError(null);
      // Permitted application use is strictly granted only upon candidate confirmation
      const permittedUse: PermittedApplicationUse =
        selectedClaim.claimType === 'CAREER_PREFERENCE' ? 'INTERNAL_MATCHING_ONLY' : 'RESUME_CONTENT';
      store.confirmClaim(selectedClaim.claimId, actorName, { permittedUse });
    } catch (err: any) {
      setActionError(err.message || 'Confirmation failed');
    }
  }, [selectedClaim, store, actorName]);

  const handleCorrectSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;
    if (editValue.trim().length === 0) {
      setActionError('Corrected value cannot be empty.');
      return;
    }

    try {
      setActionError(null);
      // Try to parse JSON if value appears to be object
      let parsedValue: unknown = editValue;
      if (editValue.startsWith('{') || editValue.startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch {
          parsedValue = editValue;
        }
      }

      store.correctClaim(selectedClaim.claimId, parsedValue, actorName, {
        reason: editReason.trim() || 'Candidate corrected value'
      });
      setIsEditing(false);
    } catch (err: any) {
      setActionError(err.message || 'Correction failed');
    }
  }, [selectedClaim, editValue, editReason, store, actorName]);

  const handleReject = useCallback(() => {
    if (!selectedClaim) return;
    try {
      setActionError(null);
      store.rejectClaim(selectedClaim.claimId, actorName, 'Rejected by candidate during review');
    } catch (err: any) {
      setActionError(err.message || 'Rejection failed');
    }
  }, [selectedClaim, store, actorName]);

  const handleMarkUnknown = useCallback(() => {
    if (!selectedClaim) return;
    try {
      setActionError(null);
      store.markClaimUnknown(selectedClaim.claimId, actorName, 'Marked as unverified / unknown by candidate');
    } catch (err: any) {
      setActionError(err.message || 'Action failed');
    }
  }, [selectedClaim, store, actorName]);

  // Helper status badge styling
  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'CORRECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Edit3 className="w-3 h-3" />
            Corrected
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            <HelpCircle className="w-3 h-3" />
            Unknown
          </span>
        );
      case 'AI_SUGGESTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <Sparkles className="w-3 h-3" />
            AI Suggestion
          </span>
        );
      case 'EXTRACTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Layers className="w-3 h-3" />
            Extracted (Draft)
          </span>
        );
    }
  };

  // Helper application use badge
  const renderPermittedUseBadge = (use: PermittedApplicationUse) => {
    switch (use) {
      case 'RESUME_CONTENT':
        return <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Permitted on Resume</span>;
      case 'COVER_LETTER':
        return <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Permitted in Cover Letter</span>;
      case 'INTERNAL_MATCHING_ONLY':
        return <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Internal Matching Only</span>;
      case 'DO_NOT_USE':
      default:
        return <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Excluded From Applications</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col my-6">
      {/* Top Warning Banner (In-Memory Session Only) */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold">In-Memory Session:</strong> Review decisions exist in local memory only. Closing or refreshing the page will reset all review states. A profile is not verified merely because all claims have been displayed.
          </span>
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="text-amber-800 dark:text-amber-300 hover:underline font-medium ml-4 shrink-0"
          >
            Exit Review
          </button>
        )}
      </div>

      {/* Review Header & Metric Summary */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Candidate Profile Review
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Audit every extracted claim against source evidence. Confirm, correct, or reject before any claim is permitted for job applications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {summary.awaitingReview} Awaiting Confirmation
            </span>
          </div>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Claims</span>
            <p className="text-base font-bold text-gray-900 dark:text-gray-100">{summary.total}</p>
          </div>
          <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
            <span className="text-xs text-emerald-700 dark:text-emerald-400">Confirmed</span>
            <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">{summary.confirmed}</p>
          </div>
          <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-center">
            <span className="text-xs text-blue-700 dark:text-blue-400">Corrected</span>
            <p className="text-base font-bold text-blue-700 dark:text-blue-300">{summary.corrected}</p>
          </div>
          <div className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 text-center">
            <span className="text-xs text-rose-700 dark:text-rose-400">Rejected</span>
            <p className="text-base font-bold text-rose-700 dark:text-rose-300">{summary.rejected}</p>
          </div>
          <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Unknown</span>
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">{summary.unknown}</p>
          </div>
          <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-center">
            <span className="text-xs text-amber-700 dark:text-amber-400">Draft Claims</span>
            <p className="text-base font-bold text-amber-700 dark:text-amber-300">{summary.extracted}</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px] divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800">
        {/* Left Column: Filterable Claims List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-gray-900">
          {/* Filters Bar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/10 flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
            >
              <option value="ALL">All Statuses ({claims.length})</option>
              <option value="EXTRACTED">Draft Extracted ({summary.extracted})</option>
              <option value="CONFIRMED">Confirmed ({summary.confirmed})</option>
              <option value="CORRECTED">Corrected ({summary.corrected})</option>
              <option value="UNKNOWN">Unknown ({summary.unknown})</option>
              <option value="REJECTED">Rejected ({summary.rejected})</option>
              <option value="AI_SUGGESTION">AI Suggestions ({summary.suggestions})</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
            >
              <option value="ALL">All Claim Types</option>
              <option value="PROFESSIONAL_SUMMARY">Summary</option>
              <option value="SKILL_PROFICIENCY">Skills</option>
              <option value="PORTFOLIO_PROJECT">Portfolio Projects</option>
              <option value="PROJECT_CONTRIBUTION">Personal Contributions</option>
              <option value="IDENTITY">Identity</option>
              <option value="CAREER_PREFERENCE">Preferences</option>
            </select>
          </div>

          {/* Claims List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[500px]">
            {filteredClaims.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No claims match the selected filter.
              </div>
            ) : (
              filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.claimId === claim.claimId;
                const valuePreview =
                  typeof claim.claimValue === 'string'
                    ? claim.claimValue
                    : typeof claim.claimValue === 'object' && claim.claimValue !== null
                    ? (claim.claimValue as any).name || (claim.claimValue as any).title || JSON.stringify(claim.claimValue)
                    : String(claim.claimValue ?? 'Missing / Unspecified');

                return (
                  <button
                    key={claim.claimId}
                    onClick={() => {
                      setSelectedClaimId(claim.claimId);
                      setIsEditing(false);
                      setActionError(null);
                    }}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {claim.claimType.replace(/_/g, ' ')}
                      </span>
                      {renderStatusBadge(claim.verificationStatus)}
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                      {valuePreview}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span>{claim.sourceDocument || 'Direct Input'}</span>
                      {claim.sourcePageNumber && <span>• p. {claim.sourcePageNumber}</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Claim Detail, Evidence & Review Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 bg-gray-50/30 dark:bg-gray-900/40">
          {selectedClaim ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Error Banner */}
                {actionError && (
                  <div className="p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Claim Key & Verification Status Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-gray-400">{selectedClaim.claimKey}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                      {selectedClaim.claimType.replace(/_/g, ' ')}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(selectedClaim.verificationStatus)}
                  </div>
                </div>

                {/* Claim Value Card */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Current Claim Value
                    </span>
                    {renderPermittedUseBadge(selectedClaim.permittedUse)}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleCorrectSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                          Corrected Value:
                        </label>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={3}
                          className="w-full text-xs font-medium rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2.5 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                          Correction Reason / Audit Note (Required):
                        </label>
                        <input
                          type="text"
                          value={editReason}
                          onChange={(e) => setEditReason(e.target.value)}
                          placeholder="e.g. Correcting job seniority or project metric"
                          className="w-full text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-2.5 py-1 text-xs rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Save Correction
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900/60 p-3 rounded font-mono whitespace-pre-wrap break-words">
                      {typeof selectedClaim.claimValue === 'string'
                        ? selectedClaim.claimValue
                        : JSON.stringify(selectedClaim.claimValue, null, 2)}
                    </div>
                  )}
                </div>

                {/* Evidence & Provenance Panel */}
                <div className="p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 dark:text-blue-300">
                    <FileText className="w-3.5 h-3.5" />
                    Source Evidence & Extraction Provenance
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="text-gray-400 block">Source Document:</span>
                      <span className="font-medium">{selectedClaim.sourceDocument || 'Direct Manual Entry'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Page Reference:</span>
                      <span className="font-medium">
                        {selectedClaim.sourcePageNumber ? `Page ${selectedClaim.sourcePageNumber}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Extraction Method:</span>
                      <span className="font-mono text-[10px]">{selectedClaim.extractionMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Document Fingerprint:</span>
                      <span className="font-mono text-[10px] truncate block" title={selectedClaim.sourceDocumentFingerprint}>
                        {selectedClaim.sourceDocumentFingerprint
                          ? selectedClaim.sourceDocumentFingerprint.slice(0, 16) + '...'
                          : 'None'}
                      </span>
                    </div>
                  </div>

                  {selectedClaim.sourceTextSnippet && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                        Original Extracted Text Snippet:
                      </span>
                      <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-blue-400 pl-2.5 py-0.5 bg-white/60 dark:bg-gray-800/40 rounded-r">
                        "{selectedClaim.sourceTextSnippet}"
                      </blockquote>
                    </div>
                  )}

                  {/* Portfolio Artifact Safeguard Warning */}
                  {selectedClaim.evidenceReference?.type === 'PORTFOLIO_ARTIFACT' && (
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Attribution Safeguard:</strong> This artifact demonstrates codebase project outcomes, but does NOT establish your personal individual contribution until confirmed.
                      </span>
                    </div>
                  )}
                </div>

                {/* Audit & Modification History */}
                {selectedClaim.history && selectedClaim.history.length > 0 && (
                  <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 space-y-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" />
                      Verification History Trail
                    </span>
                    <div className="space-y-1.5">
                      {selectedClaim.history.map((h, i) => (
                        <div key={i} className="text-[11px] text-gray-500 flex items-center justify-between">
                          <span>
                            {h.previousStatus} → {selectedClaim.verificationStatus} by {h.changedBy}
                            {h.reason && <em className="text-gray-400 ml-1">("{h.reason}")</em>}
                          </span>
                          <span className="font-mono text-[10px]">{h.changedAt.slice(0, 19).replace('T', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Explicit Review Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReject}
                    disabled={selectedClaim.verificationStatus === 'REJECTED'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 disabled:opacity-40 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Claim
                  </button>
                  <button
                    onClick={handleMarkUnknown}
                    disabled={selectedClaim.verificationStatus === 'UNKNOWN'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 disabled:opacity-40 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Mark Unknown
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isEditing ? 'Cancel Correction' : 'Correct Value'}
                  </button>
                  <DynamicButton
                    onClick={handleConfirm}
                    stateKey={selectedClaim.verificationStatus === 'CONFIRMED' ? 'confirmed' : 'unconfirmed'}
                    disabled={selectedClaim.verificationStatus === 'CONFIRMED'}
                    width="content"
                    variant="primary"
                    icon={<CheckCircle className="w-3.5 h-3.5" />}
                    className="px-4 py-1.5 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    {selectedClaim.verificationStatus === 'CONFIRMED' ? 'Claim Confirmed' : 'Confirm Claim'}
                  </DynamicButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              Select a claim on the left to inspect evidence and review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

