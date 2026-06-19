import { describe, it, expect } from 'vitest';
import { buildPersonalityProfile, mapAnswersToRecord } from '@/features/assessment/utils/personality';

describe('Assessment Utility Tests', () => {
  it('should map answers list to key-value record', () => {
    const answers = [
      { questionId: 'transport', value: 1 },
      { questionId: 'energy', value: 2 },
      { questionId: 'food', value: 3 },
      { questionId: 'shopping', value: 2 },
      { questionId: 'interest', value: 3 },
    ];
    const record = mapAnswersToRecord(answers as any);
    expect(record.transport).toBe(1);
    expect(record.energy).toBe(2);
    expect(record.food).toBe(3);
    expect(record.shopping).toBe(2);
    expect(record.interest).toBe(3);
  });

  it('should return null for incomplete answers', () => {
    const profile = buildPersonalityProfile({});
    expect(profile).toBeNull();
  });

  it('should calculate valid score and profile metrics', () => {
    const record = {
      transport: 2,
      energy: 2,
      food: 2,
      shopping: 2,
      interest: 2,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile).not.toBeNull();
    if (profile) {
      expect(profile.startScore).toBeGreaterThan(0);
      expect(profile.result.totalCarbonKg).toBeGreaterThan(0);
      expect(profile.result.percentile).toBeGreaterThanOrEqual(14);
      expect(profile.result.percentile).toBeLessThanOrEqual(96);
      expect(profile.result.breakdown).toBeInstanceOf(Array);
      expect(profile.result.recommendations.length).toBeGreaterThan(0);
    }
  });
});
