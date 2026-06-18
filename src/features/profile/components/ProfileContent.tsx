/**
 * Profile and Settings component.
 * central page body.
 * @module features/profile/components/ProfileContent
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Award,
  Settings,
  ShieldAlert,
  Save,
  CheckCircle,
  AlertTriangle,
  Globe,
  Bell,
  Palette,
  Key,
  LogOut,
  Flame,
  LayoutDashboard,
  FlaskConical,
  MessageSquare,
  ClipboardList,
  Zap
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/components/layout/AuthProvider';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/features/auth/services/profile.service';
import { RobotSeedlingIcon } from '@/components/brand';
import { Counter } from '@/components/ui/Counter';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

const ARCHETYPES = [
  {
    id: 'greenGuardian',
    name: 'Green Guardian',
    emoji: '🌿',
    tagline: 'Steady, principled, and quietly powerful.',
    desc: 'You protect what matters through consistent, thoughtful action. You don’t chase trends — you build habits that last and inspire those around you.',
    traits: ['Consistent', 'Nature-first', 'Community-minded'],
  },
  {
    id: 'natureProtector',
    name: 'Nature Protector',
    emoji: '🛡️',
    tagline: 'Rooted in wonder, protective of wild spaces.',
    desc: 'You prioritize nature first and choose actions that nourish ecosystems and leave room for the next generation.',
    traits: ['Conservation-minded', 'Earth-focused', 'Stewardship'],
  },
  {
    id: 'climateChampion',
    name: 'Climate Champion',
    emoji: '⚡',
    tagline: 'Bold, driven, and hungry for high-impact change.',
    desc: 'You seek the biggest impact possible and are happiest when your choices accelerate progress toward a cleaner world.',
    traits: ['High-impact', 'Future-focused', 'Change-maker'],
  },
  {
    id: 'futureBuilder',
    name: 'Future Builder',
    emoji: '🚀',
    tagline: 'Curious, tactical, and always building toward a cleaner future.',
    desc: 'You blend innovation with everyday habits. You want change that lasts, and you’re ready to help shape what comes next.',
    traits: ['Innovative', 'Strategic', 'Tech-savvy'],
  },
  {
    id: 'communityCatalyst',
    name: 'Community Catalyst',
    emoji: '🌎',
    tagline: 'People-powered, inclusive, and deeply connected.',
    desc: 'You know change is stronger when it is shared. You build momentum through community, encouragement, and practical support.',
    traits: ['Community-first', 'Supportive', 'Inclusive'],
  },
];

export function ProfileContent() {
  const { user, profile, carbonProfile, refreshProfile, signOut, theme, setTheme } = useAuth();

  // Local preferences state (Notifications, Language)
  const [preferences, setPreferences] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = safeGetStorageItem<any>('ecoverse_preferences', null);
      if (saved) {
        return saved;
      }
    }
    return {
      notifications: true,
      language: 'en',
    };
  });

  // Save preferences to localStorage
  useEffect(() => {
    const currentPrefs = {
      notifications: preferences.notifications,
      language: preferences.language,
    };
    safeSetStorageItem('ecoverse_preferences', { ...currentPrefs, theme });
  }, [preferences, theme]);

  // Account Settings Form State
  const [usernameInput, setUsernameInput] = useState(profile?.username || '');
  const [selectedMascot, setSelectedMascot] = useState(profile?.avatar_url || 'greenGuardian');
  const [savingAccount, setSavingAccount] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password reset & Toast state
  const [resetLoading, setResetLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Stats hydration state
  const [stats, setStats] = useState({
    simulatorRuns: 0,
    coachMessages: 0,
    completedMilestones: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedXp = safeGetStorageItem('ecoverse_total_xp', 0);
      setTotalXp(storedXp);
    }
  }, []);

  // Sync state if profile changes
  useEffect(() => {
    if (profile) {
      setUsernameInput(profile.username || '');
      setSelectedMascot(profile.avatar_url || 'greenGuardian');
    }
  }, [profile]);

  // Fetch statistics
  useEffect(() => {
    if (user) {
      setStatsLoading(true);
      profileService.getProfileStats(user.id).then(({ data, error }) => {
        if (!error && data) {
          setStats(data);
        }
        setStatsLoading(false);
      });
    }
  }, [user]);

  const activeArchetype = ARCHETYPES.find((a) => a.id === selectedMascot) || ARCHETYPES[0];
  const profileArchetype = ARCHETYPES.find((a) => a.id === (profile?.avatar_url || 'greenGuardian')) || ARCHETYPES[0];

  const carbonScore = carbonProfile?.carbon_score != null ? Number(carbonProfile.carbon_score) : 9.2;
  const roadmapPct = Math.round((stats.completedMilestones / 12) * 100);
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSavingAccount(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await profileService.updateProfile(profile.id, {
        username: usernameInput,
        avatar_url: selectedMascot,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to update profile settings.');
      } else {
        safeSetStorageItem('ecoverse_cache_dirty', true);
        safeSetStorageItem('ecoverse_dashboard_cache_dirty', true);
        await refreshProfile();
        setSuccessMsg('Account settings updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    setToast(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        setToast({ message: error.message, type: 'error' });
      } else {
        setToast({ message: 'Password reset email sent.', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to trigger password reset.', type: 'error' });
    } finally {
      setResetLoading(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <AppShell
      title="Profile & Settings"
      subtitle="Calibrate your identity, preferences, and view your eco impact achievements."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Identity Card */}
          <div className="glass-premium rounded-3xl p-6 relative overflow-hidden border border-accent-cyan/12 bg-navy-deep/55">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-aurora/10 blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-aurora/10 border border-accent-cyan/15 shadow-[0_0_20px_rgba(0,245,160,0.15)] mb-4">
                <RobotSeedlingIcon size={64} animated={true} glow={true} personality={profileArchetype.id as any} />
              </span>
              
              <h2 className="text-xl font-bold text-foreground">{profile?.username || 'Green Guardian'}</h2>
              <p className="text-xs font-semibold text-accent-cyan mt-1 px-3 py-0.5 rounded-full bg-accent-cyan/10 uppercase tracking-wider">
                Level {Math.floor(totalXp / 100) + 1}
              </p>

              <div className="w-full mt-6 space-y-3 border-t border-white/5 pt-4 text-sm text-muted-foreground text-left">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent-cyan/80" />
                  <span className="truncate">{profile?.email || 'guardian@ecoverse.earth'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-accent-cyan/80" />
                  <span>Joined {joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-accent-cyan/80" />
                  <span>Level {Math.floor(totalXp / 100) + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-accent-cyan/80" />
                  <span>
                    Account Status: <span className="font-semibold text-accent-emerald">🟢 Active</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Eco Personality Card */}
          <div className="glass rounded-3xl p-6 border border-accent-cyan/5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-emerald">
              <Sparkles className="h-3.5 w-3.5" /> Eco Personality
            </div>
            <h3 className="text-lg font-bold mt-2 flex items-center gap-2">
              {profileArchetype.emoji} {profileArchetype.name}
            </h3>
            <p className="text-xs text-muted-foreground italic mt-1">
              "{profileArchetype.tagline}"
            </p>
            <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
              {profileArchetype.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profileArchetype.traits.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Preferences Card */}
          <div className="glass rounded-3xl p-6 border border-accent-cyan/5 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-white/5 pb-2">
              <Settings className="h-4 w-4 text-accent-cyan" /> Preferences
            </h3>

            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" /> Theme
              </span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="bg-navy-mid border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent-cyan cursor-pointer"
              >
                <option value="ecoverse">EcoVerse (Default)</option>
                <option value="dark">Dark (Navy SaaS)</option>
                <option value="light">Light</option>
                <option value="system">System Default</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" /> Email Digests
              </span>
              <button
                type="button"
                onClick={() => setPreferences((p: any) => ({ ...p, notifications: !p.notifications }))}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                  preferences.notifications ? 'bg-aurora' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" /> Language
              </span>
              <select
                value="en"
                disabled
                className="bg-navy-mid border border-white/10 rounded-xl px-3 py-1.5 text-xs text-muted-foreground/70 outline-none cursor-not-allowed"
              >
                <option value="en">English (Default)</option>
              </select>
            </div>
          </div>

          {/* Security Card */}
          <div className="glass rounded-3xl p-6 border border-accent-cyan/5 space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-white/5 pb-2">
              <Key className="h-4 w-4 text-accent-cyan" /> Security Actions
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="flex-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs font-semibold hover:bg-slate-850 hover:border-white/15 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resetLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
              
              <button
                type="button"
                onClick={signOut}
                className="flex-1 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-300 px-4 py-2.5 text-xs font-semibold hover:bg-rose-950/35 transition-all text-center"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Impact Statistics */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Stat 1: Carbon Score */}
            <div className="glass flex items-center gap-4 rounded-3xl p-5 border border-accent-cyan/5">
              <span className="flex h-11 w-11 shrink-0 place-items-center justify-center rounded-2xl bg-accent-cyan/10 text-accent-cyan">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Carbon Footprint</div>
                <div className="mt-1 flex items-baseline gap-1 font-700 text-foreground">
                  <span className="text-xl">
                    <Counter value={carbonScore} decimals={1} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">t CO₂e / yr</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Roadmap Completion */}
            <div className="glass flex items-center gap-4 rounded-3xl p-5 border border-accent-cyan/5">
              <span className="flex h-11 w-11 shrink-0 place-items-center justify-center rounded-2xl bg-[#00F5A0]/10 text-[#00F5A0]">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Roadmap Progress</div>
                <div className="mt-1 flex items-baseline gap-1 font-700 text-foreground">
                  <span className="text-xl">
                    <Counter value={statsLoading ? 0 : roadmapPct} />%
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({stats.completedMilestones}/12 milestones)
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 3: Simulator Runs */}
            <div className="glass flex items-center gap-4 rounded-3xl p-5 border border-accent-cyan/5">
              <span className="flex h-11 w-11 shrink-0 place-items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <FlaskConical className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Simulator runs</div>
                <div className="mt-1 flex items-baseline gap-1 font-700 text-foreground">
                  <span className="text-xl">
                    <Counter value={statsLoading ? 0 : stats.simulatorRuns} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">comparisons</span>
                </div>
              </div>
            </div>

            {/* Stat 4: Chat Messages */}
            <div className="glass flex items-center gap-4 rounded-3xl p-5 border border-accent-cyan/5">
              <span className="flex h-11 w-11 shrink-0 place-items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Coach Conversations</div>
                <div className="mt-1 flex items-baseline gap-1 font-700 text-foreground">
                  <span className="text-xl">
                    <Counter value={statsLoading ? 0 : stats.coachMessages} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">messages logged</span>
                </div>
              </div>
            </div>

            {/* Stat 5: Eco XP Earned */}
            <div className="glass flex items-center gap-4 rounded-3xl p-5 border border-accent-cyan/5">
              <span className="flex h-11 w-11 shrink-0 place-items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Eco XP Earned</div>
                <div className="mt-1 flex items-baseline gap-1 font-700 text-foreground">
                  <span className="text-xl">
                    <Counter value={totalXp} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">total XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Form */}
          <div className="glass-premium rounded-3xl p-6 sm:p-8 border border-accent-cyan/12 bg-navy-deep/55">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-white/5 pb-3 mb-6">
              <User className="h-4 w-4 text-accent-cyan" /> Account Customization
            </h3>

            <form onSubmit={handleSaveAccount} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="profile-username">
                  Display Username
                </label>
                <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 focus-within:border-accent-cyan/50 focus-within:ring-1 focus-within:ring-accent-cyan/30 transition-all">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="profile-username"
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter displays username"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Avatar Mascot Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Eco Personality Mascot
                </label>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {ARCHETYPES.map((arc) => {
                    const active = selectedMascot === arc.id;
                    return (
                      <button
                        key={arc.id}
                        type="button"
                        onClick={() => setSelectedMascot(arc.id)}
                        className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all border ${
                          active
                            ? 'bg-accent-cyan/5 border-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]'
                            : 'bg-slate-900/20 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner mb-2">
                          <RobotSeedlingIcon size={32} animated={active} personality={arc.id as any} />
                        </span>
                        <div className="text-xs font-bold text-foreground truncate w-full">{arc.name}</div>
                        <div className="text-[10px] text-muted-foreground/85 mt-0.5 line-clamp-1">{arc.tagline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Feedbacks */}
              <AnimatePresence mode="wait">
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 rounded-2xl p-4"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs font-semibold text-rose-300 bg-rose-950/20 border border-rose-900/30 rounded-2xl p-4"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingAccount}
                  className="flex items-center justify-center gap-2 rounded-full bg-aurora px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--glow-emerald)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {savingAccount ? 'Saving Changes…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-navy-deep/90 border-accent-emerald/30 text-accent-emerald shadow-accent-emerald/10'
                : 'bg-navy-deep/90 border-rose-500/30 text-rose-400 shadow-rose-500/10'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-accent-emerald" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
