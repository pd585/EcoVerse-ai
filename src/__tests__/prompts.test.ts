import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, PROMPT_SECTIONS } from '@/lib/ai/systemPrompt';

describe('System Prompt Builder Tests', () => {
  it('should define prompt sections correctly', () => {
    expect(PROMPT_SECTIONS.PERSONA).toBe('persona');
    expect(PROMPT_SECTIONS.KNOWLEDGE_BOUNDARY).toBe('knowledge_boundary');
    expect(PROMPT_SECTIONS.USER_CONTEXT).toBe('user_context');
    expect(PROMPT_SECTIONS.SAFETY).toBe('safety');
    expect(PROMPT_SECTIONS.FORMAT).toBe('format');
  });

  it('should construct system prompt with full context', () => {
    const context = {
      userName: 'Alice',
      userCarbonFootprint: 4500,
      personalityStyle: 'Climate Champion',
      currentDate: '2026-06-20',
      completedActions: 5,
    };
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('Alice');
    expect(prompt).toContain('Climate Champion');
    expect(prompt).toContain('4500 kg CO2/year');
    expect(prompt).toContain('completed 5 sustainability actions');
    expect(prompt).toContain('2026-06-20');
  });

  it('should construct system prompt with minimal context (no footprint/actions)', () => {
    const context = {
      userName: 'Bob',
      personalityStyle: 'Green Guardian',
      currentDate: '2026-06-20',
    };
    const prompt = buildSystemPrompt(context);
    expect(prompt).toContain('Bob');
    expect(prompt).toContain('Green Guardian');
    expect(prompt).toContain('Their carbon footprint has not been calculated yet.');
    expect(prompt).toContain('They have not logged any completed actions yet.');
    expect(prompt).toContain('2026-06-20');
  });
});
