import React, { useState } from 'react';
import { ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  evidenceRef?: string;
}

const faqData: FAQItem[] = [
  {
    id: 'roles',
    question: 'What specific roles and opportunities is Kaustubh targeting?',
    answer: 'Available for full-time opportunities as a Business Analyst, Financial Analyst, Data Analyst, Valuation Specialist, or Analytics Engineer. Ready for immediate consideration across hybrid, on-site, or remote teams.',
    evidenceRef: 'Role Specialization • MBA Business Analytics (Sandip University)'
  },
  {
    id: 'phonepe-audit',
    question: 'How was the PhonePe Pre-IPO valuation model constructed and audited?',
    answer: 'Synthesized from audited MCA annual filings and NPCI operational data. Constructs explicit 5-year segment forecasts (FY26E–FY30E), discounts free cash flows at 14.92% CAPM WACC, and blends Gordon Growth (7.0%) with Exit Multiple (13.15x EBITDA) to derive a Core Enterprise Value of ₹33,432 Cr. The EV-to-Equity bridge adds gross liquid balances of ₹8,915.23 Cr (cash ₹1,127.58 Cr + marketable investments ₹7,787.65 Cr) and deducts ₹716.00 Cr of long-term debt, yielding a net liquidity contribution of +₹8,199.23 Cr and an Implied Equity Value of ₹41,631 Cr (₹821.78/share across 50.66 Cr shares). The model includes a forensic cell-by-cell audit detailing 6 formula reconciliation findings.',
    evidenceRef: 'Flagship DCF Section (02) • Audited Excel Model'
  },
  {
    id: 'stratos-governance',
    question: 'What is the STRATOS data quality framework and why does DQ-10 remain in review?',
    answer: 'STRATOS establishes the governance doctrine PRESERVE → DOCUMENT → FLAG → GOVERN over a 50,000-order retail dataset across 30 defined KPIs. Rather than silently imputing missing fields or forcing numbers into mathematical balance, control DQ-10 (where Net Revenue exceeds Gross Revenue due to untracked promotional clawbacks) is strictly preserved in REVIEW status with 15,630 occurrences across 14,156 unique orders.',
    evidenceRef: 'Projects Section (03) • Case Study Modal & Audit Register'
  },
  {
    id: 'evidence-access',
    question: 'How can hiring teams verify the underlying analytical models and workbooks?',
    answer: 'All major models feature direct external links to governed Google Sheets workbooks accessible via the “View Evidence” chips in the Flagship section and Case Study modals. Each workbook contains complete formula lineage, balance-sheet bridges, and historical schedules.',
    evidenceRef: 'Governed Evidence Links • Interactive DCF & DQ Register'
  },
  {
    id: 'technical-stack',
    question: 'What technical tools and frameworks are demonstrated across this portfolio?',
    answer: 'Demonstrated core competencies include Advanced Financial Modeling (DCF, WACC, Scenario Flexing), Relational Databases & Star-Schema design (MySQL, PostgreSQL), Business Intelligence (Power BI, DAX calculated measures), Statistical Analysis (Python, Pandas, Scikit-Learn regression), and modern web architecture (React, TypeScript, Vite, Tailwind CSS).',
    evidenceRef: 'Skills Section (05) • Verified Toolkit'
  }
];

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['roles']));

  const toggleItem = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#0b0d13] text-neutral-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 dark:bg-white/5 border border-red-500/20 dark:border-white/10 text-red-600 dark:text-red-400 text-xs font-mono uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Recruiter FAQ • Verified Fact Sheet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-600 dark:text-white/70 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Direct, factual answers regarding analytical methodologies, candidate qualifications, and model audit standards.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqData.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141722] overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                >
                  <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white leading-snug">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-white/70 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-500' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/80 border-t border-neutral-100 dark:border-white/5 space-y-3"
                  >
                    <p>{item.answer}</p>
                    {item.evidenceRef && (
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Verified Evidence: {item.evidenceRef}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
