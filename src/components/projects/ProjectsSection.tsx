import React, { useState } from 'react';
import { ArrowUpRight, Filter, Layers, BarChart2, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Activity, Briefcase, Database, ExternalLink } from 'lucide-react';
import { projects, Project, getProjectEvidenceLink } from '../../data/projects';
import { CaseStudyModal } from './CaseStudyModal';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Data Governance', 'Sports Analytics', 'Business Analytics', 'Equity Research', 'FinTech Strategy'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Professional Internship':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Production Architecture':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Completed Independent Research':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Academic Dissertation':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <section id="projects" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Refined Visual Hierarchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono uppercase tracking-widest mb-3.5">
              <span className="font-bold text-red-400">(03)</span>
              <span>Selected Case Studies • Analytical Evidence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Selected Projects & Case Studies
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-3 max-w-2xl leading-relaxed font-sans">
              Problem-led case studies grounded in verified transaction datasets, quantitative valuation workbooks, and sports performance event pipelines.
            </p>
          </div>

          {/* Filter Pills with Counts */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 text-xs ${selectedCategory === cat ? 'text-black/80' : 'text-white/75'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards with Problem -> Approach -> Finding -> Implication Storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-9">
          {filteredProjects.map((project, pIdx) => {
            const isFeatured = pIdx === 0 && selectedCategory === 'All';
            return (
              <div
                key={project.id}
                className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl transition-all duration-300 shadow-xl group ${
                  isFeatured
                    ? 'bg-[#161a28] border border-white/20 hover:border-red-500/40 lg:col-span-2'
                    : 'bg-[#141722] border border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-red-400 font-medium">
                        {project.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                      {isFeatured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-red-500/15 border border-red-500/30 text-red-300 font-semibold uppercase tracking-wider">
                          Featured Case Study
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-white/60">{project.date}</span>
                  </div>

                  {/* Project Title & Tagline */}
                  <h3 className={`${isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'} font-extrabold text-white tracking-tight leading-snug group-hover:text-red-400 transition-colors`}>
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-mono mb-4">
                    {project.tagline}
                  </p>

                  {/* Dataset Scope Highlight */}
                  {project.datasetScope && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80 mb-5">
                      <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-white/50 text-[11px] uppercase tracking-wider font-semibold">Data Scope:</span>
                      <span className="truncate">{project.datasetScope.scale}</span>
                    </div>
                  )}

                  {/* Rapid Recruiter Scanning: Concise Problem, Methodology, Personal Contribution & Deliverable */}
                  {project.cardBrief ? (
                    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                      {/* Objective & Question */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 border-l-2 border-l-amber-400">
                        <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block mb-1">
                          Analytical Objective
                        </span>
                        <p className="text-white/85 leading-relaxed">{project.cardBrief.objective}</p>
                      </div>

                      {/* Methods & Personal Contribution */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-blue-500/[0.03] border border-white/5 border-l-2 border-l-blue-400">
                          <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-0.5">
                            Methods & Architecture
                          </span>
                          <p className="text-white/75 text-xs leading-relaxed">{project.cardBrief.methods}</p>
                        </div>
                        {project.personalContribution && (
                          <div className="p-3 rounded-xl bg-purple-500/[0.03] border border-white/5 border-l-2 border-l-purple-400">
                            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-0.5">
                              Personal Contribution
                            </span>
                            <p className="text-white/75 text-xs leading-relaxed">{project.personalContribution}</p>
                          </div>
                        )}
                      </div>

                      {/* Key Deliverable & Verified Finding */}
                      <div className="p-3.5 rounded-2xl bg-emerald-500/[0.04] border border-white/5 border-l-2 border-l-emerald-400">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                            Key Deliverable & Finding
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300/80 px-2 py-0.5 rounded bg-emerald-500/10">
                            {project.category === 'Equity Research' ? 'MODEL ESTIMATE' : 'DEMONSTRATED'}
                          </span>
                        </div>
                        <p className="text-white/90 leading-relaxed">{project.cardBrief.keyDeliverable}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 border-l-2 border-l-amber-400">
                        <span className="text-xs font-mono uppercase text-amber-400 font-bold block mb-1">
                          01. Commercial Problem / Question
                        </span>
                        <p className="text-white/80 line-clamp-3 leading-relaxed">{project.problemStatement}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-500/[0.04] border border-white/5 border-l-2 border-l-emerald-400">
                        <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
                          02. Key Verified Finding
                        </span>
                        <p className="text-white/85 line-clamp-3 leading-relaxed">{project.keyFinding}</p>
                      </div>
                    </div>
                  )}

                  {/* Key Metrics Strip with Demonstrated vs Assumed distinction */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {project.keyMetrics.slice(0, 2).map((m, idx) => {
                      const badgeLabel =
                        m.classification ||
                        (project.category === 'Equity Research'
                          ? 'MODEL ESTIMATE'
                          : project.id === 'equitrack-analytics-os'
                          ? 'PROTOTYPE DEMO'
                          : project.status === 'Academic Dissertation'
                          ? 'STUDY ESTIMATE'
                          : 'DEMONSTRATED');
                      return (
                        <div key={idx} className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                          <div className="flex items-center justify-between text-[11px] uppercase font-mono text-white/60 tracking-wider">
                            <span className="truncate pr-1">{m.label}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 shrink-0 font-semibold">
                              {badgeLabel}
                            </span>
                          </div>
                          <div className="text-lg sm:text-2xl font-extrabold text-white font-mono mt-1">{m.value}</div>
                          {m.subtext && <div className="text-[11px] text-white/50 mt-0.5 truncate font-mono">{m.subtext}</div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Verified Tools & Methodological Scope */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.slice(0, 4).map((tool, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/75 text-xs font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                    {project.limitations && project.limitations.length > 0 && (
                      <span className="text-[11px] font-mono text-amber-400/80 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>{project.limitations.length} Governance Constraints</span>
                      </span>
                    )}
                  </div>
                </div>

              {/* Action Button & Verified Direct Link */}
              <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Flagship Valuation Direct Deep-Dive Link */}
                  {project.id === 'phonepe-valuation' && (
                    <a
                      href="#flagship"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 hover:text-red-200 text-xs font-mono font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <span>Interactive DCF Model</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                    </a>
                  )}
                  {(() => {
                    const evidenceLink = getProjectEvidenceLink(project);
                    if (evidenceLink) {
                      return (
                        <a
                          href={evidenceLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View project evidence for ${project.title} (opens in new tab)`}
                          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-mono font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                          <span>{evidenceLink.label || "View Project Evidence"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      );
                    }
                    if (project.verifiedLinks?.[0]) {
                      const link = project.verifiedLinks[0];
                      return link.isInternal ? (
                        <a
                          href={link.url}
                          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                        </a>
                      ) : (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      );
                    }
                    return (
                      <span className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-full bg-white/[0.03] border border-white/5 text-[11px] text-white/45 font-mono">
                        Workbook Pending
                      </span>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setActiveModalProject(project)}
                  aria-label={`Inspect case study for ${project.title}`}
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <span>Inspect Case Study</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Case Study Deep-Dive Modal */}
      {activeModalProject && (
        <CaseStudyModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
};
