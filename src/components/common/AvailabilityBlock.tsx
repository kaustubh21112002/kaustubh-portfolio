import React, { useState } from 'react';
import { Briefcase, MapPin, Laptop, Calendar, Mail, Copy, Check } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export interface AvailabilityBlockProps {
  className?: string;
}

export const AvailabilityBlock: React.FC<AvailabilityBlockProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false);
  const email = portfolioConfig.socials.email;

  // Clearly visible editable placeholders as requested by governance
  const openToRoles = '[ADD VALUE]';
  const preferredLocation = '[ADD VALUE]';
  const workMode = '[ADD VALUE]';
  const startDate = '[ADD VALUE]';

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      aria-label="Candidate Availability & Engagement"
      className={`rounded-2xl bg-black/40 dark:bg-white/[0.03] border border-white/10 p-4 sm:p-5 text-white font-mono text-xs shadow-lg backdrop-blur-md ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
            Recruiter Availability Snapshot
          </span>
        </div>
        <span className="text-[10px] text-white/50 uppercase tracking-widest">
          {portfolioConfig.availability.badgeText || 'Active Status'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Open to roles */}
        <div className="flex items-start gap-2.5">
          <Briefcase className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] text-white/50 uppercase block font-semibold">Open to Roles</span>
            <span className="text-white/90 text-xs font-sans leading-tight block">
              {openToRoles}
            </span>
          </div>
        </div>

        {/* Preferred location */}
        <div className="flex items-start gap-2.5">
          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] text-white/50 uppercase block font-semibold">Preferred Location</span>
            <span className="text-white/90 text-xs font-sans leading-tight block">
              {preferredLocation}
            </span>
          </div>
        </div>

        {/* Work mode */}
        <div className="flex items-start gap-2.5">
          <Laptop className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] text-white/50 uppercase block font-semibold">Work Mode</span>
            <span className="text-white/90 text-xs font-sans leading-tight block">
              {workMode}
            </span>
          </div>
        </div>

        {/* Start date */}
        <div className="flex items-start gap-2.5">
          <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] text-white/50 uppercase block font-semibold">Earliest Start Date</span>
            <span className="text-white/90 text-xs font-sans leading-tight block">
              {startDate}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Contact Bar with mailto & copy */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          aria-label={`Send direct email via mail client to ${email}`}
        >
          <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="underline decoration-white/30 underline-offset-2">{email}</span>
        </a>

        <button
          type="button"
          onClick={handleCopyEmail}
          aria-label={copied ? "Email copied to clipboard" : "Copy email address to clipboard"}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[11px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-white/60" />
              <span>Copy Email</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

