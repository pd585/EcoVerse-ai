import { supabase } from '@/lib/supabase';
import { aiService } from './ai.service';

export interface EcoIntelligenceProfile {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  riskAreas: string[];
  recommendedActions: string[];
  primaryFocus: string;
  sustainabilityScore: number;
}

interface CacheEntry {
  profile: EcoIntelligenceProfile;
  timestamp: number;
}

export class EcoIntelligenceService {
  private cache: Record<string, CacheEntry> = {};
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Generates a complete sustainability profile by aggregating data from all modules.
   * Leverages 15-minute in-memory caching unless forced to refresh.
   */
  async generateProfile(userId: string, forceRefresh = false): Promise<EcoIntelligenceProfile> {
    if (!userId) {
      throw new Error('User ID is required to generate eco intelligence profile.');
    }

    const now = Date.now();
    const cached = this.cache[userId];

    if (!forceRefresh && cached && (now - cached.timestamp < this.CACHE_TTL)) {
      console.log(`[EcoIntelligence] Serving cached profile for user ${userId}`);
      return cached.profile;
    }

    console.log(`[EcoIntelligence] Cache miss or forced refresh. Aggregating data for user ${userId}`);

    try {
      // 1. Fetch public profile
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const username = profile?.username || 'Green Guardian';
      const ecoPersonality = profile?.avatar_url || 'greenGuardian';

      // 2. Fetch carbon footprint calculations history
      const { data: carbonProfiles } = await (supabase.from('carbon_profiles') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const latestCarbon = carbonProfiles?.[0];
      const carbonScore = latestCarbon?.carbon_score != null ? Number(latestCarbon.carbon_score) : 10.0;
      const annualEmissions = latestCarbon?.annual_emissions != null ? Number(latestCarbon.annual_emissions) : 10.0;

      // 3. Fetch completed milestones from roadmap progress
      const { data: roadmapProgress } = await (supabase.from('roadmap_progress') as any)
        .select('*')
        .eq('user_id', userId);

      const completedMilestones = roadmapProgress?.filter((r: any) => r.completed) || [];
      const completedCount = completedMilestones.length;

      // 4. Fetch simulator runs history
      const { data: simulatorRuns } = await (supabase.from('simulator_runs') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      const simulatorCount = simulatorRuns?.length || 0;

      // 5. Fetch user achievements
      const { data: achievements } = await (supabase.from('user_achievements') as any)
        .select('unlocked_at, achievements(achievement_key)')
        .eq('user_id', userId);

      const achievementsCount = achievements?.length || 0;

      // 6. Fetch conversation logs count
      const { data: conversations } = await (supabase.from('ai_conversations') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const coachMsgCount = conversations?.length || 0;

      // Calculate dynamic local baseline fallback score
      const localCalculatedScore = Math.round(Math.max(0, Math.min(100, 100 - (carbonScore * 5) + (completedCount * 4))));

      // Construct context prompt payload
      const dataContext = `
User Profile:
- Username: ${username}
- Eco Personality Archetype: ${ecoPersonality}
- Account Created: ${profile?.created_at || 'N/A'}

Carbon Emissions Data:
- Current Score: ${carbonScore} t CO2e/year
- Annual Emissions: ${annualEmissions} t CO2e
- Historical Calculations Count: ${carbonProfiles?.length || 0}

Roadmap Progress:
- Completed Milestones: ${completedCount} completed out of 12.
- Completed List: ${completedMilestones.map((m: any) => m.milestone_key).join(', ') || 'None'}

Simulator Runs:
- Simulator Runs Count: ${simulatorCount}
- Recent runs: ${simulatorRuns?.slice(0, 3).map((r: any) => `${r.scenario_name}: ${r.footprint_before}t -> ${r.footprint_after}t`).join(', ') || 'None'}

Achievements & Coach:
- Unlocked Achievements Count: ${achievementsCount}
- Conversation Message Count: ${coachMsgCount}
`;

      const promptMessages = [
        {
          role: 'system' as const,
          content: `You are the EcoVerse Central Eco Intelligence Engine.
Analyze the user's sustainability metrics, profile, and activities to compile a unified, personalized sustainability intelligence profile.
No explanations, pleasantries, or additional text before or after the JSON.

Your response must be a single JSON object wrapped in BEGIN_JSON and END_JSON markers:
BEGIN_JSON
{
  "strengths": ["list of 2-3 custom strengths based on their low emission areas, completed milestones, or simulator actions"],
  "weaknesses": ["list of 2-3 custom weaknesses or highest emission sources"],
  "opportunities": ["list of 2-3 key leverage points/next milestones to pursue"],
  "riskAreas": ["list of 1-2 risk areas based on trends or inactive habits"],
  "recommendedActions": ["list of 3 specific, actionable recommendations (e.g. Switch 2 weekly commutes to transit)"],
  "primaryFocus": "The single highest priority focus area (e.g., Transit, Solar Energy, Plant-based Diet)",
  "sustainabilityScore": 0-100 score calculated based on progress (higher completed milestones and lower carbon score improves it)
}
END_JSON`
        },
        {
          role: 'user' as const,
          content: `Generate the profile for this user's data:\n${dataContext}`
        }
      ];

      const response = await aiService.generateResponse(promptMessages);
      const parsed = aiService.safeParseAIResponse<EcoIntelligenceProfile>(
        response.content,
        'eco-intelligence',
        {
          strengths: ['Carbon consciousness'],
          weaknesses: ['Baseline transit emissions'],
          opportunities: ['Reduce private car usage'],
          riskAreas: ['Energy efficiency'],
          recommendedActions: ['Switch 2 weekly commutes to transit', 'Try plant-based dinners', 'Switch to a renewable energy plan'],
          primaryFocus: 'Transit emissions',
          sustainabilityScore: localCalculatedScore
        }
      );

      // Cache the result
      this.cache[userId] = {
        profile: parsed,
        timestamp: now,
      };

      return parsed;
    } catch (e) {
      console.error('[EcoIntelligenceService] Failed to generate profile, returning fallback:', e);
      return {
        strengths: ['Carbon consciousness'],
        weaknesses: ['Baseline emissions'],
        opportunities: ['Reduce transit trips'],
        riskAreas: ['Household energy'],
        recommendedActions: ['Switch 2 weekly commutes to transit', 'Try plant-based dinners', 'Switch to a renewable plan'],
        primaryFocus: 'General reductions',
        sustainabilityScore: 50
      };
    }
  }

  /**
   * Invalidates the cached profile for a specific user to force a recalculation on the next access.
   */
  invalidateCache(userId: string): void {
    if (userId) {
      console.log(`[EcoIntelligence] Invalidating cache for user ${userId}`);
      if (this.cache[userId]) {
        delete this.cache[userId];
      }
    }
  }
}

export const ecoIntelligenceService = new EcoIntelligenceService();
