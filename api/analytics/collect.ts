// Serverless Analytics Ingestion Endpoint for Vercel
// Collects privacy-safe first-party visitor telemetry.
// Strict security: Rate limiting, origin checking, schema validation, zero PII retention.

import { validateAnalyticsPayload, AnalyticsEventPayload } from '../lib/analyticsContract';
import { getAnalyticsStorage } from '../lib/analyticsStorage';

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
// NOTE: Rate limiting is per serverless instance and provides best-effort abuse protection, not a globally enforced limit.
// The application does not intentionally persist or log IP addresses, but hosting infrastructure (e.g. Vercel) may independently process or log request metadata.
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

export const CANONICAL_PRODUCTION_HOST = 'kaustubh-portfolio-six.vercel.app';

function isAllowedOrigin(originHeader: string | undefined): boolean {
  if (!originHeader) return true; // Beacon and same-origin requests might not send Origin
  try {
    const parsed = new URL(originHeader);
    const host = parsed.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (host === CANONICAL_PRODUCTION_HOST) return true;
    if (host.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

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

  // 2. Origin Check
  const origin = (req.headers.origin || req.headers.referer) as string | undefined;
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({
      success: false,
      code: 'FORBIDDEN_ORIGIN',
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
      code: 'RATE_LIMITED',
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
      code: 'INVALID_EVENT_PAYLOAD',
      message: validation.error || 'Event validation failed.'
    });
    return;
  }

  const event = body as AnalyticsEventPayload;

  // 5. Ingestion via Storage Abstraction
  const storage = getAnalyticsStorage();
  await storage.recordEvent(event);

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({
    success: true,
    code: 'EVENT_INGESTED',
    message: 'Event recorded successfully in first-party analytics pipeline.'
  });
}
