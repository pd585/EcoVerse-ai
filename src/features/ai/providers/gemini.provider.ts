import { AIMessage, AIProviderResponse } from '../types';
import { AIProvider, AIProviderOptions } from './ai-provider';
import { env } from '@/lib/config/env';

export class GeminiProvider implements AIProvider {
  readonly id = 'gemini';
  private defaultModel = 'gemini-2.5-flash';

  async generateResponse(
    messages: AIMessage[],
    options?: AIProviderOptions
  ): Promise<AIProviderResponse> {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = options?.model || this.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    const contents = conversationMessages.map((m) => {
      // Gemini expects role to be 'user' or 'model'
      const role = m.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const payload: any = { contents };

    if (systemMessage) {
      payload.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    if (options?.temperature !== undefined || options?.maxTokens !== undefined) {
      payload.generationConfig = {};
      if (options.temperature !== undefined) {
        payload.generationConfig.temperature = options.temperature;
      }
      if (options.maxTokens !== undefined) {
        payload.generationConfig.maxOutputTokens = options.maxTokens;
      }
    }

    const timeoutMs = options?.timeoutMs || 15000;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(
          `Gemini API request failed with status ${response.status}: ${errorBody || response.statusText}`
        );
      }

      const data = await response.json();
      
      // Extract response content
      const candidate = data.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      const text = part?.text;

      if (text === undefined) {
        throw new Error('Invalid or empty response format received from Gemini API.');
      }

      return {
        content: text,
        model,
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount || 0,
              completionTokens: data.usageMetadata.candidatesTokenCount || 0,
              totalTokens: data.usageMetadata.totalTokenCount || 0,
            }
          : undefined,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Gemini API request timed out after ${timeoutMs}ms.`);
      }
      throw err;
    }
  }
}
