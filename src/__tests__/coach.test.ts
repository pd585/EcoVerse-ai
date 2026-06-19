import { describe, it, expect, vi } from 'vitest';
import { COACH_FALLBACKS } from '@/data/daily-data';
import { coachService } from '@/features/coach/services/coach.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

describe('AI Coach Tests', () => {
  it('should load fallback configurations correctly', () => {
    expect(COACH_FALLBACKS).toBeDefined();
    expect(COACH_FALLBACKS.length).toBeGreaterThan(0);
    expect(typeof COACH_FALLBACKS[0]).toBe('string');
  });

  it('should fetch empty history successfully from mock database', async () => {
    const { data, error } = await coachService.getHistory('user-123');
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
