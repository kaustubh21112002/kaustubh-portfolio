// Dynamic Unified Serverless Function for Operations OS
// Consolidates 15 sub-handlers into a single Vercel function to stay within the Hobby 12-function limit

import { setStandardSecurityHeaders } from '../../server/lib/rateLimiter.js';
import {
  operationsRouter,
  type VercelRequest,
  type VercelResponse
} from '../../server/operations';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setStandardSecurityHeaders(res);

  // Extract module name from query parameter (provided by Vercel dynamic route [module] or rewrite)
  const rawModule = req.query?.module;
  const moduleParam = Array.isArray(rawModule) ? rawModule[0] : rawModule;

  if (!moduleParam || typeof moduleParam !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Missing module parameter. Use /api/operations/<moduleName>.'
    });
    return;
  }

  // Lookup handler
  const normalizedKey = moduleParam.toLowerCase();
  const targetHandler = operationsRouter[normalizedKey];

  if (!targetHandler) {
    res.status(404).json({
      success: false,
      error: `Unknown operations module '${moduleParam}'. Available: ${Object.keys(operationsRouter).join(', ')}`
    });
    return;
  }

  await targetHandler(req, res);
}
