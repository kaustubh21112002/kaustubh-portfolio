/**
 * Portfolio Intelligence OS - First-Party Analytics Client SDK
 * 
 * Strict Privacy Guidelines:
 * - Cookieless, zero localStorage tracking of visitor identities.
 * - Non-blocking via navigator.sendBeacon with fetch fallback.
 * - Categorizes referrers into coarse categories ('direct', 'search', 'social', 'internal', 'other').
 * - Detects coarse device category ('desktop', 'mobile', 'tablet').
 * - Zero collection of message content, job descriptions, or user input.
 * - In-memory page session campaign attribution: captures validated utm_* parameters on page load.
 * - Never persists raw advertising identifiers (gclid, fbclid, etc.).
 * - Generates random ephemeral UUIDv4 per event for idempotency / deduplication without persistent visitor identity.
 */

import type {
  AnalyticsEventType,
  ReferrerCategory,
  DeviceCategory,
  CampaignAttribution,
  AnalyticsEventPayload,
  PrivacyPreferences
} from '../types/analytics';

export type {
  AnalyticsEventType,
  ReferrerCategory,
  DeviceCategory,
  CampaignAttribution,
  AnalyticsEventPayload,
  PrivacyPreferences
};

// In-memory campaign attribution cache for the current browser tab session
// Not stored in localStorage or cookies; destroyed on tab close
let activeSessionCampaign: CampaignAttribution | null = null;
let sessionCampaignInitialized = false;

// Allowed campaign parameter whitelist (alphanumeric, hyphen, underscore, max 50 chars)
const UTM_REGEX = /^[a-zA-Z0-9._-]{1,50}$/;

/**
 * Extracts and validates UTM campaign parameters from window.location.search.
 * Stored strictly in tab memory for the active session.
 */
export function initCampaignAttribution(): CampaignAttribution | null {
  if (sessionCampaignInitialized) return activeSessionCampaign;
  sessionCampaignInitialized = true;

  if (typeof window === 'undefined' || !window.location || !window.location.search) {
    activeSessionCampaign = null;
    return null;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const campaign: CampaignAttribution = {};

    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const name = params.get('utm_campaign');
    const content = params.get('utm_content');
    const term = params.get('utm_term');

    if (source && UTM_REGEX.test(source.trim())) campaign.utmSource = source.trim().toLowerCase();
    if (medium && UTM_REGEX.test(medium.trim())) campaign.utmMedium = medium.trim().toLowerCase();
    if (name && UTM_REGEX.test(name.trim())) campaign.utmCampaign = name.trim().toLowerCase();
    if (content && UTM_REGEX.test(content.trim())) campaign.utmContent = content.trim().toLowerCase();
    if (term && UTM_REGEX.test(term.trim())) campaign.utmTerm = term.trim().toLowerCase();

    activeSessionCampaign = Object.keys(campaign).length > 0 ? campaign : null;
    return activeSessionCampaign;
  } catch {
    activeSessionCampaign = null;
    return null;
  }
}

/**
 * Generates an ephemeral cryptographically random UUIDv4 for single-event idempotency.
 * Not stored in localStorage or cookies; zero cross-event tracking.
 */
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments lacking crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Categorizes document.referrer into broad privacy-preserving buckets.
 */
export function getReferrerCategory(referrer: string, currentHost: string): ReferrerCategory {
  if (!referrer || referrer.trim() === '') {
    return 'direct';
  }

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    // Internal referrer
    if (host === currentHost.toLowerCase() || host === 'localhost' || host === '127.0.0.1') {
      return 'internal';
    }

    // Search engines
    if (
      host.includes('google.') ||
      host.includes('bing.') ||
      host.includes('duckduckgo.') ||
      host.includes('yahoo.') ||
      host.includes('ecosia.') ||
      host.includes('baidu.') ||
      host.includes('yandex.')
    ) {
      return 'search';
    }

    // Professional / Social
    if (
      host.includes('linkedin.') ||
      host.includes('github.') ||
      host.includes('twitter.') ||
      host.includes('x.com') ||
      host.includes('t.co') ||
      host.includes('reddit.') ||
      host.includes('instagram.') ||
      host.includes('facebook.')
    ) {
      return 'social';
    }

    return 'other';
  } catch {
    return 'other';
  }
}

/**
 * Detects coarse device category without user-agent sniffing or device fingerprinting.
 */
export function getDeviceCategory(): DeviceCategory {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) {
    return 'mobile';
  } else if (width >= 768 && width < 1024) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Ingests a privacy-safe analytics event to the serverless collection endpoint.
 * Non-blocking: Uses navigator.sendBeacon when available, otherwise falls back to keepalive fetch.
 */
export function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  options: {
    projectId?: string;
    path?: string;
    metadata?: Record<string, string | number | boolean>;
  } = {}
): void {
  if (typeof window === 'undefined') return;

  const path = options.path || window.location.pathname || '/';
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  const currentHost = window.location.hostname;
  const campaign = initCampaignAttribution();

  const payload: AnalyticsEventPayload = {
    eventId: generateEventId(),
    eventType,
    timestamp: Date.now(),
    path,
    referrerCategory: getReferrerCategory(referrer, currentHost),
    deviceCategory: getDeviceCategory()
  };

  if (options.projectId) {
    payload.projectId = options.projectId;
  }

  if (options.metadata) {
    payload.metadata = options.metadata;
  }

  if (campaign) {
    payload.campaign = campaign;
  }

  const endpoint = '/api/analytics/collect';
  const data = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([data], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }

    // Fallback: asynchronous non-blocking fetch with keepalive
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      keepalive: true
    }).catch(() => {
      // Fire-and-forget: ignore network drops to prevent UX degradation
    });
  } catch {
    // Fail silently in client
  }
}
