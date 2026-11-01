import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Send, Check, AlertCircle } from 'lucide-react';

const SESSION_KEY = 'portfolio_feedback_submitted';

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPreviouslySubmitted, setHasPreviouslySubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored === 'true') {
        setHasPreviouslySubmitted(true);
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          honeypot
        })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus('success');
        try {
          sessionStorage.setItem(SESSION_KEY, 'true');
        } catch {
          // Ignore storage errors
        }
        setTimeout(() => {
          setIsOpen(false);
          setHasPreviouslySubmitted(true);
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(data?.message || 'Unable to submit feedback at this time.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error occurred. Please try again.');
    }
  };

  if (hasPreviouslySubmitted && !isOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Visitor feedback widget"
      className="fixed bottom-6 right-6 z-40 font-sans print:hidden select-none"
    >
      {/* Closed State Floating Trigger Tab */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Was this portfolio useful? Give quick feedback"
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#141722]/95 hover:bg-[#1b2030] border border-white/15 hover:border-white/30 text-white shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-medium text-white/90">Feedback</span>
        </button>
      )}

      {/* Open State Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="feedback-dialog-title"
          className="w-80 max-w-[calc(100vw-2rem)] p-5 rounded-2xl bg-[#141722] border border-white/15 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-400" />
              <h3 id="feedback-dialog-title" className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Visitor Feedback
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback panel"
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {status === 'success' ? (
            <div role="status" className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <Check className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-mono font-semibold">Thank you for your feedback!</p>
              <p className="text-[11px] text-white/70">Your response has been securely delivered.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam honeypot trap */}
              <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                <input
                  type="text"
                  name="feedback_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <p className="text-xs text-white/90 mb-2 font-medium">Was this portfolio useful?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRating('up')}
                    aria-pressed={rating === 'up'}
                    className={`min-h-[40px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      rating === 'up'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${rating === 'up' ? 'text-emerald-400' : ''}`} />
                    <span>Yes, useful</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRating('down')}
                    aria-pressed={rating === 'down'}
                    className={`min-h-[40px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      rating === 'down'
                        ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400`}
                  >
                    <ThumbsDown className={`w-3.5 h-3.5 ${rating === 'down' ? 'text-red-400' : ''}`} />
                    <span>Needs work</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="feedback-comment" className="text-[11px] font-mono text-white/60">
                    Optional notes (max 500 chars):
                  </label>
                  <span className={`text-[10px] font-mono ${comment.length > 500 ? 'text-red-400' : 'text-white/40'}`}>
                    {comment.length}/500
                  </span>
                </div>
                <textarea
                  id="feedback-comment"
                  rows={3}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was most or least relevant for your review?"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/40 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none font-sans"
                />
              </div>

              {errorMessage && (
                <div role="alert" className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!rating || status === 'submitting'}
                className={`w-full min-h-[40px] flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                  !rating || status === 'submitting'
                    ? 'bg-white/10 text-white/40 border border-white/5 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90 shadow-md cursor-pointer active:scale-95'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400`}
              >
                <span>{status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </aside>
  );
};
