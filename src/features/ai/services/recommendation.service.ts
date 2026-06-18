import { aiService } from './ai.service';
import { AIContext, AIRecommendation } from '../types';

export class RecommendationAIService {
  /**
   * Skeletons for future recommendation orchestration.
   */
  async generateRecommendations(
    context: AIContext
  ): Promise<AIRecommendation[]> {
    return [];
  }
}

export const recommendationAIService = new RecommendationAIService();
