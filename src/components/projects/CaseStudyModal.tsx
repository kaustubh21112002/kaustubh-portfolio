import React, { useEffect, useState, useRef } from 'react';
import { X, ArrowRight, ShieldAlert, CheckCircle2, FileText, ChevronDown, ChevronUp, Layers, HelpCircle, Activity, Info, AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { Project, getProjectEvidenceLink } from '../../data/projects';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  // Allow multiple sections to be expanded simultaneously
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const targetFocusIdRef = useRef<string | null>(null);
  const evidenceLink = project ? getProjectEvidenceLink(project) : null;

  useEffect(() => {
    // Reset to expand first section when project changes
    setExpandedSections(new Set([0]));
    targetFocusIdRef.current = null;
  }, [project?.id]);

  useEffect(() => {
    if (project) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Move focus into the modal for screen-reader and keyboard accessibility
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          const dialog = modalCardRef.current;
          if (!dialog) return;

          const focusableElements = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null || el === closeButtonRef.current);

          if (focusableElements.length === 0) {
            e.preventDefault();
            return;
          }

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement || !dialog.contains(document.activeElement)) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement || !dialog.contains(document.activeElement)) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);

        if (targetFocusIdRef.current) {
          const targetId = targetFocusIdRef.current;
          // Defer focus shift slightly to ensure modal has unmounted and scroll has started
          requestAnimationFrame(() => {
            const sectionEl = document.getElementById(targetId);
            if (sectionEl) {
              const heading = sectionEl.querySelector<HTMLElement>('h2, h3') || sectionEl;
              if (!heading.hasAttribute('tabindex')) {
                heading.setAttribute('tabindex', '-1');
              }
              heading.focus({ preventScroll: true });
            }
          });
        } else {
          // Restore focus to original triggering button
          triggerElementRef.current?.focus?.();
        }
      };
    }
  }, [project, onClose]);

  if (!project) return null;

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInternalJump = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const targetId = url.replace('#', '');
    targetFocusIdRef.current = targetId;
    onClose();

    requestAnimationFrame(() => {
      const sectionEl = document.getElementById(targetId);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const toggleAllSections = () => {
    if (expandedSections.size === project.caseStudy.sections.length) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(project.caseStudy.sections.map((_, i) => i)));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        ref={modalCardRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#10121a] border border-white/20 rounded-3xl shadow-2xl overflow-y-auto z-10 text-white p-6 sm:p-10 my-auto"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label="Close case study"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>{project.category}</span>
            <span>•</span>
            <span>{project.status}</span>
          </div>

          <h2 id="case-study-title" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h2>
          <p className="text-white/75 text-sm sm:text-base mt-2 font-mono">{project.tagline}</p>
        </div>

        {/* Quick Recruiter Section Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-white/10 text-xs font-mono">
          <span className="text-white/60 text-[11px] uppercase tracking-wider shrink-0 font-semibold mr-1">Jump to:</span>
          {evidenceLink ? (
            <a
              href={evidenceLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View project evidence for ${project.title} (opens in new tab)`}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition-colors shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
            >
              <ExternalLink className="w-3 h-3 text-emerald-400" />
              <span>View Evidence</span>
            </a>
          ) : (
            <span
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 transition-colors shrink-0 flex items-center gap-1.5 cursor-default"
              title="Governed spreadsheet or external evidence link pending upload"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <span>Evidence: Pending</span>
            </span>
          )}
          <button
            onClick={() => scrollToTarget('modal-overview')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            Overview
          </button>
          {project.datasetScope && (
            <button
              onClick={() => scrollToTarget('modal-dataset-scope')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:text-blue-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
            >
              <Database className="w-3 h-3 text-blue-400" />
              <span>Dataset Scope</span>
            </button>
          )}
          <button
            onClick={() => scrollToTarget('modal-metrics')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            Metrics
          </button>
          <button
            onClick={() => scrollToTarget('modal-sections')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          >
            Case Study ({project.caseStudy.sections.length} Sections)
          </button>
          {project.limitations && project.limitations.length > 0 && (
            <button
              onClick={() => scrollToTarget('modal-limitations')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            >
              Limitations
            </button>
          )}
        </div>

        {/* Top Storytelling Framework: Problem -> Approach -> Finding -> Implication */}
        <div id="modal-overview" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#141722] border border-white/10">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold block mb-1.5">
              1. Commercial Problem / Question
            </span>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{project.problemStatement}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141722] border border-white/10">
            <span className="text-xs font-mono uppercase text-blue-400 font-bold block mb-1.5">
              2. Analytical Approach & Architecture
            </span>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{project.approach}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141722] border border-white/10">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1.5">
              3. Key Verified Finding
            </span>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{project.keyFinding}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141722] border border-white/10">
            <span className="text-xs font-mono uppercase text-red-400 font-bold block mb-1.5">
              4. Business Implication
            </span>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{project.businessImplication}</p>
          </div>
        </div>

        {/* Dataset Scope & Governance Architecture Panel */}
        {project.datasetScope && (
          <div id="modal-dataset-scope" className="mb-8 p-6 rounded-2xl bg-[#0e121e] border border-blue-500/25 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-mono uppercase tracking-wider text-blue-300 font-bold">
                  Dataset Scope & Governance Architecture
                </span>
              </div>
              {project.verifiedLinks && project.verifiedLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {project.verifiedLinks.map((link, lIdx) =>
                    link.isInternal ? (
                      <a
                        key={lIdx}
                        href={link.url}
                        onClick={(e) => handleInternalJump(e, link.url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-mono font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                      >
                        <span>{link.label}</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-mono font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white/60 uppercase text-[10px] tracking-wider block font-semibold">Population & Scale</span>
                <p className="text-white font-sans text-xs leading-relaxed">{project.datasetScope.scale}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white/60 uppercase text-[10px] tracking-wider block font-semibold">Data Structure & Granularity</span>
                <p className="text-white font-sans text-xs leading-relaxed">{project.datasetScope.structure}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-white/60 uppercase text-[10px] tracking-wider block font-semibold">Quality & Governance Note</span>
                <p className="text-white font-sans text-xs leading-relaxed">{project.datasetScope.qualityNote}</p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div id="modal-metrics" className="mb-8">
          <div className="text-xs font-mono text-white/75 uppercase tracking-wider mb-3">Verified Project Metrics</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.keyMetrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-white/75 font-mono uppercase tracking-wider">{m.label}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{m.value}</div>
                {m.subtext && <div className="text-xs text-white/75 mt-1 font-mono">{m.subtext}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Methods, Assumptions & Limitations Panels */}
        <div id="modal-sections" className="space-y-4 mb-8">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="text-xs font-mono text-white/75 uppercase tracking-wider">
              Case Study Architecture ({project.caseStudy.sections.length} Governed Sections)
            </div>
            <button
              onClick={toggleAllSections}
              className="text-xs font-mono text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-md px-1"
            >
              {expandedSections.size === project.caseStudy.sections.length ? 'Collapse All Sections' : 'Expand All Sections'}
            </button>
          </div>

          {/* Grouped Methods and Assumptions Panel */}
          {project.methodsAndAssumptions && project.methodsAndAssumptions.length > 0 && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-black/20">
                <span className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Methods & Quantitative Assumptions</span>
                </span>
              </div>
              <div className="p-5 space-y-2">
                {project.methodsAndAssumptions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                    <span className="text-blue-400 font-mono text-xs mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Case Study Sections */}
          {project.caseStudy.sections.map((section, sIdx) => {
            const isExpanded = expandedSections.has(sIdx);
            return (
              <div key={sIdx} className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-colors">
                <button
                  onClick={() => toggleSection(sIdx)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-red-400 font-bold">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white font-mono">{section.title}</span>
                  </div>
                  <div className="p-1.5 rounded-full bg-white/5 text-white/70">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-1 border-t border-white/5 space-y-4">
                    <div className="space-y-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                      {section.content.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Table if present */}
                    {section.table && (
                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-white/75 px-1">
                          <span>Data Table ({section.title})</span>
                          <span className="sm:hidden text-white/70 text-[10px]">(Pan table horizontally →)</span>
                        </div>
                        <div
                          tabIndex={0}
                          role="region"
                          aria-label={`${section.title} data table`}
                          className="overflow-x-auto rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-red-400"
                        >
                          <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                              <tr className="bg-black/50 border-b border-white/10 text-white/75 text-xs uppercase">
                                {section.table.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="py-2.5 px-3 whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-black/20">
                              {section.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/[0.02]">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={`py-2 px-3 whitespace-nowrap ${cIdx === 0 ? 'font-sans font-medium text-white' : 'text-white/80'}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Callout if present */}
                    {section.callout && (
                      <div
                        className={`p-4 rounded-xl border flex items-start gap-3 ${
                          section.callout.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : section.callout.type === 'insight'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                        }`}
                      >
                        {section.callout.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : section.callout.type === 'insight' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        )}
                        <p className="text-xs leading-relaxed font-sans">{section.callout.text}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Limitations & Uncertainties Panel */}
          {project.limitations && project.limitations.length > 0 && (
            <div id="modal-limitations" className="rounded-2xl bg-amber-950/20 border border-amber-500/25 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Methodological Limitations & Governance Constraints</span>
              </div>
              <div className="space-y-1.5">
                {project.limitations.map((lim, idx) => (
                  <p key={idx} className="text-xs text-amber-200/90 leading-relaxed font-sans">
                    • {lim}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tools and Stack */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-white/75 uppercase mb-2">Verified Technology Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {evidenceLink ? (
              <a
                href={evidenceLink.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View project evidence for ${project.title} (opens in new tab)`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>{evidenceLink.label || "View Project Evidence"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : project.verifiedLinks && project.verifiedLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {project.verifiedLinks.map((link, idx) =>
                  link.isInternal ? (
                    <a
                      key={idx}
                      href={link.url}
                      onClick={(e) => handleInternalJump(e, link.url)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-red-400 hover:text-red-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    >
                      <span>{link.label}</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )
                )}
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Close Overview
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        {project.caseStudy.disclaimer && (
          <div className="mt-6 p-4 rounded-2xl bg-black/50 border border-white/5 text-xs text-white/75 font-mono leading-relaxed">
            <strong>Disclosure:</strong> {project.caseStudy.disclaimer}
          </div>
        )}
      </div>
    </div>
  );
};
