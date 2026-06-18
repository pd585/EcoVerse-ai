/**
 * AI safety guardrails configuration.
 * Defines content filtering, topic boundaries, and safety checks.
 * @module lib/ai/guardrails
 */

/**
 * Content safety check result.
 */
export interface GuardrailResult {
  readonly isAllowed: boolean;
  readonly reason?: string;
  readonly filteredContent?: string;
}

/**
 * Configuration for content safety guardrails.
 */
export interface GuardrailConfig {
  /** Topics the AI is allowed to discuss */
  readonly allowedTopics: readonly string[];
  /** Topics that should be explicitly refused */
  readonly blockedTopics: readonly string[];
  /** Maximum response length in characters */
  readonly maxResponseLength: number;
  /** Whether to filter personal data from responses */
  readonly filterPersonalData: boolean;
}

/**
 * Default guardrail configuration for the sustainability coach.
 */
export const DEFAULT_GUARDRAILS: GuardrailConfig = {
  allowedTopics: [
    'carbon footprint',
    'sustainability',
    'renewable energy',
    'conservation',
    'recycling',
    'climate change',
    'eco-friendly practices',
    'environmental science',
    'green transportation',
    'sustainable diet',
  ],
  blockedTopics: [
    'medical advice',
    'financial investment advice',
    'political opinions',
    'legal advice',
  ],
  maxResponseLength: 2000,
  filterPersonalData: true,
};

/**
 * Validates user input against guardrail configuration.
 * @param input - The user's message text
 * @param config - Guardrail configuration to apply
 * @returns Validation result
 */
export function validateInput(
  _input: string,
  _config: GuardrailConfig = DEFAULT_GUARDRAILS
): GuardrailResult {
  // Implementation placeholder
  // Will check:
  // - Input against blocked topics
  // - Input length limits
  // - Personal data patterns
  // - Injection attack patterns
  return { isAllowed: true };
}

/**
 * Validates AI output against guardrail configuration.
 * @param output - The AI's response text
 * @param config - Guardrail configuration to apply
 * @returns Validation result with potentially filtered content
 */
export function validateOutput(
  _output: string,
  _config: GuardrailConfig = DEFAULT_GUARDRAILS
): GuardrailResult {
  // Implementation placeholder
  return { isAllowed: true };
}
