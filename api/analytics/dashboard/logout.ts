// Serverless Dashboard Logout Endpoint
// Revokes the session token in auth_sessions and clears the browser cookie.
// Distinguishes successful revocation from storage errors while always clearing client cookie.

import {
  isAuthorizedOrigin,
  parseCookieHeader,
  revokeSessionToken
} from '../../../server/lib/authService.js';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  end: () => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

  // 2. Origin & CSRF Check
  const origin = (req.headers.origin || req.headers.referer) as string | undefined;
  if (!isAuthorizedOrigin(origin)) {
    res.status(403).json({
      success: false,
      code: 'CSRF_ORIGIN_REJECTED',
      message: 'Request origin is not authorized.'
    });
    return;
  }

  // 3. Clear Cookie via Expired Header unconditionally
  const clearCookie = [
    'portfolio_intelligence_session=',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/api/analytics/dashboard/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ].join('; ');

  res.setHeader('Set-Cookie', clearCookie);
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // 4. Extract Token and Revoke in Database
  const cookies = parseCookieHeader(req.headers.cookie);
  const sessionToken = cookies['portfolio_intelligence_session'];

  if (!sessionToken) {
    res.status(200).json({
      success: true,
      code: 'ALREADY_LOGGED_OUT',
      message: 'No active session cookie found; client cookie cleared.'
    });
    return;
  }

  const revocationResult = await revokeSessionToken(sessionToken);

  if (!revocationResult.success) {
    res.status(200).json({
      success: true,
      code: 'COOKIE_CLEARED_DATABASE_REVOCATION_SKIPPED',
      message: 'Client cookie cleared. Database session revocation was skipped or unavailable.',
      details: revocationResult.error
    });
    return;
  }

  res.status(200).json({
    success: true,
    code: 'LOGGED_OUT',
    message: 'Session revoked successfully in database and cookie cleared.'
  });
}
