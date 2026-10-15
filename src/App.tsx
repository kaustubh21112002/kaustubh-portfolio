import React, { useState, useEffect } from 'react';
import { Header } from './components/navigation/Header';
import { MagneticCursor } from './components/common/MagneticCursor';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { FlagshipPhonePe } from './components/flagship/FlagshipPhonePe';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { JourneySection } from './components/journey/JourneySection';
import { SkillsSection } from './components/skills/SkillsSection';
import { ResearchSection } from './components/research/ResearchSection';
import { ResumeSection } from './components/resume/ResumeSection';
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d13] text-white selection:bg-red-500 selection:text-white">
      {/* 1. Custom Magnetic Glow Cursor (disabled on touch & prefers-reduced-motion) */}
      <MagneticCursor />

      {/* 2. Floating Frosted Navigation Pill with Reading Progress */}
      <Header activeSection={activeSection} />

      {/* 3. Main Content Sections in Restrained Editorial Sequence */}
      <main>
        {/* Hero Section: 60 FPS Cursor-Tracking Character + Recruiter 5-Second Positioning */}
        <HeroSection />

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

        {/* Section (08): Direct Channels, Inquiries & Recruiter Opportunities */}
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
