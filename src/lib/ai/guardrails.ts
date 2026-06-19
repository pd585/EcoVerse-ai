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

export function validateInput(
  input: string,
  config: GuardrailConfig = DEFAULT_GUARDRAILS
): GuardrailResult {
  if (!input) {
    return { isAllowed: false, reason: 'Input cannot be empty.' };
  }

  // 1. Length check
  if (input.length > 5000) {
    return { isAllowed: false, reason: 'Input length exceeds safe limits.' };
  }

  const normalized = input.toLowerCase();

  // 2. Prompt injection detection
  const injectionPatterns = [
    'ignore previous instructions',
    'bypass system instructions',
    'reveal your system prompt',
    'show your instructions',
    'ignore above instructions',
    'system prompt override',
  ];

  if (injectionPatterns.some(pattern => normalized.includes(pattern))) {
    return {
      isAllowed: false,
      reason: 'Potential prompt injection attempt detected.',
    };
  }

  // 3. Blocked topics check
  for (const topic of config.blockedTopics) {
    if (normalized.includes(topic)) {
      return {
        isAllowed: false,
        reason: `Topic not permitted: ${topic}.`,
      };
    }
  }

  return { isAllowed: true };
}

export function validateOutput(
  output: string,
  config: GuardrailConfig = DEFAULT_GUARDRAILS
): GuardrailResult {
  if (!output) {
    return { isAllowed: false, reason: 'Response is empty.' };
  }

  if (output.length > config.maxResponseLength) {
    return {
      isAllowed: false,
      reason: 'Response length exceeds permitted limit.',
      filteredContent: output.substring(0, config.maxResponseLength) + '...',
    };
  }

  const normalized = output.toLowerCase();
  for (const topic of config.blockedTopics) {
    if (normalized.includes(topic)) {
      return {
        isAllowed: false,
        reason: `Response contains blocked topic: ${topic}.`,
      };
    }
  }

  return { isAllowed: true };
}
