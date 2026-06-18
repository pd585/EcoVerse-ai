import { AIMessage, AIProviderResponse } from '../types';
import { AIProvider, AIProviderOptions } from '../providers/ai-provider';
import { GeminiProvider } from '../providers/gemini.provider';
import { OpenRouterProvider } from '../providers/openrouter.provider';
import { env } from '@/lib/config/env';
import { CARBON_INSIGHT_FALLBACKS, TREND_SUMMARY_FALLBACKS, COACH_FALLBACKS } from '@/data/daily-data';

export class AIService {
  private openrouterProvider: OpenRouterProvider;
  private geminiProvider: GeminiProvider;

  private verifiedChain: Array<{ providerId: string; model: string }> | null = null;
  private lastVerificationTime = 0;
  private readonly VERIFICATION_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.openrouterProvider = new OpenRouterProvider();
    this.geminiProvider = new GeminiProvider();
  }

  /**
   * Performs a live provider verification step testing candidate models.
   * Excludes any models that fail to respond with HTTP 200 or successful content.
   */
  async getVerifiedFallbackChain(): Promise<Array<{ providerId: string; model: string }>> {
    const now = Date.now();
    if (this.verifiedChain && (now - this.lastVerificationTime < this.VERIFICATION_CACHE_TTL)) {
      return this.verifiedChain;
    }

    console.log('[AIService] Running live provider verification step...');
    const candidates = [
      { providerId: 'gemini', model: 'gemini-2.5-flash' },
      { providerId: 'openrouter', model: env.OPENROUTER_PRIMARY_MODEL || 'google/gemma-4-31b-it:free' },
      { providerId: 'openrouter', model: env.OPENROUTER_SECONDARY_MODEL || 'meta-llama/llama-3.3-70b-instruct:free' },
      { providerId: 'openrouter', model: env.OPENROUTER_TERTIARY_MODEL || 'meta-llama/llama-3.2-3b-instruct:free' },
    ];

    const verifiedList: Array<{ providerId: string; model: string }> = [];

    for (const cand of candidates) {
      const startTime = Date.now();
      try {
        let success = false;
        let responseContent = '';

        if (cand.providerId === 'openrouter') {
          if (!env.OPENROUTER_API_KEY) {
            throw new Error('OpenRouter API key is not configured.');
          }
          const response = await this.openrouterProvider.generateResponse(
            [{ role: 'user', content: 'Respond only with the word SUCCESS' }],
            { model: cand.model, timeoutMs: 5000 }
          );
          responseContent = response.content;
          success = responseContent.toUpperCase().includes('SUCCESS');
        } else {
          if (!env.GEMINI_API_KEY) {
            throw new Error('Gemini API key is not configured.');
          }
          const response = await this.geminiProvider.generateResponse(
            [{ role: 'user', content: 'Respond only with the word SUCCESS' }],
            { model: cand.model, timeoutMs: 5000 }
          );
          responseContent = response.content;
          success = responseContent.toUpperCase().includes('SUCCESS');
        }

        const duration = Date.now() - startTime;
        if (success) {
          console.log(`[AIService Verification] Model ${cand.providerId} (${cand.model}) verified successfully in ${duration}ms.`);
          verifiedList.push(cand);
        } else {
          console.warn(`[AIService Verification] Model ${cand.providerId} (${cand.model}) failed verification: Content mismatch (got: "${responseContent}").`);
        }
      } catch (err: any) {
        const duration = Date.now() - startTime;
        console.error(`[AIService Verification] Model ${cand.providerId} (${cand.model}) failed verification in ${duration}ms. Error: ${err.message}`);
      }
    }

    console.log(`[AIService] Fallback chain constructed with ${verifiedList.length} verified models:`, verifiedList);
    this.verifiedChain = verifiedList;
    this.lastVerificationTime = now;
    return this.verifiedChain;
  }

  /**
   * Generates a response using the dynamic fallback chain of verified models.
   */
  async generateResponse(
    messages: AIMessage[],
    options?: AIProviderOptions
  ): Promise<AIProviderResponse> {
    const verifiedChain = await this.getVerifiedFallbackChain();
    
    const errors: string[] = [];
    let currentTrigger = 'Initial Request';

    for (const step of verifiedChain) {
      const startTime = Date.now();
      try {
        console.log(`[AIService] Attempting content generation with ${step.providerId} (${step.model}). Trigger: ${currentTrigger}`);
        
        let response: AIProviderResponse;
        if (step.providerId === 'openrouter') {
          response = await this.openrouterProvider.generateResponse(messages, {
            ...options,
            model: step.model,
          });
        } else {
          response = await this.geminiProvider.generateResponse(messages, {
            ...options,
            model: step.model,
          });
        }

        const duration = Date.now() - startTime;
        console.log(`[AIService Log] Provider: ${step.providerId} | Model: ${step.model} | Status: Success | Duration: ${duration}ms | Fallback Trigger: ${currentTrigger}`);
        return response;
      } catch (err: any) {
        const duration = Date.now() - startTime;
        const errorMsg = err.message || err.toString();
        
        console.error(`[AIService Log] Provider: ${step.providerId} | Model: ${step.model} | Status: Failed (${errorMsg}) | Duration: ${duration}ms | Fallback Trigger: ${currentTrigger}`);
        errors.push(`${step.providerId} (${step.model}): ${errorMsg}`);
        
        // Update trigger for next step
        const isQuotaFailure = errorMsg.includes('429') || 
                               errorMsg.toUpperCase().includes('RESOURCE_EXHAUSTED') || 
                               errorMsg.toLowerCase().includes('quota exceeded');
        if (isQuotaFailure) {
          currentTrigger = `${step.providerId} Quota Exceeded`;
        } else {
          currentTrigger = `${step.providerId} (${step.model}) Failed`;
        }
      }
    }

    // All steps in the chain failed! Return a graceful, friendly failure response message instead of crashing
    console.error(`[AIService Log] Provider: None | Model: None | Status: All Failed | Duration: 0ms | Fallback Trigger: All Models Failed`);
    const randomTip = COACH_FALLBACKS[Math.floor(Math.random() * COACH_FALLBACKS.length)];
    return {
      content: randomTip,
      model: 'graceful-fallback-response',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  /**
   * Safe parses JSON responses, extracting content between BEGIN_JSON and END_JSON,
   * trying markdown code fences, matching curly braces, and repairing syntax errors.
   */
  safeParseAIResponse<T>(
    content: string,
    feature: string,
    customFallback?: T
  ): any {
    if (!content) {
      return customFallback || this.getFallbackForFeature(feature);
    }

    let rawText = content.trim();

    // 1. Extract content between BEGIN_JSON and END_JSON
    const beginIndex = rawText.indexOf('BEGIN_JSON');
    const endIndex = rawText.indexOf('END_JSON');
    if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
      rawText = rawText.substring(beginIndex + 'BEGIN_JSON'.length, endIndex).trim();
    } else {
      // If markers are missing, try extracting clean JSON block from code fences
      const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
      const match = rawText.match(jsonBlockRegex);
      if (match && match[1]) {
        rawText = match[1].trim();
      }
    }

    // 2. Try direct JSON.parse
    try {
      return JSON.parse(rawText);
    } catch (err) {
      console.warn(`[safeParseAIResponse] Direct parse failed for feature "${feature}". Attempting brace extraction/repair...`);
    }

    // 3. Extract first valid JSON object sequence { ... }
    try {
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(candidate);
      }
    } catch (err) {
      console.warn(`[safeParseAIResponse] Brace sequence parse failed for feature "${feature}".`);
    }

    // 4. Try basic repair: replace smart quotes, strip trailing commas
    try {
      let repaired = rawText;
      const firstBrace = repaired.indexOf('{');
      const lastBrace = repaired.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        repaired = repaired.substring(firstBrace, lastBrace + 1);
      }
      // Replace smart/curly quotes
      repaired = repaired.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
      // Strip trailing commas before closing braces/brackets
      repaired = repaired.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(repaired);
    } catch (err) {
      console.error(`[safeParseAIResponse] JSON repair failed for feature "${feature}". Returning fallback.`);
    }

    return customFallback || this.getFallbackForFeature(feature);
  }

  /**
   * Retrieves the standard fallback object for the specified feature domain.
   */
  getFallbackForFeature(feature: string): any {
    switch (feature) {
      case 'dashboard': {
        const randomInsight = CARBON_INSIGHT_FALLBACKS[Math.floor(Math.random() * CARBON_INSIGHT_FALLBACKS.length)];
        const randomTrend = TREND_SUMMARY_FALLBACKS[Math.floor(Math.random() * TREND_SUMMARY_FALLBACKS.length)];
        return {
          insight: randomInsight,
          trendSummary: randomTrend,
          achievementGuidance: "Continue completing roadmap missions.",
          recommendations: [],
          closestAchievement: {
            name: "Solar Curious",
            remainingActions: 2,
            progressPercentage: 70,
            motivation: "You're closer than you think. Keep building momentum."
          }
        };
      }
      case 'roadmap':
        return {
          nextMission: "Continue your roadmap progress.",
          weeklyActionPlan: "Continue your roadmap progress.",
          weeklyPlan: [],
          motivation: "Every action matters.",
          motivationSummary: "Every action matters.",
          priorityRanking: "Priority recommendation unavailable.",
          score: { impact: "Low", difficulty: "Low", reduction: "0.0 t / yr" }
        };
      case 'learn':
        return {
          recommendedTopic: "Carbon Reduction Basics",
          nextTopic: "Carbon Reduction Basics",
          why: "Helpful for improving sustainability awareness.",
          whyItMatters: "Helpful for improving sustainability awareness.",
          learningPath: "Carbon Track",
          impact: "Low"
        };
      case 'simulator':
        return {
          impactExplanation: "Impact analysis unavailable.",
          explanation: "Impact analysis unavailable.",
          reductionAnalysis: "Impact analysis unavailable.",
          tradeoffs: "No tradeoff analysis available.",
          nextActions: "No recommended next actions.",
          score: { impact: "Low", difficulty: "Low", reduction: "0.0 t / yr" }
        };
      case 'assessment':
        return {
          tagline: "Eco Guardian",
          personalitySummary: "You are a guardian of the environment.",
          strengths: "Awareness of carbon footprint.",
          weaknesses: "Emissions can be optimized.",
          growthOpportunities: "Prioritize transport reductions.",
          path: "Complete the first few roadmap milestones to see progress."
        };
      default:
        return {};
    }
  }
}

export const aiService = new AIService();
