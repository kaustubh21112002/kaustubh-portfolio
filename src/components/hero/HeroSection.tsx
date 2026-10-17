import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, Download, Mail, ChevronRight } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onResumeClick?: () => void;
  onContactClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  onExploreClick,
  onResumeClick,
  onContactClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Listen for dynamic changes to prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Initialize playback with smooth slow-motion (0.7x speed) and continuous looping
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.7;
    video.defaultMuted = true;
    video.muted = true;

    // Respect reduced-motion preferences
    if (isReducedMotion) {
      video.pause();
    } else if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isReducedMotion]);

  // Set 0.7x playback speed once metadata loads (fires only once on initial load, never on loop)
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.7;
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen max-h-[1080px] min-h-[640px] overflow-hidden select-none bg-[#0b0d13]"
    >
      {/* 1. Full Cinematic Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/videos/intro.mp4"
          poster="/videos/intro-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover object-[50%_18%] lg:object-[60%_30%] lg:translate-x-[10%] lg:translate-y-[2%] lg:scale-[1.04] transition-transform duration-700"
          aria-hidden="true"
        />
      </div>

      {/* 2. Editorial Overlays: Strong Dark Gradient for Text, Clean Natural Skin Tones on Portrait */}
      {/* Desktop Left-to-Right Editorial Gradient (100% dark behind text, transparent on portrait) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, #0b0d13 0%, #0b0d13 28%, rgba(11,13,19,0.96) 44%, rgba(11,13,19,0.60) 58%, rgba(11,13,19,0) 70%, rgba(11,13,19,0) 86%, rgba(11,13,19,0.35) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top & Bottom Cinematic Edge Vignette (Anchors navigation & footer without washing face) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,13,19,0.65) 0%, rgba(11,13,19,0) 16%, rgba(11,13,19,0) 82%, rgba(11,13,19,0.85) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Mobile Top-to-Bottom Scrim Overlay */}
      <div
        className="md:hidden absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#0b0d13]/80 via-[#0b0d13]/55 to-[#0b0d13]/88 backdrop-blur-[0.5px]"
        aria-hidden="true"
      />

      {/* 3. Hero Content Container */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-between pt-20 sm:pt-28 pb-6 sm:pb-10 w-full min-w-0">
        
        {/* Top Eyebrow / Direct Contact Touchpoint */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex max-w-full min-w-0 items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/95 text-xs font-mono tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate min-w-0">MBA Business Analytics • Sandip University</span>
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
        <div className="w-full max-w-xl lg:max-w-xl xl:max-w-2xl my-auto py-5 sm:py-6 max-md:bg-[#0b0d13]/85 max-md:backdrop-blur-xl max-md:border max-md:border-white/15 max-md:rounded-3xl max-md:p-4 sm:max-md:p-6 max-md:shadow-2xl min-w-0">
          {/* Candidate Name & Positioning */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-white font-mono text-xs sm:text-base font-bold tracking-widest uppercase">
              Kaustubh K. Nandurkar
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="hidden sm:inline-block text-white/75 font-mono text-xs tracking-wider">
              MBA Business Analytics • Sandip University
            </span>
          </div>

          {/* Concise Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
            Business Analytics <br className="sm:hidden" />& Research.
          </h1>

          {/* Evidence-Based Short Description */}
          <p className="text-white/90 sm:text-white/85 text-xs sm:text-base leading-relaxed font-normal mb-5 sm:mb-6 max-w-xl">
            Evaluating commercial decisions through quantitative valuation, relational analytics, and governed data pipelines.
          </p>

          {/* Recruiter Quick Proof Signals */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-1.5 sm:gap-2 mb-6 sm:mb-8 text-xs sm:text-sm font-mono">
            <span className="w-fit px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/95 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>SPIIDEO Match Analytics Intern</span>
            </span>
            <span className="w-fit px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/95 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>₹41,631 Cr Pre-IPO Valuation</span>
            </span>
            <span className="w-fit px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/95 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>50,000 Order Governed System</span>
            </span>
          </div>

          {/* Action Buttons: Primary "Explore My Work", Secondary "Download Resume (PDF)", Tertiary "Contact" */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
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
              className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-transparent font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Resume (PDF)</span>
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

        {/* Bottom Status & Navigation Bar */}
        <div className="w-full flex items-center justify-end pt-3 sm:pt-4 border-t border-white/10 text-white/60 text-xs font-mono">
          {/* Section Navigation Link */}
          <button
            onClick={() => scrollTo('flagship')}
            className="flex items-center gap-1.5 sm:gap-2 text-white/50 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="uppercase tracking-wider text-xs">Flagship DCF</span>
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce group-hover:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
