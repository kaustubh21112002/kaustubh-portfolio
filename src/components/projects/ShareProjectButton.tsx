import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { getProjectShareUrl } from './projectNavigation';

export interface ShareProjectButtonProps {
  projectId: string;
  projectTitle: string;
  view?: 'case-study' | 'brief';
  className?: string;
  compact?: boolean;
}

export const ShareProjectButton: React.FC<ShareProjectButtonProps> = ({
  projectId,
  projectTitle,
  view = 'case-study',
  className = '',
  compact = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [fallbackVisible, setFallbackVisible] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const shareUrl = getProjectShareUrl(projectId, view);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      } else {
        // Fallback for older browsers or restricted permissions
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      // If clipboard write is rejected, show fallback indicator
      setFallbackVisible(true);
      setTimeout(() => setFallbackVisible(false), 3000);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy shareable direct link for ${projectTitle}`}
        title={`Copy link to ${projectTitle}`}
        className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
          copied
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/15'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-300">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            <span>{compact ? 'Share' : 'Share Project'}</span>
          </>
        )}
      </button>

      {fallbackVisible && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded bg-black/90 border border-white/20 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-xl z-50"
        >
          Press Ctrl+C to copy URL
        </div>
      )}
    </div>
  );
};

