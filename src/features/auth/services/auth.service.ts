/**
 * Auth backend service placeholder.
 * Ready for future Supabase Authentication integration.
 * @module features/auth/services/auth.service
 */

import { supabase } from '@/lib/supabase';

export const authService = {
  /**
   * Registers a new user.
   */
  async signUp(email: string, password: string, username: string) {
    if (!email || !password || !username) {
      return { data: null, error: new Error('Email, password, and username are required.') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { data, error };
  },

  /**
   * Authenticates an existing user.
   */
  async signIn(email: string, password: string) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password are required.') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  /**
   * Log out the current user session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};
