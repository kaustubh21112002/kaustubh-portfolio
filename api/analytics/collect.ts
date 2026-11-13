// Serverless Analytics Ingestion Endpoint for Vercel
// Collects privacy-safe first-party visitor telemetry.
// Strict security: Rate limiting, origin checking, schema validation, zero PII retention.
// Idempotency: Supports optional client-generated random UUIDv4 eventId for deduplication.
// Traffic Quality: Categorizes crawlers/bots without tracking individual identities.
// Campaign Attribution: Sanitizes and attaches validated utm_* parameters.

import { validateAnalyticsPayload, AnalyticsEventPayload } from '../../server/lib/analyticsContract.js';
import { getAnalyticsStorage } from '../../server/lib/analyticsStorage.js';
import { validateCollectionOrigin } from '../../server/lib/originValidator.js';
import {
  checkDistributedRateLimit,
  setStandardSecurityHeaders
} from '../../server/lib/rateLimiter.js';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  url?: string;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  end: () => void;
}

// Distributed rate limit policy: max 60 collection events per minute per IP
const COLLECT_RATE_LIMIT_OPTIONS = {
  windowMs: 60 * 1000,
  maxAttempts: 60
};

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Attach standard security headers to all responses
  setStandardSecurityHeaders(res);

  // 1. Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are permitted on this endpoint.'
    });
    return;
  }

  // 2. Origin & Referer Validation
  const originCheck = validateCollectionOrigin(req.headers.origin, req.headers.referer);
  if (!originCheck.isAuthorized) {
    res.status(403).json({
      success: false,
      code: 'CSRF_ORIGIN_REJECTED',
      message: 'Request origin is not authorized.'
    });
    return;
  }

  // 3. Distributed Sliding Window Rate Limiting (Neutralizes STATE-RACE-01)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const rateLimit = await checkDistributedRateLimit(ip, 'analytics_collect', COLLECT_RATE_LIMIT_OPTIONS);

  res.setHeader('X-RateLimit-Limit', String(COLLECT_RATE_LIMIT_OPTIONS.maxAttempts));
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetAt / 1000)));

  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Event submission limit exceeded. Please try again later.'
    });
    return;
  }

  // 4. Schema Validation & Campaign / Traffic Quality Processing
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({
        success: false,
        code: 'INVALID_JSON',
        message: 'Request body must be valid JSON.'
      });
      return;
    }
  }

  const userAgentHeader = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : undefined;
  const validation = validateAnalyticsPayload(body, userAgentHeader);
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      code: validation.code || 'INVALID_EVENT_PAYLOAD',
      message: validation.error || 'Event validation failed.'
    });
    return;
  }

  const event = body as AnalyticsEventPayload;
  if (validation.cleanedCampaign) {
    event.campaign = validation.cleanedCampaign;
  }
  if (validation.trafficQuality) {
    event.trafficQuality = validation.trafficQuality;
  }

  const storage = getAnalyticsStorage();

  // 5. Ingestion via Storage Abstraction with Honest Storage Status Check
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  try {
    const recordResult = await storage.recordEvent(
      event,
      validation.normalizedPath || '/',
      validation.cleanedMetadata || {},
      validation.eventId
    );

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    // Idempotent duplicate response handling
    if (recordResult.isDuplicate) {
      res.status(200).json({
        success: true,
        code: 'EVENT_DUPLICATE_IGNORED',
        message: 'Event already recorded. Duplicate ingestion skipped idempotently.',
        eventId: recordResult.eventId
      });
      return;
    }

    res.status(200).json({
      success: true,
      code: dbUrl ? 'EVENT_RECORDED' : 'DIAGNOSTIC_BUFFER_ACCEPTED',
      message: dbUrl
        ? 'Event recorded successfully in durable analytics pipeline.'
        : 'Event accepted in diagnostic buffer only. Persistent storage unconfigured.',
      eventId: recordResult.eventId
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      message: 'Durable storage is currently unavailable.'
    });
  }
}
