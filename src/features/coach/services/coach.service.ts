import { supabase } from '@/lib/supabase';

export const coachService = {
  /**
   * Fetches the user's conversation history with the AI coach.
   */
  async getHistory(userId: string) {
    if (!userId) {
      return { data: null, error: new Error('User ID is required.') };
    }
    const { data, error } = await supabase.from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  /**
   * Saves a message (from user or AI) to the database.
   */
  async saveMessage(userId: string, role: 'user' | 'coach' | 'system', message: string) {
    if (!userId || !role || !message) {
      return { data: null, error: new Error('User ID, role, and message are required.') };
    }
    const { data, error } = await supabase.from('ai_conversations')
      .insert({
        user_id: userId,
        role,
        message,
      })
      .select()
      .single();
    return { data, error };
  },
};
