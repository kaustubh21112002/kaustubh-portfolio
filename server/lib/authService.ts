/**
 * Portfolio Intelligence OS - Session & Authentication Service
 * 
 * Features:
 * - Scrypt / PBKDF2 constant-time verification using native Node.js crypto.
 * - Cryptographically random session tokens (32 bytes hex).
 * - Stores ONLY SHA-256 token hashes in PostgreSQL auth_sessions table.
 * - Session invalidation and epoch comparison.
 * - Strict Origin validation (canonical production, exact preview, dev origins - NO wildcards).
 * - Explicit error boundaries: Distinguishes unconfigured DB, DB errors, and bad credentials.
 * - Zero third-party authentication packages required.
 */

import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

export interface SessionRecord {
  sessionId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export type SessionValidationResult =
  | { status: 'VALID'; session: SessionRecord }
  | { status: 'UNCONFIGURED'; reason: string }
  | { status: 'STORAGE_UNAVAILABLE'; reason: string }
  | { status: 'INVALID'; reason: string };

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export const CANONICAL_PRODUCTION_ORIGIN = 'https://kaustubh-portfolio-six.vercel.app';
export const ALLOWED_DEV_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]);

/**
 * Validates request Origin / Referer against explicit whitelist.
 * Does NOT accept arbitrary *.vercel.app suffixes.
 */
export function isAuthorizedOrigin(originHeader: string | undefined): boolean {
  if (!originHeader) return false;
  try {
    const parsed = new URL(originHeader);
    const origin = `${parsed.protocol}//${parsed.host}`;

    if (ALLOWED_DEV_ORIGINS.has(origin)) return true;
    if (origin === CANONICAL_PRODUCTION_ORIGIN) return true;

    // Only allow exact preview host if configured via VERCEL_URL
    const previewHost = process.env.VERCEL_URL;
    if (previewHost && parsed.host === previewHost) return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Verifies candidate passphrase against stored ANALYTICS_ADMIN_HASH.
 * Enforces strict bounds:
 * - Candidate length: 1 to 256 characters.
 * - Salt length: 16 to 64 bytes (hex: 32 to 128 chars).
 * - Fixed safe scrypt parameters (cost=16384, blockSize=8, parallel=1, maxmem=32MB).
 */
export function verifyPassphrase(candidate: string, storedHash: string): boolean {
  if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > 256) {
    return false;
  }
  if (typeof storedHash !== 'string' || storedHash.length > 512) {
    return false;
  }

  try {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;

    const scheme = parts[0];
    const saltHex = parts[1];
    const expectedHex = parts[2];

    // Validate salt & hash hex formats
    if (!/^[0-9a-fA-F]{32,128}$/.test(saltHex) || !/^[0-9a-fA-F]{64,128}$/.test(expectedHex)) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expectedBuffer = Buffer.from(expectedHex, 'hex');

    if (scheme === 'scrypt') {
      // Fixed safe cost params to prevent CPU DOS
      const derived = crypto.scryptSync(candidate, salt, expectedBuffer.length, {
        N: 16384,
        r: 8,
        p: 1,
        maxmem: 32 * 1024 * 1024
      });
      return crypto.timingSafeEqual(derived, expectedBuffer);
    } else if (scheme === 'pbkdf2') {
      const derived = crypto.pbkdf2Sync(candidate, salt, 100000, expectedBuffer.length, 'sha512');
      return crypto.timingSafeEqual(derived, expectedBuffer);
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Creates a new session in auth_sessions and returns the raw opaque token for the client cookie.
 */
export async function createSession(role = 'admin'): Promise<string> {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    throw new Error('UNCONFIGURED_STORAGE');
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const sql = neon(dbUrl);
  await sql`
    INSERT INTO auth_sessions (
      session_token_hash,
      role,
      expires_at
    )
    VALUES (
      ${tokenHash},
      ${role},
      NOW() + INTERVAL '4 hours'
    );
  `;

  return rawToken;
}

/**
 * Validates a session raw token from the cookie against auth_sessions table.
 * Clearly differentiates:
 * - 'UNCONFIGURED': DATABASE_URL missing.
 * - 'STORAGE_UNAVAILABLE': DB query throws network/connection error.
 * - 'INVALID': Token missing, expired, malformed, or revoked.
 * - 'VALID': Returns session record.
 */
export async function validateSessionToken(rawToken: string): Promise<SessionValidationResult> {
  if (!rawToken || rawToken.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(rawToken)) {
    return { status: 'INVALID', reason: 'Malformed or missing session token format' };
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    return { status: 'UNCONFIGURED', reason: 'DATABASE_URL is not configured' };
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const epochTimestamp = process.env.SESSION_INVALIDATION_EPOCH
      ? parseInt(process.env.SESSION_INVALIDATION_EPOCH, 10)
      : null;

    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT session_id::text, role, created_at::text, expires_at::text
      FROM auth_sessions
      WHERE session_token_hash = ${tokenHash}
        AND is_revoked = FALSE
        AND expires_at > NOW()
        AND (${epochTimestamp}::bigint IS NULL OR created_at >= to_timestamp(${epochTimestamp}::bigint));
    `;

    if (rows.length === 0) {
      return { status: 'INVALID', reason: 'Session token not found, expired, or revoked' };
    }

    return {
      status: 'VALID',
      session: {
        sessionId: rows[0].session_id,
        role: rows[0].role,
        createdAt: rows[0].created_at,
        expiresAt: rows[0].expires_at
      }
    };
  } catch (err: any) {
    return { status: 'STORAGE_UNAVAILABLE', reason: err?.message || 'Database connection error' };
  }
}

/**
 * Revokes a session token immediately in auth_sessions.
 * Distinguishes successful revocation from database errors.
 */
export async function revokeSessionToken(rawToken: string): Promise<{ success: boolean; error?: string }> {
  if (!rawToken || rawToken.length !== 64) {
    return { success: false, error: 'Malformed token' };
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    return { success: false, error: 'UNCONFIGURED_STORAGE' };
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const sql = neon(dbUrl);

    await sql`
      UPDATE auth_sessions
      SET is_revoked = TRUE,
          revoked_at = NOW()
      WHERE session_token_hash = ${tokenHash};
    `;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Storage error during revocation' };
  }
}

/**
 * Parses cookies from Cookie header.
 */
export function parseCookieHeader(cookieHeader: string | string[] | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const header = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader;
  const result: Record<string, string> = {};

  header.split(';').forEach((part) => {
    const [key, ...val] = part.trim().split('=');
    if (key) {
      result[key] = decodeURIComponent(val.join('='));
    }
  });

  return result;
}
