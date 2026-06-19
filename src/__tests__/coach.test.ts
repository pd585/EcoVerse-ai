import { describe, it, expect, vi } from 'vitest';
import { COACH_FALLBACKS } from '@/data/daily-data';
import { coachService } from '@/features/coach/services/coach.service';

const mockInsertSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [{ id: '1', message: 'Hello' }], error: null })),
        })),
        single: mockSingle,
      })),
      insert: vi.fn((payload) => ({
        select: mockInsertSelect.mockReturnValue({
          single: mockSingle.mockImplementation(() => Promise.resolve({ data: payload, error: null })),
        }),
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

  it('should fetch history successfully from mock database', async () => {
    const { data, error } = await coachService.getHistory('user-123');
    expect(error).toBeNull();
    expect(data).toEqual([{ id: '1', message: 'Hello' }]);
  });

  it('should return error if getHistory is called without userId', async () => {
    const { data, error } = await coachService.getHistory('');
    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(error?.message).toBe('User ID is required.');
  });

  it('should save a message successfully', async () => {
    const { data, error } = await coachService.saveMessage('user-123', 'user', 'Test message');
    expect(error).toBeNull();
    expect(data).toEqual({
      user_id: 'user-123',
      role: 'user',
      message: 'Test message',
    });
  });

  it('should return error if saveMessage is called with missing parameters', async () => {
    const res1 = await coachService.saveMessage('', 'user', 'Test');
    expect(res1.data).toBeNull();
    expect(res1.error?.message).toBe('User ID, role, and message are required.');

    const res2 = await coachService.saveMessage('user-123', '' as any, 'Test');
    expect(res2.data).toBeNull();
    expect(res2.error?.message).toBe('User ID, role, and message are required.');

    const res3 = await coachService.saveMessage('user-123', 'user', '');
    expect(res3.data).toBeNull();
    expect(res3.error?.message).toBe('User ID, role, and message are required.');
  });
});
