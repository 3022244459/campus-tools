import type {NextFunction, Request, Response} from 'express';
import type {ServerConfig} from '../config.ts';

interface RateBucket {
  count: number;
  resetAt: number;
}

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

export function createSecurityHeadersMiddleware() {
  return function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction) {
    for (const [header, value] of Object.entries(securityHeaders)) {
      res.header(header, value);
    }

    next();
  };
}

export function createCorsMiddleware(config: ServerConfig) {
  const allowedOrigins = new Set(config.corsOrigins);
  const allowAnyOrigin = allowedOrigins.has('*');

  return function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.header('origin');

    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (origin && (allowAnyOrigin || allowedOrigins.has(origin))) {
      res.header('Access-Control-Allow-Origin', allowAnyOrigin ? '*' : origin);
    }

    if (req.method === 'OPTIONS') {
      if (origin && !allowAnyOrigin && !allowedOrigins.has(origin)) {
        res.status(403).json({message: 'Origin is not allowed by CORS policy.'});
        return;
      }

      res.status(204).end();
      return;
    }

    next();
  };
}

export function createRateLimitMiddleware(config: ServerConfig) {
  const buckets = new Map<string, RateBucket>();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next();
      return;
    }

    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const current = buckets.get(key);
    const bucket = current && current.resetAt > now
      ? current
      : {count: 0, resetAt: now + config.rateLimitWindowMs};

    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, config.rateLimitMaxRequests - bucket.count);
    res.header('RateLimit-Limit', String(config.rateLimitMaxRequests));
    res.header('RateLimit-Remaining', String(remaining));
    res.header('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > config.rateLimitMaxRequests) {
      res.status(429).json({message: 'Too many requests. Please retry later.'});
      return;
    }

    next();
  };
}
