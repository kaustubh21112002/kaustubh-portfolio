// Deprecated Legacy Stats Endpoint
// Returns 410 Gone with non-sensitive deprecation notice.
// Authenticated dashboard telemetry has securely moved to /api/analytics/dashboard/stats.

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
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(410).json({
    success: false,
    code: 'ENDPOINT_DEPRECATED',
    message: 'This endpoint has been deprecated. Authenticated dashboard telemetry has moved to /api/analytics/dashboard/stats.'
  });
}
