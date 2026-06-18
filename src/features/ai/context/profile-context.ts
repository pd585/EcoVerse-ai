import { supabase } from '@/lib/supabase';
import { AIContext } from '../types';

const ALL_MILESTONES = [
  "Log today's commute",
  "Read: 'Where your footprint hides'",
  "Set a meatless dinner reminder",
  "Two transit commutes",
  "Compare green energy tariffs",
  "Complete Climate Change module 5",
  "Switch to a renewable plan",
  "Reach a 30-day streak",
  "Run the solar simulator with real bills",
  "Halve your annual footprint",
  "Reach Climate Champion identity",
  "Offset remaining emissions"
];

const PERSONALITY_NAMES: Record<string, string> = {
  greenGuardian: 'Green Guardian',
  natureProtector: 'Nature Protector',
  climateChampion: 'Climate Champion',
  futureBuilder: 'Future Builder',
  communityCatalyst: 'Community Catalyst',
};

export class ProfileContextService {
  /**
   * Loads profile, carbon profile, roadmap progress, and simulator history
   * for a specific user to compile a unified AIContext block.
   */
  async loadUserProfileContext(userId: string): Promise<AIContext> {
    if (!userId) {
      throw new Error('User ID is required to build profile context.');
    }

    // 1. Load public profile details
    const { data: profile } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    let accountAgeDays = 0;
    if (profile?.created_at) {
      const created = new Date(profile.created_at);
      const diffTime = Math.abs(new Date().getTime() - created.getTime());
      accountAgeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const avatarUrl = profile?.avatar_url || 'greenGuardian';
    const ecoPersonality = PERSONALITY_NAMES[avatarUrl] || 'Green Guardian';

    // 2. Load latest carbon footprint profiles (up to 5 for trends)
    const { data: carbonHistory } = await (supabase.from('carbon_profiles') as any)
      .select('carbon_score, annual_emissions, last_calculated, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }); // oldest first

    const latestCarbon = carbonHistory && carbonHistory.length > 0
      ? carbonHistory[carbonHistory.length - 1]
      : null;

    const baselineCarbon = carbonHistory && carbonHistory.length > 0
      ? carbonHistory[0]
      : null;

    let trendData = 'Baseline established. No trend data available yet.';
    if (carbonHistory && carbonHistory.length > 1) {
      const oldestScore = Number(carbonHistory[0].carbon_score || 0);
      const newestScore = Number(latestCarbon?.carbon_score || 0);
      const diff = newestScore - oldestScore;
      if (diff < 0) {
        trendData = `Footprint has decreased by ${Math.abs(diff).toFixed(1)} tonnes CO2e/year since starting.`;
      } else if (diff > 0) {
        trendData = `Footprint has increased by ${diff.toFixed(1)} tonnes CO2e/year since starting.`;
      } else {
        trendData = 'Footprint has remained stable since starting.';
      }
    }

    // 3. Load roadmap completed milestones
    const { data: milestones } = await (supabase
      .from('roadmap_progress') as any)
      .select('completed, milestone_key')
      .eq('user_id', userId);

    const completedList = milestones ? milestones.filter((m: any) => m.completed).map((m: any) => m.milestone_key) : [];
    const incompleteList = ALL_MILESTONES.filter(m => !completedList.includes(m));
    const completedMilestonesCount = completedList.length;
    const totalMilestonesCount = ALL_MILESTONES.length;
    const completedPercentage = Math.round((completedMilestonesCount / totalMilestonesCount) * 100);

    // 4. Load recent simulator runs (limit to 5 for context token management)
    const { data: simulatorHistory } = await (supabase.from('simulator_runs') as any)
      .select('id, user_id, scenario_name, footprint_before, footprint_after, score_change, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Analyze behavioral patterns from simulations
    let simulatorPatterns = 'No simulations run yet.';
    if (simulatorHistory && simulatorHistory.length > 0) {
      const scenarios = simulatorHistory.map((s: any) => s.scenario_name).filter(Boolean);
      const scenarioCounts: Record<string, number> = {};
      scenarios.forEach((scen: string) => {
        scenarioCounts[scen] = (scenarioCounts[scen] || 0) + 1;
      });
      const topScenario = Object.entries(scenarioCounts).sort((a, b) => b[1] - a[1])[0];
      if (topScenario) {
        simulatorPatterns = `Frequently simulating adjustments to "${topScenario[0]}", focusing carbon reduction efforts in this area.`;
      } else {
        simulatorPatterns = 'Simulating diverse carbon reduction strategies.';
      }
    }

    return {
      profile: profile ? {
        username: profile.username,
        email: profile.email || '',
        created_at: profile.created_at || '',
        avatar_url: profile.avatar_url,
        eco_personality: ecoPersonality,
        account_age_days: accountAgeDays,
      } : undefined,
      carbonProfile: latestCarbon ? {
        carbon_score: latestCarbon.carbon_score,
        annual_emissions: latestCarbon.annual_emissions,
        last_calculated: latestCarbon.last_calculated,
        trend_data: trendData,
      } : undefined,
      roadmapProgress: {
        completedMilestonesList: completedList,
        incompleteMilestonesList: incompleteList,
        completedMilestonesCount,
        totalMilestonesCount,
        completedPercentage,
      },
      simulatorHistory: simulatorHistory || [],
      simulatorPatterns,
      assessmentOutcome: baselineCarbon ? {
        baselineScore: baselineCarbon.carbon_score,
        baselineEmissions: baselineCarbon.annual_emissions,
      } : undefined,
    };
  }
}

export const profileContextService = new ProfileContextService();
