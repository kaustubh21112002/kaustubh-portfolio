// Serverless Dashboard Authentication Endpoint
// Verifies passphrase and sets an HttpOnly, Secure, SameSite=Strict cookie scoped to /api/analytics/dashboard/

import {
  isAuthorizedOrigin,
  verifyPassphrase,
  createSession
} from '../../../server/lib/authService.js';
import {
  checkDistributedRateLimit,
  setStandardSecurityHeaders
} from '../../../server/lib/rateLimiter.js';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  end: () => void;
}

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

// Distributed rate limit policy: max 5 login attempts per 15 minutes per IP
const LOGIN_RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5
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
      message: 'Only POST requests are permitted.'
    });
    return;
  }

  // 2. Origin & CSRF Check (Strict whitelist - no arbitrary preview domains)
  const origin = (req.headers.origin || req.headers.referer) as string | undefined;
  if (!isAuthorizedOrigin(origin)) {
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
  const rateLimit = await checkDistributedRateLimit(ip, 'dashboard_login', LOGIN_RATE_LIMIT_OPTIONS);

  res.setHeader('X-RateLimit-Limit', String(LOGIN_RATE_LIMIT_OPTIONS.maxAttempts));
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetAt / 1000)));

  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many failed login attempts. Please try again in 15 minutes.'
    });
    return;
  }

  // 4. Configuration Check: Both passphrase hash AND database storage must be configured
  const adminHash = process.env.ANALYTICS_ADMIN_HASH;
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!adminHash || !dbUrl) {
    res.status(503).json({
      success: false,
      code: 'AUTH_UNCONFIGURED',
      message: 'Dashboard authentication and persistent storage are not configured in this environment.'
    });
    return;
  }

  // 5. Credentials Verification with bounded payload check
  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > 2048) {
      res.status(400).json({
        success: false,
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeds allowable limit.'
      });
      return;
    }
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

  const { passphrase } = (body as Record<string, unknown>) || {};
  if (typeof passphrase !== 'string' || passphrase.length === 0 || passphrase.length > 256) {
    res.status(401).json({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials provided.'
    });
    return;
  }

  const isValid = verifyPassphrase(passphrase, adminHash);
  if (!isValid) {
    res.status(401).json({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials provided.'
    });
    return;
  }

  // 6. Session Creation & Cookie Issuance
  try {
    const rawToken = await createSession('admin');

    // Scoped strictly to /api/analytics/dashboard/
    const cookie = [
      `portfolio_intelligence_session=${rawToken}`,
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/api/analytics/dashboard/',
      'Max-Age=14400'
    ].join('; ');

    res.setHeader('Set-Cookie', cookie);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({
      success: true,
      code: 'SESSION_CREATED',
      message: 'Authentication successful.'
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      message: 'Database storage is unavailable to create a session.'
    });
  }
}
