import { aiService } from './ai.service';
import { AIMessage, AIProviderResponse } from '../types';

export class CoachAIService {
  /**
   * Skeletons for future coach orchestration.
   */
  async generateCoachResponse(
    messages: AIMessage[],
    userId: string
  ): Promise<AIProviderResponse> {
    return aiService.generateResponse(messages);
  }
}

export const coachAIService = new CoachAIService();
