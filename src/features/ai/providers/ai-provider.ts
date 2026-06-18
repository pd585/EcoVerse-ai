import { AIMessage, AIProviderResponse } from '../types';

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AIProvider {
  readonly id: 'gemini' | 'openrouter';
  
  /**
   * Generates a response using the implementation-specific API.
   * Standardizes error outputs and handles timeout constraints.
   */
  generateResponse(
    messages: AIMessage[],
    options?: AIProviderOptions
  ): Promise<AIProviderResponse>;
}
