// Serverless Analytics Aggregation & Dashboard Stats Endpoint for Vercel
// Strictly guarded by server-side Bearer token authentication.
// Rejects unauthenticated requests with 401 Unauthorized.
// Returns truthful telemetry metadata and unconfigured storage warnings.

import { getAnalyticsStorage } from '../lib/analyticsStorage';
import { syncDailyAggregatesToSheets } from '../lib/sheetsSync';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  url?: string;
  query?: Record<string, string | string[]>;
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
  // 1. Allow GET for stats retrieval, POST for triggering sync
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET and POST requests are permitted.'
    });
    return;
  }

  // 2. Server-side Bearer Token Authentication
  // Expects Authorization: Bearer <INTELLIGENCE_AUTH_KEY>
  const configuredAuthKey = process.env.PORTFOLIO_INTELLIGENCE_KEY;
  const authHeader = req.headers.authorization;

  // If no auth key is configured in environment, keep dashboard inaccessible
  if (!configuredAuthKey) {
    res.status(503).json({
      success: false,
      code: 'AUTH_UNCONFIGURED',
      message: 'Portfolio Intelligence authentication is not configured in server environment. Dashboard access remains securely locked.'
    });
    return;
  }

  const expectedBearer = `Bearer ${configuredAuthKey}`;
  if (!authHeader || authHeader !== expectedBearer) {
    res.setHeader('WWW-Authenticate', 'Bearer realm="Portfolio Intelligence OS"');
    res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Valid Bearer token is required to access analytics telemetry.'
    });
    return;
  }

  const storage = getAnalyticsStorage();

  // 3. Handle POST for Google Sheets manual sync trigger
  if (req.method === 'POST') {
    const aggregates = await storage.getDailyAggregatesForSync();
    const syncResult = await syncDailyAggregatesToSheets(aggregates);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({
      success: true,
      sync: syncResult
    });
    return;
  }

  // 4. Handle GET for telemetry summary
  const summary = await storage.getSummary();

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({
    success: true,
    data: summary
  });
}
