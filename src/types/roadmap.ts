/**
 * Sustainability roadmap type definitions.
 * @module types/roadmap
 */

import type { ID, Timestamp } from './common';

/** Difficulty level for roadmap actions */
export type ActionDifficulty = 'beginner' | 'intermediate' | 'advanced';

/** Status of a roadmap action */
export type ActionStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

/** Frequency of recurring actions */
export type ActionFrequency = 'daily' | 'weekly' | 'monthly' | 'one-time';

/** A single action in the sustainability roadmap */
export interface RoadmapAction {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly difficulty: ActionDifficulty;
  readonly frequency: ActionFrequency;
  readonly estimatedImpactKg: number;
  readonly status: ActionStatus;
  readonly dueDate?: Timestamp;
  readonly completedAt?: Timestamp;
}

/** A milestone grouping related actions */
export interface RoadmapMilestone {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly actions: readonly RoadmapAction[];
  readonly targetDate: Timestamp;
  readonly rewardBadge?: string;
  readonly order: number;
}

/** Progress tracking for the roadmap */
export interface RoadmapProgress {
  readonly userId: ID;
  readonly completedActions: number;
  readonly totalActions: number;
  readonly currentMilestoneId: ID;
  readonly totalCarbonSavedKg: number;
  readonly streak: number;
  readonly lastActivityAt: Timestamp;
}

/** Complete user roadmap */
export interface Roadmap {
  readonly id: ID;
  readonly userId: ID;
  readonly milestones: readonly RoadmapMilestone[];
  readonly progress: RoadmapProgress;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}
