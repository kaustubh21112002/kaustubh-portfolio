import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'hero' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const navItems = [
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'VALUATION', href: '#flagship', id: 'flagship' },
    { label: 'WORK', href: '#projects', id: 'projects' },
    { label: 'JOURNEY', href: '#journey', id: 'journey' },
    { label: 'SKILLS', href: '#skills', id: 'skills' },
    { label: 'RESEARCH', href: '#research', id: 'research' },
    { label: 'RESUME', href: '#resume', id: 'resume' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
            className="flex items-center gap-2 text-white font-bold tracking-wider text-sm transition-opacity hover:opacity-80"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono uppercase text-xs sm:text-sm tracking-wide">
              {portfolioConfig.name}
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-0.5 text-xs tracking-wider font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-2.5 py-1.5 rounded-full transition-all duration-200 uppercase font-mono text-[11px] cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  [{item.label}]
                </button>
              );
            })}
          </div>

          {/* Quick Direct Resume Download in Header */}
          <div className="hidden sm:flex items-center">
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-transform active:scale-95 shadow-sm font-mono tracking-tight"
              title="Download Verified Resume PDF"
            >
              <span>RESUME</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col justify-center items-center gap-5 p-8">
          <div className="text-xs font-mono uppercase text-white/40 tracking-widest mb-2">
            Navigation Index
          </div>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="text-lg font-mono tracking-wider text-white hover:text-red-400 transition-colors uppercase cursor-pointer"
            >
              [{item.label}]
            </button>
          ))}
          <div className="pt-6 border-t border-white/15 flex flex-col items-center gap-3 w-full max-w-xs">
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black font-bold text-sm tracking-wide"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified Resume</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono text-white/50 hover:text-white pt-2 cursor-pointer"
            >
              [Close Menu]
            </button>
          </div>
        </div>
      )}
    </>
  );
};
