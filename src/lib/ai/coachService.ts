/**
 * AI Coach service layer.
 * Handles communication with the AI backend for coaching conversations.
 * @module lib/ai/coachService
 */

import type { CoachMessage, CoachConversation, CoachConfig } from '@/types';

/**
 * Service interface for the AI sustainability coach.
 * Implementations will handle the actual AI API communication.
 */
export interface ICoachService {
  /** Send a message and receive a coach response */
  sendMessage(conversationId: string, message: string): Promise<CoachMessage>;
  /** Start a new coaching conversation */
  startConversation(config: CoachConfig): Promise<CoachConversation>;
  /** Retrieve conversation history */
  getConversation(conversationId: string): Promise<CoachConversation>;
  /** End a conversation */
  endConversation(conversationId: string): Promise<void>;
}

/**
 * Coach service factory.
 * Returns the appropriate implementation based on environment.
 *
 * @returns An implementation of the coach service
 */
export function createCoachService(): ICoachService {
  // Implementation placeholder
  // Will return either:
  // - Production AI service (API calls to AI backend)
  // - Mock service (for development/testing)
  throw new Error('CoachService not yet implemented');
}
