/**
 * AI system prompt configuration.
 * Defines the personality, boundaries, and behavior of the EcoVerse AI coach.
 * @module lib/ai/systemPrompt
 */

/**
 * System prompt template variables.
 * Populated at runtime with user-specific context.
 */
export interface SystemPromptContext {
  readonly userName: string;
  readonly userCarbonFootprint?: number;
  readonly personalityStyle: string;
  readonly currentDate: string;
  readonly completedActions?: number;
}

/**
 * Generates the system prompt for the AI sustainability coach.
 * @param context - User-specific context to inject into the prompt
 * @returns The complete system prompt string
 */
export function buildSystemPrompt(_context: SystemPromptContext): string {
  // Implementation placeholder
  // Will construct a detailed system prompt incorporating:
  // - Coach persona and tone
  // - Sustainability domain knowledge boundaries
  // - User personalization context
  // - Safety guardrails references
  // - Response format guidelines
  return '';
}

/**
 * Prompt template sections — kept separate for testability and composability.
 */
export const PROMPT_SECTIONS = {
  PERSONA: 'persona',
  KNOWLEDGE_BOUNDARY: 'knowledge_boundary',
  USER_CONTEXT: 'user_context',
  SAFETY: 'safety',
  FORMAT: 'format',
} as const;
