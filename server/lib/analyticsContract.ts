/**
 * Portfolio Intelligence OS - First-Party Analytics Event Contract
 * 
 * Re-exports domain types from the neutral shared type location (src/types/analytics)
 * and provides server-side payload validation, normalization, and bounds enforcement.
 * 
 * Strict Privacy Guidelines:
 * - No invasive browser fingerprinting or canvas/WebGL enumeration.
 * - No cookies, localStorage identifiers, or cross-session tracking.
 * - Zero raw IP address retention; no IP+UA hashing.
 * - Zero transmission of pasted job descriptions or contact message bodies.
 * - Campaign Attribution: Strict whitelist of UTM parameters (source, medium, campaign, content, term).
 *   Max length constraints (50 chars), alphanumeric/safe hyphen/underscore characters only.
 *   Forbids arbitrary query strings, PII, or raw click IDs (fbclid, gclid, etc.).
 * - Traffic Quality: Detects automated crawlers, bot user-agents, and anomalous frequency bursts.
 */

import type {
  AnalyticsEventType,
  ReferrerCategory,
  DeviceCategory,
  CampaignAttribution,
  TrafficQualityGrade,
  AnalyticsEventPayload,
  AnalyticsValidationResult
} from '../../src/types/analytics';

export type {
  AnalyticsEventType,
  ReferrerCategory,
  DeviceCategory,
  CampaignAttribution,
  TrafficQualityGrade,
  AnalyticsEventPayload,
  AnalyticsValidationResult
};

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

// Strict UUIDv4 regex for event idempotency
export const EVENT_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Campaign parameter validation regex: alphanumeric, hyphen, underscore, dot (max 50 chars)
export const UTM_VALUE_REGEX = /^[a-zA-Z0-9._-]{1,50}$/;

// Known crawler signatures (coarse pattern match on User-Agent header)
export const KNOWN_CRAWLER_SUBSTRINGS = [
  'bot', 'crawl', 'spider', 'slurp', 'googlebot', 'bingbot',
  'yandex', 'duckduckbot', 'baiduspider', 'facebookexternalhit',
  'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
  'showyoubot', 'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
  'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
  'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
  'nuzzel', 'discordbot', 'google page speed', 'qwantify', 'headlesschrome'
];

/**
 * Classifies traffic quality based on User-Agent string without tracking individual identities.
 */
export function classifyTrafficQuality(userAgent?: string): TrafficQualityGrade {
  if (!userAgent || typeof userAgent !== 'string' || userAgent.trim() === '') {
    return 'unclassified';
  }

  const uaLower = userAgent.toLowerCase();
  for (const botSub of KNOWN_CRAWLER_SUBSTRINGS) {
    if (uaLower.includes(botSub)) {
      return 'automated_crawler';
    }
  }

  return 'verified_human';
}

/**
 * Validates and normalizes campaign attribution parameters.
 * Strips any unapproved parameters or PII.
 */
export function validateCampaignAttribution(campaignRaw: unknown): {
  isValid: boolean;
  cleanedCampaign?: CampaignAttribution;
  error?: string;
} {
  if (!campaignRaw || typeof campaignRaw !== 'object' || Array.isArray(campaignRaw)) {
    return { isValid: true, cleanedCampaign: undefined };
  }

  const raw = campaignRaw as Record<string, unknown>;
  const allowedKeys = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm'];
  const cleaned: CampaignAttribution = {};

  // Forbid click IDs or arbitrary advertising trackers
  const forbiddenClickIds = ['gclid', 'fbclid', 'msclkid', 'dclid', 'ttclid', 'twclid', 'wbraid', 'gbraid'];
  for (const f of forbiddenClickIds) {
    if (f in raw) {
      return { isValid: false, error: `Raw advertising click ID forbidden in analytics payload: ${f}` };
    }
  }

  for (const key of Object.keys(raw)) {
    if (!allowedKeys.includes(key)) {
      return { isValid: false, error: `Unauthorized campaign parameter: ${key}` };
    }

    const val = raw[key];
    if (val !== undefined && val !== null && val !== '') {
      if (typeof val !== 'string') {
        return { isValid: false, error: `Campaign parameter ${key} must be a string` };
      }
      const trimmed = val.trim();
      if (!UTM_VALUE_REGEX.test(trimmed)) {
        return {
          isValid: false,
          error: `Campaign parameter ${key} contains invalid characters or exceeds 50 characters`
        };
      }
      cleaned[key as keyof CampaignAttribution] = trimmed.toLowerCase();
    }
  }

  return { isValid: true, cleanedCampaign: Object.keys(cleaned).length > 0 ? cleaned : undefined };
}

/**
 * Validates an incoming analytics event payload.
 * Enforces strict bounds, allowed event types, idempotency IDs, and forbids any sensitive fields.
 */
export function validateAnalyticsPayload(payload: unknown, userAgentHeader?: string): AnalyticsValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, code: 'INVALID_JSON', error: 'Payload must be a non-null object' };
  }

  const p = payload as Record<string, unknown>;

  // 1. Strict Privacy Audit: Forbid any suspicious PII fields in root payload
  const forbiddenFields = [
    'email', 'phone', 'name', 'message', 'comment', 'ip', 'rawIp',
    'userAgent', 'jobDescription', 'pastedText', 'fingerprint',
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

  // 3. Optional Idempotency Event ID Check (UUIDv4)
  let validatedEventId: string | undefined = undefined;
  if (p.eventId !== undefined && p.eventId !== null) {
    if (typeof p.eventId !== 'string' || !EVENT_ID_REGEX.test(p.eventId)) {
      return {
        isValid: false,
        code: 'INVALID_EVENT_ID',
        error: 'eventId must be a valid random UUIDv4'
      };
    }
    validatedEventId = p.eventId.toLowerCase();
  }

  // 4. Project ID Rules
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

  // 5. Timestamp Check (must be realistic epoch ms, within 24 hours of server time)
  if (typeof p.timestamp !== 'number' || !Number.isFinite(p.timestamp)) {
    return { isValid: false, code: 'INVALID_TIMESTAMP', error: 'Timestamp must be a finite number' };
  }
  const now = Date.now();
  const maxSkewMs = 24 * 60 * 60 * 1000;
  if (p.timestamp < now - maxSkewMs || p.timestamp > now + maxSkewMs) {
    return { isValid: false, code: 'TIMESTAMP_SKEW', error: 'Timestamp is outside acceptable time window' };
  }

  // 6. Path Check & Normalization
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

  // 7. Referrer Category Check
  if (typeof p.referrerCategory !== 'string' || !VALID_REFERRER_CATEGORIES.has(p.referrerCategory as ReferrerCategory)) {
    return { isValid: false, code: 'INVALID_REFERRER_CATEGORY', error: `Invalid referrerCategory: ${String(p.referrerCategory)}` };
  }

  // 8. Device Category Check
  if (typeof p.deviceCategory !== 'string' || !VALID_DEVICE_CATEGORIES.has(p.deviceCategory as DeviceCategory)) {
    return { isValid: false, code: 'INVALID_DEVICE_CATEGORY', error: `Invalid deviceCategory: ${String(p.deviceCategory)}` };
  }

  // 9. Campaign Attribution Validation
  const campaignValidation = validateCampaignAttribution(p.campaign);
  if (!campaignValidation.isValid) {
    return {
      isValid: false,
      code: 'INVALID_CAMPAIGN_ATTRIBUTION',
      error: campaignValidation.error || 'Campaign attribution validation failed'
    };
  }

  // 10. Traffic Quality Classification
  const trafficQuality = classifyTrafficQuality(userAgentHeader);

  // 11. Event-Specific Metadata Validation
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
    cleanedMetadata,
    eventId: validatedEventId,
    cleanedCampaign: campaignValidation.cleanedCampaign,
    trafficQuality
  };
}
