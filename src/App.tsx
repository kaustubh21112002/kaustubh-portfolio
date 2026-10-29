import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/navigation/Header';
import { MagneticCursor } from './components/common/MagneticCursor';
import { BackToTop } from './components/common/BackToTop';
import { HeroSection } from './components/hero/HeroSection';
import { EvidenceTelemetryBar } from './components/metrics/EvidenceTelemetryBar';
import { AboutSection } from './components/about/AboutSection';
import { FlagshipPhonePe } from './components/flagship/FlagshipPhonePe';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { JourneySection } from './components/journey/JourneySection';
import { SkillsSection } from './components/skills/SkillsSection';
import { ResearchSection } from './components/research/ResearchSection';
import { ResumeSection } from './components/resume/ResumeSection';
import { FAQSection } from './components/faq/FAQSection';
import { ContactSection } from './components/contact/ContactSection';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'about',
        'flagship',
        'projects',
        'journey',
        'skills',
        'research',
        'resume',
        'faq',
        'contact'
      ];
      const scrollPos = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Synchronous section positioning for deep links & headless capture
    const searchTarget = new URLSearchParams(window.location.search).get('section');
    const hashTarget = window.location.hash ? window.location.hash.replace('#', '') : '';
    const targetId = searchTarget || hashTarget;

    if (targetId) {
      const scrollNow = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      };
      scrollNow();
      requestAnimationFrame(scrollNow);
      const timer = setTimeout(scrollNow, 100);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ThemeProvider>
      {/* 0. Accessible Skip-to-Main-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-red-600 focus:text-white focus:font-mono focus:text-xs focus:rounded-full focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d13] text-slate-900 dark:text-white selection:bg-red-500 selection:text-white transition-colors duration-300">
        {/* 1. Custom Magnetic Glow Cursor (disabled on touch & prefers-reduced-motion) */}
        <MagneticCursor />

        {/* 2. Floating Frosted Navigation Pill with Reading Progress & Quick Search */}
        <Header activeSection={activeSection} />

        {/* 3. Main Content Sections in Restrained Editorial Sequence */}
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {/* Hero Section: 60 FPS Cursor-Tracking Character + Recruiter 5-Second Positioning */}
          <HeroSection />

          {/* Evidence Telemetry Bar: Verified Quantitative Outputs & Governed Data Volumes */}
          <EvidenceTelemetryBar />

          {/* Section (01): About Me, Analytical Manifesto & 5-Stage Problem-Solving Methodology */}
          <AboutSection />

          {/* Section (02): Flagship Valuation — PhonePe Pre-IPO DCF Model & Reconciled Per-Share Value */}
          <FlagshipPhonePe />

          {/* Section (03): Selected Analytics Projects (STRATOS, SPIIDEO, IT Support, SmartBank) */}
          <ProjectsSection />

          {/* Section (04): Professional Journey & Educational Timeline (Newest First) */}
          <JourneySection />

          {/* Section (05): Skills & Verified Toolkit with Concrete Application Context */}
          <SkillsSection />

          {/* Section (06): Academic Research Library & Manuscripts */}
          <ResearchSection />

          {/* Section (07): Verified Resume Download & Official PDF Access */}
          <ResumeSection />

          {/* Section (08): Recruiter FAQ & Factual Q&A Accordion */}
          <FAQSection />

          {/* Section (09): Direct Channels, Inquiries & Recruiter Opportunities */}
          <ContactSection />
        </main>

        {/* 4. Floating Back to Top Button */}
        <BackToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;
