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
  code?: string;
  error?: string;
  normalizedPath?: string;
  cleanedMetadata?: Record<string, string | number | boolean>;
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

// Strict single-segment / asset / anchor path regex:
// Disallows leading '//', disallows '/.', '/..', disallows arbitrary query/fragments
export const PATH_VALIDATION_REGEX = /^(\/|#contact|\/[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*)$/;

/**
 * Validates an incoming analytics event payload.
 * Enforces strict bounds, allowed event types, and forbids any sensitive fields.
 */
export function validateAnalyticsPayload(payload: unknown): AnalyticsValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, code: 'INVALID_JSON', error: 'Payload must be a non-null object' };
  }

  const p = payload as Record<string, unknown>;

  // 1. Strict Privacy Audit: Forbid any suspicious PII fields in root payload
  const forbiddenFields = [
    'email', 'phone', 'name', 'message', 'comment', 'ip', 'rawIp',
    'userAgent', 'jobDescription', 'pastedText', 'fingerprint', 'uuid',
    'session_id', 'visitor_id'
  ];
  for (const field of forbiddenFields) {
    if (field in p) {
      return { isValid: false, code: 'FORBIDDEN_FIELD', error: `Forbidden field present in payload: ${field}` };
    }
  }

  // 2. Event Type Check
  if (typeof p.eventType !== 'string' || !VALID_EVENT_TYPES.has(p.eventType as AnalyticsEventType)) {
    return { isValid: false, code: 'INVALID_EVENT_TYPE', error: `Invalid or unsupported eventType: ${String(p.eventType)}` };
  }
  const eventType = p.eventType as AnalyticsEventType;

  // 3. Project ID Rules
  if (eventType === 'project_view') {
    if (!p.projectId || typeof p.projectId !== 'string' || !KNOWN_PROJECT_IDS.has(p.projectId)) {
      return {
        isValid: false,
        code: 'MISSING_OR_INVALID_PROJECT_ID',
        error: `project_view event must specify a valid project_id: ${String(p.projectId)}`
      };
    }
  } else {
    if (p.projectId !== undefined && p.projectId !== null) {
      return {
        isValid: false,
        code: 'UNEXPECTED_PROJECT_ID',
        error: `Event ${eventType} must not contain a project_id`
      };
    }
  }

  // 4. Timestamp Check (must be realistic epoch ms, within 24 hours of server time)
  if (typeof p.timestamp !== 'number' || !Number.isFinite(p.timestamp)) {
    return { isValid: false, code: 'INVALID_TIMESTAMP', error: 'Timestamp must be a finite number' };
  }
  const now = Date.now();
  const maxSkewMs = 24 * 60 * 60 * 1000;
  if (p.timestamp < now - maxSkewMs || p.timestamp > now + maxSkewMs) {
    return { isValid: false, code: 'TIMESTAMP_SKEW', error: 'Timestamp is outside acceptable time window' };
  }

  // 5. Path Check & Normalization
  if (typeof p.path !== 'string' || p.path.length === 0 || p.path.length > 256) {
    return { isValid: false, code: 'INVALID_PATH', error: 'Path must be a non-empty string under 256 characters' };
  }

  // Reject percent-encoding to prevent traversal / smuggling bypasses
  if (p.path.includes('%')) {
    return { isValid: false, code: 'INVALID_PATH', error: 'Percent-encoded characters are not permitted in path' };
  }

  // Strip query string if present
  let normalized = p.path.split('?')[0].trim();

  // Validate against approved regex
  if (!PATH_VALIDATION_REGEX.test(normalized) || normalized.length > 128) {
    return { isValid: false, code: 'INVALID_PATH', error: `Path does not match approved format: ${normalized}` };
  }

  // 6. Referrer Category Check
  if (typeof p.referrerCategory !== 'string' || !VALID_REFERRER_CATEGORIES.has(p.referrerCategory as ReferrerCategory)) {
    return { isValid: false, code: 'INVALID_REFERRER_CATEGORY', error: `Invalid referrerCategory: ${String(p.referrerCategory)}` };
  }

  // 7. Device Category Check
  if (typeof p.deviceCategory !== 'string' || !VALID_DEVICE_CATEGORIES.has(p.deviceCategory as DeviceCategory)) {
    return { isValid: false, code: 'INVALID_DEVICE_CATEGORY', error: `Invalid deviceCategory: ${String(p.deviceCategory)}` };
  }

  // 8. Event-Specific Metadata Validation
  let cleanedMetadata: Record<string, string | number | boolean> = {};

  if (p.metadata !== undefined && p.metadata !== null) {
    if (typeof p.metadata !== 'object' || Array.isArray(p.metadata)) {
      return { isValid: false, code: 'INVALID_METADATA', error: 'Metadata must be an object' };
    }
    const meta = p.metadata as Record<string, unknown>;
    const keys = Object.keys(meta);

    if (eventType === 'job_match_use') {
      for (const k of keys) {
        if (k === 'roleLength') {
          const val = meta[k];
          if (typeof val !== 'number' || !Number.isInteger(val) || val < 0 || val > 200) {
            return { isValid: false, code: 'INVALID_METADATA', error: 'roleLength must be an integer between 0 and 200' };
          }
          cleanedMetadata.roleLength = val;
        } else if (k === 'hasCompany') {
          const val = meta[k];
          if (typeof val !== 'boolean') {
            return { isValid: false, code: 'INVALID_METADATA', error: 'hasCompany must be a boolean' };
          }
          cleanedMetadata.hasCompany = val;
        } else {
          return { isValid: false, code: 'INVALID_METADATA', error: `Unexpected metadata key for job_match_use: ${k}` };
        }
      }
    } else {
      // All other events must not send metadata
      if (keys.length > 0) {
        return { isValid: false, code: 'INVALID_METADATA', error: `Event type ${eventType} does not accept metadata` };
      }
    }
  }

  return {
    isValid: true,
    normalizedPath: normalized,
    cleanedMetadata
  };
}
