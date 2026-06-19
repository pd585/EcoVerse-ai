import { supabase } from '@/lib/supabase';

export const roadmapService = {
  /**
   * Fetches the user's roadmap milestone completion status.
   */
  async getProgress(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('roadmap_progress')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  /**
   * Updates or inserts a roadmap milestone completion state.
   */
  async updateProgress(
    userId: string,
    milestoneKey: string,
    completed: boolean,
    progressPercentage: number
  ) {
    if (!userId || !milestoneKey) {
      return { data: null, error: new Error('User ID and milestone key are required.') };
    }

    // Check if progress already exists for this user and key
    const { data: existing, error: findError } = await supabase.from('roadmap_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone_key', milestoneKey)
      .limit(1);

    if (findError) {
      return { data: null, error: findError };
    }

    if (existing && existing.length > 0) {
      // Update existing record
      const { data, error } = await supabase.from('roadmap_progress')
        .update({
          completed,
          progress_percentage: progressPercentage,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', existing[0].id)
        .select()
        .single();
      return { data, error };
    } else {
      // Insert new record
      const { data, error } = await supabase.from('roadmap_progress')
        .insert({
          user_id: userId,
          milestone_key: milestoneKey,
          completed,
          progress_percentage: progressPercentage,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single();
      return { data, error };
    }
  },
};
