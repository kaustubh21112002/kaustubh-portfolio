import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  X,
  Lock,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Smartphone,
  Globe2,
  BarChart3,
  TrendingUp,
  Info
} from 'lucide-react';
import { AnalyticsStorageSummary, DailyAggregateMetrics } from '../../../server/lib/analyticsStorage';

interface PortfolioIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Canonical mapping of project IDs to human-readable portfolio titles
const CANONICAL_PROJECT_TITLES: Record<string, string> = {
  'phonepe-valuation': 'PhonePe Pre-IPO Equity Research & Valuation',
  'stratos-governance': 'STRATOS AI | Controlled Business Analytics & KPI Governance',
  'spiideo-sports-analytics': 'Sports Match Event Tracking & Video Analytics',
  'it-support-analytics': 'IT Support Service Intelligence & Resolution Prediction',
  'smartbank-360': 'SmartBank 360 – FinTech Business Model Credibility Report',
  'equitrack-analytics-os': 'EquiTrack Analytics OS — Financial News Intelligence & Data Governance'
};

/**
 * Returns the last N calendar dates in YYYY-MM-DD UTC format, ending today.
 */
function getUtcCalendarDateRange(daysCount: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    dates.push(d.toISOString().slice(0, 10));
  }
  
  return dates;
}

export const PortfolioIntelligenceModal: React.FC<PortfolioIntelligenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalyticsStorageSummary | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setPassphrase('');
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch telemetry from authenticated dashboard endpoint
  const fetchTelemetry = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analytics/dashboard/stats', {
        credentials: 'include'
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setIsAuthenticated(false);
        setErrorMessage('401 Unauthorized: Valid authentication session required.');
        return;
      }

      if (res.status === 503 || data?.code === 'STORAGE_UNAVAILABLE') {
        setIsAuthenticated(true);
        setErrorMessage('Notice: Durable PostgreSQL storage is currently unreachable.');
        return;
      }

      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        setSummary(data.data);
      } else {
        setErrorMessage(data?.message || 'Failed to fetch telemetry summary.');
      }
    } catch {
      setErrorMessage('Network error communicating with /api/analytics/dashboard/stats.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      setErrorMessage('Please enter the administrator passphrase.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analytics/dashboard/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ passphrase: passphrase.trim() })
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setErrorMessage('401 Unauthorized: Invalid administrator credentials.');
        return;
      }

      if (res.status === 403) {
        setErrorMessage('403 Forbidden: Request origin is not permitted.');
        return;
      }

      if (res.status === 503 || data?.code === 'AUTH_UNCONFIGURED') {
        setErrorMessage('503 Locked: ANALYTICS_ADMIN_HASH is unconfigured in the server environment.');
        return;
      }

      if (res.ok && data?.success) {
        setPassphrase('');
        await fetchTelemetry();
      } else {
        setErrorMessage(data?.message || 'Authentication failed.');
      }
    } catch {
      setErrorMessage('Network error during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/analytics/dashboard/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setIsAuthenticated(false);
      setSummary(null);
      setPassphrase('');
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // UTC Date-Window Filtering & Safe Multi-Day Aggregation
  // -------------------------------------------------------------
  const {
    filteredDailyRows,
    kpiTotals,
    projectPopularityList,
    deviceBreakdownList,
    referrerBreakdownList,
    totalProjectViewsSum
  } = useMemo(() => {
    const dailyRecords: DailyAggregateMetrics[] = summary?.dailyAggregates || [];
    const daysCount = timeRange === '7d' ? 7 : 30;
    const targetUtcDates = getUtcCalendarDateRange(daysCount);
    const dateSet = new Set(targetUtcDates);

    // Map existing records by YYYY-MM-DD
    const recordMap = new Map<string, DailyAggregateMetrics>();
    for (const r of dailyRecords) {
      if (r?.date) {
        recordMap.set(r.date, r);
      }
    }

    // Filter to selected UTC date window
    const filteredRows: DailyAggregateMetrics[] = [];
    for (const d of targetUtcDates) {
      const match = recordMap.get(d);
      if (match) {
        filteredRows.push(match);
      } else {
        // Zero-fill missing calendar dates so time sequence remains consistent
        filteredRows.push({
          date: d,
          pageViews: 0,
          projectViews: 0,
          resumeDownloads: 0,
          contactClicks: 0,
          whatsappClicks: 0,
          emailClicks: 0,
          jobMatchUses: 0,
          topProjects: [],
          referrers: {},
          devices: {}
        });
      }
    }

    // Sort descending by date for display
    filteredRows.sort((a, b) => b.date.localeCompare(a.date));

    // Aggregate totals across the filtered window
    let pageViews = 0;
    let projectViews = 0;
    let resumeDownloads = 0;
    let contactClicks = 0;
    let whatsappClicks = 0;
    let emailClicks = 0;
    let jobMatchUses = 0;

    const projectCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};

    for (const row of filteredRows) {
      pageViews += Number(row.pageViews) || 0;
      projectViews += Number(row.projectViews) || 0;
      resumeDownloads += Number(row.resumeDownloads) || 0;
      contactClicks += Number(row.contactClicks) || 0;
      whatsappClicks += Number(row.whatsappClicks) || 0;
      emailClicks += Number(row.emailClicks) || 0;
      jobMatchUses += Number(row.jobMatchUses) || 0;

      // Safe project counts aggregation
      if (Array.isArray(row.topProjects)) {
        for (const p of row.topProjects) {
          if (p?.projectId) {
            projectCounts[p.projectId] = (projectCounts[p.projectId] || 0) + (Number(p.count) || 0);
          }
        }
      }

      // Safe devices aggregation
      if (row.devices && typeof row.devices === 'object') {
        for (const [devKey, devVal] of Object.entries(row.devices)) {
          deviceCounts[devKey] = (deviceCounts[devKey] || 0) + (Number(devVal) || 0);
        }
      }

      // Safe referrers aggregation
      if (row.referrers && typeof row.referrers === 'object') {
        for (const [refKey, refVal] of Object.entries(row.referrers)) {
          referrerCounts[refKey] = (referrerCounts[refKey] || 0) + (Number(refVal) || 0);
        }
      }
    }

    // Build sorted project list
    const projectList = Object.entries(projectCounts)
      .map(([id, count]) => ({
        id,
        title: CANONICAL_PROJECT_TITLES[id] || `Unspecified Project: ${id}`,
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Build device list (ensure standard categories are present)
    const standardDevices = ['desktop', 'mobile', 'tablet'];
    const allDeviceKeys = Array.from(new Set([...standardDevices, ...Object.keys(deviceCounts)]));
    const deviceList = allDeviceKeys.map((key) => ({
      category: key,
      count: deviceCounts[key] || 0
    }));

    // Build referrer list (ensure standard categories are present)
    const standardReferrers = ['direct', 'search', 'social', 'internal', 'other'];
    const allRefKeys = Array.from(new Set([...standardReferrers, ...Object.keys(referrerCounts)]));
    const referrerList = allRefKeys.map((key) => ({
      category: key,
      count: referrerCounts[key] || 0
    }));

    return {
      filteredDailyRows: filteredRows,
      kpiTotals: {
        pageViews,
        projectViews,
        resumeDownloads,
        contactClicks,
        whatsappClicks,
        emailClicks,
        jobMatchUses
      },
      projectPopularityList: projectList,
      deviceBreakdownList: deviceList,
      referrerBreakdownList: referrerList,
      totalProjectViewsSum: projectViews
    };
  }, [summary, timeRange]);

  if (!isOpen) return null;

  const storageStatus = summary?.status || 'UNCONFIGURED_STORAGE';
  const isDurable = summary?.isPersistent ?? false;

  // Rate calculations guarded against zero denominators
  const resumeDownloadRate =
    kpiTotals.pageViews > 0
      ? ((kpiTotals.resumeDownloads / kpiTotals.pageViews) * 100).toFixed(1)
      : '0.0';

  const totalDeviceEvents = deviceBreakdownList.reduce((acc, d) => acc + d.count, 0);
  const totalReferrerEvents = referrerBreakdownList.reduce((acc, r) => acc + r.count, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intelligence-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md overflow-y-auto pointer-events-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0e1017] border border-white/15 text-white shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
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
              First-party, privacy-governed engagement tracking and decision telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Revoke session and logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Portfolio Intelligence Dashboard"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                <h3 className="text-lg font-bold text-white">Protected Operator Session</h3>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  Enter the administrative passphrase to authenticate. Sessions are secured via stateful, HttpOnly,
                  SameSite=Strict cookies isolated to the dashboard namespace.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter administrator passphrase..."
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
                  disabled={isLoading || !passphrase.trim()}
                  className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs tracking-wide transition-all ${
                    isLoading || !passphrase.trim()
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/90 shadow-md active:scale-95 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Verifying Credentials...' : 'Unlock Telemetry'}
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div className="space-y-6">
              {/* Storage & Persistence Status Banner */}
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-mono ${
                  isDurable
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                }`}
              >
                <Database className={`w-4 h-4 shrink-0 mt-0.5 ${isDurable ? 'text-emerald-400' : 'text-amber-400'}`} />
                <div className="space-y-1">
                  <div className="font-bold uppercase tracking-wider">
                    Durable Storage: {storageStatus} {isDurable ? '(OPERATIONAL)' : '(UNAVAILABLE)'}
                  </div>
                  <p className="text-white/80 font-sans text-xs">
                    {summary?.persistenceNotice ||
                      'Persistent database storage is unconfigured. Historical analytics and persistent rollups are unavailable.'}
                  </p>
                </div>
              </div>

              {/* CONTROLS HEADER: Date Range Selector + Refresh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Window (UTC):</span>
                  </span>
                  <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setTimeRange('7d')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeRange === '7d'
                          ? 'bg-blue-500 text-white font-bold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      7D
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeRange('30d')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeRange === '30d'
                          ? 'bg-blue-500 text-white font-bold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      30D
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/40">
                    {timeRange === '7d' ? 'Last 7 UTC Days' : 'Last 30 UTC Days'}
                  </span>
                  <button
                    type="button"
                    onClick={() => fetchTelemetry()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* SECTION A: EXECUTIVE KPI SNAPSHOT */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>A. Executive KPI Snapshot ({timeRange.toUpperCase()})</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
                  {/* Card 1: Page Views */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block">Page Views</span>
                      <span className="text-xl font-bold text-white mt-1 block">
                        {isDurable ? kpiTotals.pageViews : 'Unavailable'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-2">Page-view events</span>
                  </div>

                  {/* Card 2: Project Views */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block">Project Views</span>
                      <span className="text-xl font-bold text-white mt-1 block">
                        {isDurable ? kpiTotals.projectViews : 'Unavailable'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-2">Case study opens</span>
                  </div>

                  {/* Card 3: Resume DL Intent */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 uppercase block">Resume Clicks</span>
                        {isDurable && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            {resumeDownloadRate}%
                          </span>
                        )}
                      </div>
                      <span className="text-xl font-bold text-emerald-400 mt-1 block">
                        {isDurable ? kpiTotals.resumeDownloads : 'Unavailable'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-2">per 100 page-view events</span>
                  </div>

                  {/* Card 4: WhatsApp Clicks */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block">WhatsApp Clicks</span>
                      <span className="text-xl font-bold text-emerald-400 mt-1 block">
                        {isDurable ? kpiTotals.whatsappClicks : 'Unavailable'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-2">Direct chat link clicks</span>
                  </div>

                  {/* Card 5: Email Clicks */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block">Email Clicks</span>
                      <span className="text-xl font-bold text-blue-300 mt-1 block">
                        {isDurable ? kpiTotals.emailClicks : 'Unavailable'}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-2">Mailto / copy actions</span>
                  </div>
                </div>
              </div>

              {/* SECTION B: PROJECT POPULARITY */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>B. Project Popularity ({timeRange.toUpperCase()})</span>
                  </h3>
                  <span className="text-[11px] font-mono text-white/40">
                    {totalProjectViewsSum} Total Case Study Views
                  </span>
                </div>

                {!isDurable ? (
                  <div className="py-6 text-center text-xs font-mono text-white/40">
                    Durable storage unconfigured. Project breakdown telemetry unavailable.
                  </div>
                ) : projectPopularityList.length === 0 ? (
                  <div className="py-6 text-center text-xs font-mono text-white/40">
                    No project view events recorded in the selected {timeRange.toUpperCase()} window.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    {projectPopularityList.map((project) => {
                      const sharePercent =
                        totalProjectViewsSum > 0
                          ? ((project.count / totalProjectViewsSum) * 100).toFixed(1)
                          : '0.0';

                      return (
                        <div key={project.id} className="space-y-1.5">
                          <div className="flex items-baseline justify-between text-xs gap-3">
                            <span className="font-sans text-white/90 font-medium truncate">
                              {project.title}
                            </span>
                            <div className="flex items-center gap-2 shrink-0 text-white/60">
                              <span className="font-bold text-white">{project.count}</span>
                              <span className="text-[11px] text-blue-400 w-12 text-right">
                                {sharePercent}%
                              </span>
                            </div>
                          </div>
                          {/* Proportional Bar */}
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(0, Number(sharePercent)))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION C: AUDIENCE CONTEXT (DEVICES & REFERRERS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Device Breakdown */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Device Category</span>
                    </h3>
                    <span className="text-[11px] font-mono text-white/40">
                      {totalDeviceEvents} Events
                    </span>
                  </div>

                  {!isDurable || totalDeviceEvents === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-white/40">
                      No device telemetry recorded in this period.
                    </div>
                  ) : (
                    <div className="space-y-2.5 font-mono text-xs">
                      {deviceBreakdownList.map((d) => {
                        const pct =
                          totalDeviceEvents > 0
                            ? ((d.count / totalDeviceEvents) * 100).toFixed(1)
                            : '0.0';

                        return (
                          <div key={d.category} className="space-y-1">
                            <div className="flex items-center justify-between text-white/80">
                              <span className="capitalize">{d.category}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{d.count}</span>
                                <span className="text-[11px] text-white/40 w-10 text-right">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-400/80 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Referrer Categories */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Referrer Category</span>
                    </h3>
                    <span className="text-[11px] font-mono text-white/40">
                      {totalReferrerEvents} Events
                    </span>
                  </div>

                  {!isDurable || totalReferrerEvents === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-white/40">
                      No referrer telemetry recorded in this period.
                    </div>
                  ) : (
                    <div className="space-y-2.5 font-mono text-xs">
                      {referrerBreakdownList.map((r) => {
                        const pct =
                          totalReferrerEvents > 0
                            ? ((r.count / totalReferrerEvents) * 100).toFixed(1)
                            : '0.0';

                        return (
                          <div key={r.category} className="space-y-1">
                            <div className="flex items-center justify-between text-white/80">
                              <span className="capitalize">{r.category}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{r.count}</span>
                                <span className="text-[11px] text-white/40 w-10 text-right">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-400/80 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-[10px] text-white/40 font-sans pt-1 border-t border-white/5">
                    Categorized into coarse buckets via privacy-safe document.referrer rules.
                  </p>
                </div>
              </div>

              {/* SECTION D: DAILY ROLLUPS TABLE */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>D. Daily Activity Sequence ({filteredDailyRows.length} Days)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-white/40">UTC Calendar Date</span>
                </div>

                {!isDurable ? (
                  <div className="py-6 text-center text-xs font-mono text-white/40">
                    Durable storage unconfigured. Historical records unavailable.
                  </div>
                ) : filteredDailyRows.length === 0 ? (
                  <div className="py-6 text-center text-xs font-mono text-white/40">
                    No daily summaries recorded in the selected window.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          <th className="pb-2">Date (UTC)</th>
                          <th className="pb-2">Views</th>
                          <th className="pb-2">Project Views</th>
                          <th className="pb-2">Resume DL</th>
                          <th className="pb-2">WA Clicks</th>
                          <th className="pb-2">Email Clicks</th>
                          <th className="pb-2">Job Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredDailyRows.map((d) => (
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

              {/* PRIVACY DISCLOSURE & SHEETS SYNC STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy & Cookieless Architecture</span>
                  </h3>
                  <div className="space-y-2 text-xs font-sans text-white/70">
                    <p>
                      <strong>Visitor Telemetry:</strong> Public beacon ingestion is completely cookieless. No tracking
                      cookies, localStorage identifiers, canvas hashes, or IP+UA fingerprint hashes are generated or stored.
                    </p>
                    <p>
                      <strong>Transient IP Rate Limiting:</strong> IP addresses are read in container memory solely to
                      enforce sliding-window abuse limits (60 req/min) and are immediately discarded. Zero raw IPs stored.
                    </p>
                    <p>
                      <strong>No Content Collection:</strong> Messages and job description text are excluded from analytics.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Google Sheets Synchronization</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono text-white/70">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Status:</span>
                      <span className="text-amber-400 font-bold">DISABLED (Governance Policy)</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Operational Guarantee:</span>
                      <span className="text-white/60">Requires External FIFO Queue</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span>Automated Crons:</span>
                      <span className="text-white/40">Disabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manual Write Triggers:</span>
                      <span className="text-white/40">Disabled</span>
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
