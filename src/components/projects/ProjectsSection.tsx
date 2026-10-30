import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Layers,
  Database,
  ChevronRight,
  ExternalLink,
  Briefcase,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { projects, Project, getProjectEvidenceLink } from '../../data/projects';
import { CaseStudyModal } from './CaseStudyModal';
import { ProjectSummaryModal } from './ProjectSummaryModal';
import {
  parseProjectUrlParams,
  setProjectUrlParam,
  getProjectById,
  isValidProjectId
} from './projectNavigation';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeSummaryProject, setActiveSummaryProject] = useState<Project | null>(null);

  // Synchronize URL parameters with modal state on mount and browser navigation (Back/Forward)
  useEffect(() => {
    const handleUrlSync = () => {
      const { projectId, view } = parseProjectUrlParams();
      if (projectId && isValidProjectId(projectId)) {
        const resolved = getProjectById(projectId);
        if (resolved) {
          if (view === 'brief') {
            setActiveSummaryProject(resolved);
            setActiveModalProject(null);
          } else {
            setActiveModalProject(resolved);
            setActiveSummaryProject(null);
          }
          return;
        }
      }
      // If no valid project parameter is present, ensure modals are closed
      setActiveModalProject(null);
      setActiveSummaryProject(null);
    };

    // Initial check on load
    handleUrlSync();

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const openSummaryModal = (p: Project) => {
    setActiveSummaryProject(p);
    setActiveModalProject(null);
    setProjectUrlParam(p.id, 'brief');
  };

  const openCaseStudyModal = (p: Project) => {
    setActiveModalProject(p);
    setActiveSummaryProject(null);
    setProjectUrlParam(p.id, 'case-study');
  };

  const closeModals = () => {
    setActiveModalProject(null);
    setActiveSummaryProject(null);
    setProjectUrlParam(null);
  };

  const categories = useMemo(() => [
    'All',
    'Data Governance',
    'Equity Research',
    'Business Analytics',
    'Sports Analytics',
    'FinTech Strategy'
  ], []);

  // Filter and search computation grounded strictly in verified project attributes
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Category match
      const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
      if (!categoryMatch) return false;

      // 2. Search match across title, tagline, summary, problem statement, tools, and category
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const titleMatch = project.title.toLowerCase().includes(q);
      const taglineMatch = project.tagline.toLowerCase().includes(q);
      const summaryMatch = project.summary.toLowerCase().includes(q);
      const problemMatch = project.problemStatement.toLowerCase().includes(q);
      const categoryTextMatch = project.category.toLowerCase().includes(q);
      const toolsMatch = project.tools?.some((t) => t.toLowerCase().includes(q)) ?? false;

      return titleMatch || taglineMatch || summaryMatch || problemMatch || categoryTextMatch || toolsMatch;
    });
  }, [selectedCategory, searchQuery]);

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

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
    <section id="projects" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono uppercase tracking-widest mb-3.5">
              <span className="font-bold text-red-400">(03)</span>
              <span>Interactive Project Explorer • Evidence Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Selected Projects & Case Studies
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-3 max-w-2xl leading-relaxed font-sans">
              Filterable case studies grounded in verified transaction datasets, quantitative valuation workbooks, and sports performance event pipelines.
            </p>
          </div>

          {/* Quick Stats Counter */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141722] border border-white/10 text-xs font-mono self-start md:self-auto">
            <span className="text-white/50">Displaying:</span>
            <span className="text-red-400 font-bold">{filteredProjects.length}</span>
            <span className="text-white/50">of {projects.length} Case Studies</span>
          </div>
        </div>

        {/* Interactive Explorer Control Deck */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#141722] border border-white/10 mb-10 space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, analytical method, or tool (e.g., 'DCF', 'Governance', 'SQL')..."
                aria-label="Search case studies by keyword, method, or tool"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus:border-red-400/60 text-white placeholder-white/40 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-red-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search text"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reset Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-medium transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider mr-1 hidden sm:inline">
              Domain:
            </span>
            {categories.map((cat) => {
              const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-md scale-105'
                      : 'bg-black/30 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 text-[11px] ${isSelected ? 'text-black/80' : 'text-white/40'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State when zero projects match filters */}
        {filteredProjects.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#141722] border border-white/10 max-w-xl mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Matching Case Studies</h3>
            <p className="text-xs sm:text-sm text-white/60 font-sans max-w-sm mx-auto leading-relaxed">
              No portfolio projects matched your search <code className="text-red-300">"{searchQuery}"</code> in the selected category.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-white/90 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}

        {/* Project Cards Grid with Problem -> Approach -> Deliverable Hierarchy */}
        {filteredProjects.length > 0 && (
          <div data-testid="project-cards-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-9">
            {filteredProjects.map((project, pIdx) => {
              const isFeatured = pIdx === 0 && selectedCategory === 'All' && !searchQuery;
              return (
                <article
                  key={project.id}
                  data-project-id={project.id}
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

                    {/* Card Content Brief */}
                    {project.cardBrief ? (
                      <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 border-l-2 border-l-amber-400">
                          <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block mb-1">
                            Analytical Objective
                          </span>
                          <p className="text-white/85 leading-relaxed">{project.cardBrief.objective}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-xl bg-blue-500/[0.03] border border-white/5 border-l-2 border-l-blue-400">
                            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-0.5">
                              Methods & Architecture
                            </span>
                            <p className="text-white/80 text-xs">{project.cardBrief.methods}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-purple-500/[0.03] border border-white/5 border-l-2 border-l-purple-400">
                            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-0.5">
                              Deliverable
                            </span>
                            <p className="text-white/80 text-xs">{project.cardBrief.keyDeliverable}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                        <p className="text-white/85 line-clamp-3">{project.summary}</p>
                      </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-5 font-mono">
                      {project.keyMetrics.slice(0, 4).map((metric, mIdx) => (
                        <div key={mIdx} className="p-3 rounded-2xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-white/50 uppercase block truncate">
                            {metric.label}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-white block mt-0.5 truncate">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tools Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70 text-[11px] font-mono border border-white/5"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions Dock */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      {(() => {
                        const evidence = getProjectEvidenceLink(project);
                        return evidence ? (
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span>{evidence.label}</span>
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-white/40">Grounded in Private Workbooks</span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openSummaryModal(project)}
                        aria-label={`View 30-second executive brief for ${project.title}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/90 hover:text-white text-xs font-mono font-medium border border-white/15 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                        <span>Brief</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCaseStudyModal(project)}
                        aria-label={`Inspect full case study for ${project.title}`}
                        className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <span>Inspect Case Study</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Recruiter Quick Executive Brief Modal */}
      <ProjectSummaryModal
        project={activeSummaryProject}
        isOpen={activeSummaryProject !== null}
        onClose={closeModals}
        onInspectFullCaseStudy={(p) => {
          openCaseStudyModal(p);
        }}
      />

      {/* Case Study Deep-Dive Modal */}
      {activeModalProject && (
        <CaseStudyModal
          project={activeModalProject}
          onClose={closeModals}
          onSelectProject={(nextP) => {
            openCaseStudyModal(nextP);
          }}
        />
      )}
    </section>
  );
};
