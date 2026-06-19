import { supabase } from '@/lib/supabase';

export const simulatorService = {
  /**
   * Saves a new simulator run.
   */
  async saveHistory(
    userId: string,
    scenarioName: string,
    footprintBefore: number,
    footprintAfter: number,
    scoreChange: number
  ) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('simulator_runs')
      .insert({
        user_id: userId,
        scenario_name: scenarioName,
        footprint_before: footprintBefore,
        footprint_after: footprintAfter,
        score_change: scoreChange,
      })
      .select()
      .single();
    return { data, error };
  },

  /**
   * Retrieves simulation history for a user.
   */
  async getHistory(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('simulator_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};
