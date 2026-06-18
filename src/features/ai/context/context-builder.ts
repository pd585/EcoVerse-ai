import { AIContext, AIMessage } from '../types';

export class ContextBuilder {
  /**
   * Combines current prompt message, historical conversation context,
   * and current user carbon details into a structured prompt context block.
   */
  buildPromptContext(
    currentMessage: string,
    history: AIMessage[],
    context: AIContext,
    ecoProfile?: any,
    clientContext?: any
  ): string {
    const sections: string[] = [];

    // 0. Append Unified Eco Intelligence Profile if available
    if (ecoProfile) {
      sections.push(
        `## Unified Eco Intelligence Profile\n` +
        `- Primary Focus Area: ${ecoProfile.primaryFocus}\n` +
        `- Sustainability Score: ${ecoProfile.sustainabilityScore}/100\n` +
        `- Key Strengths: ${ecoProfile.strengths.join(', ')}\n` +
        `- Key Weaknesses: ${ecoProfile.weaknesses.join(', ')}\n` +
        `- Growth Opportunities: ${ecoProfile.opportunities.join(', ')}\n` +
        `- Risk Areas: ${ecoProfile.riskAreas.join(', ')}\n` +
        `- Recommended Actions:\n${ecoProfile.recommendedActions.map((a: string) => `  * ${a}`).join('\n')}`
      );
    }

    // 1. Append User Profile & Carbon Stats Context
    const profileSections: string[] = [];
    if (context.profile) {
      profileSections.push(
        `- Username: ${context.profile.username || 'Anonymous'}\n` +
        `- Email: ${context.profile.email || 'N/A'}\n` +
        `- Eco Personality: ${context.profile.eco_personality}\n` +
        `- Account Age: ${context.profile.account_age_days} days`
      );
    }
    if (context.carbonProfile) {
      profileSections.push(
        `- Carbon Footprint Score: ${context.carbonProfile.carbon_score ?? 'Not calculated'} t CO2e/year\n` +
        `- Annual Emissions: ${context.carbonProfile.annual_emissions ?? 'Not calculated'} t CO2e\n` +
        `- Emissions Trend: ${context.carbonProfile.trend_data}`
      );
    }
    if (context.roadmapProgress) {
      profileSections.push(
        `- Roadmap Milestones completed count: ${context.roadmapProgress.completedMilestonesCount}/${context.roadmapProgress.totalMilestonesCount} (${context.roadmapProgress.completedPercentage}% progress)\n` +
        `- Completed Milestones: ${context.roadmapProgress.completedMilestonesList.join(', ') || 'None'}\n` +
        `- Incomplete Milestones: ${context.roadmapProgress.incompleteMilestonesList.join(', ') || 'None'}`
      );
    }

    if (profileSections.length > 0) {
      sections.push(`## User Profile & Emission Metrics\n${profileSections.join('\n')}`);
    }

    // 2. Append Assessment Outcomes
    if (context.assessmentOutcome) {
      sections.push(
        `## Assessment Initial Outlines\n` +
        `- Baseline Carbon Score: ${context.assessmentOutcome.baselineScore} t CO2e/year\n` +
        `- Baseline Annual Emissions: ${context.assessmentOutcome.baselineEmissions} t CO2e`
      );
    }

    // 3. Append Simulator History Context
    if (context.simulatorHistory && context.simulatorHistory.length > 0) {
      const historyItems = context.simulatorHistory
        .map(run => `* "${run.scenario_name || 'Custom Run'}": baseline ${run.footprint_before} t, simulated ${run.footprint_after} t (score change: ${run.score_change} t)`)
        .join('\n');
      sections.push(`## Recent Simulator Scenarios\n${historyItems}\n- Simulator Patterns: ${context.simulatorPatterns}`);
    }

    // 4. Append User Local Learning & Achievements (Real-time client context)
    if (clientContext) {
      sections.push(
        `## User Local Learning & Achievements\n` +
        `- Total Eco XP Earned: ${clientContext.totalXp ?? 0} XP\n` +
        `- Completed Lessons: ${clientContext.completedLessonsCount ?? 0} lessons\n` +
        `- Unlocked Achievements: ${(clientContext.unlockedAchievements || []).join(', ') || 'None'}`
      );
    }

    // 5. Append Conversation History
    if (history.length > 0) {
      const historyItems = history
        .map(m => `* ${m.role === 'user' ? 'User' : m.role === 'assistant' ? 'Assistant' : 'System'}: ${m.content}`)
        .join('\n');
      sections.push(`## Recent Message History\n${historyItems}`);
    }

    // 6. Append Current Message
    sections.push(`## Active User Message\n${currentMessage}`);

    return sections.join('\n\n');
  }
}

export const contextBuilder = new ContextBuilder();
