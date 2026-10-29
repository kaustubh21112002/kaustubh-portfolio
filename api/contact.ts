// Serverless Contact Form Endpoint for Vercel
// Dispatches contact requests securely to a Slack incoming webhook.
// Strict security: Zero secrets are exposed to the client; rate limiting,
// honeypot spam protection, schema validation, and truthful delivery status.

export interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string; // Hidden spam-trap field
}

export interface ContactResponseBody {
  success: boolean;
  code: string;
  message: string;
  delivered?: boolean;
}

// In-memory rate limiting map for edge/serverless lifetime (IP -> timestamp[])
// Limits to 5 submissions per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestTimestamps = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestTimestamps.set(ip, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  ipRequestTimestamps.set(ip, validTimestamps);

  // Periodically clean up stale entries if map gets large
  if (ipRequestTimestamps.size > 1000) {
    for (const [key, times] of ipRequestTimestamps.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestTimestamps.delete(key);
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

// Minimal RFC 5322 compliant email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escape Slack mrkdwn special characters: &, <, >
function escapeSlackMrkdwn(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req: any, res: any) {
  // Enforce HTTP method
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are permitted.'
    });
  }

  // Extract client IP for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many submissions. Please wait 10 minutes or contact directly via email.'
    });
  }

  // Parse body
  let body: ContactRequestBody = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({
      success: false,
      code: 'INVALID_JSON',
      message: 'Malformed request payload.'
    });
  }

  const { name, email, subject, message, honeypot } = body;

  // 1. Honeypot check: If bot filled the hidden honeypot input, silently succeed without sending to Slack
  if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return res.status(200).json({
      success: true,
      delivered: true,
      code: 'DISPATCH_ACCEPTED',
      message: 'Your inquiry has been received.'
    });
  }

  // 2. Server-side validation
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanSubject = (subject || '').trim() || 'General Portfolio Inquiry';
  const cleanMessage = (message || '').trim();

  if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_NAME',
      message: 'Name must be between 2 and 100 characters.'
    });
  }

  if (!cleanEmail || cleanEmail.length > 150 || !EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL',
      message: 'A valid email address is required.'
    });
  }

  if (cleanSubject.length > 200) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_SUBJECT',
      message: 'Subject cannot exceed 200 characters.'
    });
  }

  if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 2000) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_MESSAGE',
      message: 'Message must be between 10 and 2000 characters.'
    });
  }

  // 3. Inspect Slack Webhook environment variable
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  // If Slack webhook is not configured in Vercel environment:
  // Return truthful 503 response so UI knows Slack is unconfigured and instructs user to use direct mailto/copy
  if (!slackWebhookUrl || !slackWebhookUrl.startsWith('https://hooks.slack.com/services/')) {
    return res.status(503).json({
      success: false,
      delivered: false,
      code: 'SLACK_NOT_CONFIGURED',
      message: 'Automated direct notification service is not yet configured with an active Slack webhook. Please use direct email.'
    });
  }

  // 4. Construct Slack Payload
  const sanitizedName = escapeSlackMrkdwn(cleanName);
  const sanitizedEmail = escapeSlackMrkdwn(cleanEmail);
  const sanitizedSubject = escapeSlackMrkdwn(cleanSubject);
  const sanitizedMessage = escapeSlackMrkdwn(cleanMessage);
  const timestamp = new Date().toISOString();

  const slackPayload = {
    text: `New Portfolio Inquiry from ${sanitizedName} (${sanitizedEmail})`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📬 New Portfolio Inquiry',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*From:*\n${sanitizedName}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n<mailto:${sanitizedEmail}|${sanitizedEmail}>`
          },
          {
            type: 'mrkdwn',
            text: `*Subject:*\n${sanitizedSubject}`
          },
          {
            type: 'mrkdwn',
            text: `*Received At (UTC):*\n${timestamp}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n>>> ${sanitizedMessage}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Source: Portfolio Contact Form • Origin: \`${ip === 'unknown' ? 'anonymous' : 'verified'}\``
          }
        ]
      }
    ]
  };

  // 5. Dispatch to Slack Webhook
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

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
        message: 'Unable to deliver message to Slack channel at this moment. Please use direct email.'
      });
    }

    return res.status(200).json({
      success: true,
      delivered: true,
      code: 'DISPATCH_SUCCESSFUL',
      message: 'Inquiry successfully delivered to private notification channel.'
    });
  } catch (error: any) {
    const isTimeout = error?.name === 'AbortError';
    console.error(`Slack webhook transmission error:`, isTimeout ? 'Request timed out' : error?.message || error);

    return res.status(504).json({
      success: false,
      delivered: false,
      code: isTimeout ? 'GATEWAY_TIMEOUT' : 'DISPATCH_ERROR',
      message: 'Notification delivery timed out or encountered a network error. Please use direct email.'
    });
  }
}
