import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
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
  SlidersHorizontal,
  Target,
  Cpu,
  TrendingUp,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { projects, Project, getProjectEvidenceLink } from '../../data/projects';
import projectsData from '../../data/projects.json';
import { ProjectDataSchema } from '../../data/projectSchema';
import { ModalFallback } from './ModalFallback';
import {
  parseProjectUrlParams,
  setProjectUrlParam,
  getProjectById,
  isValidProjectId
} from './projectNavigation';

// Genuine lazy loading for modal experiences
const CaseStudyModal = lazy(() => import('./CaseStudyModal').then(m => ({ default: m.CaseStudyModal })));
const ProjectSummaryModal = lazy(() => import('./ProjectSummaryModal').then(m => ({ default: m.ProjectSummaryModal })));

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCapability, setSelectedCapability] = useState<string>('All');
  const [expandedStorylines, setExpandedStorylines] = useState<Set<string>>(new Set());
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

  // Analytical Positioning Capabilities: Allows recruiters to filter by core competency
  const capabilities = useMemo(() => [
    { id: 'All', label: 'All Analytical Modes' },
    { id: 'financial-analytics', label: 'Financial & Equity Analytics', match: (p: Project) => p.category === 'Equity Research' || p.category === 'FinTech Strategy' },
    { id: 'data-governance', label: 'Data Governance & KPI Integrity', match: (p: Project) => p.category === 'Data Governance' },
    { id: 'business-analytics', label: 'Business & Operations Analytics', match: (p: Project) => p.category === 'Business Analytics' || p.category === 'Sports Analytics' },
    { id: 'predictive-ml', label: 'Predictive Modeling & Heuristics', match: (p: Project) => p.tools.some(t => /LightGBM|Regression|Prediction|Predictive/i.test(t)) }
  ], []);

  const toggleStoryline = (id: string) => {
    setExpandedStorylines(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter and search computation grounded strictly in verified project attributes
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Category match
      const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
      if (!categoryMatch) return false;

      // 2. Analytical capability match
      if (selectedCapability !== 'All') {
        const cap = capabilities.find(c => c.id === selectedCapability);
        if (cap && cap.match && !cap.match(project)) return false;
      }

      // 3. Search match across title, tagline, summary, problem statement, tools, and category
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
  }, [selectedCategory, selectedCapability, searchQuery, capabilities]);

  const hasActiveFilters = selectedCategory !== 'All' || selectedCapability !== 'All' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCapability('All');
    setSearchQuery('');
  };

  // Fast lookup map for centralized projects.json metadata
  const centralizedMetadataMap = useMemo(() => {
    const map = new Map<string, ProjectDataSchema>();
    (projectsData as unknown as ProjectDataSchema[]).forEach((p) => {
      map.set(p.id, p);
    });
    return map;
  }, []);

  const getStatusBadge = (status: Project['status'], jsonStatus?: ProjectDataSchema['status']) => {
    if (jsonStatus) {
      switch (jsonStatus) {
        case 'In progress':
          return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        case 'Paused':
          return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30';
        case 'Completed':
        default:
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      }
    }
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
                  className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${isSelected
                      ? 'bg-white text-black font-bold shadow-md scale-105'
                      : 'bg-black/30 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 text-[11px] ${isSelected ? 'text-black/90' : 'text-white/70'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Analytical Capability Filter (Recruiter Competency Lens) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono text-amber-400/80 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 inline text-amber-400" />
              <span>Competency:</span>
            </span>
            {capabilities.map((cap) => {
              const isCapSelected = selectedCapability === cap.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setSelectedCapability(cap.id)}
                  aria-pressed={isCapSelected}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                    isCapSelected
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                      : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cap.label}
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
              const jsonMeta = centralizedMetadataMap.get(project.id);
              const displayTitle = jsonMeta?.title || project.title;
              const displayStatus = jsonMeta?.status || project.status;
              const displaySummary = jsonMeta?.oneLineSummary || project.summary;
              const displayTools = jsonMeta?.tools && jsonMeta.tools.length > 0 ? jsonMeta.tools : project.tools;
              const statusBadgeClass = getStatusBadge(project.status, jsonMeta?.status);
              return (
                <article
                  key={project.id}
                  data-project-id={project.id}
                  className={`flex flex-col justify-between p-5 sm:p-8 rounded-3xl transition-all duration-300 shadow-xl group ${isFeatured
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
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${statusBadgeClass}`}>
                          {displayStatus}
                        </span>
                        {isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-red-500/15 border border-red-500/30 text-red-300 font-semibold uppercase tracking-wider">
                            Featured Case Study
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-white/60">
                        {jsonMeta?.lastUpdated ? `Updated: ${jsonMeta.lastUpdated}` : project.date}
                      </span>
                    </div>

                    {/* Project Title & Tagline */}
                    <h3 className={`${isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'} font-extrabold text-white tracking-tight leading-snug group-hover:text-red-400 transition-colors`}>
                      {displayTitle}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-mono mb-4">
                      {project.tagline}
                    </p>

                    {/* Dataset Scope Highlight */}
                    {project.datasetScope && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80 mb-5">
                        <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-white/50 text-[11px] uppercase tracking-wider font-semibold">Data Scope:</span>
                        <span className="truncate">{jsonMeta?.data || project.datasetScope.scale}</span>
                      </div>
                    )}

                    {/* Card Content Brief: Centrally driven summary & objective */}
                    {project.cardBrief ? (
                      <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 border-l-2 border-l-amber-400">
                          <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block mb-1">
                            Analytical Objective & Summary
                          </span>
                          <p className="text-white/85 leading-relaxed">{displaySummary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-xl bg-blue-500/[0.03] border border-white/5 border-l-2 border-l-blue-400">
                            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-0.5">
                              Methods & Architecture
                            </span>
                            <p className="text-white/80 text-xs line-clamp-3">{jsonMeta?.method || project.cardBrief.methods}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-purple-500/[0.03] border border-white/5 border-l-2 border-l-purple-400">
                            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-0.5">
                              Deliverable & Result
                            </span>
                            <p className="text-white/80 text-xs line-clamp-3">{jsonMeta?.result || project.cardBrief.keyDeliverable}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
                        <p className="text-white/85 line-clamp-3">{displaySummary}</p>
                      </div>
                    )}

                    {/* Recruiter Storyline Toggle & 8-Point Structured Deep-Dive */}
                    <div className="mb-5">
                      <button
                        type="button"
                        onClick={() => toggleStoryline(project.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-mono text-white/80 transition-colors cursor-pointer"
                        aria-expanded={expandedStorylines.has(project.id)}
                        aria-label={`Toggle recruiter analytical storyline for ${displayTitle}`}
                      >
                        <span className="flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-semibold text-white/90">
                            {expandedStorylines.has(project.id) ? 'Hide 8-Point Recruiter Storyline' : 'View 8-Point Recruiter Storyline'}
                          </span>
                        </span>
                        <span className="text-[11px] text-amber-400/90 font-mono">
                          {expandedStorylines.has(project.id) ? '▲ Close Storyline' : '▼ Problem → Impact'}
                        </span>
                      </button>

                      {expandedStorylines.has(project.id) && (
                        <div className="mt-3 p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3.5 text-xs animate-in fade-in duration-200">
                          {/* 1. Business Problem */}
                          <div className="border-l-2 border-red-400 pl-3">
                            <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                              1. Commercial Dilemma & Business Problem
                            </span>
                            <p className="text-white/85 mt-0.5 leading-relaxed font-sans">{project.problemStatement}</p>
                          </div>

                          {/* 2. Analytical Objective */}
                          <div className="border-l-2 border-amber-400 pl-3">
                            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                              2. Project Objective
                            </span>
                            <p className="text-white/85 mt-0.5 leading-relaxed font-sans">{project.cardBrief?.objective || displaySummary}</p>
                          </div>

                          {/* 3 & 4. Data & Methods */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="border-l-2 border-blue-400 pl-3">
                              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                                3. Data Scope & Methodology
                              </span>
                              <p className="text-white/80 mt-0.5 text-[11px] leading-relaxed font-sans">{project.approach}</p>
                            </div>
                            <div className="border-l-2 border-cyan-400 pl-3">
                              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                                4. Key Analytical Tools
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayTools.map((t, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/80">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 5 & 6. Analysis & Key Findings */}
                          <div className="border-l-2 border-emerald-400 pl-3">
                            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                              5 & 6. Empirical Analysis & Reconciled Findings
                            </span>
                            <p className="text-white/85 mt-0.5 leading-relaxed font-sans">{project.keyFinding}</p>
                          </div>

                          {/* 7 & 8. Business Implications & Deliverable */}
                          <div className="border-l-2 border-purple-400 pl-3">
                            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                              7 & 8. Business Implications & Final Deliverables
                            </span>
                            <p className="text-white/85 mt-0.5 leading-relaxed font-sans mb-1">{project.businessImplication}</p>
                            <span className="text-[11px] font-mono text-purple-300/90 block pt-1 border-t border-white/5">
                              Deliverable: {project.cardBrief?.keyDeliverable || jsonMeta?.result}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metrics Grid Sourced from Central Metadata with Fallback */}
                    <div className="grid grid-cols-2 gap-2.5 mb-5 font-mono">
                      {(jsonMeta?.keyMetrics || project.keyMetrics).slice(0, 4).map((metric, mIdx) => (
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

                    {/* Tools Tags Sourced from Central Metadata */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {displayTools.map((tool, tIdx) => (
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
                          <span className="text-xs font-mono text-white/75">Grounded in Private Workbooks</span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openSummaryModal(project)}
                        aria-label={`Brief: 30-second executive summary for ${project.title}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/90 hover:text-white text-xs font-mono font-medium border border-white/15 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                        <span>Brief</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCaseStudyModal(project)}
                        aria-label={`Inspect Case Study: full quantitative review for ${project.title}`}
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
      {activeSummaryProject && (
        <Suspense fallback={<ModalFallback />}>
          <ProjectSummaryModal
            project={activeSummaryProject}
            isOpen={activeSummaryProject !== null}
            onClose={closeModals}
            onInspectFullCaseStudy={(p) => {
              openCaseStudyModal(p);
            }}
          />
        </Suspense>
      )}

      {/* Case Study Deep-Dive Modal */}
      {activeModalProject && (
        <Suspense fallback={<ModalFallback />}>
          <CaseStudyModal
            project={activeModalProject}
            onClose={closeModals}
            onSelectProject={(nextP) => {
              openCaseStudyModal(nextP);
            }}
          />
        </Suspense>
      )}
    </section>
  );
};
