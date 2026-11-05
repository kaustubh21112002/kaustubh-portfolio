import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  Lock,
  RefreshCw,
  Eye,
  FileDown,
  MessageCircle,
  Mail,
  Send,
  AlertTriangle,
  Database,
  Calendar,
  Layers,
  CheckCircle2,
  HelpCircle,
  Info
} from 'lucide-react';
import { AnalyticsStorageSummary, DailyAggregateMetrics } from '../../../api/lib/analyticsStorage';

interface PortfolioIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioIntelligenceModal: React.FC<PortfolioIntelligenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalyticsStorageSummary | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      // Clean auth token and state on close so key is never held in background
      setAuthToken('');
      setIsAuthenticated(false);
      setSummary(null);
    }
  }, [isOpen]);

  // Fetch telemetry from serverless stats endpoint with Bearer auth
  const fetchTelemetry = async (tokenToUse?: string) => {
    const key = tokenToUse || authToken;
    if (!key.trim()) {
      setErrorMessage('Please enter an authorized Bearer token.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analytics/stats', {
        headers: {
          Authorization: `Bearer ${key.trim()}`
        }
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage('401 Unauthorized: Invalid or rejected Bearer key.');
        return;
      }

      if (res.status === 503 || data?.code === 'AUTH_UNCONFIGURED') {
        setIsAuthenticated(false);
        setErrorMessage(
          '503 Locked: PORTFOLIO_INTELLIGENCE_KEY is unconfigured in the server environment. Access remains securely locked.'
        );
        return;
      }

      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        setSummary(data.data);
      } else {
        setErrorMessage(data?.message || 'Failed to fetch telemetry summary.');
      }
    } catch {
      setErrorMessage('Network error communicating with /api/analytics/stats.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTelemetry();
  };

  if (!isOpen) return null;

  // Transient diagnostic count from current container memory
  const diagnosticEventsCount = summary?.totalEventsIngestedInSession ?? 0;
  const isDurableConfigured = summary?.isPersistent ?? false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intelligence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0e1017] border border-white/15 text-white shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Portfolio Intelligence OS • Private Telemetry</span>
            </div>
            <h2 id="intelligence-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Visitor Intelligence & Engagement Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-sans">
              First-party, privacy-governed engagement tracking and operational analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Portfolio Intelligence Dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!isAuthenticated ? (
            /* AUTHENTICATION GATE */
            <div className="max-w-md mx-auto py-12 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Restricted Operational Telemetry</h3>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  Portfolio Intelligence is accessible only with an authorized server-side Bearer token.
                  Access is governed and never accessible via query-string leaks.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Enter Bearer Access Key..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-blue-400 text-sm text-white placeholder-white/40 font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
                />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono text-left flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !authToken.trim()}
                  className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs tracking-wide transition-all ${
                    isLoading || !authToken.trim()
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/90 shadow-md active:scale-95 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Verifying Authorization...' : 'Unlock Telemetry'}
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div className="space-y-6">
              {/* Storage & Persistence Status Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-3 text-xs font-mono">
                <Database className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <div className="font-bold uppercase tracking-wider text-amber-300">
                    Durable Storage: {summary?.status || 'UNCONFIGURED_STORAGE'} (UNAVAILABLE)
                  </div>
                  <p className="text-white/80 font-sans text-xs">
                    Durable database storage is currently unconfigured. Historical analytics, unique visitor counts,
                    retention curves, and persistent totals are unavailable. No historical data has been fabricated.
                  </p>
                </div>
              </div>

              {/* SECTION A: PERSISTENT KPI STATUS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50">
                    A. Governed Historical Metrics (Persistent Database Required)
                  </h3>
                  <button
                    type="button"
                    onClick={() => fetchTelemetry()}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Total Visitors</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Page Views</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Project Views</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Resume DL Intent</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">WhatsApp Clicks</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Email Clicks</span>
                    <span className="text-base font-bold text-amber-400/90 mt-1 block">Unavailable</span>
                    <span className="text-[9px] text-white/40 block mt-0.5">Durable DB needed</span>
                  </div>
                </div>
              </div>

              {/* SECTION B: TRANSIENT INSTANCE-LOCAL DIAGNOSTIC BUFFER */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>B. Container Diagnostic Telemetry (Ephemeral & Instance-Local Only)</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {diagnosticEventsCount} events in memory (max 500)
                  </span>
                </div>

                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  The table below displays non-persistent diagnostic observations captured inside the currently active
                  warm serverless execution container. These records reset on container restart and do not constitute
                  authoritative historical trend data.
                </p>

                {summary?.dailyAggregates.length === 0 ? (
                  <div className="py-6 text-center text-xs font-mono text-white/40">
                    No diagnostic events currently observed in this warm container.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          <th className="pb-2">Date (UTC)</th>
                          <th className="pb-2">Transient Views</th>
                          <th className="pb-2">Project Clicks</th>
                          <th className="pb-2">Resume Clicks</th>
                          <th className="pb-2">WA Clicks</th>
                          <th className="pb-2">Email Clicks</th>
                          <th className="pb-2">Job Match Runs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {summary?.dailyAggregates.map((d) => (
                          <tr key={d.date} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 font-bold text-white">{d.date}</td>
                            <td className="py-2.5">{d.pageViews}</td>
                            <td className="py-2.5">{d.projectViews}</td>
                            <td className="py-2.5 text-emerald-400">{d.resumeDownloads}</td>
                            <td className="py-2.5 text-emerald-400">{d.whatsappClicks}</td>
                            <td className="py-2.5">{d.emailClicks}</td>
                            <td className="py-2.5 text-purple-400">{d.jobMatchUses}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION C & D: PRIVACY DISCLOSURE & GOOGLE SHEETS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Privacy & Transient IP Processing Disclosure */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy & Transient IP Processing</span>
                  </h3>
                  <div className="space-y-2 text-xs font-sans text-white/70">
                    <p>
                      <strong>Transient IP Processing:</strong> Client IP addresses are extracted in-memory solely for
                      abuse prevention and sliding-window rate limiting (60 req/min). IPs are never logged, stored in
                      databases, or associated with visitor records.
                    </p>
                    <p>
                      <strong>No Cookies or Fingerprints:</strong> No cookies, localStorage IDs, canvas hashes, or
                      IP+UA fingerprint hashes are generated or retained.
                    </p>
                    <p>
                      <strong>Event-Level Truthfulness:</strong> Clicks indicate user engagement intent. They do not
                      certify completed conversations, delivered emails, or completed file transfers.
                    </p>
                    <p>
                      <strong>Zero Content Ingestion:</strong> Job description text and contact form messages are strictly
                      excluded from analytics events.
                    </p>
                  </div>
                </div>

                {/* Google Sheets Sync Integration Status */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google Sheets Daily Sync</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono text-white/70">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Sync Adapter:</span>
                      <span className="text-emerald-400 font-bold">READY (Boundary Validated)</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Credentials:</span>
                      <span className="text-amber-400">STANDBY_UNCONFIGURED</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Row Schema:</span>
                      <span className="text-white/60">9 Columns (Governed Daily)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Unique Visitors:</span>
                      <span className="text-amber-300">Explicitly N/A (Cookieless)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
