import { describe, it, expect, vi } from 'vitest';
import { simulatorService } from '@/features/simulator/services/simulator.service';

const mockInsertSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [{ id: '1', scenario_name: 'test' }], error: null })),
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

describe('Simulator Service Tests', () => {
  it('should fetch simulation history successfully', async () => {
    const { data, error } = await simulatorService.getHistory('user-123');
    expect(error).toBeNull();
    expect(data).toEqual([{ id: '1', scenario_name: 'test' }]);
  });

  it('should return error if getHistory is called without userId', async () => {
    const { data, error } = await simulatorService.getHistory('');
    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(error?.message).toBe('User ID is required.');
  });

  it('should save simulation history successfully', async () => {
    const { data, error } = await simulatorService.saveHistory('user-123', 'Solar Scenario', 4.5, 3.2, 1.3);
    expect(error).toBeNull();
    expect(data).toEqual({
      user_id: 'user-123',
      scenario_name: 'Solar Scenario',
      footprint_before: 4.5,
      footprint_after: 3.2,
      score_change: 1.3,
    });
  });

  it('should return error if saveHistory is called without userId', async () => {
    const { data, error } = await simulatorService.saveHistory('', 'Solar Scenario', 4.5, 3.2, 1.3);
    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(error?.message).toBe('User ID is required.');
  });
});
