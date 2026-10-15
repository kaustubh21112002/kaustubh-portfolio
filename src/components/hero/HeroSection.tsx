import React from 'react';
import { ArrowDown, ArrowUpRight, Download, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CharacterCanvas } from './CharacterCanvas';
import { portfolioConfig } from '../../config/portfolio';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onResumeClick?: () => void;
  onContactClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onResumeClick,
  onContactClick,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] overflow-hidden select-none"
      style={{ backgroundColor: portfolioConfig.characterBgColor }}
    >
      {/* 1. Full Viewport Canvas Character (Hardware-Accelerated Directional Tracking) */}
      <CharacterCanvas className="absolute inset-0 z-0" />

      {/* 2. Editorial Overlays for High Readability */}
      {/* Mobile Scrim Overlay for 100% Text Readability over centered character */}
      <div className="md:hidden absolute inset-0 pointer-events-none z-10 bg-black/70 backdrop-blur-[1px]" />

      {/* Desktop Left-to-Right Editorial Gradient */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,13,19,0.94) 0%, rgba(11,13,19,0.80) 42%, rgba(11,13,19,0.25) 68%, rgba(11,13,19,0.05) 100%)',
        }}
      />

      {/* Subtle Bottom & Top Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 65% 50%, rgba(0,0,0,0) 45%, rgba(11,13,19,0.65) 100%)',
        }}
      />

      {/* 3. Hero Content Container */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10">
        
        {/* Top Eyebrow / Direct Contact Touchpoint */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/95 text-[11px] sm:text-xs font-mono uppercase tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">MBA Business Analytics • Sandip University</span>
          </div>

          <a
            href={`mailto:${portfolioConfig.socials.email}`}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-white/80 hover:text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-all hover:bg-black/60"
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>{portfolioConfig.socials.email}</span>
          </a>
        </div>

        {/* Core Editorial Identity & CTAs */}
        <div className="max-w-xl lg:max-w-2xl my-auto py-4 sm:py-6">
          {/* Candidate Name & Positioning: Immediate Readability */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-white font-mono text-xs sm:text-base font-bold tracking-widest uppercase">
              Kaustubh K. Nandurkar
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="hidden sm:inline-block text-white/75 font-mono text-xs uppercase tracking-wider">
              MBA Business Analytics • Sandip University
            </span>
          </div>

          {/* Concise Headline as requested */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
            Business Analytics <br className="sm:hidden" />& Research.
          </h1>

          {/* Evidence-Based Short Description (3 lines) */}
          <p className="text-white/90 sm:text-white/85 text-xs sm:text-base leading-relaxed font-normal mb-5 sm:mb-6 max-w-xl">
            Evaluating commercial decisions through quantitative valuation (<span className="text-white font-semibold">PhonePe Pre-IPO DCF</span>), relational SQL & Power BI analytics pipelines, and governed transaction architecture (<span className="text-white font-semibold">STRATOS AI</span>).
          </p>

          {/* Recruiter Quick Proof Signals */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/15 text-white/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              SPIIDEO Match Analytics Intern
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/15 text-white/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              ₹41,631 Cr Pre-IPO Valuation
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/15 text-white/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              50,000 Order Governed System
            </span>
          </div>

          {/* Action Buttons: Primary "Explore My Work", Secondary "Download Résumé", Tertiary "Contact" */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-none">
            {/* Primary CTA */}
            <button
              onClick={() => {
                scrollTo('flagship');
                if (onExploreClick) onExploreClick();
              }}
              className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all duration-200 hover:bg-white/95 hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] active:scale-95 cursor-pointer shadow-md"
            >
              <span>Explore My Work</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Secondary CTA */}
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Résumé</span>
            </a>

            {/* Quick Contact CTA in Hero */}
            <button
              onClick={() => {
                scrollTo('contact');
                if (onContactClick) onContactClick();
              }}
              className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white/90 hover:text-white font-medium text-sm tracking-wide transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span>Contact</span>
            </button>
          </div>
        </div>

        {/* Bottom Status & Scroll Indicator */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/15 text-white/75 text-[11px] sm:text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="uppercase tracking-wider text-[10px] sm:text-[11px]">3D Model</span>
          </div>

          <button
            onClick={() => scrollTo('flagship')}
            className="flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="uppercase tracking-wider text-[10px] sm:text-[11px]">Flagship DCF</span>
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce group-hover:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};
