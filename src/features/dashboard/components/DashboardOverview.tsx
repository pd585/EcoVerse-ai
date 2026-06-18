/**
 * Dashboard overview page component.
 * @module features/dashboard/components/DashboardOverview
 */

'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { ArrowRight, Flame, Leaf, Sparkles, TrendingDown } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { RobotSeedlingIcon } from '@/components/brand';
import { Counter } from '@/components/ui/Counter';
import {
  achievements as mockAchievements,
  carbonScore as mockCarbonScore,
  monthlyTrend,
  recommendations,
} from '@/data/eco-data';
import { ROUTES } from '@/constants/routes';
import { EcoJumpCard } from '@/components/layout/EcoJumpCard';
import { EmissionBreakdown } from './EmissionBreakdown';
import { useAuth } from '@/components/layout/AuthProvider';
import { supabase } from '@/lib/supabase';
import { getDailyEcoTip, getDailyPlanetHealth, CARBON_INSIGHT_FALLBACKS, TREND_SUMMARY_FALLBACKS } from '@/data/daily-data';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

export function DashboardOverview() {
  const { user, profile, carbonProfile } = useAuth();
  const [completedMissions, setCompletedMissions] = useState(3); // default fallback
  const [streak, setStreak] = useState(12);
  const [earnedKeys, setEarnedKeys] = useState<string[]>([]);

  // Local storage states
  const [xp, setXp] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [localUnlocked, setLocalUnlocked] = useState<string[]>([]);

  // Ref to track and prevent concurrent/duplicate AI fetches during hydration/state updates
  const isFetchingAI = useRef(false);


  const currentScore = carbonProfile?.carbon_score != null ? Number(carbonProfile.carbon_score) : mockCarbonScore.value;
  const annualEmissions = carbonProfile?.annual_emissions != null ? Number(carbonProfile.annual_emissions) : mockCarbonScore.value;
  const username = profile?.username || 'Green Guardian';
  const personality = (profile?.avatar_url as any) || 'greenGuardian';

  const PERSONALITY_NAMES: Record<string, string> = {
    greenGuardian: 'Green Guardian',
    natureProtector: 'Nature Protector',
    climateChampion: 'Climate Champion',
    futureBuilder: 'Future Builder',
    communityCatalyst: 'Community Catalyst',
  };
  const personalityName = PERSONALITY_NAMES[personality] || 'Green Guardian';

  const [aiInsight, setAiInsight] = useState<string>('Analyzing your carbon profile for insights...');
  const [aiTrendSummary, setAiTrendSummary] = useState<string>('Comparing recent emission calculations...');
  const [aiAchievementGuidance, setAiAchievementGuidance] = useState<string>('Keep completing tasks to unlock your next milestone.');
  const [aiRecommendations, setAiRecommendations] = useState<Array<{ title: string; detail: string; impact: string; effort: string; difficulty?: string; reduction?: string }>>([
    {
      title: 'Use public transport twice this week',
      impact: 'Medium',
      reduction: '−0.4t / yr',
      detail: 'Replacing car journeys with public transit saves carbon.',
      effort: 'Low',
    },
    {
      title: 'Complete Energy Efficiency Basics mission',
      impact: 'High',
      reduction: '−0.3t / yr',
      detail: 'Learn where your home wastes energy to make changes.',
      effort: 'Low',
    },
    {
      title: 'Reduce food waste through meal planning',
      impact: 'Medium',
      reduction: '−0.5t / yr',
      detail: 'Planning meals prevents buying food that gets thrown out.',
      effort: 'Medium',
    },
  ]);

  const [aiClosestAchievement, setAiClosestAchievement] = useState<{
    name: string;
    remainingActions: string | number;
    progressPercentage: number;
    motivation: string;
  }>({
    name: 'Solar Curious',
    remainingActions: 'Complete Learn Module 2 · Finish Energy Mission',
    progressPercentage: 70,
    motivation: "You're closer than you think. Keep building momentum.",
  });

  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  // Load local storage values and rotating lists on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedXp = safeGetStorageItem('ecoverse_total_xp', 0);
      setXp(storedXp);
      const storedCompleted = safeGetStorageItem<string[]>('ecoverse_completed_lessons', []);
      setCompletedLessonsCount(storedCompleted.length);
      const storedAchievements = safeGetStorageItem<string[]>('ecoverse_unlocked_achievements', []);
      setLocalUnlocked(storedAchievements);
    }
  }, []);

  // Compute dynamic levels based on XP
  const calculatedLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  // Hydrate cache immediately when user is available
  useEffect(() => {
    if (!user) return;
    const cacheKey = `ecoverse_dashboard_ai_${user.id}`;
    const cached = safeGetStorageItem<any>(cacheKey, null);
    if (cached) {
      try {
        let valInsight = cached.insight;
        if (!valInsight || valInsight.includes('temporarily unavailable') || valInsight.includes('unavailable')) {
          valInsight = CARBON_INSIGHT_FALLBACKS[Math.floor(Math.random() * CARBON_INSIGHT_FALLBACKS.length)];
        }
        let valTrend = cached.trendSummary;
        if (!valTrend || valTrend.includes('unavailable') || valTrend.includes('temporarily')) {
          valTrend = TREND_SUMMARY_FALLBACKS[Math.floor(Math.random() * TREND_SUMMARY_FALLBACKS.length)];
        }
        setSanitizedDashboardState(valInsight, valTrend, cached);
      } catch (_) {}
    }
  }, [user]);

  // Load roadmap progress and user achievements concurrently in parallel
  useEffect(() => {
    if (!user) return;

    setLoadingRoadmap(true);
    setLoadingAchievements(true);

    Promise.all([
      supabase.from('roadmap_progress').select('*').eq('user_id', user.id),
      supabase.from('user_achievements').select('unlocked_at, achievements(achievement_key)').eq('user_id', user.id)
    ])
      .then(([roadmapRes, achievementsRes]) => {
        if (!roadmapRes.error && roadmapRes.data) {
          const completedCount = (roadmapRes.data as any[]).filter((d) => d.completed).length;
          setCompletedMissions(completedCount);
          if (completedCount > 0) {
            setStreak(12 + completedCount);
          }
        }
        setLoadingRoadmap(false);

        if (!achievementsRes.error && achievementsRes.data) {
          const keys = (achievementsRes.data as any[])
            .map((d: any) => d.achievements?.achievement_key)
            .filter(Boolean);
          setEarnedKeys(keys);
        }
        setLoadingAchievements(false);
      })
      .catch((err) => {
        console.error('[DashboardOverview] Concurrent data fetch failed:', err);
        setLoadingRoadmap(false);
        setLoadingAchievements(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user || loadingRoadmap || loadingAchievements) return;

    const fetchAIInsights = async () => {
      if (isFetchingAI.current) return;

      const cacheKey = `ecoverse_dashboard_ai_${user.id}`;
      const cached = safeGetStorageItem<any>(cacheKey, null);
      
      const isDirty = safeGetStorageItem('ecoverse_dashboard_cache_dirty', false) || 
                      safeGetStorageItem('ecoverse_cache_dirty', false);

      let shouldRegenerate = true;

      if (cached && !isDirty) {
        try {
          const cacheAge = cached.timestamp ? (Date.now() - cached.timestamp) : Infinity;
          const isExpired = cacheAge >= 24 * 60 * 60 * 1000;

          if (!isExpired) {
            shouldRegenerate = false;
            if (cached.insight) setAiInsight(cached.insight);
            if (cached.trendSummary) setAiTrendSummary(cached.trendSummary);
            if (cached.achievementGuidance) setAiAchievementGuidance(cached.achievementGuidance);
            if (cached.recommendations && cached.recommendations.length > 0) {
              setAiRecommendations(cached.recommendations);
            }
            if (cached.closestAchievement) {
              setAiClosestAchievement(cached.closestAchievement);
            }
          }
        } catch (_) {}
      }

      if (!shouldRegenerate) {
        return;
      }

      try {
        isFetchingAI.current = true;
        const sessionResponse = await supabase.auth.getSession();
        const token = sessionResponse.data.session?.access_token;

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            feature: 'dashboard',
            message: 'Generate dashboard insights',
            invalidateCache: true,
            clientContext: {
              totalXp: xp,
              completedLessonsCount,
              unlockedAchievements: localUnlocked
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsedInsight = JSON.parse(data.content);

          let finalInsight = parsedInsight.insight;
          if (!finalInsight || finalInsight.includes('temporarily unavailable') || finalInsight.includes('unavailable')) {
            finalInsight = CARBON_INSIGHT_FALLBACKS[Math.floor(Math.random() * CARBON_INSIGHT_FALLBACKS.length)];
          }

          let finalTrend = parsedInsight.trendSummary;
          if (!finalTrend || finalTrend.includes('unavailable') || finalTrend.includes('temporarily')) {
            finalTrend = TREND_SUMMARY_FALLBACKS[Math.floor(Math.random() * TREND_SUMMARY_FALLBACKS.length)];
          }

          const isFallback = data.model === 'graceful-fallback-response' || 
                             (parsedInsight.insight && parsedInsight.insight.includes('temporarily unavailable')) ||
                             (parsedInsight.trendSummary && parsedInsight.trendSummary.includes('unavailable'));

          const hasValidCache = cached !== null;
          if (isFallback && hasValidCache) {
            console.log('[DashboardAI] Fallback response received. Retaining valid cached dashboard data.');
            return;
          }

          setAiInsight(finalInsight);
          setAiTrendSummary(finalTrend);
          if (parsedInsight.achievementGuidance) setAiAchievementGuidance(parsedInsight.achievementGuidance);
          if (parsedInsight.recommendations && parsedInsight.recommendations.length > 0) {
            setAiRecommendations(parsedInsight.recommendations);
          }
          if (parsedInsight.closestAchievement) {
            setAiClosestAchievement(parsedInsight.closestAchievement);
          }

          safeSetStorageItem(cacheKey, {
            timestamp: Date.now(),
            score: currentScore,
            completedMissions,
            achievementsCount: earnedKeys.length,
            insight: finalInsight,
            trendSummary: finalTrend,
            achievementGuidance: parsedInsight.achievementGuidance,
            recommendations: parsedInsight.recommendations,
            closestAchievement: parsedInsight.closestAchievement,
          });

          try { localStorage.removeItem('ecoverse_dashboard_cache_dirty'); } catch (_) {}
          try { localStorage.removeItem('ecoverse_cache_dirty'); } catch (_) {}
        }
      } catch (err) {
        console.error('[DashboardAI] Failed to fetch dynamic insights:', err);
        // Fall back to random elements from datasets if no cache and state is still loading
        const cacheKey = `ecoverse_dashboard_ai_${user.id}`;
        const cached = safeGetStorageItem<any>(cacheKey, null);
        if (!cached) {
          setAiInsight(prev => prev.includes('Analyzing') ? CARBON_INSIGHT_FALLBACKS[Math.floor(Math.random() * CARBON_INSIGHT_FALLBACKS.length)] : prev);
          setAiTrendSummary(prev => prev.includes('Comparing') ? TREND_SUMMARY_FALLBACKS[Math.floor(Math.random() * TREND_SUMMARY_FALLBACKS.length)] : prev);
        }
      } finally {
        isFetchingAI.current = false;
      }
    };

    fetchAIInsights();
  }, [user, currentScore, completedMissions, earnedKeys, loadingRoadmap, loadingAchievements, xp, completedLessonsCount, localUnlocked]);

  // Helper helper to set state sanitarily
  function setSanitizedDashboardState(valInsight: string, valTrend: string, parsed: any) {
    setAiInsight(valInsight);
    setAiTrendSummary(valTrend);
    if (parsed.achievementGuidance) setAiAchievementGuidance(parsed.achievementGuidance);
    if (parsed.recommendations && parsed.recommendations.length > 0) {
      setAiRecommendations(parsed.recommendations);
    }
    if (parsed.closestAchievement) {
      setAiClosestAchievement(parsed.closestAchievement);
    }
  }

  // Recalculate achievement statuses locally with memoization
  const achievementsList = useMemo(() => {
    return mockAchievements.map((a) => {
      const keyMap: Record<string, string> = {
        'First Steps': 'first_steps',
        'Car-Free Week': 'car_free_week',
        'Plant Pioneer': 'plant_pioneer',
        'Solar Curious': 'solar_curious',
        'Streak Master': 'streak_master',
        'Carbon Halver': 'carbon_halver',
        'First Lesson Completed': 'first_lesson_completed',
        '5 Lessons Completed': 'five_lessons_completed',
        '10 Lessons Completed': 'ten_lessons_completed',
        '25 Lessons Completed': 'twentyfive_lessons_completed',
        '100 XP Earned': 'xp_100_earned',
        '250 XP Earned': 'xp_250_earned',
        '500 XP Earned': 'xp_500_earned',
      };
      const dbKey = keyMap[a.name] || a.name.toLowerCase().replace(/ /g, '_');
      const earned = earnedKeys.includes(dbKey) || localUnlocked.includes(dbKey) || (earnedKeys.length === 0 && a.earned);
      return { ...a, dbKey, earned };
    });
  }, [earnedKeys, localUnlocked]);

  // Calculate local closest achievement progress with memoization
  const localClosestAchievement = useMemo(() => {
    const unearned = achievementsList.filter(a => !a.earned);
    if (unearned.length === 0) return null;

    const progressList = unearned.map(a => {
      let progressPercentage = 0;
      let remainingActions = '';
      let motivation = '';

      if (a.dbKey === 'first_lesson_completed') {
        progressPercentage = completedLessonsCount >= 1 ? 100 : 0;
        remainingActions = '1 lesson';
        motivation = 'Complete your very first lesson to kickstart your climate mastery!';
      } else if (a.dbKey === 'five_lessons_completed') {
        progressPercentage = Math.round((Math.min(5, completedLessonsCount) / 5) * 100);
        remainingActions = `${Math.max(0, 5 - completedLessonsCount)} lessons`;
        motivation = 'Unlock this by finishing 5 lessons across any module.';
      } else if (a.dbKey === 'ten_lessons_completed') {
        progressPercentage = Math.round((Math.min(10, completedLessonsCount) / 10) * 100);
        remainingActions = `${Math.max(0, 10 - completedLessonsCount)} lessons`;
        motivation = 'Double your knowledge and unlock the double-digit badge!';
      } else if (a.dbKey === 'twentyfive_lessons_completed') {
        progressPercentage = Math.round((Math.min(25, completedLessonsCount) / 25) * 100);
        remainingActions = `${Math.max(0, 25 - completedLessonsCount)} lessons`;
        motivation = 'Ultimate academic challenge. Master 25 lessons!';
      } else if (a.dbKey === 'xp_100_earned') {
        progressPercentage = Math.round((Math.min(100, xp) / 100) * 100);
        remainingActions = `${Math.max(0, 100 - xp)} XP`;
        motivation = 'Reach 100 Eco XP by completing quiz challenges correctly.';
      } else if (a.dbKey === 'xp_250_earned') {
        progressPercentage = Math.round((Math.min(250, xp) / 250) * 100);
        remainingActions = `${Math.max(0, 250 - xp)} XP`;
        motivation = 'Earn 250 XP to prove your sustainability knowledge is tier-1.';
      } else if (a.dbKey === 'xp_500_earned') {
        progressPercentage = Math.round((Math.min(500, xp) / 500) * 100);
        remainingActions = `${Math.max(0, 500 - xp)} XP`;
        motivation = 'The grand milestone. Reach 500 XP to become an Eco Grandmaster!';
      } else {
        progressPercentage = a.name === 'Streak Master' ? 40 : 10;
        remainingActions = a.name === 'Streak Master' ? '18 days' : 'Calculate footprint';
        motivation = a.name === 'Streak Master' ? 'Keep visiting daily.' : 'Reduce annual footprint by 50%.';
      }

      return {
        name: a.name,
        progressPercentage,
        remainingActions,
        motivation
      };
    });

    const candidates = progressList.filter(p => p.progressPercentage < 100);
    if (candidates.length === 0) return null;
    
    candidates.sort((a, b) => b.progressPercentage - a.progressPercentage);
    return candidates[0];
  }, [achievementsList, completedLessonsCount, xp]);

  return (
    <AppShell
      title={`Welcome back, ${username.split(' ')[0]} 🌿`}
      subtitle="Your planet is trending in the right direction. Here's your mission control."
    >
      {/* ── Carbon score hero ─────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-premium relative overflow-hidden rounded-3xl p-7 lg:col-span-2"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald/15 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Your carbon score</div>
              <div className="mt-2 flex items-end gap-2">
                <Counter
                  value={currentScore}
                  decimals={1}
                  className="text-6xl font-700 text-gradient"
                />
                <span className="mb-2 text-lg font-500 text-muted-foreground">t CO₂e / yr</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                <TrendingDown className="h-4 w-4" aria-hidden /> {mockCarbonScore.changePct}% this year
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <ComparisonBar label="You"         value={currentScore}    max={12} highlight />
              <ComparisonBar label="National avg" value={mockCarbonScore.national} max={12} />
              <ComparisonBar label="Global avg"   value={mockCarbonScore.global}   max={12} />
            </div>
          </div>
          <div className="mt-4 border-t border-border/20 pt-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-aurora shrink-0" /> {aiInsight}
            </p>
          </div>
        </motion.div>

        {/* Eco personality + streak */}
        <div className="grid gap-5">
          <div className="glass-premium rounded-3xl p-6 bg-navy-deep/55 border border-accent-cyan/12">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora/10 border border-accent-cyan/15">
                <RobotSeedlingIcon size={40} animated={true} glow={true} personality={personality} />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Eco personality</div>
                <div className="font-700">{personalityName}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Level {calculatedLevel} · {xpToNextLevel} XP to Level {calculatedLevel + 1}
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-950/40">
              <div 
                className="h-full rounded-full bg-aurora transition-all duration-500" 
                style={{ width: `${xpInCurrentLevel}%` }}
              />
            </div>
          </div>
          
          <div className="glass flex items-center justify-between rounded-3xl p-6 bg-navy-deep/55 border border-accent-cyan/5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Streak</div>
              <div className="mt-1 text-3xl font-700">
                <Counter value={streak} />{' '}
                <span className="text-base font-500 text-muted-foreground">days</span>
              </div>
            </div>
            <Flame className="h-10 w-10 text-aurora animate-pulse" aria-hidden />
          </div>
        </div>
      </div>



      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Monthly trend chart */}
        <div className="glass rounded-3xl p-6 pb-2 lg:col-span-2 bg-navy-deep/45 border border-accent-cyan/5 flex flex-col justify-between h-full min-h-[340px]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-700">Monthly trend</h2>
              <span className="text-xs text-muted-foreground">tonnes CO₂e</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-aurora shrink-0" /> {aiTrendSummary}
            </p>
          </div>
          <div className="flex-1 mt-4 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend as unknown as Record<string, number>[]} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="eco-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="var(--color-emerald)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-emerald)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  padding={{ left: 10, right: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background:   'var(--color-popover)',
                    border:       '1px solid var(--color-border)',
                    borderRadius: 12,
                    color:        'var(--color-foreground)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-emerald)"
                  strokeWidth={2}
                  fill="url(#eco-gradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emission breakdown */}
        <EmissionBreakdown />
      </div>

      {/* ── AI Recommendations + EcoJump + Achievements (Unified Balanced Grid) ────────────────────────── */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-10 lg:grid-cols-30 gap-5">
        {/* Recommendations */}
        <div className="glass rounded-3xl p-6 col-span-1 md:col-span-6 lg:col-span-13">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-700">
              <Sparkles className="h-5 w-5 text-aurora" aria-hidden /> AI recommendations
            </h2>
            <Link href={ROUTES.COACH.ROOT} className="text-sm text-primary hover:underline">
              Ask the coach
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {aiRecommendations.map((r) => (
              <div
                key={r.title}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 transition-colors hover:border-primary/40"
              >
                <div>
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{r.detail}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-700 text-lg text-primary">{r.reduction || '−0.4t / yr'}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {r.impact || 'Medium'} impact · {r.difficulty || r.effort || 'Low'} effort
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EcoJump */}
        <div className="flex items-center justify-center h-full col-span-1 md:col-span-4 lg:col-span-7">
          <EcoJumpCard />
        </div>

        {/* Achievements */}
        <div className="glass rounded-3xl p-6 col-span-1 md:col-span-10 lg:col-span-10">
          <h2 className="font-700">Achievements</h2>
          <p className="mt-1 text-xs text-muted-foreground leading-normal mb-3">
            {aiAchievementGuidance}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 max-h-[170px] overflow-y-auto pr-1">
            {achievementsList.map((a) => (
              <div
                key={a.name}
                className={`flex flex-col items-center rounded-2xl p-2.5 text-center transition-transform hover:scale-105 ${
                  a.earned ? 'bg-card/40 border border-accent-cyan/10' : 'opacity-30 grayscale'
                }`}
                title={`${a.name} — ${a.desc}`}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="mt-1 text-[9px] font-medium leading-tight line-clamp-1">{a.name}</span>
              </div>
            ))}
          </div>

          {/* Next Achievement progress block utilizing dead space */}
          {(() => {
            const next = localClosestAchievement || aiClosestAchievement;
            if (!next) return null;
            return (
              <div className="mt-6 border-t border-border/20 pt-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground flex items-center gap-1">
                    🎯 Next: <span className="text-foreground">{next.name}</span>
                  </span>
                  <span className="text-primary">{next.progressPercentage}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan"
                    style={{ width: `${next.progressPercentage}%` }}
                  />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">Remaining:</span> {next.remainingActions}
                  </div>
                  <div className="italic text-muted-foreground text-[10px] mt-1 line-clamp-2 leading-tight">
                    "{next.motivation}"
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { href: ROUTES.SIMULATOR.ROOT, label: 'Run a simulation', icon: Sparkles, desc: 'Test a future choice' },
          { href: ROUTES.ROADMAP.ROOT,   label: 'View roadmap',     icon: ArrowRight, desc: 'Your next milestones' },
          { href: ROUTES.LEARN.ROOT,     label: 'Keep learning',    icon: Leaf,       desc: 'Continue your track' },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="glass group flex items-center justify-between rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--glow-emerald)] bg-navy-deep/45 border border-accent-cyan/5"
          >
            <div>
              <div className="font-semibold text-sm">{q.label}</div>
              <div className="text-xs text-muted-foreground">{q.desc}</div>
            </div>
            <q.icon className="h-5 w-5 text-aurora transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

// ─── ComparisonBar sub-component ──────────────────────────────────────────────

const ComparisonBar = memo(function ComparisonBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
  highlight?: boolean;
}) {
  let barColorClass = 'bg-muted-foreground/50';
  if (label === 'You') {
    barColorClass = 'bg-[#00F5A0] shadow-[0_0_8px_rgba(0,245,160,0.4)]'; // Eco Green
  } else if (label === 'National avg') {
    barColorClass = 'bg-[#3B82F6]'; // Blue
  } else if (label === 'Global avg') {
    barColorClass = 'bg-[#A855F7]'; // Purple
  }

  return (
    <div className="w-44">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}t</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-950/40 border border-white/5">
        <motion.div
          className={`h-full rounded-full ${barColorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
});
