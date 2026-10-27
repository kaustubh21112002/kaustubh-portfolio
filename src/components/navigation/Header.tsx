import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Download, Search } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';
import { ThemeToggle } from '../common/ThemeToggle';
import { QuickSearchModal } from '../common/QuickSearchModal';
import { AvailabilityIndicator } from '../common/AvailabilityIndicator';

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'hero' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalSearchKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalSearchKey);
    return () => window.removeEventListener('keydown', handleGlobalSearchKey);
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

  // Streamlined primary desktop navigation (5 clear recruiter anchors)
  const desktopNavItems = [
    { number: '01', label: 'About', href: '#about', id: 'about' },
    { number: '02', label: 'Valuation', href: '#flagship', id: 'flagship' },
    { number: '03', label: 'Work', href: '#projects', id: 'projects' },
    { number: '04', label: 'Journey', href: '#journey', id: 'journey' },
    { number: '05', label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Comprehensive mobile drawer items
  const mobileNavItems = [
    { number: '01', label: 'About', href: '#about', id: 'about' },
    { number: '02', label: 'Valuation', href: '#flagship', id: 'flagship' },
    { number: '03', label: 'Work', href: '#projects', id: 'projects' },
    { number: '04', label: 'Journey', href: '#journey', id: 'journey' },
    { number: '05', label: 'Skills', href: '#skills', id: 'skills' },
    { number: '06', label: 'Research', href: '#research', id: 'research' },
    { number: '07', label: 'Contact', href: '#contact', id: 'contact' },
    { number: '08', label: 'FAQ', href: '#faq', id: 'faq' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: isReducedMotion ? 'instant' : 'smooth' });
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
          className={`pointer-events-auto flex items-center justify-between gap-3 lg:gap-4 px-4 py-2 sm:px-5 sm:py-2 rounded-full border shadow-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 dark:bg-[#12141c]/90 backdrop-blur-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-neutral-300 dark:border-white/20'
              : 'bg-white/75 dark:bg-black/50 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-neutral-200 dark:border-white/25'
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
            className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold tracking-wider text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-full shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono uppercase text-xs sm:text-sm tracking-wide">
              {portfolioConfig.name}
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 text-xs tracking-wider font-medium">
            {desktopNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  aria-label={`Jump to ${item.label} section`}
                  className={`px-3 py-1.5 rounded-full transition-colors duration-200 uppercase font-mono text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-sm'
                      : 'text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Utilities: Search, Resume, Theme */}
          <div className="flex items-center gap-1.5">
            {/* Quick Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search portfolio projects and skills (Ctrl+K)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-neutral-600 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
              title="Search Projects & Skills (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline font-semibold text-[11px]">SEARCH</span>
              <kbd className="hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-200 dark:bg-white/10 text-neutral-500 dark:text-white/50">
                ⌘K
              </kbd>
            </button>

            {/* Quick Direct Resume Download */}
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              aria-label="Download verified resume PDF"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-transform active:scale-95 shadow-sm font-mono tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              title="Download Verified Resume PDF"
            >
              <span>RESUME</span>
              <Download className="w-3.5 h-3.5" />
            </a>

            {/* 3-State Theme Selector Pill */}
            <ThemeToggle variant="compact" />

            {/* Mobile Menu Button */}
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-neutral-800 dark:text-white min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-dialog"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
          className="fixed inset-0 z-50 bg-[#0b0d13]/99 backdrop-blur-3xl lg:hidden flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
        >
          {/* Top Bar: Editorial Index Title & Close Button */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
              <span className="text-[11px] font-mono uppercase text-white/60 tracking-widest font-semibold">
                Navigation Index
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Availability Status in Mobile Drawer */}
          <div className="w-full max-w-md mx-auto pt-4 flex justify-start">
            <AvailabilityIndicator />
          </div>

          {/* Quick Search Shortcut in Mobile Drawer */}
          <div className="w-full max-w-md mx-auto pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full min-h-[48px] flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-sm font-mono hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-red-400" />
                <span>Search Projects, Skills, Models...</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">⌘K</span>
            </button>
          </div>

          {/* Editorial Navigation List: 01 About to 08 FAQ */}
          <nav
            aria-label="Mobile Navigation Index"
            className="w-full max-w-md mx-auto my-auto py-4 sm:py-6 flex flex-col gap-1 sm:gap-1.5"
          >
            {mobileNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={isActive ? 'location' : undefined}
                  aria-label={`Section ${item.number}: ${item.label}`}
                  className="group w-full min-h-[48px] flex items-center justify-between py-2.5 sm:py-3 px-3.5 -mx-3.5 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 hover:bg-white/[0.04]"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span
                      className={`font-mono text-xs sm:text-sm tracking-wider transition-colors duration-150 ${
                        isActive
                          ? 'text-red-400 font-semibold'
                          : 'text-white/40 group-hover:text-white/70'
                      }`}
                    >
                      {item.number}
                    </span>

                    <span
                      className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-150 ${
                        isActive
                          ? 'text-white'
                          : 'text-white/80 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center pl-2">
                    {isActive ? (
                      <span
                        className="inline-block w-6 h-[2.5px] bg-red-500 rounded-full"
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

          {/* Bottom Actions & Controls */}
          <div className="w-full max-w-md mx-auto pt-5 border-t border-white/10 flex flex-col gap-3.5">
            {/* Expanded 3-state Theme Selector */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-white/50 tracking-wider font-semibold">
                Theme Appearance
              </div>
              <ThemeToggle variant="expanded" />
            </div>

            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              aria-label="Download verified resume PDF"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-md font-mono"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Resume</span>
            </a>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 px-1 pt-1">
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

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
