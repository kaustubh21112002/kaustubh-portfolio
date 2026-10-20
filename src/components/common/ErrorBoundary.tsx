import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error internally without exposing sensitive call stacks to visitors
    const isDev = Boolean(
      (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV === 'development'
    );
    if (isDev) {
      console.error('[STRATOS ErrorBoundary] Caught render-phase error:', error, errorInfo);
    } else {
      console.error('[STRATOS ErrorBoundary] Interface rendering failed:', error.message);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#0b0d13] text-white flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest">
                <span>Rendering Recovery</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Interface Encountered an Error
              </h1>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans">
                An unexpected rendering exception interrupted the portfolio display. You can reload the page to restore normal application state.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
