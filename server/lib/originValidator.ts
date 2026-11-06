/**
 * Portfolio Intelligence OS - First-Party Analytics Origin Validator
 * 
 * Strict Perimeter Security:
 * - Compares normalized protocol, host, and port.
 * - Exact canonical production matching: https://kaustubh-portfolio-six.vercel.app
 * - Exact authorized Vercel preview deployment host matching via VERCEL_URL.
 * - Explicit localhost and 127.0.0.1 development allowances (:5173, :3000).
 * - Zero wildcard Vercel subdomain matching (rejects arbitrary *.vercel.app).
 * - Strict Origin precedence over Referer.
 * - Rejects unanchored requests where both Origin and Referer are absent.
 * - Dependency-light: Zero database, storage, or external dependencies.
 */

export const CANONICAL_PRODUCTION_ORIGIN = 'https://kaustubh-portfolio-six.vercel.app';
export const ALLOWED_DEV_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]);

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export interface OriginValidationResult {
  isAuthorized: boolean;
  reason?: 'ORIGIN_DISALLOWED' | 'REFERER_DISALLOWED' | 'MISSING_ORIGIN_AND_REFERER';
}

/**
 * Normalizes an origin or referer candidate into an exact scheme://host(:port) string.
 */
export function normalizeOrigin(originCandidate: string): string | null {
  try {
    const parsed = new URL(originCandidate);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

/**
 * Validates a normalized origin against the explicit allowlist.
 * Allows an optional explicit previewHost parameter for pure dependency injection during testing.
 */
export function isWhitelistedOrigin(origin: string, explicitPreviewHost?: string): boolean {
  if (ALLOWED_DEV_ORIGINS.has(origin)) return true;
  if (origin === CANONICAL_PRODUCTION_ORIGIN) return true;

  // Exact preview host comparison if VERCEL_URL is provided or set in environment
  const previewHost = explicitPreviewHost !== undefined ? explicitPreviewHost : process.env.VERCEL_URL;
  if (previewHost) {
    const cleanHost = previewHost.replace(/^https?:\/\//, '').trim();
    if (cleanHost && origin === `https://${cleanHost}`) {
      return true;
    }
  }

  return false;
}

/**
 * Validates incoming HTTP Origin and Referer headers.
 * 
 * Precedence & Rules:
 * 1. If Origin header is present, it MUST be valid. An invalid Origin cannot be overridden by a valid Referer.
 * 2. If Origin header is absent, Referer header is inspected as a fallback.
 * 3. If both Origin and Referer are absent, the request is rejected by default to block unanchored bot injections.
 */
export function validateCollectionOrigin(
  originHeader: string | string[] | undefined,
  refererHeader: string | string[] | undefined,
  explicitPreviewHost?: string
): OriginValidationResult {
  const originStr = typeof originHeader === 'string'
    ? originHeader.trim()
    : Array.isArray(originHeader)
      ? originHeader[0]?.trim()
      : undefined;

  const refererStr = typeof refererHeader === 'string'
    ? refererHeader.trim()
    : Array.isArray(refererHeader)
      ? refererHeader[0]?.trim()
      : undefined;

  // 1. If Origin header is present, it MUST be valid.
  if (originStr) {
    const normalized = normalizeOrigin(originStr);
    if (!normalized || !isWhitelistedOrigin(normalized, explicitPreviewHost)) {
      return { isAuthorized: false, reason: 'ORIGIN_DISALLOWED' };
    }
    return { isAuthorized: true };
  }

  // 2. If Origin header is absent, inspect Referer header as fallback
  if (refererStr) {
    const normalized = normalizeOrigin(refererStr);
    if (!normalized || !isWhitelistedOrigin(normalized, explicitPreviewHost)) {
      return { isAuthorized: false, reason: 'REFERER_DISALLOWED' };
    }
    return { isAuthorized: true };
  }

  // 3. If both Origin and Referer are absent:
  return { isAuthorized: false, reason: 'MISSING_ORIGIN_AND_REFERER' };
}

