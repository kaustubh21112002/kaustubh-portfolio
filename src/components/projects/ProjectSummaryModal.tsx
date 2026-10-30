import React, { useEffect, useRef } from 'react';
import { X, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { Project, getProjectEvidenceLink } from '../../data/projects';
import { DecisionIntelligenceBlock } from './DecisionIntelligenceBlock';
import { ShareProjectButton } from './ShareProjectButton';

export interface ProjectSummaryModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectFullCaseStudy: (project: Project) => void;
}

export const ProjectSummaryModal: React.FC<ProjectSummaryModalProps> = ({
  project,
  isOpen,
  onClose,
  onInspectFullCaseStudy
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Focus trap & Escape dismissal
  useEffect(() => {
    if (!isOpen) return;

    triggerElementRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = modalRef.current;
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button or container
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      triggerElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const evidenceLink = getProjectEvidenceLink(project);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
      aria-describedby="summary-modal-desc"
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#12141c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-[90vh] text-white animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#161a28]/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                  Recruiter Executive Brief • 30-Sec Overview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                  {project.category}
                </span>
              </div>
              <h2 id="summary-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close executive brief modal"
            className="min-h-[40px] min-w-[40px] p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Brief Body with Standardized Decision Intelligence Layer */}
        <div id="summary-modal-desc" className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm">
          <DecisionIntelligenceBlock project={project} layout="modal" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161a28]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {evidenceLink ? (
              <a
                href={evidenceLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify Evidence Source</span>
              </a>
            ) : (
              <span className="text-[11px] font-mono text-white/40">Verified Local Model & Architecture</span>
            )}

            <ShareProjectButton
              projectId={project.id}
              projectTitle={project.title}
              view="brief"
              compact={true}
            />
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono transition-all border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Close Brief
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onInspectFullCaseStudy(project);
              }}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all shadow-md hover:shadow-red-500/25 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <span>View Full Case Study</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

