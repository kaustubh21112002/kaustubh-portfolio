// Serverless Dashboard Telemetry Endpoint
// Strictly guarded by session cookie validation against PostgreSQL auth_sessions.
// Scoped to /api/analytics/dashboard/

import {
  parseCookieHeader,
  validateSessionToken
} from '../../../server/lib/authService.js';
import { getAnalyticsStorage } from '../../../server/lib/analyticsStorage.js';

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

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // 1. Only allow GET for retrieving stats
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are permitted on this endpoint.'
    });
    return;
  }

  // 2. Controlled Configuration Check
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const adminHash = process.env.ANALYTICS_ADMIN_HASH;

  if (!dbUrl || !adminHash) {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNCONFIGURED',
      message: 'Durable analytics storage and authentication are unconfigured in this environment. Persistent historical metrics are unavailable.'
    });
    return;
  }

  // 3. Cookie Extraction & Session Validation with Controlled Error Handling
  const cookies = parseCookieHeader(req.headers.cookie);
  const sessionToken = cookies['portfolio_intelligence_session'];

  if (!sessionToken) {
    res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication session required.'
    });
    return;
  }

  const validation = await validateSessionToken(sessionToken);

  if (validation.status === 'UNCONFIGURED') {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNCONFIGURED',
      message: 'Storage is unconfigured in this environment.'
    });
    return;
  }

  if (validation.status === 'STORAGE_UNAVAILABLE') {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      message: 'Durable storage is currently unreachable.'
    });
    return;
  }

  if (validation.status === 'INVALID') {
    res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Session is invalid, expired, or has been revoked.'
    });
    return;
  }

  // 4. Telemetry Retrieval from Storage
  const storage = getAnalyticsStorage();

  try {
    const summary = await storage.getSummary();
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      message: 'Failed to retrieve telemetry from durable storage.'
    });
  }
}
