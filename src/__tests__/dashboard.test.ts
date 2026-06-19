import { describe, it, expect, vi } from 'vitest';
import { carbonService } from '@/features/dashboard/services/carbon.service';

const mockInsertSelect = vi.fn();
const mockSingle = vi.fn();

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
      insert: vi.fn((payload) => ({
        select: mockInsertSelect.mockReturnValue({
          single: mockSingle.mockImplementation(() => Promise.resolve({ data: payload, error: null })),
        }),
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

  it('should return error if getCarbonScore is called without userId', async () => {
    const { data, error } = await carbonService.getCarbonScore('');
    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(error?.message).toBe('User ID is required.');
  });

  it('should record an emission change successfully', async () => {
    const { data, error } = await carbonService.recordEmissionChange('user-123', 85, 3.8);
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.carbon_score).toBe(85);
    expect(data?.annual_emissions).toBe(3.8);
    expect(data?.user_id).toBe('user-123');
  });

  it('should return error if recordEmissionChange is called without userId', async () => {
    const { data, error } = await carbonService.recordEmissionChange('', 85, 3.8);
    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(error?.message).toBe('User ID is required.');
  });
});
