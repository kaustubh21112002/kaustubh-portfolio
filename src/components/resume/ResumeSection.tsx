import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Eye, Award, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';
import { projects } from '../../data/projects';
import { getCoreResumeSkills } from '../../data/skills';

export const ResumeSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Content-driven: only completed/verified projects flagged for resume
  const resumeProjects = projects
    .filter((p) => p.includeInResume && p.status !== 'In Progress' && p.resumeHighlight)
    .sort((a, b) => (a.resumeHighlight?.order ?? 99) - (b.resumeHighlight?.order ?? 99));

  // Single-source core technical competencies
  const coreSkills = getCoreResumeSkills();

  return (
    <section id="resume" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0b0d13] text-white border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="font-bold text-red-400">(07)</span>
            <span>Verified Curriculum Vitae • Official PDF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Resume & Professional Experience
          </h2>
          <p className="text-white/75 text-base mt-2 max-w-xl mx-auto">
            Available for Business Analyst, Data Analyst, and Valuation roles.
          </p>

          {/* Download & View CTA Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            {portfolioConfig.resumeAvailable ? (
              <>
                <a
                  href={portfolioConfig.resumePath}
                  download="Kaustubh_Nandurkar_Resume.pdf"
                  aria-label="Download verified resume PDF"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href={portfolioConfig.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View verified resume PDF in browser window"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Eye className="w-4 h-4 text-white/75" />
                  <span>View PDF in Browser</span>
                </a>
              </>
            ) : (
              <button
                onClick={handleCopyEmail}
                aria-label="Request resume via direct email"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Mail className="w-4 h-4" />
                <span>Request Resume via Email</span>
              </button>
            )}

            <button
              onClick={handleCopyEmail}
              aria-label="Copy direct email address to clipboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <CheckCircle className={`w-4 h-4 ${copied ? 'text-emerald-400' : 'text-white/75'}`} />
              <span>{copied ? 'Email Copied!' : 'Copy Direct Email'}</span>
            </button>
          </div>
        </div>

        {/* On-Page Clean Editorial Resume Preview */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-10">
          {/* Header Info */}
          <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h3 className="text-3xl font-extrabold text-white">{portfolioConfig.fullName}</h3>
              <p className="text-red-400 font-mono text-sm mt-1">{portfolioConfig.role}</p>
              <p className="text-white/75 text-xs mt-1">{portfolioConfig.location} • {portfolioConfig.socials.phone}</p>
            </div>
            <div className="text-xs font-mono text-white/75 space-y-1">
              <div>Email: {portfolioConfig.socials.email}</div>
              <div>LinkedIn: <a href={portfolioConfig.socials.linkedIn} target="_blank" rel="noopener noreferrer" className="text-white hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400">/in/kaustubhnandurkar</a></div>
              <div>GitHub: <a href={portfolioConfig.socials.github} target="_blank" rel="noopener noreferrer" className="text-white hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400">/kaustubh21112002</a></div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <Briefcase className="w-4 h-4" />
              <span>Professional Experience</span>
            </h4>
            <div className="space-y-4">
              {portfolioConfig.experience.map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-base">{exp.role}</span>
                      <span className="text-white/75 font-mono text-xs block sm:inline sm:ml-2">| {exp.organization}</span>
                    </div>
                    <span className="text-xs font-mono text-white/75">{exp.period}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-white/80">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>• {r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Qualifications</span>
            </h4>
            <div className="space-y-4">
              {portfolioConfig.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-white text-base">{edu.degree}</span>
                    <span className="text-xs font-mono text-white/75">{edu.period}</span>
                  </div>
                  <p className="text-xs text-white/80 mt-1">{edu.institution}</p>
                  <p className="text-xs text-white/75 font-mono mt-1">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted Analytical Projects (Single Source of Truth from projects.ts) */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <Award className="w-4 h-4" />
              <span>Featured Analytical Projects</span>
            </h4>
            <div className="space-y-4 text-xs">
              {resumeProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-sm font-bold text-white">{p.title}</span>
                    <span className="font-mono text-white/75 text-xs">{p.resumeHighlight?.role || p.status}</span>
                  </div>
                  <div className="text-white/80 leading-relaxed space-y-1">
                    {p.resumeHighlight?.bulletPoints.map((bp, bIdx) => (
                      <p key={bIdx}>{bp}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Toolbox (Single Source of Truth from skills.ts) */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <FileText className="w-4 h-4" />
              <span>Core Toolset & Competencies</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {coreSkills.map((skill, sIdx) => (
                <div key={sIdx} className="p-3 rounded-lg bg-white/5 text-white/90">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
