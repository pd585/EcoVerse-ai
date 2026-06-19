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

  it('should return null if any question is missing', () => {
    const record = {
      transport: 1,
      energy: 2,
      food: 3,
      shopping: 2,
      // interest is missing
    };
    const profile = buildPersonalityProfile(record as any);
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

  it('should resolve to Green Guardian archetype with green weights', () => {
    const record = {
      transport: 1,
      energy: 2,
      food: 3,
      shopping: 3,
      interest: 2,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.id).toBe('greenGuardian');
    expect(profile?.name).toBe('Green Guardian');
    expect(profile?.emoji).toBe('🌿');
  });

  it('should resolve to Nature Protector archetype with matching inputs', () => {
    const record = {
      transport: 3,
      energy: 2,
      food: 3,
      shopping: 1,
      interest: 2,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.id).toBe('natureProtector');
    expect(profile?.emoji).toBe('🛡️');
  });

  it('should resolve to Climate Champion archetype with matching inputs', () => {
    const record = {
      transport: 2,
      energy: 3,
      food: 2,
      shopping: 1,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.id).toBe('climateChampion');
    expect(profile?.emoji).toBe('⚡');
  });

  it('should resolve to Future Builder archetype with matching inputs', () => {
    const record = {
      transport: 1,
      energy: 3,
      food: 2,
      shopping: 2,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.id).toBe('futureBuilder');
    expect(profile?.emoji).toBe('🚀');
  });

  it('should resolve to Community Catalyst archetype with matching inputs', () => {
    const record = {
      transport: 1,
      energy: 2,
      food: 2,
      shopping: 3,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.id).toBe('communityCatalyst');
    expect(profile?.emoji).toBe('🌎');
  });

  it('should match score bounds for highly eco-conscious inputs', () => {
    const record = {
      transport: 3,
      energy: 3,
      food: 3,
      shopping: 3,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.startScore).toBe(5.7); // 12.6 - 3 * 2.3 = 5.7
    expect(profile?.result.totalCarbonKg).toBe(5700);
    expect(profile?.result.comparedToAverage).toBe(5.5); // 11.2 - 5.7 = 5.5
  });

  it('should map specific recommendations for low transportation score', () => {
    const record = {
      transport: 1,
      energy: 3,
      food: 3,
      shopping: 3,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.result.recommendations).toContain(
      'Try replacing one or two car trips with transit, biking, or walking each week.'
    );
  });

  it('should map specific recommendations for low energy score', () => {
    const record = {
      transport: 3,
      energy: 1,
      food: 3,
      shopping: 3,
      interest: 3,
    };
    const profile = buildPersonalityProfile(record);
    expect(profile?.result.recommendations).toContain(
      'Explore a renewable energy plan or add solar to your home energy mix.'
    );
  });
});
