/**
 * Portfolio Intelligence OS - Storage Abstraction Layer
 * 
 * Strict Architectural Governance:
 * 1. Serverless instance memory is ephemeral and MUST NOT be claimed as durable storage.
 * 2. If no persistent database (PostgreSQL, Redis, Supabase, Cloudflare KV) is configured,
 *    the system reports its storage capability as 'UNCONFIGURED_STORAGE'.
 * 3. It maintains a short-lived diagnostic memory buffer for immediate debugging
 *    and development verification, but marks all aggregate outputs with:
 *    isPersistent: false, storageBackend: 'memory_transient_diagnostic', persistenceWarning: '...'
 * 4. Never fabricates numbers, benchmarks, or persistent unique visitor counts.
 */

import { AnalyticsEventPayload } from './analyticsContract.js';

export interface DailyAggregateMetrics {
  date: string; // YYYY-MM-DD (UTC)
  pageViews: number;
  projectViews: number;
  resumeDownloads: number;
  contactClicks: number;
  whatsappClicks: number;
  emailClicks: number;
  jobMatchUses: number;
  topProjects: Array<{ projectId: string; count: number }>;
  referrers: Record<string, number>;
  devices: Record<string, number>;
}

export interface AnalyticsStorageSummary {
  status: 'ACTIVE_PERSISTENT' | 'UNCONFIGURED_STORAGE';
  storageBackend: 'external_database' | 'memory_transient_diagnostic';
  isPersistent: boolean;
  persistenceNotice: string;
  lastEventTimestamp: number | null;
  totalEventsIngestedInSession: number;
  dailyAggregates: DailyAggregateMetrics[];
  dataQuality: {
    unspecifiedReferrers: number;
    droppedEventsCount: number;
    storageBoundaryStatus: string;
  };
}

export interface IAnalyticsStorage {
  recordEvent(event: AnalyticsEventPayload): Promise<void>;
  getSummary(): Promise<AnalyticsStorageSummary>;
  getDailyAggregatesForSync(): Promise<DailyAggregateMetrics[]>;
}

/**
 * Diagnostic In-Memory Implementation.
 * Used when no external database credentials (e.g. POSTGRES_URL, KV_REST_API_URL) are provisioned.
 * Bound to 500 recent events per serverless container to prevent memory exhaustion.
 */
class TransientMemoryAnalyticsStorage implements IAnalyticsStorage {
  private events: AnalyticsEventPayload[] = [];
  private readonly maxBufferSize = 500;
  private droppedEvents = 0;

  async recordEvent(event: AnalyticsEventPayload): Promise<void> {
    if (this.events.length >= this.maxBufferSize) {
      this.events.shift();
      this.droppedEvents++;
    }
    this.events.push(event);
  }

  async getSummary(): Promise<AnalyticsStorageSummary> {
    const dailyMap = new Map<string, DailyAggregateMetrics>();
    let unspecifiedReferrers = 0;

    for (const ev of this.events) {
      const dateStr = new Date(ev.timestamp).toISOString().split('T')[0];
      let day = dailyMap.get(dateStr);
      if (!day) {
        day = {
          date: dateStr,
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
        };
        dailyMap.set(dateStr, day);
      }

      // Increment counts
      switch (ev.eventType) {
        case 'page_view':
          day.pageViews++;
          break;
        case 'project_view':
          day.projectViews++;
          if (ev.projectId) {
            const existingProj = day.topProjects.find((p) => p.projectId === ev.projectId);
            if (existingProj) {
              existingProj.count++;
            } else {
              day.topProjects.push({ projectId: ev.projectId, count: 1 });
            }
          }
          break;
        case 'resume_download':
          day.resumeDownloads++;
          break;
        case 'contact_click':
          day.contactClicks++;
          break;
        case 'whatsapp_click':
          day.whatsappClicks++;
          break;
        case 'email_click':
          day.emailClicks++;
          break;
        case 'job_match_use':
          day.jobMatchUses++;
          break;
      }

      // Track referrers & devices
      const ref = ev.referrerCategory || 'other';
      if (ref === 'other') unspecifiedReferrers++;
      day.referrers[ref] = (day.referrers[ref] || 0) + 1;

      const dev = ev.deviceCategory || 'desktop';
      day.devices[dev] = (day.devices[dev] || 0) + 1;
    }

    // Sort projects in daily metrics
    for (const day of dailyMap.values()) {
      day.topProjects.sort((a, b) => b.count - a.count);
    }

    const sortedDays = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return {
      status: 'UNCONFIGURED_STORAGE',
      storageBackend: 'memory_transient_diagnostic',
      isPersistent: false,
      persistenceNotice: 'Persistent database is unconfigured. Showing transient container telemetry only. No historical metrics fabricated.',
      lastEventTimestamp: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null,
      totalEventsIngestedInSession: this.events.length,
      dailyAggregates: sortedDays,
      dataQuality: {
        unspecifiedReferrers,
        droppedEventsCount: this.droppedEvents,
        storageBoundaryStatus: 'Awaiting durable database provisioning authorization'
      }
    };
  }

  async getDailyAggregatesForSync(): Promise<DailyAggregateMetrics[]> {
    const summary = await this.getSummary();
    return summary.dailyAggregates;
  }
}

// Storage instance factory singleton
let storageInstance: IAnalyticsStorage | null = null;

export function getAnalyticsStorage(): IAnalyticsStorage {
  if (!storageInstance) {
    // Currently, no external database credentials exist in Vercel environment variables.
    // Instantiates TransientMemoryAnalyticsStorage with explicit unconfigured status.
    storageInstance = new TransientMemoryAnalyticsStorage();
  }
  return storageInstance;
}
