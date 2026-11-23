'use client';

import React, {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Check } from 'lucide-react';

export type ConfirmationInput = 'keyboard' | 'pointer';

export type HoldToConfirmButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'onClick'
> & {
  children?: ReactNode;
  confirmedContent?: ReactNode;
  duration?: number;
  onConfirm: (input: ConfirmationInput) => void;
  resetAfter?: number;
  variant?: 'danger' | 'warning' | 'primary' | 'subtle';
};

type HoldStatus = 'confirmed' | 'holding' | 'idle';

const variantClasses = {
  danger: {
    base: 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 focus-visible:ring-rose-500',
    overlay: 'bg-rose-600 text-white',
    confirmed: 'bg-rose-600 text-white border-rose-500',
  },
  warning: {
    base: 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 focus-visible:ring-amber-500',
    overlay: 'bg-amber-600 text-white',
    confirmed: 'bg-amber-600 text-white border-amber-500',
  },
  primary: {
    base: 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 focus-visible:ring-red-500',
    overlay: 'bg-red-600 text-white',
    confirmed: 'bg-red-600 text-white border-red-500',
  },
  subtle: {
    base: 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/40',
    overlay: 'bg-white text-black',
    confirmed: 'bg-white text-black border-white',
  },
};

export const HoldToConfirmButton: React.FC<HoldToConfirmButtonProps> = ({
  children = 'Hold to confirm',
  className = '',
  confirmedContent,
  disabled = false,
  duration = 1400,
  onConfirm,
  resetAfter = 1800,
  variant = 'danger',
  ...buttonProps
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const inputModeRef = useRef<ConfirmationInput>('pointer');
  const isHoldingRef = useRef(false);
  const [inputMode, setInputMode] = useState<ConfirmationInput | null>(null);
  const [status, setStatus] = useState<HoldStatus>('idle');

  // Check prefers-reduced-motion
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const clearConfirmTimer = useCallback(() => {
    if (confirmTimerRef.current !== null) {
      window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
  }, []);

  const completeHold = useCallback(() => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    activePointerIdRef.current = null;
    clearConfirmTimer();
    setStatus('confirmed');
    onConfirm(inputModeRef.current);

    if (resetAfter > 0) {
      resetTimerRef.current = window.setTimeout(() => {
        setStatus('idle');
        resetTimerRef.current = null;
      }, resetAfter);
    }
  }, [clearConfirmTimer, onConfirm, resetAfter]);

  const cancelHold = useCallback(() => {
    if (!isHoldingRef.current) return;

    isHoldingRef.current = false;
    activePointerIdRef.current = null;
    clearConfirmTimer();
    setStatus('idle');
  }, [clearConfirmTimer]);

  const startHold = useCallback(
    (input: ConfirmationInput) => {
      if (disabled || status === 'confirmed' || isHoldingRef.current) return;

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      inputModeRef.current = input;
      setInputMode(input);
      isHoldingRef.current = true;
      setStatus('holding');
      confirmTimerRef.current = window.setTimeout(completeHold, duration);
    },
    [completeHold, disabled, duration, status]
  );

  useEffect(() => {
    return () => {
      clearConfirmTimer();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, [clearConfirmTimer]);

  useEffect(() => {
    if (disabled) {
      cancelHold();
    }
  }, [cancelHold, disabled]);

  function releasePointerCapture(pointerId: number) {
    const button = buttonRef.current;
    if (button?.hasPointerCapture(pointerId)) {
      try {
        button.releasePointerCapture(pointerId);
      } catch {
        // Safe release
      }
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || disabled) return;

    activePointerIdRef.current = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture errors on unsupported touch
    }
    startHold('pointer');
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!isHoldingRef.current || activePointerIdRef.current !== event.pointerId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const boundaryPadding = 8;
    const isOutside =
      event.clientX < rect.left - boundaryPadding ||
      event.clientX > rect.right + boundaryPadding ||
      event.clientY < rect.top - boundaryPadding ||
      event.clientY > rect.bottom + boundaryPadding;

    if (isOutside) {
      cancelHold();
      releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (activePointerIdRef.current !== event.pointerId) return;
    cancelHold();
    releasePointerCapture(event.pointerId);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    startHold('keyboard');
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    cancelHold();
  }

  const isConfirmed = status === 'confirmed';
  const isHolding = status === 'holding';
  const styling = variantClasses[variant];

  const overlayStyle: React.CSSProperties = {
    clipPath: isHolding ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
    transitionDuration:
      shouldReduceMotion || inputMode === 'keyboard'
        ? '0ms'
        : isHolding
        ? `${duration}ms`
        : '180ms',
    transitionProperty: 'clip-path',
    transitionTimingFunction: isHolding ? 'linear' : 'cubic-bezier(0.23, 1, 0.32, 1)',
  };

  return (
    <button
      {...buttonProps}
      aria-busy={isHolding}
      className={`relative isolate inline-flex h-8 sm:h-9 min-w-32 touch-none cursor-pointer select-none items-center justify-center overflow-hidden rounded-xl border px-3.5 font-mono text-xs font-semibold outline-none transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d13] ${
        isConfirmed ? styling.confirmed : styling.base
      } ${className}`}
      data-input={inputMode}
      disabled={disabled}
      onBlur={cancelHold}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onLostPointerCapture={cancelHold}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      ref={buttonRef}
      type="button"
    >
      {isConfirmed ? (
        <span className="relative flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
          {confirmedContent ?? (
            <>
              <Check className="w-3.5 h-3.5 text-current stroke-[3]" />
              <span>Confirmed</span>
            </>
          )}
        </span>
      ) : (
        <>
          <span className="relative flex items-center justify-center gap-1.5 z-10">
            {children}
          </span>
          <span
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center gap-1.5 px-3.5 ${styling.overlay} font-bold z-20 pointer-events-none`}
            style={overlayStyle}
          >
            {children}
          </span>
        </>
      )}
    </button>
  );
};

