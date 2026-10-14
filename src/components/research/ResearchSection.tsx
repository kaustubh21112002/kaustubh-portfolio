import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, AlertCircle, CheckCircle, FileCheck } from 'lucide-react';
import { researchPapers } from '../../data/research';

export const ResearchSection: React.FC = () => {
  const [expandedPaper, setExpandedPaper] = useState<string | null>(researchPapers[0].id);

  const togglePaper = (id: string) => {
    setExpandedPaper(expandedPaper === id ? null : id);
  };

  return (
    <section id="research" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0b0d13] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Academic & Analytical Publications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Research Library & Manuscripts
          </h2>
          <p className="text-white/60 text-base mt-2 max-w-2xl">
            In-depth analytical manuscripts, strategic feasibility reports, and empirical econometric investigations.
          </p>
        </div>

        {/* Papers Accordion List */}
        <div className="space-y-4">
          {researchPapers.map((paper) => {
            const isExpanded = expandedPaper === paper.id;
            return (
              <div
                key={paper.id}
                className="rounded-3xl bg-[#141722] border border-white/10 overflow-hidden transition-all duration-300"
              >
                {/* Header Bar */}
                <button
                  onClick={() => togglePaper(paper.id)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {paper.topic}
                      </span>
                      <span className="text-white/40">• {paper.date}</span>
                      <span className="text-white/40">• {paper.fileType}</span>
                      <span className="text-emerald-400/80">• {paper.status}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">{paper.title}</h3>
                  </div>

                  <div className="p-2 rounded-full bg-white/5 text-white/70 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-7 sm:px-7 sm:pb-8 pt-2 border-t border-white/10 space-y-6 text-sm">
                    {/* Abstract */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-white/50 mb-1.5 font-semibold">Abstract</h4>
                      <p className="text-white/80 leading-relaxed">{paper.abstract}</p>
                    </div>

                    {/* Methodology */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-white/50 mb-1.5 font-semibold">Analytical Methodology</h4>
                      <p className="text-white/80 leading-relaxed font-mono text-xs">{paper.methodology}</p>
                    </div>

                    {/* Principal Findings */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-white/50 mb-2 font-semibold">Principal Observed Findings</h4>
                      <div className="space-y-2">
                        {paper.principalFindings.map((finding, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-white/80 text-xs sm:text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Limitations & Uncertainties */}
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-300 font-bold mb-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>Methodological Limitations & Caveats</span>
                      </div>
                      <div className="space-y-1">
                        {paper.limitations.map((lim, idx) => (
                          <p key={idx} className="text-xs text-amber-200/80 leading-relaxed">
                            • {lim}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
