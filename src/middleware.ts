/**
 * Next.js Middleware — Rate Limiting & Security
 * Implements in-memory sliding-window rate limiting for API routes.
 * @module middleware
 */

import { NextRequest, NextResponse } from 'next/server';

// ────────────────────── In-Memory Rate-Limit Store ──────────────────────
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of rateLimitStore) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks and enforces rate limiting for a given key.
 * Returns the number of seconds to wait if rate limited, or 0 if allowed.
 */
function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  cleanupStaleEntries(windowMs);

  const entry = rateLimitStore.get(key) || { timestamps: [] };

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > now - windowMs);

  if (entry.timestamps.length >= maxRequests) {
    // Calculate retry-after based on the oldest timestamp in the window
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    return {
      allowed: false,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
      remaining: 0,
    };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequests - entry.timestamps.length,
  };
}

// ────────────────────── Rate Limit Configuration ──────────────────────

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyExtractor: (req: NextRequest) => string;
}

function getUserIdentifier(req: NextRequest): string {
  // Try extracting user ID from the Authorization header (JWT Bearer token)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      // Decode JWT payload (base64url) without verification (verification happens in the route handler)
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.sub) return `user:${payload.sub}`;
      }
    } catch (_) {
      // Fall through to IP-based identification
    }
  }

  // Fall back to IP address
  return `ip:${getClientIP(req)}`;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    (req as any).ip ||
    'unknown'
  );
}

const RATE_LIMITS: { matcher: (pathname: string) => boolean; config: RateLimitConfig }[] = [
  {
    // Auth endpoints: 5 requests / 15 minutes / IP
    matcher: (pathname) => pathname.startsWith('/api/auth'),
    config: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      keyExtractor: (req) => `auth:${getClientIP(req)}`,
    },
  },
  {
    // AI endpoints: 10 requests / minute / user
    matcher: (pathname) => pathname.startsWith('/api/ai'),
    config: {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      keyExtractor: (req) => `ai:${getUserIdentifier(req)}`,
    },
  },
  {
    // General API endpoints: 60 requests / minute / user
    matcher: (pathname) => pathname.startsWith('/api'),
    config: {
      maxRequests: 60,
      windowMs: 60 * 1000, // 1 minute
      keyExtractor: (req) => `general:${getUserIdentifier(req)}`,
    },
  },
];

// ────────────────────── Middleware Handler ──────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Find the matching rate limit configuration (first match wins, most specific first)
  const matchedLimit = RATE_LIMITS.find((rl) => rl.matcher(pathname));
  if (!matchedLimit) {
    return NextResponse.next();
  }

  const { config } = matchedLimit;
  const key = config.keyExtractor(req);
  const result = checkRateLimit(key, config.maxRequests, config.windowMs);

  if (!result.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${result.retryAfterSeconds} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfterSeconds),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + result.retryAfterSeconds),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
