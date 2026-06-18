/**
 * EcoJump game persistence service placeholder.
 * Ready for future Supabase leaderboards integration.
 * @module features/dashboard/services/ecojump.service
 */

import { supabase } from '@/lib/supabase';

export const ecojumpService = {
  /**
   * Placeholder for submitting game score.
   */
  async submitScore() {
    return { data: null, error: new Error('EcoJump service submitScore is not implemented yet.') };
  },

  /**
   * Placeholder for fetching leaderboards.
   */
  async getLeaderboard() {
    return { data: null, error: new Error('EcoJump service getLeaderboard is not implemented yet.') };
  },
};
