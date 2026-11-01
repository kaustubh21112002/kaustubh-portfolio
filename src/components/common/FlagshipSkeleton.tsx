import React from 'react';

export const FlagshipSkeleton: React.FC = () => {
  return (
    <section id="flagship" aria-label="PhonePe Pre-IPO DCF Valuation loading" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0b0d13] text-white border-t border-white/10 min-h-[600px] flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="w-36 h-6 rounded-full bg-white/10" />
          <div className="w-3/4 max-w-lg h-9 rounded-xl bg-white/10" />
          <div className="w-1/2 max-w-md h-5 rounded-lg bg-white/5" />
        </div>

        {/* Card & Controls Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 h-72 rounded-2xl bg-white/5 border border-white/10" />
          <div className="lg:col-span-3 h-72 rounded-2xl bg-white/5 border border-white/10" />
        </div>

        {/* Loading status indicator */}
        <div className="flex items-center justify-center gap-2 pt-4 text-xs font-mono text-white/40">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Loading PhonePe DCF valuation financial engine...</span>
        </div>
      </div>
    </section>
  );
};

