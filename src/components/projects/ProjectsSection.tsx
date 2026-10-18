import React, { useState } from 'react';
import { ArrowUpRight, Filter, Layers, BarChart2, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Activity, Briefcase } from 'lucide-react';
import { projects, Project } from '../../data/projects';
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-[#141722] border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-red-400 font-medium">
                      {project.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/75">{project.date}</span>
                </div>

                {/* Project Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/75 text-xs sm:text-sm mt-1.5 font-mono mb-6">
                  {project.tagline}
                </p>

                {/* 4 Storytelling Pillars: Problem -> Approach -> Key Finding -> Implication */}
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  {/* 1. Problem Statement */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 border-l-2 border-l-amber-400">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold block mb-1">
                      01. Commercial Problem / Question
                    </span>
                    <p className="text-white/80 line-clamp-3 leading-relaxed">{project.problemStatement}</p>
                  </div>

                  {/* 2. Analytical Approach */}
                  <div className="p-3.5 rounded-2xl bg-blue-500/[0.03] border border-white/5 border-l-2 border-l-blue-400">
                    <span className="text-xs font-mono uppercase text-blue-400 font-bold block mb-1">
                      02. Analytical Approach & Architecture
                    </span>
                    <p className="text-white/80 line-clamp-3 leading-relaxed">{project.approach}</p>
                  </div>

                  {/* 3. Key Verified Finding */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/[0.04] border border-white/5 border-l-2 border-l-emerald-400">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
                      03. Key Verified Finding
                    </span>
                    <p className="text-white/85 line-clamp-3 leading-relaxed">{project.keyFinding}</p>
                  </div>

                  {/* 4. Business Implication */}
                  <div className="p-3.5 rounded-2xl bg-red-500/[0.03] border border-white/5 border-l-2 border-l-red-400">
                    <span className="text-xs font-mono uppercase text-red-400 font-bold block mb-1">
                      04. Business Implication
                    </span>
                    <p className="text-white/80 line-clamp-2 leading-relaxed">{project.businessImplication}</p>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {project.keyMetrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5">
                      <div className="text-xs uppercase font-mono text-white/75 tracking-wider">{m.label}</div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{m.value}</div>
                      {m.subtext && <div className="text-xs text-white/75 mt-0.5 truncate font-mono">{m.subtext}</div>}
                    </div>
                  ))}
                </div>

                {/* Verified Tools Pill Box */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tools.slice(0, 4).map((tool, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/75 font-mono">Complete Methodology</span>
                <button
                  onClick={() => setActiveModalProject(project)}
                  aria-label={`Inspect case study for ${project.title}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <span>Inspect Case Study</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
