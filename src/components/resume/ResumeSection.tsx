import React, { useState } from 'react';
import { Download, FileText, CheckCircle, ExternalLink, Eye, Award, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export const ResumeSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <p className="text-white/60 text-base mt-2 max-w-xl mx-auto">
            Available for Business Analyst, Data Analyst, and Valuation roles.
          </p>

          {/* Download & View CTA Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            {portfolioConfig.resumeAvailable ? (
              <>
                <a
                  href={portfolioConfig.resumePath}
                  download="Kaustubh_Nandurkar_Resume.pdf"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.35)] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified Resume (PDF)</span>
                </a>

                <a
                  href={portfolioConfig.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4 text-white/70" />
                  <span>View PDF in Browser</span>
                </a>
              </>
            ) : (
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide"
              >
                <Mail className="w-4 h-4" />
                <span>Request Resume via Email</span>
              </button>
            )}

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm transition-all active:scale-95"
            >
              <CheckCircle className={`w-4 h-4 ${copied ? 'text-emerald-400' : 'text-white/70'}`} />
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
              <p className="text-white/50 text-xs mt-1">{portfolioConfig.location} • {portfolioConfig.socials.phone}</p>
            </div>
            <div className="text-xs font-mono text-white/60 space-y-1">
              <div>Email: {portfolioConfig.socials.email}</div>
              <div>LinkedIn: <a href={portfolioConfig.socials.linkedIn} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">/in/kaustubhnandurkar</a></div>
              <div>GitHub: <a href={portfolioConfig.socials.github} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">/kaustubh21112002</a></div>
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
                      <span className="text-white/60 font-mono text-xs block sm:inline sm:ml-2">| {exp.organization}</span>
                    </div>
                    <span className="text-xs font-mono text-white/50">{exp.period}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-white/75">
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
                    <span className="text-xs font-mono text-white/50">{edu.period}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1">{edu.institution}</p>
                  <p className="text-xs text-white/50 font-mono mt-1">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted Analytical Projects */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <Award className="w-4 h-4" />
              <span>Featured Analytical Projects</span>
            </h4>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">STRATOS AI | Controlled Business Analytics & KPI Governance</span>
                  <span className="font-mono text-white/50">Production Architecture</span>
                </div>
                <p className="text-white/75 leading-relaxed">
                  Built a controlled analytical dataset of 50,000 orders and designed a 30-KPI framework across financial, customer, campaign, sales, and delivery analytics.
                  Implemented 11 validation controls and reconciled 14,465 financial exception occurrences across 12,787 affected orders.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">PhonePe Pre-IPO Equity Research & DCF Valuation</span>
                  <span className="font-mono text-white/50">Independent Valuation Research</span>
                </div>
                <p className="text-white/75 leading-relaxed">
                  Constructed 5-year explicit revenue segment forecasts (FY26E–FY30E) and DCF model (WACC 14.92%, Exit Multiple 13.15x).
                  Derived Core Enterprise Value ₹33,432 Cr and Implied Equity Value ₹41,631 Cr with balance sheet liquidity adjustments.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Toolbox */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-4">
              <FileText className="w-4 h-4" />
              <span>Core Toolset & Competencies</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 text-white/80">Power BI & DAX</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">SQL (PostgreSQL, MySQL)</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">Python (Pandas, Scikit)</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">DCF & Financial Modeling</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">Supabase & REST APIs</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">Data Pipeline Management</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">Data Quality Governance</div>
              <div className="p-3 rounded-xl bg-white/5 text-white/80">React 18 & TypeScript</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
