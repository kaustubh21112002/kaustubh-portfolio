import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  location: string;
  period: string;
  status: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  skills: string[];
}

const timelineData: TimelineItem[] = [
  {
    id: 'spiideo-internship',
    type: 'experience',
    title: 'Sports Data Analyst Intern',
    organization: 'SPIIDEO',
    location: 'Remote / India',
    period: 'June 2026 – Present',
    status: 'Professional Experience',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Operational sports data analytics internship tagging, verifying, and structuring match video footage into reliable downstream performance datasets.',
    highlights: [
      'Tagged and structured soccer and field hockey match events using automated multi-camera Spiideo tracking platform.',
      'Enforced multi-tier verification protocols ensuring zero timestamp desynchronization across player-attribution sequences.',
      'Delivered high-fidelity structured tabular datasets used by coaching and analytical staff for tactical modeling.'
    ],
    skills: ['Spiideo Camera Systems', 'Event Tagging', 'Data Quality QA', 'Video Analytics']
  },
  {
    id: 'sandip-mba',
    type: 'education',
    title: 'MBA in Business Analytics',
    organization: 'Sandip University',
    location: 'Nashik, Maharashtra',
    period: '2025 – 2027',
    status: 'Academic Degree (In Progress)',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    description: 'Postgraduate management degree specializing in advanced quantitative valuation, business analytics, predictive statistical modeling, and data governance.',
    highlights: [
      'Comprehensive focus on Discounted Cash Flow (DCF), CAPM WACC, and corporate valuation modeling.',
      'Advanced relational database management, SQL star-schema modeling, and Power BI DAX KPI design.',
      'Authored independent Pre-IPO equity research on PhonePe (₹41,631 Cr valuation) and SmartBank 360 feasibility study.'
    ],
    skills: ['DCF Valuation', 'CAPM WACC', 'Power BI & DAX', 'SQL Modeling', 'Business Intelligence']
  },
  {
    id: 'kamla-nehru-bsc',
    type: 'education',
    title: 'BSc in Computer Science',
    organization: 'Kamla Nehru Mahavidyalaya',
    location: 'Nagpur, Maharashtra',
    period: '2021 – 2025',
    status: 'Undergraduate Degree (Grade: 56.7%)',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Undergraduate degree providing deep foundations in computer science, relational database management systems, data structures, and algorithmic logic.',
    highlights: [
      'Developed strong software fundamentals in Python, C++, MySQL relational schema design, and Linux tools.',
      'Designed star-schema database architecture for 10,000+ support ticket records for academic analytics dissertation.',
      'Integrated statistical analysis with programmatic ETL pipelines and frontend visualization engines.'
    ],
    skills: ['Python', 'MySQL', 'Relational Databases', 'Algorithms', 'Data Structures']
  },
  {
    id: 'raisoni-hsc',
    type: 'education',
    title: 'Higher Secondary Certificate (HSC) — Science',
    organization: 'G. H. Raisoni Vidya Niketan',
    location: 'Nagpur, Maharashtra',
    period: '2021',
    status: 'Secondary Certificate (Grade: 67.4%)',
    badgeColor: 'bg-white/5 text-white/60 border-white/10',
    description: 'Rigorous high school science curriculum establishing core quantitative reasoning in mathematics, physics, and computer science.',
    highlights: [
      'Completed coursework in Higher Mathematics, Applied Physics, and Computer Science fundamentals.',
      'Developed quantitative and analytical problem-solving foundation preceding undergraduate studies.'
    ],
    skills: ['Higher Mathematics', 'Analytical Reasoning', 'Physics', 'Computer Science']
  }
];

export const JourneySection: React.FC = () => {
  return (
    <section id="journey" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0b0d13] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Label */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="text-red-400 font-bold">(04)</span>
            <span>Professional Journey & Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Academic Grounding & Applied Practice
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            A chronological timeline distinguishing professional employment from academic degrees, reflecting continuous growth across computer science, business analytics, and quantitative valuation.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/15 space-y-12">
          {timelineData.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full border-2 bg-[#0b0d13] transition-all duration-300 flex items-center justify-center ${
                  item.type === 'experience'
                    ? 'border-emerald-400 group-hover:scale-125 group-hover:bg-emerald-400/20'
                    : 'border-red-500 group-hover:scale-125 group-hover:bg-red-500/20'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === 'experience' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
              </div>

              {/* Item Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#141722] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${item.badgeColor}`}
                    >
                      {item.type === 'experience' ? (
                        <Briefcase className="w-3.5 h-3.5" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      {item.period}
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-white/40" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Title & Organization */}
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <div className="text-sm font-semibold text-red-400 font-mono mt-0.5">
                    {item.organization}
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/75 text-sm leading-relaxed mb-4 font-sans">
                  {item.description}
                </p>

                {/* Specific Responsibilities / Achievements */}
                <div className="space-y-2 mb-5 pt-3 border-t border-white/10">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-xs text-white/65 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tool & Skill Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] font-mono tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
