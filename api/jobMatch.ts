// Serverless Job Description Match Analyzer Endpoint for Vercel
// Strictly bounds matching to governed repository facts without hallucination or arbitrary scores.
// If AI is configured, it can optionally augment suggestions via the existing Groq adapter
// while preserving the AI_ENABLED kill-switch and zero-PII logging.

import { analyzeJobDescription } from './lib/jobMatchEngineServer.js';

const CANONICAL_HOST = 'kaustubh-portfolio-six.vercel.app';

export function isExplicitLocalDevelopment(): boolean {
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    return false;
  }
  const nodeEnv = process.env.NODE_ENV;
  return nodeEnv === 'development' || nodeEnv === 'test';
}

export function isValidOriginUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    const port = parsed.port;
    const protocol = parsed.protocol;

    if (host === CANONICAL_HOST) {
      if (protocol !== 'https:') return false;
      if (port && port !== '443') return false;
      return true;
    }

    const previewUrl = process.env.VERCEL_URL?.trim().toLowerCase();
    if (previewUrl) {
      const activePreviewHost = previewUrl.replace(/^https?:\/\//, '').split('/')[0];
      if (host === activePreviewHost) {
        if (protocol !== 'https:') return false;
        if (port && port !== '443') return false;
        return true;
      }
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      if (isExplicitLocalDevelopment()) {
        return true;
      }
      return false;
    }

    return false;
  } catch (_err) {
    return false;
  }
}

function validateRequestOrigin(req: any): boolean {
  const originHeader = req.headers['origin'];
  const refererHeader = req.headers['referer'];

  if (typeof originHeader === 'string' && originHeader.trim()) {
    return isValidOriginUrl(originHeader.trim());
  }

  if (typeof refererHeader === 'string' && refererHeader.trim()) {
    try {
      const parsedReferer = new URL(refererHeader.trim());
      const refererOrigin = `${parsedReferer.protocol}//${parsedReferer.host}`;
      return isValidOriginUrl(refererOrigin);
    } catch (_e) {
      return false;
    }
  }

  return false;
}

export default async function handler(req: any, res: any): Promise<void> {
  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed. Only POST requests are supported.'
    });
    return;
  }

  // 2. Origin check
  if (!validateRequestOrigin(req)) {
    res.status(403).json({
      success: false,
      code: 'FORBIDDEN_ORIGIN',
      message: 'Access denied: Untrusted origin.'
    });
    return;
  }

  // 3. Payload validation
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({
      success: false,
      code: 'INVALID_PAYLOAD',
      message: 'Invalid request body. Expected JSON object with jobDescription string.'
    });
    return;
  }

  const rawDescription = body.jobDescription;
  if (typeof rawDescription !== 'string' || !rawDescription.trim()) {
    res.status(400).json({
      success: false,
      code: 'EMPTY_DESCRIPTION',
      message: 'Job description must be a non-empty string.'
    });
    return;
  }

  const description = rawDescription.trim();
  if (description.length > 10000) {
    res.status(400).json({
      success: false,
      code: 'DESCRIPTION_TOO_LONG',
      message: 'Job description exceeds maximum length of 10,000 characters.'
    });
    return;
  }

  const jobTitle = typeof body.jobTitle === 'string' ? body.jobTitle.slice(0, 150) : undefined;
  const company = typeof body.company === 'string' ? body.company.slice(0, 150) : undefined;

  try {
    const report = analyzeJobDescription(description, { jobTitle, company });
    res.status(200).json({
      success: true,
      code: 'MATCH_ANALYZED',
      report
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      code: 'ANALYSIS_ERROR',
      message: err.message || 'Unable to analyze job description.'
    });
  }
}
