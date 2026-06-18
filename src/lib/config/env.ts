/**
 * Typed environment variable access.
 * Centralizes all environment variable reads with validation.
 * @module lib/config/env
 */

/**
 * Application environment configuration.
 * All environment variables should be accessed through this module.
 */
export interface EnvConfig {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly NEXT_PUBLIC_APP_URL: string;
  readonly NEXT_PUBLIC_API_URL: string;
  readonly NEXT_PUBLIC_ENABLE_3D: boolean;
  readonly NEXT_PUBLIC_ENABLE_AI_COACH: boolean;
  readonly NEXT_PUBLIC_SUPABASE_URL: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
  readonly AI_PROVIDER?: string;
  readonly GEMINI_API_KEY?: string;
  readonly OPENROUTER_API_KEY?: string;
  readonly OPENROUTER_PRIMARY_MODEL?: string;
  readonly OPENROUTER_SECONDARY_MODEL?: string;
  readonly OPENROUTER_TERTIARY_MODEL?: string;
}

/**
 * Reads and validates environment variables.
 * Throws at startup if required variables are missing.
 *
 * @returns Typed environment configuration
 */
export function getEnvConfig(): EnvConfig {
  const nodeEnv = (process.env.NODE_ENV as EnvConfig['NODE_ENV']) ?? 'development';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
  const enable3D = process.env.NEXT_PUBLIC_ENABLE_3D === 'true';
  const enableAICoach = process.env.NEXT_PUBLIC_ENABLE_AI_COACH === 'true';

  const normalizeSupabaseUrl = (value: string | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed) return '';

    return trimmed
      .replace(/\/rest\/v1\/?$/, '')
      .replace(/\/+$/, '');
  };

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  // Fail-fast validation at runtime, but allow Next.js build phase and tests to compile
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-action-build';
  const isTest = nodeEnv === 'test';

  if (!isBuild && !isTest) {
    if (!supabaseUrl) {
      throw new Error(
        'Error: NEXT_PUBLIC_SUPABASE_URL environment variable is missing. ' +
        'Please ensure it is defined in your environment or .env.local file.'
      );
    }
    if (!supabaseKey) {
      throw new Error(
        'Error: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable is missing. ' +
        'Please ensure it is defined in your environment or .env.local file.'
      );
    }

    // Fail-fast validation of server-side AI provider credentials
    if (typeof window === 'undefined') {
      const activeProvider = process.env.AI_PROVIDER || 'gemini';
      if (activeProvider === 'gemini') {
        const geminiKey = process.env.GEMINI_API_KEY?.trim();
        if (!geminiKey) {
          throw new Error(
            'Error: GEMINI_API_KEY environment variable is missing. ' +
            'Required when AI_PROVIDER is set to "gemini".'
          );
        }
      } else if (activeProvider === 'openrouter') {
        const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();
        if (!openrouterKey) {
          throw new Error(
            'Error: OPENROUTER_API_KEY environment variable is missing. ' +
            'Required when AI_PROVIDER is set to "openrouter".'
          );
        }
      }
    }
  }

  return {
    NODE_ENV: nodeEnv,
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_ENABLE_3D: enable3D,
    NEXT_PUBLIC_ENABLE_AI_COACH: enableAICoach,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseKey ?? '',
    AI_PROVIDER: typeof window === 'undefined' ? process.env.AI_PROVIDER : undefined,
    GEMINI_API_KEY: typeof window === 'undefined' ? process.env.GEMINI_API_KEY : undefined,
    OPENROUTER_API_KEY: typeof window === 'undefined' ? process.env.OPENROUTER_API_KEY : undefined,
    OPENROUTER_PRIMARY_MODEL: typeof window === 'undefined' ? process.env.OPENROUTER_PRIMARY_MODEL : undefined,
    OPENROUTER_SECONDARY_MODEL: typeof window === 'undefined' ? process.env.OPENROUTER_SECONDARY_MODEL : undefined,
    OPENROUTER_TERTIARY_MODEL: typeof window === 'undefined' ? process.env.OPENROUTER_TERTIARY_MODEL : undefined,
  };
}

/** Singleton env config instance */
export const env = getEnvConfig();
