import React, { useState } from 'react';
import { ArrowUpRight, Filter, Layers, BarChart2, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Activity } from 'lucide-react';
import { projects, Project } from '../../data/projects';
import { CaseStudyModal } from './CaseStudyModal';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Data Governance', 'Equity Research', 'Sports Analytics', 'Business Analytics'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

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
            <p className="text-white/70 text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
              Problem-led case studies grounded in verified transaction datasets, quantitative valuation workbooks, and sports performance event pipelines.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards with Problem -> Approach -> Finding -> Implication Storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between p-8 sm:p-9 rounded-3xl bg-[#141722] border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-red-400 font-medium">
                      {project.category}
                    </span>
                    <span className="text-xs text-white/50 font-mono">• {project.status}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40">{project.date}</span>
                </div>

                {/* Project Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {project.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-mono mb-6">
                  {project.tagline}
                </p>

                {/* Storytelling Grid: Problem -> Approach -> Key Finding -> Implication */}
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed mb-6">
                  {/* 1. Problem */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono uppercase text-red-400 font-bold block mb-1">
                      Business Problem / Question
                    </span>
                    <p className="text-white/80 line-clamp-3">{project.problemStatement}</p>
                  </div>

                  {/* 2. Key Verified Finding */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                      Key Verified Finding
                    </span>
                    <p className="text-white/85 line-clamp-3">{project.keyFinding}</p>
                  </div>

                  {/* 3. Business Implication */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                      Business Implication
                    </span>
                    <p className="text-white/80 line-clamp-2">{project.businessImplication}</p>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {project.keyMetrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5">
                      <div className="text-[10px] uppercase font-mono text-white/50 tracking-wider">{m.label}</div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{m.value}</div>
                      {m.subtext && <div className="text-[11px] text-white/40 mt-0.5 truncate font-mono">{m.subtext}</div>}
                    </div>
                  ))}
                </div>

                {/* Verified Tools Pill Box */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tools.slice(0, 4).map((tool, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40 font-mono">Full Methodology Available</span>
                <button
                  onClick={() => {
                    if (project.id === 'phonepe-valuation') {
                      const el = document.getElementById('flagship');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setActiveModalProject(project);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-wide transition-all hover:bg-white/90 active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
