import { AIMessage, AIProviderResponse } from '../types';
import { AIProvider, AIProviderOptions } from './ai-provider';
import { env } from '@/lib/config/env';

export class OpenRouterProvider implements AIProvider {
  readonly id = 'openrouter';
  private defaultModel = 'google/gemini-2.5-flash';

  async generateResponse(
    messages: AIMessage[],
    options?: AIProviderOptions
  ): Promise<AIProviderResponse> {
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured.');
    }

    const model = options?.model || this.defaultModel;
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const payload: any = {
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    if (options?.temperature !== undefined) {
      payload.temperature = options.temperature;
    }
    if (options?.maxTokens !== undefined) {
      payload.max_tokens = options.maxTokens;
    }

    const timeoutMs = options?.timeoutMs || 15000;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://ecoverse.earth',
          'X-Title': 'EcoVerse AI',
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(
          `OpenRouter API request failed with status ${response.status}: ${errorBody || response.statusText}`
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const text = choice?.message?.content;

      if (text === undefined) {
        throw new Error('Invalid or empty response format received from OpenRouter API.');
      }

      return {
        content: text,
        model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens || 0,
              completionTokens: data.usage.completion_tokens || 0,
              totalTokens: data.usage.total_tokens || 0,
            }
          : undefined,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`OpenRouter API request timed out after ${timeoutMs}ms.`);
      }
      throw err;
    }
  }
}
