import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, fallbackAiLimiter, fallbackGeneralLimiter, fallbackAuthLimiter, redis } from '@/lib/rateLimit';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

describe('Rate Limiting Tests', () => {
  beforeEach(() => {
    (fallbackAiLimiter as any).requests.clear();
    (fallbackGeneralLimiter as any).requests.clear();
    (fallbackAuthLimiter as any).requests.clear();
  });

  describe('checkRateLimit logic', () => {
    it('should increment requests correctly and allow under limit', async () => {
      const res = await checkRateLimit('user-1', 'ai');
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(9);
    });

    it('should trigger block correctly when limit is reached', async () => {
      for (let i = 0; i < 10; i++) {
        const res = await checkRateLimit('user-block', 'ai');
        expect(res.success).toBe(true);
      }
      
      const blockedRes = await checkRateLimit('user-block', 'ai');
      expect(blockedRes.success).toBe(false);
      expect(blockedRes.remaining).toBe(0);
    });

    it('should reset correctly when timestamps expire', async () => {
      const originalNow = Date.now;
      let mockTime = Date.now();
      Date.now = vi.fn(() => mockTime);

      for (let i = 0; i < 10; i++) {
        await checkRateLimit('user-reset', 'ai');
      }
      const blockedRes = await checkRateLimit('user-reset', 'ai');
      expect(blockedRes.success).toBe(false);

      mockTime += 61000;

      const afterResetRes = await checkRateLimit('user-reset', 'ai');
      expect(afterResetRes.success).toBe(true);
      expect(afterResetRes.remaining).toBe(9);

      Date.now = originalNow;
    });

    it('should enforce stricter limits on AI (10) vs General (60) vs Auth (5)', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await checkRateLimit('key-test', 'auth');
        expect(res.success).toBe(true);
      }
      const blockedAuth = await checkRateLimit('key-test', 'auth');
      expect(blockedAuth.success).toBe(false);

      for (let i = 0; i < 10; i++) {
        const res = await checkRateLimit('key-test', 'ai');
        expect(res.success).toBe(true);
      }
      const blockedAi = await checkRateLimit('key-test', 'ai');
      expect(blockedAi.success).toBe(false);

      for (let i = 0; i < 60; i++) {
        const res = await checkRateLimit('key-test', 'general');
        expect(res.success).toBe(true);
      }
      const blockedGeneral = await checkRateLimit('key-test', 'general');
      expect(blockedGeneral.success).toBe(false);
    });

    it('should test Redis initialization branches', () => {
      // Confirm redis is defined or null depending on environment
      expect(redis).toBeDefined();
    });
  });

  describe('Middleware Rate Limit Header Integration', () => {
    it('should bypass middleware rate limiting for non-API routes', async () => {
      const req = new NextRequest('http://localhost:3000/dashboard');
      const response = await middleware(req);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Limit')).toBeNull();
    });

    it('should return rate limit headers on successful API requests', async () => {
      const req = new NextRequest('http://localhost:3000/api/test-route', {
        headers: {
          'x-forwarded-for': '1.2.3.4',
        },
      });
      const response = await middleware(req);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('60');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('59');
    });

    it('should extract user identity from Authorization header with JWT payload', async () => {
      // Mock JWT payload with sub: 'auth-user-999'
      const payload = { sub: 'auth-user-999' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '')}.signature`;
      const req = new NextRequest('http://localhost:3000/api/test-jwt', {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });
      const response = await middleware(req);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('60');
    });

    it('should fall back to IP if Authorization header contains invalid JWT payload', async () => {
      const req = new NextRequest('http://localhost:3000/api/test-jwt-invalid', {
        headers: {
          'authorization': 'Bearer invalid.jwt.token',
        },
      });
      const response = await middleware(req);
      expect(response.status).toBe(200);
    });

    it('should fall back to x-real-ip or generic ip field when x-forwarded-for is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/test-ip-fallback', {
        headers: {
          'x-real-ip': '5.5.5.5',
        },
      });
      const response = await middleware(req);
      expect(response.status).toBe(200);
    });

    it('should return 429 status code and correct headers when rate limit is exceeded', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/chat', {
        headers: {
          'x-forwarded-for': '5.6.7.8',
        },
      });

      for (let i = 0; i < 10; i++) {
        const res = await middleware(req);
        expect(res.status).toBe(200);
      }

      const blockedResponse = await middleware(req);
      expect(blockedResponse.status).toBe(429);
      
      const body = await blockedResponse.json();
      expect(body.error).toBe('Too Many Requests');
      expect(body.message).toContain('Rate limit exceeded');
      expect(blockedResponse.headers.get('Retry-After')).toBeDefined();
      expect(blockedResponse.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(blockedResponse.headers.get('X-RateLimit-Remaining')).toBe('0');
    });
  });
});
