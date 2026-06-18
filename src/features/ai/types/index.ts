/**
 * AI Core Type Definitions.
 * @module features/ai/types
 */

export type AIFeature = 'coach' | 'dashboard' | 'roadmap' | 'learn' | 'assessment';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIContext {
  profile?: {
    username: string | null;
    email: string;
    created_at: string;
    avatar_url: string | null;
    eco_personality: string;
    account_age_days: number;
  };
  carbonProfile?: {
    carbon_score: number | null;
    annual_emissions: number | null;
    last_calculated: string | null;
    trend_data: string;
  };
  roadmapProgress?: {
    completedMilestonesList: string[];
    incompleteMilestonesList: string[];
    completedMilestonesCount: number;
    totalMilestonesCount: number;
    completedPercentage: number;
  };
  simulatorHistory?: Array<{
    id: string;
    user_id: string;
    scenario_name: string | null;
    footprint_before: number | null;
    footprint_after: number | null;
    score_change: number | null;
    created_at: string;
  }>;
  simulatorPatterns?: string;
  assessmentOutcome?: {
    baselineScore: number | null;
    baselineEmissions: number | null;
    breakdownText?: string;
  };
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  actionUrl?: string;
}
