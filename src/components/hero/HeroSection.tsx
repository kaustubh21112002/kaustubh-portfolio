import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowDown, Download, Mail, ChevronRight, Copy, Check } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';
import { AvailabilityIndicator } from '../common/AvailabilityIndicator';

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
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(portfolioConfig.socials.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = portfolioConfig.socials.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      }
    } catch (err) {
      console.warn('Failed to copy email:', err);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe playback trigger handling browser autoplay policy and user gesture requirements
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || isReducedMotion) return;

    video.playbackRate = 0.7;
    video.defaultMuted = true;
    video.muted = true;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          // If browser policy deferred autoplay pending interaction, resume on first gesture
          const isPolicyRestriction =
            err instanceof Error &&
            (err.name === 'NotAllowedError' || err.name === 'AbortError');

          if (isPolicyRestriction && typeof window !== 'undefined') {
            const onUserInteraction = () => {
              window.removeEventListener('pointerdown', onUserInteraction);
              window.removeEventListener('touchstart', onUserInteraction);
              window.removeEventListener('keydown', onUserInteraction);
              window.removeEventListener('scroll', onUserInteraction);

              const currentVideo = videoRef.current;
              if (currentVideo && !isReducedMotion && currentVideo.paused) {
                currentVideo.play().catch((playbackErr) => {
                  console.warn('Hero video playback deferred on gesture:', playbackErr);
                });
              }
            };

            window.addEventListener('pointerdown', onUserInteraction, { once: true, passive: true });
            window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true });
            window.addEventListener('keydown', onUserInteraction, { once: true, passive: true });
            window.addEventListener('scroll', onUserInteraction, { once: true, passive: true });
          } else if (err instanceof Error) {
            console.warn('Hero video playback notice:', err.message);
          }
        });
      }
    }
  }, [isReducedMotion]);

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

  // Initialize and synchronize playback state with slow-motion (0.7x speed)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.7;
    video.defaultMuted = true;
    video.muted = true;

    // Respect reduced-motion preferences
    if (isReducedMotion) {
      video.pause();
    } else {
      attemptPlay();
    }
  }, [isReducedMotion, attemptPlay]);

  // Set 0.7x playback speed and verify playback once metadata loads
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.7;
    if (!isReducedMotion && video.paused) {
      attemptPlay();
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] select-none bg-[#0b0d13] flex flex-col justify-between overflow-x-hidden"
    >
      {/* 1. Full Cinematic Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/videos/intro.mp4"
          poster="/videos/intro-poster.webp"
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

      {/* 2. Editorial Overlays: Balanced Dark Gradient for Text, Clean Natural Clarity on Portrait */}
      {/* Desktop Left-to-Right Editorial Gradient (Dark behind text on left, 100% transparent on portrait center-right) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, #0b0d13 0%, #0b0d13 22%, rgba(11,13,19,0.92) 36%, rgba(11,13,19,0.45) 50%, rgba(11,13,19,0) 62%, rgba(11,13,19,0) 90%, rgba(11,13,19,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top & Bottom Cinematic Edge Vignette (Subtle anchor without dimming face) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,13,19,0.45) 0%, rgba(11,13,19,0) 18%, rgba(11,13,19,0) 86%, rgba(11,13,19,0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Mobile Top-to-Bottom Scrim Overlay */}
      <div
        className="md:hidden absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#0b0d13]/70 via-[#0b0d13]/40 to-[#0b0d13]/85"
        aria-hidden="true"
      />

      {/* 3. Hero Content Container */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-between pt-20 sm:pt-22 lg:pt-26 pb-4 sm:pb-6 lg:pb-8 w-full min-w-0">
        
        {/* Top Eyebrow / Direct Contact & Availability Touchpoints (Visible on sm+ to prevent floating header collision on mobile) */}
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex max-w-full min-w-0 items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/95 text-xs font-mono tracking-wider shadow-lg">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full bg-red-500" />
              <span className="truncate min-w-0">MBA Business Analytics • Sandip University</span>
            </div>

            {/* Configurable Availability Indicator with Engagement Popover */}
            <AvailabilityIndicator />
          </div>

          <a
            href={`mailto:${portfolioConfig.socials.email}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-white/80 hover:text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-all hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>{portfolioConfig.socials.email}</span>
          </a>
        </div>

        {/* Core Editorial Identity & CTAs */}
        <div className="w-full max-w-xl lg:max-w-xl xl:max-w-2xl my-auto py-4 sm:py-6 max-md:bg-[#0b0d13]/85 max-md:backdrop-blur-xl max-md:border max-md:border-white/10 max-md:rounded-3xl max-md:p-5 sm:max-md:p-7 max-md:shadow-2xl min-w-0">
          {/* Candidate Name & Positioning */}
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
            <span className="text-white font-mono text-xs sm:text-base font-bold tracking-widest uppercase">
              Kaustubh K. Nandurkar
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-white/75 font-mono text-xs tracking-wider">
              MBA Business Analytics
            </span>
            <span className="hidden sm:inline text-white/50 font-mono text-xs tracking-wider">
              • Sandip University
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
            Business Analytics <br className="sm:hidden" />& Research.
          </h1>

          {/* Description */}
          <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed font-normal mb-5 sm:mb-6 max-w-xl">
            Evaluating commercial decisions through quantitative valuation, relational analytics, and governed data pipelines.
          </p>

          {/* Recruiter Quick Proof Signals (Unified Red Accent for Consistent Interaction) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-xs sm:text-sm font-mono">
            <button
              onClick={() => scrollTo('journey')}
              aria-label="Jump to SPIIDEO Match Analytics internship in journey section"
              className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-red-400/50 text-white/95 flex items-center gap-1.5 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-[0.98]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>SPIIDEO Match Analytics Intern</span>
              <span className="text-white/50 group-hover:text-red-400 transition-colors text-[10px]">↗</span>
            </button>
            <button
              onClick={() => scrollTo('flagship')}
              aria-label="Jump to ₹41,631 Cr PhonePe Pre-IPO valuation model"
              className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-red-400/50 text-white/95 flex items-center gap-1.5 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-[0.98]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>₹41,631 Cr Pre-IPO Valuation</span>
              <span className="text-white/50 group-hover:text-red-400 transition-colors text-[10px]">↗</span>
            </button>
            <button
              onClick={() => scrollTo('projects')}
              aria-label="Jump to 50,000 Order STRATOS governed analytics system"
              className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-red-400/50 text-white/95 flex items-center gap-1.5 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-[0.98]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>50,000 Order Governed System</span>
              <span className="text-white/50 group-hover:text-red-400 transition-colors text-[10px]">↗</span>
            </button>
          </div>

          {/* Action Buttons: Primary "Explore My Work", Secondary "Download Resume (PDF)", Tertiary "Contact" */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Primary CTA (Von Restorff: crisp white high-contrast standout) */}
            <button
              onClick={() => {
                scrollTo('flagship');
                if (onExploreClick) onExploreClick();
              }}
              aria-label="Explore flagship valuation model and analytical case studies"
              className="min-h-[48px] flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all duration-200 hover:bg-white/95 hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] active:scale-95 cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <span>Explore My Work</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Secondary CTA */}
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              aria-label="Download verified resume PDF from hero section"
              className="min-h-[48px] flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Resume (PDF)</span>
            </a>

            {/* Quick Contact CTA in Hero with One-Click Email Copy */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  scrollTo('contact');
                  if (onContactClick) onContactClick();
                }}
                aria-label="Scroll to direct contact channels"
                className="flex-1 sm:flex-none min-h-[48px] flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white/90 hover:text-white font-medium text-sm tracking-wide transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>Contact</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={copiedEmail ? 'Email copied to clipboard' : 'Copy email address'}
                title={copiedEmail ? `Copied: ${portfolioConfig.socials.email}` : `Copy ${portfolioConfig.socials.email}`}
                className="min-w-[48px] min-h-[48px] flex items-center justify-center p-3 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 relative"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/80 hover:text-white" />
                )}
                <span className="sr-only">{copiedEmail ? 'Copied' : 'Copy email'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status & Navigation Bar */}
        <div className="w-full flex items-center justify-end pt-2 sm:pt-3 lg:pt-4 border-t border-white/10 text-white/70 text-xs font-mono">
          {/* Section Navigation Link */}
          <button
            onClick={() => scrollTo('flagship')}
            aria-label="Scroll down to Flagship DCF Valuation section"
            className="flex items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-full px-2 py-1"
          >
            <span className="uppercase tracking-wider text-xs font-semibold">Flagship DCF</span>
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce group-hover:text-white text-red-400" />
          </button>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
