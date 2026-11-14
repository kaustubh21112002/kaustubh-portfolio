import React, { useState, useEffect, useCallback } from 'react';
import type { B2BCampaignRecord, CampaignMetrics } from '../../../../api/operations/b2bCampaigns';
import { CampaignStatusTable } from './CampaignStatusTable';

export const B2BCampaignOrchestratorCenter: React.FC = () => {
  const [campaigns, setCampaigns] = useState<B2BCampaignRecord[]>([]);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('initializing');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [filterChannel, setFilterChannel] = useState<string>('ALL');

  const fetchCampaignData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/operations/b2bCampaigns', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch campaign telemetry`);
      }

      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
        setMetrics(data.metrics || null);
        setSource(data.source || 'live');
        setLastRefreshed(new Date());
      } else {
        throw new Error(data.error || 'Failed to parse campaign telemetry');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Telemetry service unavailable';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaignData();
    const interval = setInterval(fetchCampaignData, 30000);
    return () => clearInterval(interval);
  }, [fetchCampaignData]);

  const filteredCampaigns = campaigns.filter((c) => {
    if (filterChannel === 'ALL') return true;
    return c.channel === filterChannel;
  });

  return (
    <div className="space-y-6">
      {/* Header telemetry control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 font-mono text-sm font-bold">
            11
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Automated B2B Outreach & Multi-Channel Campaign Orchestrator
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                OutreachPulse
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Omni-channel sequencing (LinkedIn, Email, WhatsApp), SLA penalty exposure analysis, and automated pipeline conversion telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className={`w-2 h-2 rounded-full ${source.includes('fallback') ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="capitalize">{source.replace('_', ' ')}</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={fetchCampaignData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Polling...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Active Campaigns
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-violet-500 dark:text-violet-400 mt-1">
            {metrics ? metrics.totalCampaigns : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across MSP, SaaS & Retail sectors
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg Engagement Score
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-1">
            {metrics ? `${metrics.averageEngagementScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.convertedCount || 0} demos committed
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            SLA Penalty Exposure Target
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 mt-1">
            {metrics ? `$${(metrics.totalSlaPenaltyExposureUsd / 1000).toFixed(0)}k` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Aggregated bottleneck value
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Channel Distribution
          </div>
          <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-2 flex items-center gap-2">
            <span className="text-blue-500">{metrics?.channelBreakdown.linkedin || 0} LI</span>
            <span>•</span>
            <span className="text-violet-500">{metrics?.channelBreakdown.email || 0} Email</span>
            <span>•</span>
            <span className="text-emerald-500">{metrics?.channelBreakdown.whatsapp || 0} WA</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Multi-touch active pipeline
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Filter Channel:</span>
            <div className="flex gap-1">
              {(['ALL', 'LINKEDIN', 'EMAIL', 'WHATSAPP'] as const).map((channel) => (
                <button
                  key={channel}
                  onClick={() => setFilterChannel(channel)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterChannel === channel
                      ? 'bg-violet-500 text-white font-semibold shadow-sm shadow-violet-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Showing {filteredCampaigns.length} of {campaigns.length} active campaigns
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        <CampaignStatusTable campaigns={filteredCampaigns} />
      </div>
    </div>
  );
};
