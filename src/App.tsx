import React, { useState, useEffect } from 'react';
import { Header } from './components/navigation/Header';
import { MagneticCursor } from './components/common/MagneticCursor';
import { HeroSection } from './components/hero/HeroSection';
import { FlagshipPhonePe } from './components/flagship/FlagshipPhonePe';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { ResearchSection } from './components/research/ResearchSection';
import { AboutSection } from './components/about/AboutSection';
import { ResumeSection } from './components/resume/ResumeSection';
import { ContactSection } from './components/contact/ContactSection';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'flagship', 'projects', 'research', 'about', 'resume', 'contact'];
      const scrollPos = window.scrollY + 200;

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
      {/* 1. Custom Magnetic Glow Cursor */}
      <MagneticCursor />

      {/* 2. Floating Frosted Navigation Pill */}
      <Header activeSection={activeSection} />

      {/* 3. Main Content Sections */}
      <main>
        {/* Section A: Hero with 60 FPS Cursor-Tracking Character */}
        <HeroSection />

        {/* Section D: Flagship Project: PhonePe Pre-IPO Equity Research & Valuation */}
        <FlagshipPhonePe />

        {/* Section B & C: Featured Projects & Case Studies */}
        <ProjectsSection />

        {/* Section E: Research Library */}
        <ResearchSection />

        {/* Section F: About Me */}
        <AboutSection />

        {/* Section G: Resume Access Area */}
        <ResumeSection />

        {/* Section H: Direct Contact & Inquiries */}
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
