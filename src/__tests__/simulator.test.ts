import { describe, it, expect, vi } from 'vitest';
import { simulatorService } from '@/features/simulator/services/simulator.service';

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

describe('Simulator Service Tests', () => {
  it('should fetch empty simulation runs successfully', async () => {
    const { data, error } = await simulatorService.getHistory('user-123');
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
