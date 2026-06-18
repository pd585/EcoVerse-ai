/**
 * Learning module type definitions.
 * @module types/learn
 */

import type { ID, Timestamp } from './common';

/** Types of learning content */
export type ContentType = 'article' | 'video' | 'quiz' | 'infographic' | 'interactive';

/** Difficulty level for learning content */
export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';

/** A piece of learning content */
export interface LearningContent {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly type: ContentType;
  readonly difficulty: ContentDifficulty;
  readonly durationMinutes: number;
  readonly thumbnailUrl?: string;
  readonly tags: readonly string[];
  readonly order: number;
}

/** A learning module grouping related content */
export interface LearningModule {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly contents: readonly LearningContent[];
  readonly estimatedDurationMinutes: number;
  readonly prerequisiteIds?: readonly ID[];
  readonly order: number;
}

/** User's progress through learning content */
export interface LearningProgress {
  readonly userId: ID;
  readonly moduleId: ID;
  readonly completedContentIds: readonly ID[];
  readonly currentContentId?: ID;
  readonly percentComplete: number;
  readonly startedAt: Timestamp;
  readonly completedAt?: Timestamp;
  readonly quizScores: Record<string, number>;
}

/** Learning path — a curated sequence of modules */
export interface LearningPath {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly modules: readonly LearningModule[];
  readonly estimatedWeeks: number;
  readonly badgeOnCompletion?: string;
}
