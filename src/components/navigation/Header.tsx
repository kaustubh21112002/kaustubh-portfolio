import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

interface HeaderProps {
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'hero' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'PROJECTS', href: '#projects' },
    { label: 'PHONEPE DCF', href: '#flagship' },
    { label: 'RESEARCH', href: '#research' },
    { label: 'ABOUT', href: '#about' },
    { label: 'RESUME', href: '#resume' },
    { label: 'CONTACT', href: '#contact' },
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
      <header className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        {/* Floating frosted-glass navigation pill */}
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-6 px-6 py-2.5 rounded-full border shadow-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-[#12141c]/90 backdrop-blur-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-white/20'
              : 'bg-black/45 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/25'
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
            <span className="font-mono uppercase">{portfolioConfig.name}</span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 text-xs tracking-widest font-medium">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 uppercase font-mono cursor-pointer ${
                  activeSection === item.href.slice(1)
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                [{item.label}]
              </button>
            ))}
          </div>

          {/* Quick Direct Resume Download in Header */}
          <div className="hidden md:flex items-center">
            <a
              href={portfolioConfig.resumePath}
              download="Kaustubh_Nandurkar_Resume.pdf"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-transform active:scale-95 shadow-sm"
              title="Download Verified Resume PDF"
            >
              <span>RESUME</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center gap-6 p-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="text-xl font-mono uppercase tracking-widest text-white/90 hover:text-white py-2 cursor-pointer"
            >
              [{item.label}]
            </button>
          ))}
          <a
            href={portfolioConfig.resumePath}
            download="Kaustubh_Nandurkar_Resume.pdf"
            className="mt-4 flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full bg-white text-black"
          >
            <span>DOWNLOAD RESUME (PDF)</span>
            <Download className="w-4 h-4" />
          </a>
        </div>
      )}
    </>
  );
};
