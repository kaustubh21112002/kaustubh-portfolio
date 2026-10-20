import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'hero' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileDialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolledPercent);
      setScrolled(winScroll > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        const dialog = mobileDialogRef.current;
        const firstFocusable = dialog?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMobileMenuOpen(false);
          return;
        }

        if (e.key === 'Tab') {
          const dialog = mobileDialogRef.current;
          if (!dialog) return;

          const focusable = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null);

          if (focusable.length === 0) {
            e.preventDefault();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first || !dialog.contains(document.activeElement)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last || !dialog.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        mobileMenuButtonRef.current?.focus();
      };
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { number: '01', label: 'About', href: '#about', id: 'about' },
    { number: '02', label: 'Valuation', href: '#flagship', id: 'flagship' },
    { number: '03', label: 'Work', href: '#projects', id: 'projects' },
    { number: '04', label: 'Journey', href: '#journey', id: 'journey' },
    { number: '05', label: 'Skills', href: '#skills', id: 'skills' },
    { number: '06', label: 'Research', href: '#research', id: 'research' },
    { number: '07', label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Global Reading Progress Indicator Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(237,32,38,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Frosted Navigation Pill */}
      <header className="fixed top-5 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 lg:gap-6 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border shadow-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-[#12141c]/90 backdrop-blur-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-white/20'
              : 'bg-black/50 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/25'
          }`}
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Brand identifier */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={`${portfolioConfig.name} - Back to top`}
            className="flex items-center gap-2 text-white font-bold tracking-wider text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono uppercase text-xs sm:text-sm tracking-wide">
              {portfolioConfig.name}
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 text-xs tracking-wider font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  aria-label={`Jump to ${item.label} section`}
                  className={`px-3 py-1.5 rounded-full transition-colors duration-200 uppercase font-mono text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Direct Resume Download in Header */}
          <div className="hidden sm:flex items-center">
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              aria-label="Download verified resume PDF"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-transform active:scale-95 shadow-sm font-mono tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              title="Download Verified Resume PDF"
            >
              <span>RESUME</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-dialog"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileDialogRef}
          id="mobile-navigation-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 bg-[#0b0d13]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
        >
          {/* Top Bar: Editorial Index Title & Close Button */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
              <span className="text-[11px] font-mono uppercase text-white/50 tracking-widest font-semibold">
                Navigation Index
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editorial Navigation List: 01 About to 07 Contact */}
          <nav
            aria-label="Mobile Navigation Index"
            className="w-full max-w-md mx-auto my-auto py-6 sm:py-8 flex flex-col gap-1 sm:gap-2"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  aria-label={`Section ${item.number}: ${item.label}`}
                  className="group w-full flex items-center justify-between py-3 sm:py-3.5 px-3 -mx-3 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 hover:bg-white/[0.03]"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    {/* Two-digit section number */}
                    <span
                      className={`font-mono text-xs sm:text-sm tracking-wider transition-colors duration-150 ${
                        isActive
                          ? 'text-red-400 font-semibold'
                          : 'text-white/40 group-hover:text-white/70'
                      }`}
                    >
                      {item.number}
                    </span>

                    {/* Dominant Section Label */}
                    <span
                      className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-150 ${
                        isActive
                          ? 'text-white'
                          : 'text-white/80 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Restrained Active Indicator: short red rule for active, subtle directional cue on hover */}
                  <div className="flex items-center pl-2">
                    {isActive ? (
                      <span
                        className="inline-block w-6 h-[2px] bg-red-500 rounded-full"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-white/40 text-sm font-mono motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions & Metadata */}
          <div className="w-full max-w-md mx-auto pt-6 border-t border-white/10 flex flex-col gap-4">
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              aria-label="Download verified resume PDF"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-md font-mono"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Resume</span>
            </a>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 px-1">
              <span>{portfolioConfig.fullName}</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded px-1"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
