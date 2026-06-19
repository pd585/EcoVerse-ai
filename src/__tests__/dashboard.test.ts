import { describe, it, expect, vi } from 'vitest';
import { carbonService } from '@/features/dashboard/services/carbon.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [{ carbon_score: 80, annual_emissions: 4.2 }], error: null })),
          })),
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

describe('Dashboard Service Tests', () => {
  it('should retrieve latest carbon profile from mock database', async () => {
    const { data, error } = await carbonService.getCarbonScore('user-123');
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.carbon_score).toBe(80);
    expect(data?.annual_emissions).toBe(4.2);
  });
});
