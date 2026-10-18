import React from 'react';
import {
  User,
  ShieldCheck,
  Search,
  Database,
  BarChart2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

const methodologySteps = [
  {
    step: '01',
    title: 'Scope the Commercial Question',
    description: 'Isolate the underlying business driver and define precise decision criteria before manipulating data, avoiding confirmation bias or premature model assumptions.'
  },
  {
    step: '02',
    title: 'Audit & Profile Raw Distributions',
    description: 'Inspect transaction-level data for missing fields, skewed distributions, and unmapped attributes. Preserve attribution gaps as "Unspecified" rather than dropping records.'
  },
  {
    step: '03',
    title: 'Validate & Enforce Governance',
    description: 'Reconcile controlled totals across financial and relational layers (PRESERVE → DOCUMENT → FLAG → GOVERN). Never silently alter source records or fabricate benchmarks.'
  },
  {
    step: '04',
    title: 'Construct Transparent Models',
    description: 'Build explicit models—whether 5-year DCF cash flows with CAPM WACC, MySQL star schemas, or regression duration models—with documented formulas and caveats.'
  },
  {
    step: '05',
    title: 'Synthesize & Advise',
    description: 'Translate analytical findings into executive-ready insights structured around: What Matters → What Changed → Why → What To Do Next.'
  }
];

const verifiedProofPoints = [
  {
    metric: '₹41,631 Cr',
    label: 'Implied Pre-IPO Equity Valuation',
    subtext: 'Explicit 5-year forecast (FY26E–FY30E), CAPM WACC (14.92%), audited balance-sheet liquidity bridge'
  },
  {
    metric: '50,000',
    label: 'Controlled Orders Governed',
    subtext: '14,465 financial exception occurrences reconciled with 30/30 KPI traceability in STRATOS AI'
  },
  {
    metric: '10,000+',
    label: 'Support Incidents Modeled',
    subtext: 'MySQL star-schema database, Power BI DAX calculated metrics, and Python regression duration modeling'
  }
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Label */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="text-red-400 font-bold">(01)</span>
            <span>About & Analytical Manifesto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Evidence-Driven Analytics <br className="hidden sm:inline" />
            Before Decorative Complexity.
          </h2>
          <p className="text-white/75 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            I am an MBA candidate in Business Analytics with a computer science foundation, focused on quantitative valuation, data governance, and decision intelligence.
          </p>
        </div>

        {/* 3 Verified Quantitative Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {verifiedProofPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#141722] border border-white/10 hover:border-red-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between h-full group"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight group-hover:text-red-400 transition-colors">
                  {item.metric}
                </div>
                <div className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider mt-2">
                  {item.label}
                </div>
              </div>
              <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/5 leading-relaxed font-sans">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Portrait & Credential Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/40 group shadow-2xl">
              <img
                src={portfolioConfig.profilePhoto}
                alt={`${portfolioConfig.fullName} Portrait`}
                loading="lazy"
                decoding="async"
                width={640}
                height={480}
                className="w-full h-auto aspect-[4/3] object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xl font-bold text-white tracking-tight">{portfolioConfig.fullName}</div>
                <div className="text-xs text-white/85 font-mono mt-0.5">MBA Business Analytics • Sandip University</div>
                <div className="text-xs text-white/75 font-mono mt-0.5">{portfolioConfig.location}</div>
              </div>
            </div>

            {/* Quick Snapshot Card */}
            <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
              <div className="text-xs font-mono uppercase text-white/75 tracking-wider font-bold">
                Professional Profile
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">MBA - Business Analytics</span>
                    <p className="text-white/75">Sandip University, Nashik (2025 – 2027)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">BSc - Computer Science</span>
                    <p className="text-white/75">Kamla Nehru Mahavidyalaya, Nagpur (2021 – 2025)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                  <Briefcase className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Sports Data Analyst Intern</span>
                    <p className="text-white/75">SPIIDEO (June 2026 – Present)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Manifesto & Problem-Solving Methodology */}
          <div className="lg:col-span-7 space-y-10">
            {/* Core Manifesto */}
            <div className="p-7 rounded-3xl bg-[#141722] border border-white/10 space-y-4 shadow-xl">
              <div className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider">
                Analytical Philosophy
              </div>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Most analytical errors occur before any calculation is made: questions are improperly scoped, corrupted transactions are silently cleaned, and observational correlations are treated as causal facts.
              </p>
              <p className="text-white/75 text-sm leading-relaxed">
                My objective is to bridge financial accounting logic, relational database discipline, and executive storytelling. Whether evaluating the monetization trajectory of a consumer payments giant like PhonePe or reconciling exception-ridden order ledgers, I adhere to a governed doctrine: <span className="text-white font-mono font-semibold">PRESERVE → DOCUMENT → FLAG → GOVERN</span>.
              </p>
            </div>

            {/* 5-Step Methodology */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-white/75 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Problem-Solving Methodology
              </div>

              <div className="space-y-3">
                {methodologySteps.map((m) => (
                  <div
                    key={m.step}
                    className="p-4 rounded-2xl bg-[#141722]/80 border border-white/10 hover:border-white/20 transition-all flex items-start gap-4"
                  >
                    <span className="text-sm font-mono font-extrabold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20 shrink-0">
                      {m.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {m.title}
                      </h3>
                      <p className="text-xs text-white/65 mt-1 leading-relaxed font-sans">
                        {m.description}
                      </p>
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
