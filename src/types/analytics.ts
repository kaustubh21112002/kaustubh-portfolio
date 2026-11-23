/**
 * Shared First-Party Analytics Event Types & Domain Contracts
 * 
 * Neutral shared type location for client SDK and serverless API handlers.
 * Guarantees type-only imports on frontend, preventing server dependencies
 * from entering client bundles.
 * 
 * Strict Privacy Guidelines:
 * - Cookieless, zero localStorage tracking of visitor identities.
 * - No invasive browser fingerprinting or persistent visitor IDs.
 * - Zero raw IP address retention; no IP+UA hashing.
 * - Zero transmission of pasted job descriptions or contact message bodies.
 * - Honest metric reporting: Clicks represent engagement/intent.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'project_view'
  | 'resume_download'
  | 'contact_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'job_match_use';

export type ReferrerCategory =
  | 'direct'
  | 'search'
  | 'social'
  | 'internal'
  | 'other';

export type DeviceCategory =
  | 'desktop'
  | 'mobile'
  | 'tablet';

export interface CampaignAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export type TrafficQualityGrade =
  | 'verified_human'
  | 'automated_crawler'
  | 'suspicious_burst'
  | 'unclassified';

export interface AnalyticsEventPayload {
  eventId?: string; // Optional client-generated UUIDv4 for end-to-end deduplication
  eventType: AnalyticsEventType;
  timestamp: number;
  path: string;
  referrerCategory: ReferrerCategory;
  deviceCategory: DeviceCategory;
  projectId?: string;
  metadata?: Record<string, string | number | boolean>;
  campaign?: CampaignAttribution;
  trafficQuality?: TrafficQualityGrade;
}

export interface AnalyticsValidationResult {
  isValid: boolean;
  code?: string;
  error?: string;
  normalizedPath?: string;
  cleanedMetadata?: Record<string, string | number | boolean>;
  eventId?: string;
  cleanedCampaign?: CampaignAttribution;
  trafficQuality?: TrafficQualityGrade;
}

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
  campaigns?: Record<string, number>;
  trafficQuality?: {
    verifiedHuman: number;
    automatedCrawler: number;
    suspiciousBurst: number;
  };
}

export interface AnalyticsStorageSummary {
  status: 'ACTIVE_PERSISTENT' | 'UNCONFIGURED_STORAGE' | 'STORAGE_UNAVAILABLE';
  storageBackend: 'neon_postgres' | 'memory_transient_diagnostic';
  isPersistent: boolean;
  persistenceNotice: string;
  lastEventTimestamp: number | null;
  totalEventsIngestedInSession: number;
  dailyAggregates: DailyAggregateMetrics[];
  dataQuality: {
    unspecifiedReferrers: number;
    droppedEventsCount: number;
    storageBoundaryStatus: string;
    totalFilteredBots?: number;
    totalDuplicatesIgnored?: number;
  };
}

export interface RetentionPolicySpec {
  rawEventRetentionDays: number;
  maxEventsPerBatch: number;
  preserveAggregateSummaries: boolean;
  targetTable: string;
}

export interface PrivacyPreferences {
  analyticsConsent: boolean;
  marketingConsent: boolean;
  functionalConsent: boolean;
  consentTimestamp: number;
}
