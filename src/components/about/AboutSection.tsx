import React from 'react';
import { User, Award, Terminal, Compass, GraduationCap, ShieldCheck, Briefcase } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <User className="w-3.5 h-3.5 text-red-400" />
            <span>Professional Profile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            About {portfolioConfig.fullName}
          </h2>
          <p className="text-white/60 text-base mt-2 max-w-2xl">
            Connecting quantitative valuation, SQL & Power BI analytics pipelines, and governed data architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Portrait & Fast Facts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/40 group shadow-2xl">
              <img
                src={portfolioConfig.profilePhoto}
                alt={`${portfolioConfig.fullName} Portrait`}
                className="w-full h-auto aspect-[4/3] object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xl font-bold text-white">{portfolioConfig.fullName}</div>
                <div className="text-xs text-white/70 font-mono mt-0.5">{portfolioConfig.role}</div>
                <div className="text-xs text-white/50 font-mono mt-1">{portfolioConfig.location}</div>
              </div>
            </div>

            {/* Academic Credentials Card */}
            <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-mono uppercase text-red-400 font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Qualifications</span>
              </div>
              {portfolioConfig.education.map((edu, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-3 border-t border-white/10' : ''}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                    <span className="text-[11px] font-mono text-white/40">{edu.period}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">{edu.institution}</p>
                  <p className="text-[11px] text-white/50 font-mono mt-0.5">{edu.details}</p>
                </div>
              ))}
            </div>

            {/* Experience Card */}
            <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-mono uppercase text-red-400 font-bold">
                <Briefcase className="w-4 h-4" />
                <span>Current Experience</span>
              </div>
              {portfolioConfig.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                    <span className="text-[11px] font-mono text-white/40">{exp.period}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">{exp.organization}</p>
                  <ul className="mt-2 space-y-1 text-xs text-white/60">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>• {r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                I am an MBA candidate in Business Analytics at Sandip University with a foundational degree in Computer Science. My objective is to bridge quantitative financial analysis, relational database engineering, and managerial decision intelligence.
              </p>
              <p>
                In analytics and financial valuation, I focus on evidence and governance: balance sheets and cash flows must reconcile, exceptions must be preserved rather than silently altered, and observational patterns must be described objectively without unsubstantiated claims.
              </p>
            </div>

            {/* Core Governance Principles */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Governed Analytical Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioConfig.governancePrinciples.map((principle) => (
                  <div key={principle.id} className="p-4 rounded-2xl bg-[#141722] border border-white/10">
                    <div className="text-xs font-bold text-white font-mono">{principle.title}</div>
                    <p className="text-xs text-white/65 mt-1.5 leading-relaxed">{principle.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Tool Competencies */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-400" />
                Verified Tool Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioConfig.skills.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="text-xs font-semibold text-white/90 mb-2 font-mono">{cat.title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-mono text-white/70">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
