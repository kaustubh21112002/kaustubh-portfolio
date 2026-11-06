/**
 * Portfolio Intelligence OS - First-Party Analytics Client SDK
 * 
 * Strict Privacy Guidelines:
 * - Cookieless, zero localStorage tracking of visitor identities.
 * - Non-blocking via navigator.sendBeacon with fetch fallback.
 * - Categorizes referrers into coarse categories ('direct', 'search', 'social', 'internal', 'other').
 * - Detects coarse device category ('desktop', 'mobile', 'tablet').
 * - Zero collection of message content, job descriptions, or user input.
 */

import {
  AnalyticsEventType,
  ReferrerCategory,
  DeviceCategory,
  AnalyticsEventPayload
} from '../../server/lib/analyticsContract';

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
 * Detects coarse device category based on viewport width and userAgent heuristics.
 */
export function getDeviceCategory(): DeviceCategory {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Dispatches an analytics event to the first-party serverless collector.
 * Non-blocking, fails silently to never degrade user experience.
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

  const path = options.path || window.location.pathname + window.location.search;
  const referrerCategory = getReferrerCategory(document.referrer, window.location.hostname);
  const deviceCategory = getDeviceCategory();

  const payload: AnalyticsEventPayload = {
    eventType,
    timestamp: Date.now(),
    path: path.length > 255 ? path.substring(0, 255) : path,
    referrerCategory,
    deviceCategory,
    ...(options.projectId ? { projectId: options.projectId } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {})
  };

  const endpoint = '/api/analytics/collect';
  const body = JSON.stringify(payload);

  // Use sendBeacon if available, otherwise fetch with keepalive
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => {
      // Fail silently: analytics must never disrupt user experience
    });
  } catch {
    // Fail silently
  }
}

