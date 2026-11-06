// Serverless Analytics Ingestion Endpoint for Vercel
// Collects privacy-safe first-party visitor telemetry.
// Strict security: Rate limiting, origin checking, schema validation, zero PII retention.

import { validateAnalyticsPayload, AnalyticsEventPayload } from '../../server/lib/analyticsContract.js';
import { getAnalyticsStorage } from '../../server/lib/analyticsStorage.js';
import { validateCollectionOrigin } from '../../server/lib/originValidator.js';

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

// In-memory sliding-window rate limit for collection (max 60 events per minute per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 60;
const ipEventTimestamps = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipEventTimestamps.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (valid.length >= MAX_EVENTS_PER_WINDOW) {
    ipEventTimestamps.set(ip, valid);
    return false;
  }

  valid.push(now);
  ipEventTimestamps.set(ip, valid);

  if (ipEventTimestamps.size > 2000) {
    for (const [key, times] of ipEventTimestamps.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipEventTimestamps.delete(key);
      }
    }
  }

  return true;
}

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

  // 3. Rate Limit Check
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '127.0.0.1';
  if (!checkRateLimit(ip)) {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Event submission limit exceeded. Please try again later.'
    });
    return;
  }

  // 4. Schema Validation
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

  const validation = validateAnalyticsPayload(body);
  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      code: validation.code || 'INVALID_EVENT_PAYLOAD',
      message: validation.error || 'Event validation failed.'
    });
    return;
  }

  const event = body as AnalyticsEventPayload;
  const storage = getAnalyticsStorage();

  // 5. Ingestion via Storage Abstraction with Honest Storage Status Check
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  try {
    await storage.recordEvent(
      event,
      validation.normalizedPath || '/',
      validation.cleanedMetadata || {}
    );

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({
      success: true,
      code: dbUrl ? 'EVENT_RECORDED' : 'DIAGNOSTIC_BUFFER_ACCEPTED',
      message: dbUrl
        ? 'Event recorded successfully in durable analytics pipeline.'
        : 'Event accepted in diagnostic buffer only. Persistent storage unconfigured.'
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      message: 'Durable storage is currently unavailable.'
    });
  }
}
