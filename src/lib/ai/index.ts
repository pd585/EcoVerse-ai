/**
 * Barrel export for AI service layer.
 * @module lib/ai
 */

export { buildSystemPrompt, PROMPT_SECTIONS } from './systemPrompt';
export type { SystemPromptContext } from './systemPrompt';

export { createCoachService } from './coachService';
export type { ICoachService } from './coachService';

export { validateInput, validateOutput, DEFAULT_GUARDRAILS } from './guardrails';
export type { GuardrailResult, GuardrailConfig } from './guardrails';
