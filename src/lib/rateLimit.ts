import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Edge-compatible Upstash Redis client
export const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

// Auth limiter: 5 requests / 15 minutes
export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'ecoverse_ratelimit_auth',
    })
  : null;

// General API limiter: 60 requests per 1 minute
export const generalRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      analytics: true,
      prefix: 'ecoverse_ratelimit_general',
    })
  : null;

// AI Chat limiter: 10 requests per 1 minute
export const aiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ecoverse_ratelimit_ai',
    })
  : null;

// Fallback in-memory rate limiter for testing and development environments
class InMemoryFallbackLimiter {
  private requests = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string) {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    // Filter out expired timestamps
    const activeTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    if (activeTimestamps.length >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: now + this.windowMs,
      };
    }
    
    activeTimestamps.push(now);
    this.requests.set(identifier, activeTimestamps);
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - activeTimestamps.length,
      reset: now + this.windowMs,
    };
  }
}

export const fallbackAuthLimiter = new InMemoryFallbackLimiter(5, 15 * 60 * 1000);
export const fallbackGeneralLimiter = new InMemoryFallbackLimiter(60, 60 * 1000);
export const fallbackAiLimiter = new InMemoryFallbackLimiter(10, 60 * 1000);

export async function checkRateLimit(identifier: string, type: 'auth' | 'general' | 'ai') {
  if (type === 'ai') {
    if (aiRateLimiter) {
      return await aiRateLimiter.limit(identifier);
    }
    return await fallbackAiLimiter.limit(identifier);
  } else if (type === 'auth') {
    if (authRateLimiter) {
      return await authRateLimiter.limit(identifier);
    }
    return await fallbackAuthLimiter.limit(identifier);
  } else {
    if (generalRateLimiter) {
      return await generalRateLimiter.limit(identifier);
    }
    return await fallbackGeneralLimiter.limit(identifier);
  }
}
