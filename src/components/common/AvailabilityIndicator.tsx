import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, X, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export const AvailabilityIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { availability } = portfolioConfig;

  // Handle click outside to close popover
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const scrollToContact = () => {
    setIsOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Interactive Status Pill Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Availability status: ${availability.badgeText}. Click to view engagement details.`}
        className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 dark:bg-white/10 hover:bg-black/80 dark:hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-emerald-500/40 text-white text-xs font-mono tracking-wide transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
      >
        <span
          className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
          aria-hidden="true"
        />
        <span className="font-semibold text-emerald-300 dark:text-emerald-400">
          {availability.badgeText}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 group-hover:text-white ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Accessible Engagement Details Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
          aria-label="Candidate Availability & Engagement Parameters"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f121a]/98 dark:bg-[#121622]/98 backdrop-blur-xl border border-white/15 text-white p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Engagement Status
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close availability details"
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Body */}
          <div className="py-3.5 space-y-3.5 text-xs font-mono">
            {/* Target Roles */}
            <div>
              <div className="text-[10px] uppercase text-white/50 tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                <Briefcase className="w-3 h-3 text-red-400" />
                <span>Target Specializations</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {availability.targetRoles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/90 text-[11px]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Types */}
            <div>
              <div className="text-[10px] uppercase text-white/50 tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                <Calendar className="w-3 h-3 text-red-400" />
                <span>Engagement Options</span>
              </div>
              <ul className="space-y-1 text-white/80 text-[11px] list-disc list-inside">
                {availability.engagementTypes.map((type) => (
                  <li key={type} className="leading-snug">
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Preferences */}
            <div>
              <div className="text-[10px] uppercase text-white/50 tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Locations</span>
              </div>
              <div className="text-white/80 text-[11px]">
                {availability.locationPreferences.join(' • ')}
              </div>
            </div>

            {/* Governed Confirmation Notice */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-white/60 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Timeline Note:</strong> {availability.earliestStartDate}. {availability.notice}
              </span>
            </div>
          </div>

          {/* Popover Footer CTA */}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={scrollToContact}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-black font-bold text-xs font-mono tracking-wide hover:bg-white/90 transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-[0.99]"
            >
              <span>Initiate Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
