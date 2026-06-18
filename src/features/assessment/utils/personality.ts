/**
 * Personality scoring utilities for the assessment flow.
 * @module features/assessment/utils/personality
 */

import { onboardingQuestions } from '@/data/eco-data';
import type { AssessmentAnswer, AssessmentResult } from '@/types';

export type PersonalityId =
  | 'greenGuardian'
  | 'natureProtector'
  | 'climateChampion'
  | 'futureBuilder'
  | 'communityCatalyst';

export interface PersonalityProfile {
  readonly id: PersonalityId;
  readonly name: string;
  readonly emoji: string;
  readonly tagline: string;
  readonly desc: string;
  readonly traits: readonly string[];
  readonly startScore: number;
  readonly result: AssessmentResult;
}

const archetypes = [
  {
    id: 'greenGuardian' as const,
    name: 'Green Guardian',
    emoji: '🌿',
    tagline: 'Steady, principled, and quietly powerful.',
    desc: 'You protect what matters through consistent, thoughtful action. You don’t chase trends — you build habits that last and inspire those around you.',
    traits: ['Consistent', 'Nature-first', 'Community-minded'] as const,
    weights: {
      transport: 1,
      energy: 2,
      food: 3,
      shopping: 3,
      interest: 2,
    },
  },
  {
    id: 'natureProtector' as const,
    name: 'Nature Protector',
    emoji: '🛡️',
    tagline: 'Rooted in wonder, protective of wild spaces.',
    desc: 'You prioritize nature first and choose actions that nourish ecosystems and leave room for the next generation.',
    traits: ['Conservation-minded', 'Earth-focused', 'Stewardship'] as const,
    weights: {
      transport: 3,
      energy: 2,
      food: 3,
      shopping: 1,
      interest: 2,
    },
  },
  {
    id: 'climateChampion' as const,
    name: 'Climate Champion',
    emoji: '⚡',
    tagline: 'Bold, driven, and hungry for high-impact change.',
    desc: 'You seek the biggest impact possible and are happiest when your choices accelerate progress toward a cleaner world.',
    traits: ['High-impact', 'Future-focused', 'Change-maker'] as const,
    weights: {
      transport: 2,
      energy: 3,
      food: 2,
      shopping: 2,
      interest: 3,
    },
  },
  {
    id: 'futureBuilder' as const,
    name: 'Future Builder',
    emoji: '🚀',
    tagline: 'Curious, tactical, and always building toward a cleaner future.',
    desc: 'You blend innovation with everyday habits. You want change that lasts, and you’re ready to help shape what comes next.',
    traits: ['Innovative', 'Strategic', 'Tech-savvy'] as const,
    weights: {
      transport: 1,
      energy: 3,
      food: 1,
      shopping: 2,
      interest: 3,
    },
  },
  {
    id: 'communityCatalyst' as const,
    name: 'Community Catalyst',
    emoji: '🌎',
    tagline: 'People-powered, inclusive, and deeply connected.',
    desc: 'You know change is stronger when it is shared. You build momentum through community, encouragement, and practical support.',
    traits: ['Community-first', 'Supportive', 'Inclusive'] as const,
    weights: {
      transport: 1,
      energy: 1,
      food: 2,
      shopping: 3,
      interest: 3,
    },
  },
] as const;

function normalizeAnswerValue(value: string | number | readonly string[]): number {
  if (Array.isArray(value)) {
    return normalizeAnswerValue(value[0]);
  }

  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function mapAnswersToRecord(answers: readonly AssessmentAnswer[]) {
  return answers.reduce<Record<string, number>>((record, answer) => {
    record[answer.questionId] = normalizeAnswerValue(answer.value);
    return record;
  }, {});
}

export function buildPersonalityProfile(
  answers: Record<string, number>
): PersonalityProfile | null {
  const questionKeys = onboardingQuestions.map((question) => question.key);
  const hasAllAnswers = questionKeys.every(
    (key) => typeof answers[key] === 'number' && !Number.isNaN(answers[key])
  );

  if (!hasAllAnswers) {
    return null;
  }

  const totalAnswerScore = questionKeys.reduce(
    (sum, key) => sum + answers[key],
    0
  );
  const averageAnswer = totalAnswerScore / questionKeys.length;

  const startScore = Number(
    Math.max(3.4, Math.min(13.4, 12.6 - averageAnswer * 2.3)).toFixed(1)
  );
  const totalCarbonKg = Math.round(startScore * 1000);

  const categoryWeights = {
    transportation: (3 - answers.transport) + 1,
    energy: (3 - answers.energy) + 1,
    food: (3 - answers.food) + 0.8,
    shopping: (3 - answers.shopping) + 0.7,
    housing: 1.2,
    waste: 0.9,
  } as const;

  const totalCategoryWeight = Object.values(categoryWeights).reduce(
    (sum, value) => sum + value,
    0
  );

  const breakdown: AssessmentResult['breakdown'] = (
    Object.entries(categoryWeights) as Array<[
      keyof AssessmentResult['breakdown'][number]['category'],
      number
    ]>
  ).map(([category, weight]) => ({
    category,
    carbonKg: Math.round((weight / totalCategoryWeight) * totalCarbonKg),
    percentage: Math.max(
      2,
      Math.round((weight / totalCategoryWeight) * 100)
    ),
  })) as unknown as AssessmentResult['breakdown'];

  const percentile = Math.min(
    96,
    Math.max(14, Math.round(75 + (7 - startScore) * 4))
  );
  const comparedToAverage = Number((11.2 - startScore).toFixed(1));

  const recommendations: string[] = [];

  if (answers.transport <= 1) {
    recommendations.push(
      'Try replacing one or two car trips with transit, biking, or walking each week.'
    );
  } else if (answers.transport === 2) {
    recommendations.push(
      'Swap a few short drives for public transit or bike rides to cut transport emissions.'
    );
  }

  if (answers.energy <= 1) {
    recommendations.push(
      'Explore a renewable energy plan or add solar to your home energy mix.'
    );
  } else if (answers.energy === 2) {
    recommendations.push(
      'Look for ways to make your energy use even cleaner with green tariff options.'
    );
  }

  if (answers.food <= 1) {
    recommendations.push(
      'Try three plant-based meals a week to reduce your food footprint significantly.'
    );
  } else if (answers.food === 2) {
    recommendations.push(
      'Shift a few more meals toward plant-based choices for greater impact.'
    );
  }

  if (recommendations.length < 3) {
    recommendations.push(
      'Continue building easy green habits and track your progress with the dashboard.'
    );
  }

  const archetype = archetypes.reduce<
    { profile: (typeof archetypes)[number]; score: number }
  >((best, candidate) => {
    const candidateScore = questionKeys.reduce(
      (sum, key) => sum + candidate.weights[key] * answers[key],
      0
    );
    return candidateScore > best.score
      ? { profile: candidate, score: candidateScore }
      : best;
  }, { profile: archetypes[0], score: -Infinity }).profile;

  return {
    id: archetype.id,
    name: archetype.name,
    emoji: archetype.emoji,
    tagline: archetype.tagline,
    desc: archetype.desc,
    traits: [...archetype.traits],
    startScore,
    result: {
      totalCarbonKg,
      breakdown,
      percentile,
      comparedToAverage,
      recommendations,
    },
  };
}
