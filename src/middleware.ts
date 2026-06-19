/**
 * Next.js Middleware — Rate Limiting & Security
 * Implements Edge-compatible distributed rate limiting using Upstash Redis.
 * @module middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

// ────────────────────── Rate Limit Configuration ──────────────────────

interface RateLimitConfig {
  type: 'auth' | 'general' | 'ai';
  maxRequests: number;
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
      type: 'auth',
      maxRequests: 5,
      keyExtractor: (req) => `auth:${getClientIP(req)}`,
    },
  },
  {
    // AI endpoints: 10 requests / minute / user
    matcher: (pathname) => pathname.startsWith('/api/ai'),
    config: {
      type: 'ai',
      maxRequests: 10,
      keyExtractor: (req) => `ai:${getUserIdentifier(req)}`,
    },
  },
  {
    // General API endpoints: 60 requests / minute / user
    matcher: (pathname) => pathname.startsWith('/api'),
    config: {
      type: 'general',
      maxRequests: 60,
      keyExtractor: (req) => `general:${getUserIdentifier(req)}`,
    },
  },
];

// ────────────────────── Middleware Handler ──────────────────────

export async function middleware(req: NextRequest) {
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
  const result = await checkRateLimit(key, config.type);

  if (!result.success) {
    // Upstash/Fallback limiter returns reset timestamp in ms
    const retryAfterMs = result.reset - Date.now();
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSeconds),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
