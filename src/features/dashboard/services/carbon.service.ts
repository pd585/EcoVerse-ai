import { supabase } from '@/lib/supabase';

export const carbonService = {
  /**
   * Fetches the latest carbon score and annual emissions for a user.
   */
  async getCarbonScore(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('carbon_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    const latest = data && data.length > 0 ? data[0] : null;
    return { data: latest, error };
  },

  /**
   * Records a new carbon score and annual emissions entry.
   */
  async recordEmissionChange(userId: string, carbonScore: number, annualEmissions: number) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('carbon_profiles')
      .insert({
        user_id: userId,
        carbon_score: carbonScore,
        annual_emissions: annualEmissions,
        last_calculated: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },
};
