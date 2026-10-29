import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, BookOpen, Wrench, Layers } from 'lucide-react';
import { projects } from '../../data/projects';
import { skillGroups } from '../../data/skills';
import { researchPapers } from '../../data/research';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Project' | 'Skill' | 'Research';
  targetHref: string;
  badge: string;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Search indexing
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default top suggestions when empty
      return [
        {
          id: 'phonepe-flagship',
          title: 'PhonePe Pre-IPO DCF Valuation',
          subtitle: '₹41,631 Cr Implied Equity Value, 5-Yr FCFF, CAPM WACC (14.92%)',
          category: 'Project' as const,
          targetHref: '#flagship',
          badge: 'Flagship DCF'
        },
        {
          id: 'stratos-gov',
          title: 'STRATOS AI Data Governance',
          subtitle: '50,000 orders, 10 DQ controls, DQ-10 financial review',
          category: 'Project' as const,
          targetHref: '#projects',
          badge: 'Governance'
        },
        {
          id: 'powerbi-skill',
          title: 'Power BI & DAX Calculations',
          subtitle: 'MTTA, MTTR, SLA compliance, moving averages',
          category: 'Skill' as const,
          targetHref: '#skills',
          badge: 'Analytics'
        },
        {
          id: 'journey-timeline',
          title: 'Career & Education Journey',
          subtitle: 'MBA Sandip University, SPIIDEO Match Analytics Internship',
          category: 'Research' as const,
          targetHref: '#journey',
          badge: 'Experience'
        }
      ];
    }

    const items: SearchResultItem[] = [];

    // 1. Search projects
    for (const p of projects) {
      const match =
        p.title.toLowerCase().includes(trimmed) ||
        p.summary.toLowerCase().includes(trimmed) ||
        p.tagline.toLowerCase().includes(trimmed) ||
        p.tools.some(t => t.toLowerCase().includes(trimmed)) ||
        p.category.toLowerCase().includes(trimmed);

      if (match) {
        items.push({
          id: `p-${p.id}`,
          title: p.title,
          subtitle: p.tagline,
          category: 'Project',
          targetHref: p.id === 'phonepe-valuation' ? '#flagship' : '#projects',
          badge: p.category
        });
      }
    }

    // 2. Search skills
    for (const group of skillGroups) {
      for (const s of group.skills) {
        const match =
          s.name.toLowerCase().includes(trimmed) ||
          s.context.toLowerCase().includes(trimmed) ||
          s.evidence.toLowerCase().includes(trimmed);

        if (match) {
          items.push({
            id: `s-${s.name}`,
            title: s.name,
            subtitle: `${s.context} • Evidence: ${s.evidence}`,
            category: 'Skill',
            targetHref: '#skills',
            badge: group.title.split(' ')[0]
          });
        }
      }
    }

    // 3. Search research papers
    for (const r of researchPapers) {
      const match =
        r.title.toLowerCase().includes(trimmed) ||
        r.abstract.toLowerCase().includes(trimmed) ||
        r.topic.toLowerCase().includes(trimmed);

      if (match) {
        items.push({
          id: `r-${r.id}`,
          title: r.title,
          subtitle: r.topic,
          category: 'Research',
          targetHref: '#research',
          badge: r.fileType
        });
      }
    }

    return items.slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (targetHref: string) => {
    onClose();
    requestAnimationFrame(() => {
      const el = document.querySelector(targetHref);
      if (el) {
        const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: isReducedMotion ? 'instant' : 'smooth', block: 'start' });
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search portfolio projects and skills"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white dark:bg-[#12141c] rounded-3xl border border-neutral-200 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] my-auto"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30">
          <Search className="w-5 h-5 text-neutral-400 dark:text-white/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, DCF models, skills, tools..."
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/40 focus:outline-none"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-white/60">
            ESC
          </kbd>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full text-neutral-500 dark:text-white/60 hover:bg-neutral-200 dark:hover:bg-white/10 sm:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm font-mono text-neutral-500 dark:text-white/50">
              No matching projects or skills found for “{query}”.
            </div>
          ) : (
            <>
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-white/40 font-semibold">
                {query ? 'Search Results' : 'Suggested Explorations'}
              </div>
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.targetHref)}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-white/70 group-hover:text-red-500 dark:group-hover:text-red-400 shrink-0 mt-0.5">
                      {item.category === 'Project' && <Layers className="w-4 h-4" />}
                      {item.category === 'Skill' && <Wrench className="w-4 h-4" />}
                      {item.category === 'Research' && <BookOpen className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-white/60 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-white/60 truncate mt-0.5 font-mono">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/20 text-[11px] font-mono text-neutral-500 dark:text-white/40 flex items-center justify-between">
          <span>Search verified public portfolio facts</span>
          <span className="hidden sm:inline">Use ↑↓ or click to select</span>
        </div>
      </div>
    </div>
  );
};
