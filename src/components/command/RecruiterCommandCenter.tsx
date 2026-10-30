import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Database,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileText,
  BarChart3,
  Cpu,
  Layers,
  CheckCircle2,
  Download
} from 'lucide-react';
import { projects, Project } from '../../data/projects';
import { getResumeSkillCategories } from '../../data/skills';
import { portfolioConfig } from '../../config/portfolio';
import { ProjectSummaryModal } from '../projects/ProjectSummaryModal';
import { CaseStudyModal } from '../projects/CaseStudyModal';
import { setProjectUrlParam } from '../projects/projectNavigation';

export const RecruiterCommandCenter: React.FC = () => {
  const [activeSummaryProject, setActiveSummaryProject] = useState<Project | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeCapabilityTab, setActiveCapabilityTab] = useState<number>(0);

  // Retrieve 3 primary flagship projects directly from authoritative repository data
  const phonepe = projects.find((p) => p.id === 'phonepe-valuation');
  const stratos = projects.find((p) => p.id === 'stratos-governance');
  const equitrack = projects.find((p) => p.id === 'equitrack-analytics-os');

  const featuredProjects = [phonepe, stratos, equitrack].filter(Boolean) as Project[];
  const capabilityGroups = getResumeSkillCategories();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openSummaryModal = (proj: Project) => {
    setActiveSummaryProject(proj);
    setActiveModalProject(null);
    setProjectUrlParam(proj.id, 'brief');
  };

  const openCaseStudyModal = (proj: Project) => {
    setActiveModalProject(proj);
    setActiveSummaryProject(null);
    setProjectUrlParam(proj.id, 'case-study');
  };

  const closeModals = () => {
    setActiveSummaryProject(null);
    setActiveModalProject(null);
    setProjectUrlParam(null);
  };

  return (
    <section
      id="command-center"
      aria-label="Recruiter Decision Intelligence Command Center"
      className="relative z-20 w-full py-12 sm:py-16 lg:py-20 bg-[#0d0f17] border-b border-white/10 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Recruiter Header & Call-to-Action Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Recruiter Overview • Candidate Snapshot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Commercial Valuation, Relational Analytics & Data Governance
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed font-sans">
              Evaluates business decisions by connecting financial cash flow modeling, dimensional database architectures, and zero-imputation governance protocols.
            </p>
          </div>

          {/* Recruiter Action Dock */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Primary Action: Explore Projects */}
            <button
              onClick={() => scrollTo('projects')}
              className="min-h-[44px] px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/95 font-bold font-mono text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <span>Explore Projects</span>
            </button>

            {/* Secondary Action: View Official Resume */}
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold font-mono text-xs tracking-wide transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>View Resume (PDF)</span>
            </a>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Top Projects Showcase (Left 7 Cols) + Capability Matrix (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-8">
          
          {/* LEFT: Top 3 Flagship Projects */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white/90 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-400" />
                <span>Featured Project Evidence</span>
              </h3>
              <span className="text-[11px] font-mono text-white/50">3 Distinct Problem Domains</span>
            </div>

            <div className="space-y-3.5">
              {featuredProjects.map((proj) => {
                const isPhonePe = proj.id === 'phonepe-valuation';
                const isStratos = proj.id === 'stratos-governance';

                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#141722] hover:bg-[#181c2b] border border-white/10 hover:border-white/25 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 font-medium">
                          {proj.category}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/60">
                          <span>{proj.date}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{proj.status.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-red-300 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-white/70 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {proj.problemStatement || proj.summary}
                      </p>

                      {/* Governed Anchor Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/5">
                        {proj.keyMetrics.slice(0, 3).map((km, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-black/40 border border-white/5 font-mono">
                            <span className="text-[10px] text-white/50 block uppercase truncate">{km.label}</span>
                            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block truncate">
                              {km.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openSummaryModal(proj)}
                        aria-label={`View 30-second executive brief for ${proj.title}`}
                        className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-mono font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                        <span>30s Brief</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {isPhonePe && (
                          <button
                            type="button"
                            onClick={() => scrollTo('flagship')}
                            aria-label="Jump to interactive PhonePe DCF model"
                            className="min-h-[38px] inline-flex items-center gap-1 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 px-2 py-1 rounded"
                          >
                            <span>Model Tab</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openCaseStudyModal(proj)}
                          aria-label={`Inspect full case study for ${proj.title}`}
                          className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:text-red-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 px-2 py-1 rounded"
                        >
                          <span>Case Study</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Analytical Capability Snapshot */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white/90 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400" />
                <span>Analytical Capabilities</span>
              </h3>
              <span className="text-[11px] font-mono text-white/50">Curated Competencies</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-4">
              {/* Category Selector Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono">
                {capabilityGroups.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCapabilityTab(idx)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeCapabilityTab === idx
                        ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {cat.category.split('&')[0].trim()}
                  </button>
                ))}
              </div>

              {/* Active Capability Group Skills */}
              <div className="space-y-3">
                <div className="pb-2 border-b border-white/10">
                  <h4 className="text-xs font-bold text-white font-mono">
                    {capabilityGroups[activeCapabilityTab]?.category}
                  </h4>
                  <p className="text-[11px] text-white/60 font-sans mt-0.5">
                    Grounded in actual project code, workbooks, or database implementations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {capabilityGroups[activeCapabilityTab]?.skills.map((skillName, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono text-white/90 hover:border-white/15 transition-colors"
                    >
                      <span className="font-medium">{skillName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/50">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Differentiator Box */}
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Governance Standard</span>
                </div>
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  Adheres strictly to <strong className="text-white">PRESERVE → DOCUMENT → FLAG → GOVERN</strong>. Attribution gaps are explicitly labeled as <code className="text-amber-300">Unspecified</code>; ledger anomalies like Net Revenue &gt; Gross Revenue (DQ-10) are maintained as <code className="text-amber-300">REVIEW</code> without synthetic force-balancing.
                </p>
              </div>

              {/* Direct Jump to Full Skills Section */}
              <div className="pt-1 flex items-center justify-between text-xs font-mono">
                <span className="text-white/50">Need detailed methodology?</span>
                <button
                  onClick={() => scrollTo('skills')}
                  className="text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Skills Matrix (05)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Case Study Deep Dive Modal */}
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
