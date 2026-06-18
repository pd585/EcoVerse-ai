/**
 * User profile backend service placeholder.
 * Ready for future Supabase user profile tables and storage persistence.
 * @module features/auth/services/profile.service
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database/database.types';

export const profileService = {
  /**
   * Fetches the user profile by user ID.
   */
  async getProfile(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  /**
   * Updates the user profile attributes.
   */
  async updateProfile(
    userId: string,
    updates: Database['public']['Tables']['profiles']['Update']
  ) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await (supabase.from('profiles') as any)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  /**
   * Fetches user statistics from simulator_runs, ai_conversations, and roadmap_progress tables.
   */
  async getProfileStats(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }

    try {
      // Query simulator runs count
      const { count: simulatorCount, error: simulatorError } = await (supabase
        .from('simulator_runs') as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (simulatorError) throw simulatorError;

      // Query AI conversations count
      const { count: coachCount, error: coachError } = await (supabase
        .from('ai_conversations') as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (coachError) throw coachError;

      // Query roadmap progress milestones
      const { data: roadmapData, error: roadmapError } = await (supabase
        .from('roadmap_progress') as any)
        .select('completed')
        .eq('user_id', userId);

      if (roadmapError) throw roadmapError;

      return {
        data: {
          simulatorRuns: simulatorCount || 0,
          coachMessages: coachCount || 0,
          completedMilestones: (roadmapData as any[])?.filter((r) => r.completed).length || 0,
        },
        error: null,
      };
    } catch (err: any) {
      console.error('Error fetching profile stats:', err);
      return { data: null, error: err };
    }
  },
};
