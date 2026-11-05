/**
 * Portfolio Intelligence OS - First-Party Analytics Event Contract
 * 
 * Strict Privacy Guidelines:
 * - No invasive browser fingerprinting or canvas/WebGL enumeration.
 * - No cookies, localStorage identifiers, or cross-session tracking.
 * - Zero raw IP address retention; no IP+UA hashing.
 * - Zero transmission of pasted job descriptions or contact message bodies.
 * - Honest metric reporting: Clicks represent user engagement/intent, not confirmed conversations.
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

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  timestamp: number;
  path: string;
  referrerCategory: ReferrerCategory;
  deviceCategory: DeviceCategory;
  projectId?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AnalyticsValidationResult {
  isValid: boolean;
  error?: string;
}

export const VALID_EVENT_TYPES: ReadonlySet<AnalyticsEventType> = new Set([
  'page_view',
  'project_view',
  'resume_download',
  'contact_click',
  'whatsapp_click',
  'email_click',
  'job_match_use'
]);

export const VALID_REFERRER_CATEGORIES: ReadonlySet<ReferrerCategory> = new Set([
  'direct',
  'search',
  'social',
  'internal',
  'other'
]);

export const VALID_DEVICE_CATEGORIES: ReadonlySet<DeviceCategory> = new Set([
  'desktop',
  'mobile',
  'tablet'
]);

export const KNOWN_PROJECT_IDS: ReadonlySet<string> = new Set([
  'phonepe-valuation',
  'stratos-governance',
  'spiideo-sports-analytics',
  'it-support-analytics',
  'smartbank-360',
  'equitrack-analytics-os'
]);

/**
 * Validates an incoming analytics event payload.
 * Enforces strict bounds, allowed event types, and forbids any sensitive fields.
 */
export function validateAnalyticsPayload(payload: unknown): AnalyticsValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Payload must be a non-null object' };
  }

  const p = payload as Record<string, unknown>;

  // 1. Event Type Check
  if (typeof p.eventType !== 'string' || !VALID_EVENT_TYPES.has(p.eventType as AnalyticsEventType)) {
    return { isValid: false, error: `Invalid or unsupported eventType: ${String(p.eventType)}` };
  }

  // 2. Timestamp Check (must be realistic epoch ms, within 24 hours of server time)
  if (typeof p.timestamp !== 'number' || !Number.isFinite(p.timestamp)) {
    return { isValid: false, error: 'Timestamp must be a finite number' };
  }
  const now = Date.now();
  const maxSkewMs = 24 * 60 * 60 * 1000;
  if (p.timestamp < now - maxSkewMs || p.timestamp > now + maxSkewMs) {
    return { isValid: false, error: 'Timestamp is outside acceptable time window' };
  }

  // 3. Path Check
  if (typeof p.path !== 'string' || p.path.length === 0 || p.path.length > 256) {
    return { isValid: false, error: 'Path must be a non-empty string under 256 characters' };
  }
  // Sanitize path: Must start with / or be a relative URL path
  if (!p.path.startsWith('/') && !p.path.startsWith('?') && !p.path.startsWith('#')) {
    return { isValid: false, error: 'Path must be a relative path or query string' };
  }

  // 4. Referrer Category Check
  if (typeof p.referrerCategory !== 'string' || !VALID_REFERRER_CATEGORIES.has(p.referrerCategory as ReferrerCategory)) {
    return { isValid: false, error: `Invalid referrerCategory: ${String(p.referrerCategory)}` };
  }

  // 5. Device Category Check
  if (typeof p.deviceCategory !== 'string' || !VALID_DEVICE_CATEGORIES.has(p.deviceCategory as DeviceCategory)) {
    return { isValid: false, error: `Invalid deviceCategory: ${String(p.deviceCategory)}` };
  }

  // 6. Project ID Check (if present)
  if (p.projectId !== undefined && p.projectId !== null) {
    if (typeof p.projectId !== 'string' || (!KNOWN_PROJECT_IDS.has(p.projectId) && p.projectId.length > 64)) {
      return { isValid: false, error: `Invalid projectId: ${String(p.projectId)}` };
    }
  }

  // 7. Metadata Check (if present, must be key-value pairs without PII or excessive length)
  if (p.metadata !== undefined && p.metadata !== null) {
    if (typeof p.metadata !== 'object' || Array.isArray(p.metadata)) {
      return { isValid: false, error: 'Metadata must be an object' };
    }
    const meta = p.metadata as Record<string, unknown>;
    const keys = Object.keys(meta);
    if (keys.length > 10) {
      return { isValid: false, error: 'Metadata has too many keys (max 10)' };
    }
    for (const key of keys) {
      if (key.length > 32) {
        return { isValid: false, error: `Metadata key too long: ${key}` };
      }
      const val = meta[key];
      if (typeof val === 'string' && val.length > 128) {
        return { isValid: false, error: `Metadata value too long for key ${key}` };
      }
      if (typeof val !== 'string' && typeof val !== 'number' && typeof val !== 'boolean') {
        return { isValid: false, error: `Metadata value must be primitive for key ${key}` };
      }
    }
  }

  // 8. Strict Privacy Audit: Forbid any suspicious PII fields in root payload
  const forbiddenFields = [
    'email', 'phone', 'name', 'message', 'comment', 'ip', 'rawIp',
    'userAgent', 'jobDescription', 'pastedText', 'fingerprint', 'uuid'
  ];
  for (const field of forbiddenFields) {
    if (field in p) {
      return { isValid: false, error: `Forbidden field present in payload: ${field}` };
    }
  }

  return { isValid: true };
}
