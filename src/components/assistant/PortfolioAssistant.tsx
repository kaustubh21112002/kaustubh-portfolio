import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, AlertCircle, Sparkles } from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sourceSection?: string;
  isError?: boolean;
}

interface AssistantApiResponse {
  success: boolean;
  code: string;
  message: string;
  answer?: string;
  sourceSection?: string;
}

const SUGGESTED_QUESTIONS = [
  'What is EquiTrack?',
  'Which tools do you use?',
  'Are you open to roles?'
];

export const PortfolioAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSessionDisabled, setIsSessionDisabled] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages container
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus management on open/close
  useEffect(() => {
    if (isOpen) {
      // Focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      // Clear in-memory conversation on close as mandated
      setMessages([]);
      setInputQuestion('');
      setErrorMessage(null);
      setIsLoading(false);
      // Return focus to launcher
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  // Trap focus within open panel and handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const submitQuestion = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 300) {
      setErrorMessage('Please shorten your question to under 300 characters.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: trimmed })
      });

      const data: AssistantApiResponse = await res.json().catch(() => ({
        success: false,
        code: 'PARSE_ERROR',
        message: 'The assistant is temporarily unavailable. Please use portfolio search or email instead.'
      }));

      // Handle 503 AI_DISABLED -> Hide widget for remainder of page session
      if (res.status === 503 && data.code === 'AI_DISABLED') {
        setIsSessionDisabled(true);
        setIsOpen(false);
        return;
      }

      if (res.ok && data.success && data.answer) {
        const assistantMessage: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          sourceSection: data.sourceSection
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Map error states safely
        let friendlyErr = data.message || 'The assistant is temporarily unavailable. Please use portfolio search or email instead.';
        if (res.status === 429) {
          if (data.code === 'DAILY_CAP_REACHED') {
            friendlyErr = 'Assistant is resting. Please use search or email.';
          } else {
            friendlyErr = "You've reached the question limit for now. Please use portfolio search or email.";
          }
        } else if (res.status === 400) {
          friendlyErr = 'Please enter a valid question under 300 characters.';
        } else if (res.status === 502) {
          friendlyErr = 'The assistant is temporarily unavailable. Please use portfolio search or email instead.';
        }

        const errorMsgItem: ChatMessageItem = {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: friendlyErr,
          isError: true
        };
        setMessages((prev) => [...prev, errorMsgItem]);
      }
    } catch (_err) {
      const errorMsgItem: ChatMessageItem = {
        id: `network-err-${Date.now()}`,
        sender: 'assistant',
        text: 'The assistant is temporarily unavailable. Please use portfolio search or email instead.',
        isError: true
      };
      setMessages((prev) => [...prev, errorMsgItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion(inputQuestion);
  };

  // If disabled by kill switch during this page session, hide entirely
  if (isSessionDisabled) {
    return null;
  }

  return (
    <aside
      aria-label="Portfolio AI assistant"
      className="fixed bottom-6 left-6 z-40 font-sans print:hidden select-none"
    >
      {/* Closed State Floating Launcher Button */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Ask about my work"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141722]/95 hover:bg-[#1c2130] border border-white/15 hover:border-white/30 text-white shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-95"
        >
          <Bot className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-medium text-white/95">Ask about my work</span>
        </button>
      )}

      {/* Open State Conversational Panel */}
      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-panel-title"
          className="w-84 sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl bg-[#141722] border border-white/15 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 id="assistant-panel-title" className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Portfolio Assistant
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono block">Portfolio-Only Intelligence</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant panel"
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mandatory Disclaimer Notice */}
          <div className="px-4 py-2 bg-blue-500/5 border-b border-blue-500/10 text-[11px] text-white/70 leading-relaxed shrink-0">
            AI assistant. Answers from this portfolio only. It can make mistakes, so check key facts.
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-white/80">
                  Ask me about Kaustubh&apos;s financial models, decision frameworks, data governance, or project deliverables:
                </p>

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Suggested Questions
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((questionText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isLoading}
                        onClick={() => submitQuestion(questionText)}
                        className="text-left text-xs px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/30 text-white/90 hover:text-white transition-all flex items-center justify-between group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 disabled:opacity-50"
                      >
                        <span>{questionText}</span>
                        <Sparkles className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed break-words ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : msg.isError
                        ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-bl-xs'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sourceSection && (
                    <span className="text-[10px] font-mono text-white/40 mt-1 px-1">
                      Source: {msg.sourceSection}
                    </span>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-white/50 text-xs font-mono p-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Reading portfolio context...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div role="alert" className="mx-4 mb-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-2 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Input Footer */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-white/10 shrink-0 bg-[#0e1017]/50 rounded-b-2xl">
            <div className="relative flex items-center">
              <label htmlFor="assistant-input-question" className="sr-only">
                Ask a question about this portfolio
              </label>
              <input
                ref={inputRef}
                id="assistant-input-question"
                type="text"
                maxLength={300}
                placeholder="Ask about my work (max 300 chars)..."
                value={inputQuestion}
                disabled={isLoading}
                onChange={(e) => setInputQuestion(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400 focus:bg-black/40 text-xs text-white placeholder-white/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isLoading}
                aria-label="Send question to AI assistant"
                className={`absolute right-1.5 p-1.5 rounded-lg text-white transition-all ${
                  !inputQuestion.trim() || isLoading
                    ? 'text-white/20 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer active:scale-95'
                } focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

