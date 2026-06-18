/**
 * AI sustainability coach type definitions.
 * @module types/coach
 */

import type { ID, Timestamp } from './common';

/** Coach personality/style */
export type CoachPersonality = 'encouraging' | 'analytical' | 'casual' | 'challenging';

/** Message sender role */
export type MessageRole = 'user' | 'coach' | 'system';

/** A single message in a coach conversation */
export interface CoachMessage {
  readonly id: ID;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: Timestamp;
  readonly metadata?: CoachMessageMeta;
}

/** Metadata attached to coach messages */
export interface CoachMessageMeta {
  readonly suggestedActions?: readonly CoachSuggestion[];
  readonly relatedTopics?: readonly string[];
  readonly confidence?: number;
}

/** Actionable suggestion from the coach */
export interface CoachSuggestion {
  readonly id: ID;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly estimatedImpactKg: number;
  readonly isCompleted: boolean;
}

/** A complete coach conversation */
export interface CoachConversation {
  readonly id: ID;
  readonly userId: ID;
  readonly messages: readonly CoachMessage[];
  readonly personality: CoachPersonality;
  readonly startedAt: Timestamp;
  readonly lastMessageAt: Timestamp;
  readonly topic?: string;
}

/** Coach session configuration */
export interface CoachConfig {
  readonly personality: CoachPersonality;
  readonly maxTokens: number;
  readonly temperature: number;
  readonly contextWindowSize: number;
}
