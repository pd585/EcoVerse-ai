import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './config/env';
import type { Database } from '@/types/database/database.types';

const globalForSupabase = globalThis as unknown as {
  __supabaseClient?: SupabaseClient<Database>;
};

/**
 * Supabase client instance (Singleton pattern).
 * Safe for client-side and server-side usage.
 */
export const supabase =
  globalForSupabase.__supabaseClient ??
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.__supabaseClient = supabase;
}
