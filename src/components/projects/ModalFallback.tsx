import React from 'react';

export const ModalFallback: React.FC = () => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading case study workspace"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      {/* Loading Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0b0d13] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 animate-pulse">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-2">
            <div className="w-28 h-5 rounded-full bg-white/10" />
            <div className="w-64 sm:w-96 h-8 rounded-xl bg-white/15" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>

        <div className="space-y-4 pt-4">
          <div className="w-full h-20 rounded-2xl bg-white/5 border border-white/5" />
          <div className="w-full h-40 rounded-2xl bg-white/5 border border-white/5" />
        </div>

        <div className="flex items-center justify-center gap-2 pt-6 text-xs font-mono text-white/50">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Loading interactive case study workspace...</span>
        </div>
      </div>
    </div>
  );
};

