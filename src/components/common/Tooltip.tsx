import React, { useState, useRef, ReactNode, useId } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
  delayMs?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  delayMs = 120,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#141722] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#141722] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#141722] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#141722] border-y-transparent border-l-transparent',
  };

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <span aria-describedby={isVisible ? tooltipId : undefined} className="inline-flex items-center">
        {children}
      </span>

      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1.5 rounded-lg bg-[#141722] border border-white/20 text-white text-[11px] font-mono shadow-2xl backdrop-blur-md pointer-events-none whitespace-normal min-w-[140px] max-w-[260px] text-center leading-snug animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
        >
          {content}
          {/* Directional Arrow Pointer */}
          <span
            aria-hidden="true"
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </span>
      )}
    </span>
  );
};

