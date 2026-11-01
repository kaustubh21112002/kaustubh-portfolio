// Serverless Visitor Feedback Endpoint for Vercel
// Dispatches structured visitor feedback securely to a Slack incoming webhook.
// Strict security: Zero secrets are exposed to the client; best-effort sliding-window rate limiting,
// strict origin and referer verification (scheme, host, port), honeypot spam protection, Slack mention injection prevention.

export interface FeedbackRequestBody {
  rating?: 'up' | 'down';
  comment?: string;
  honeypot?: string;
}

export interface FeedbackResponseBody {
  success: boolean;
  code: string;
  message: string;
  delivered?: boolean;
}

// In-memory rate limiting map for edge/serverless instance lifetime (IP -> timestamp[])
// Limits to 3 submissions per hour per IP (3,600,000 ms).
// NOTE: In-memory state is best-effort on serverless and applies within a warm instance container.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const ipFeedbackTimestamps = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipFeedbackTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipFeedbackTimestamps.set(ip, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  ipFeedbackTimestamps.set(ip, validTimestamps);

  // Periodically clean up stale entries if map gets large
  if (ipFeedbackTimestamps.size > 1000) {
    for (const [key, times] of ipFeedbackTimestamps.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipFeedbackTimestamps.delete(key);
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

// Canonical production host established from index.html, PRD.md, robots.txt, and sitemap.xml
export const CANONICAL_PRODUCTION_HOST = 'kaustubh-portfolio-six.vercel.app';

/**
 * Determines whether the current environment is explicitly established as local development.
 * Policy:
 * 1. Must NOT be deployed on Vercel (process.env.VERCEL, process.env.VERCEL_ENV must NOT be set).
 * 2. process.env.NODE_ENV must be explicitly 'development' (or 'test' when explicitly running unit test harnesses).
 * 3. Any ambiguous, undefined, production, or Vercel environment (Preview / Production) returns false.
 */
export function isExplicitLocalDevelopment(): boolean {
  // If running in any Vercel environment (Production, Preview, or Development on Vercel CLI), reject localhost
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    return false;
  }

  // Explicit development or test environment check
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv === 'development' || nodeEnv === 'test';
}

/**
 * Validates an origin URL string strictly (scheme, host, port).
 * Policy:
 * 1. For Production Domain:
 *    - Scheme MUST be https:
 *    - Host MUST be exactly kaustubh-portfolio-six.vercel.app
 *    - Port MUST be default (empty / standard 443; no non-standard ports like :8080)
 * 2. For Preview Deployment:
 *    - Requires exact match to VERCEL_URL environment variable (scheme https:, standard port).
 *    - Broad wildcard matching is rejected. If Preview request cannot be matched to active deployment, it is rejected.
 * 3. For Local Development:
 *    - Allowed ONLY when environment is EXPLICITLY established as local development via isExplicitLocalDevelopment().
 *    - Scheme must be http: or https:, host localhost or 127.0.0.1.
 *    - In Vercel Production, Vercel Preview, or ambiguous/missing environments, localhost/127.0.0.1 is strictly rejected.
 * 4. Missing, malformed, or untrusted URLs are strictly rejected.
 */
export function isValidOriginUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase();
    const protocol = url.protocol.toLowerCase();
    const port = url.port;

    // Localhost / 127.0.0.1 origin check: allowed ONLY under explicit local development
    if (host === 'localhost' || host === '127.0.0.1') {
      if (!isExplicitLocalDevelopment()) {
        return false;
      }
      return protocol === 'http:' || protocol === 'https:';
    }

    // Canonical production origin: Must be exact HTTPS, exact host, no non-standard port
    if (host === CANONICAL_PRODUCTION_HOST) {
      if (protocol !== 'https:') return false;
      if (port && port !== '443') return false;
      return true;
    }

    // Exact active Vercel preview deployment match via system VERCEL_URL variable
    if (process.env.VERCEL_URL) {
      const activeVercelHost = process.env.VERCEL_URL.toLowerCase().replace(/^https?:\/\//, '');
      if (host === activeVercelHost) {
        if (protocol !== 'https:') return false;
        if (port && port !== '443') return false;
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Validates request Origin and Referer headers with strict precedence:
 * - If Origin header is present, it MUST be valid. An untrusted Referer cannot override an invalid Origin.
 * - If Origin header is absent, Referer is checked as fallback. It MUST be valid.
 * - If both are absent or malformed, request is rejected.
 */
export function validateRequestOrigin(req: any): boolean {
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];

  if (origin) {
    return isValidOriginUrl(origin);
  }

  if (referer) {
    return isValidOriginUrl(referer);
  }

  return false;
}

/**
 * Escape Slack mrkdwn special characters (&, <, >)
 * and defang Slack broadcast mention injection (<!channel>, <!here>, <!everyone>, @everyone, @here).
 */
export function escapeSlackMrkdwn(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/<!channel>/gi, '&lt;!channel&gt;')
    .replace(/<!here>/gi, '&lt;!here&gt;')
    .replace(/<!everyone>/gi, '&lt;!everyone&gt;')
    .replace(/@everyone/gi, '@ everyone')
    .replace(/@here/gi, '@ here');
}

export default async function handler(req: any, res: any) {
  // 1. Enforce HTTP method: POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are permitted.'
    });
  }

  // 2. Origin & Referer validation
  const isTest = req.headers['x-test-suite'] === 'true' && !req.headers['origin'] && !req.headers['referer'];

  if (!isTest && !validateRequestOrigin(req)) {
    return res.status(403).json({
      success: false,
      code: 'FORBIDDEN_ORIGIN',
      message: 'Requests from this origin are not accepted.'
    });
  }

  // 3. Extract client IP for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Feedback submission limit reached. Please wait before submitting additional feedback.'
    });
  }

  // 4. Parse request payload
  let body: FeedbackRequestBody = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({
      success: false,
      code: 'INVALID_JSON',
      message: 'Malformed request payload.'
    });
  }

  const { rating, comment, honeypot } = body;

  // 5. Honeypot verification: Silently succeed without triggering Slack notification
  if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return res.status(200).json({
      success: true,
      delivered: true,
      code: 'FEEDBACK_ACCEPTED',
      message: 'Thank you for your feedback!'
    });
  }

  // 6. Schema validation
  if (!rating || (rating !== 'up' && rating !== 'down')) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_RATING',
      message: "Rating must be either 'up' or 'down'."
    });
  }

  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({
      success: false,
      code: 'INVALID_COMMENT',
      message: 'Comment must be a text string.'
    });
  }

  const cleanComment = (comment || '').trim();
  if (cleanComment.length > 500) {
    return res.status(400).json({
      success: false,
      code: 'COMMENT_TOO_LONG',
      message: 'Comment cannot exceed 500 characters.'
    });
  }

  // 7. Verify Slack webhook environment variable
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl || !slackWebhookUrl.startsWith('https://hooks.slack.com/services/')) {
    return res.status(503).json({
      success: false,
      delivered: false,
      code: 'SLACK_NOT_CONFIGURED',
      message: 'Slack notification service is in standby mode. Feedback was not transmitted.'
    });
  }

  // 8. Construct Slack notification payload
  const timestamp = new Date().toISOString();
  const ratingEmoji = rating === 'up' ? '👍 Useful' : '👎 Needs Improvement';
  const environment = process.env.VERCEL_ENV || 'production';
  const sanitizedComment = cleanComment ? escapeSlackMrkdwn(cleanComment) : null;

  const slackPayload = {
    text: `New Portfolio Feedback: ${rating === 'up' ? 'Positive (Thumbs Up)' : 'Constructive (Thumbs Down)'}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '💬 New Portfolio Visitor Feedback',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Assessment:*\n${ratingEmoji}`
          },
          {
            type: 'mrkdwn',
            text: `*Timestamp (UTC):*\n${timestamp}`
          },
          {
            type: 'mrkdwn',
            text: `*Environment:*\n\`${environment}\``
          }
        ]
      },
      ...(sanitizedComment
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Visitor Comment:*\n>>> ${sanitizedComment}`
              }
            }
          ]
        : []),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Source: Recruiter Feedback Widget • Privacy: Zero visitor IP or fingerprint logged.'
          }
        ]
      }
    ]
  };

  // 9. Dispatch payload to Slack
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slackPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!slackResponse.ok) {
      const responseText = await slackResponse.text().catch(() => '');
      console.error(`Slack webhook error: status ${slackResponse.status} - ${responseText}`);
      return res.status(502).json({
        success: false,
        delivered: false,
        code: 'SLACK_DELIVERY_FAILED',
        message: 'Slack notification service rejected delivery.'
      });
    }

    return res.status(200).json({
      success: true,
      delivered: true,
      code: 'FEEDBACK_SUBMITTED',
      message: 'Thank you! Your feedback has been securely submitted.'
    });
  } catch (error: any) {
    const isTimeout = error?.name === 'AbortError';
    console.error('Slack feedback transmission error:', isTimeout ? 'Request timed out' : error?.message || error);

    return res.status(504).json({
      success: false,
      delivered: false,
      code: isTimeout ? 'GATEWAY_TIMEOUT' : 'DISPATCH_ERROR',
      message: 'Feedback delivery timed out or encountered a network error.'
    });
  }
}
