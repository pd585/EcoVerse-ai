'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';
import type { Database } from '@/types/database/database.types';
import type { User } from '@supabase/supabase-js';

// Table Row Types from our schema
export interface ProfileRow {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarbonProfileRow {
  id: string;
  user_id: string;
  carbon_score: number | null;
  annual_emissions: number | null;
  last_calculated: string | null;
  created_at: string;
  updated_at: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  profile: ProfileRow | null;
  carbonProfile: CarbonProfileRow | null;
  status: AuthStatus;
  authError: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  theme: 'ecoverse' | 'light' | 'dark' | 'system';
  setTheme: (theme: 'ecoverse' | 'light' | 'dark' | 'system') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [carbonProfile, setCarbonProfile] = useState<CarbonProfileRow | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const [theme, setThemeState] = useState<'ecoverse' | 'light' | 'dark' | 'system'>('ecoverse');

  // Load initial theme on mount
  useEffect(() => {
    const savedPreferences = safeGetStorageItem<any>('ecoverse_preferences', null);
    let initialTheme: 'ecoverse' | 'light' | 'dark' | 'system' = 'ecoverse';
    if (savedPreferences && savedPreferences.theme) {
      // Map old dark mode preference to ecoverse (aurora branded)
      if (savedPreferences.theme === 'dark') {
        initialTheme = 'ecoverse';
      } else {
        initialTheme = savedPreferences.theme;
      }
    }
    setThemeState(initialTheme);
  }, []);

  // Update theme and save preferences to localStorage
  const setTheme = (newTheme: 'ecoverse' | 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    const currentPrefs = safeGetStorageItem('ecoverse_preferences', { theme: 'ecoverse', notifications: true, language: 'en' });
    currentPrefs.theme = newTheme;
    safeSetStorageItem('ecoverse_preferences', currentPrefs);
  };

  // Sync theme to document element class list
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      
      // Remove all theme classes first
      root.classList.remove('theme-ecoverse', 'theme-light', 'theme-dark', 'light', 'dark');

      // System Default resolves to EcoVerse
      const activeTheme = theme === 'system' ? 'ecoverse' : theme;

      if (activeTheme === 'ecoverse') {
        root.classList.add('theme-ecoverse');
        root.classList.add('dark');
      } else if (activeTheme === 'light') {
        root.classList.add('theme-light');
        root.classList.add('light');
      } else if (activeTheme === 'dark') {
        root.classList.add('theme-dark');
        root.classList.add('dark');
      }
    };

    applyTheme();

    // If theme is system, handle OS preferences by updating classes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else {
          mediaQuery.removeListener(listener);
        }
      };
    }
  }, [theme]);

  // Load profile and carbon profile from Supabase
  const loadUserData = async (user: User) => {
    const userId = user.id;

    try {
      setAuthError(null);
      setIsDataLoaded(false);

      // 1. Fetch public profile or create it on demand if the auth trigger is delayed.
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        if (profileErr.message?.includes('permission denied') || profileErr.code === '42501') {
          setAuthError('Unable to read your profile because the profile access policy is blocking the request.');
        } else {
          setAuthError(`Unable to load your profile: ${profileErr.message}`);
        }
        console.error('Error fetching profile:', profileErr.message);
        return;
      }

      if (!profileData) {
        const metadata = user.user_metadata ?? {};
        const email = user.email ?? '';
        const fallbackUsername =
          metadata.full_name || metadata.name || email.split('@')[0] || 'user';
        const avatarUrl = metadata.avatar_url || metadata.picture || null;

        const profileInsert = {
          id: userId,
          email,
          username: fallbackUsername,
          avatar_url: avatarUrl,
        } as Database['public']['Tables']['profiles']['Insert'];

        const { data: createdProfile, error: createProfileErr } = await (supabase
          .from('profiles') as any)
          .insert(profileInsert)
          .select('*')
          .single();

        if (createProfileErr) {
          if (createProfileErr.message?.includes('permission denied') || createProfileErr.code === '42501') {
            setAuthError('Unable to create your profile because the insert policy is blocking the request.');
          } else {
            setAuthError(`Unable to create your profile: ${createProfileErr.message}`);
          }
          console.error('Error creating profile:', createProfileErr.message);
          return;
        }

        setProfile(createdProfile as ProfileRow);
      } else {
        setProfile(profileData as ProfileRow);
      }

      // 2. Fetch latest carbon profile
      const { data: carbonData, error: carbonErr } = await supabase
        .from('carbon_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (carbonErr) {
        if (carbonErr.message?.includes('permission denied') || carbonErr.code === '42501') {
          setAuthError('Unable to read your carbon profile because the access policy is blocking the request.');
        } else {
          setAuthError(`Unable to load your carbon profile: ${carbonErr.message}`);
        }
        console.error('Error fetching carbon profile:', carbonErr.message);
        return;
      }

      if (carbonData && carbonData.length > 0) {
        setCarbonProfile(carbonData[0] as CarbonProfileRow);
      } else {
        setCarbonProfile(null);
      }

      setIsDataLoaded(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown authentication error';
      setAuthError(message);
      console.error('Error loading user data:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const handleSignOut = async () => {
    setStatus('loading');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCarbonProfile(null);
    setIsDataLoaded(false);
    setStatus('unauthenticated');
    router.push('/auth/login');
  };

  // Monitor auth state changes
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setUser(session.user);
        await loadUserData(session.user);
        if (mounted) setStatus('authenticated');
      } else {
        setUser(null);
        setProfile(null);
        setCarbonProfile(null);
        setIsDataLoaded(false);
        setStatus('unauthenticated');
      }
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session) {
        setUser(session.user);
        await loadUserData(session.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setProfile(null);
        setCarbonProfile(null);
        setIsDataLoaded(false);
        setStatus('unauthenticated');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle route protection and redirections
  useEffect(() => {
    if (status === 'loading') return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (status === 'unauthenticated' && !isPublic) {
      // Redirect unauthenticated users trying to access protected pages to login
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      if (authError) {
        return;
      }

      // Only evaluate onboarding redirects if user data has loaded successfully
      if (!isDataLoaded) {
        return;
      }

      if (pathname === '/' || pathname === '/auth/login' || pathname === '/auth/register') {
        // Redirect authenticated users away from landing/auth pages based on onboarding status
        if (carbonProfile) {
          router.push('/dashboard/overview');
        } else {
          router.push('/assessment/questions');
        }
        return;
      }

      if (!carbonProfile && !pathname.startsWith('/assessment') && !isPublic) {
        // If authenticated but has not completed onboarding, redirect to assessment questions.
        router.push('/assessment/questions');
      }
    }
  }, [status, pathname, carbonProfile, authError, isDataLoaded, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        carbonProfile,
        status,
        authError,
        refreshProfile,
        signOut: handleSignOut,
        theme,
        setTheme,
      }}
    >
      {status === 'loading' ? (
        <div className="fixed inset-0 flex items-center justify-center bg-navy-deep text-white">
          <div className="flex flex-col items-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-accent-cyan border-t-transparent" />
            <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Connecting to EcoVerse...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
