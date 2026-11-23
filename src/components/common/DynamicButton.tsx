'use client';

import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export type DynamicButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline';

export interface DynamicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: ReactNode;
  stateKey?: string | number;
  variant?: DynamicButtonVariant;
  width?: 'content' | 'full';
}

const variantStyles: Record<DynamicButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-neutral-200 border-transparent shadow-md',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border-white/10 shadow-sm',
  dark: 'bg-[#141722] text-white/90 hover:bg-[#1a1f30] border-white/15',
  outline: 'bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40',
};

export const DynamicButton = forwardRef<HTMLButtonElement, DynamicButtonProps>(
  function DynamicButton(
    {
      children,
      className = '',
      icon,
      stateKey,
      type = 'button',
      variant = 'primary',
      width = 'content',
      disabled = false,
      ...props
    },
    forwardedRef
  ) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

    useImperativeHandle(forwardedRef, () => buttonRef.current as HTMLButtonElement);

    const shouldMeasure = width === 'content';

    const syncWidth = useCallback(() => {
      const button = buttonRef.current;
      const measure = measureRef.current;

      if (!button || !measure || !shouldMeasure) return;

      const styles = window.getComputedStyle(button);
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight) +
        Number.parseFloat(styles.borderLeftWidth) +
        Number.parseFloat(styles.borderRightWidth);

      const nextWidth = Math.ceil(measure.scrollWidth + horizontalPadding);

      setMeasuredWidth((current) => (current === nextWidth ? current : nextWidth));
    }, [shouldMeasure]);

    useLayoutEffect(() => {
      syncWidth();

      const measure = measureRef.current;
      if (!measure || !shouldMeasure) return;

      const observer = new ResizeObserver(syncWidth);
      observer.observe(measure);
      window.addEventListener('resize', syncWidth);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', syncWidth);
      };
    }, [shouldMeasure, syncWidth, children, icon, stateKey]);

    const activeKey = stateKey ?? children;

    return (
      <button
        {...props}
        ref={buttonRef}
        type={type}
        disabled={disabled}
        style={{
          width: shouldMeasure && measuredWidth ? `${measuredWidth}px` : undefined,
          transition: 'width 240ms cubic-bezier(0.23, 1, 0.32, 1), background-color 150ms ease, transform 150ms ease',
        }}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-mono text-xs font-bold whitespace-nowrap px-4 py-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border ${
          width === 'full' ? 'w-full' : ''
        } ${variantStyles[variant]} ${className}`}
      >
        {/* Visible Content Container */}
        <span
          key={String(activeKey)}
          className="relative inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
        >
          {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
          <span>{children}</span>
        </span>

        {/* Hidden Offscreen Measurement Element */}
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none absolute inline-flex items-center gap-1.5 opacity-0 invisible -z-10"
        >
          {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
          <span>{children}</span>
        </span>
      </button>
    );
  }
);

