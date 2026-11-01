import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { FlagshipSkeleton } from './FlagshipSkeleton';

const FlagshipPhonePe = lazy(() =>
  import('../flagship/FlagshipPhonePe').then((m) => ({ default: m.FlagshipPhonePe }))
);

export const DeferredFlagshipPhonePe: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Immediate load if URL targets flagship directly
    const searchTarget = new URLSearchParams(window.location.search).get('section');
    const projectTarget = new URLSearchParams(window.location.search).get('project');
    const hashTarget = window.location.hash.replace('#', '');
    return (
      searchTarget === 'flagship' ||
      hashTarget === 'flagship' ||
      projectTarget === 'phonepe-valuation'
    );
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldLoad) return;

    // IntersectionObserver with generous 400px margin before reaching section
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first && first.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: '400px 0px' }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      setShouldLoad(true);
    }
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Suspense fallback={<FlagshipSkeleton />}>
          <FlagshipPhonePe />
        </Suspense>
      ) : (
        <FlagshipSkeleton />
      )}
    </div>
  );
};
