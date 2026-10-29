import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: isReducedMotion ? 'instant' : 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/90 dark:bg-[#141722]/90 text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/15 shadow-xl backdrop-blur-md transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto hover:bg-white dark:hover:bg-[#1a1e2c] hover:border-red-400/50 hover:shadow-[0_0_20px_rgba(237,32,38,0.3)] active:scale-95'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 text-neutral-700 dark:text-white/80 group-hover:text-red-500" />
    </button>
  );
};
