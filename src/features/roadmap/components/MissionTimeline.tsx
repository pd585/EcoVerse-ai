/**
 * Mission Roadmap page component.
 * @module features/roadmap/components/MissionTimeline
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Flag, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { roadmap as mockRoadmap } from '@/data/eco-data';
import { useAuth } from '@/components/layout/AuthProvider';
import { roadmapService } from '../services/roadmap.service';
import { supabase } from '@/lib/supabase';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';

const sections = Object.entries(mockRoadmap) as [string, readonly { task: string; done: boolean }[]][];

export function MissionTimeline() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [aiRoadmap, setAiRoadmap] = useState<{
    nextMission: string;
    priorityRanking: string;
    weeklyActionPlan: string;
    motivationSummary: string;
    score: { impact: string; difficulty: string; reduction: string };
  } | null>(null);
  const [loadingAI, setLoadingAI] = useState(true);

  // Initialize tasks state with default mockRoadmap values
  useEffect(() => {
    const initialTasks: Record<string, boolean> = {};
    sections.forEach(([, items]) => {
      items.forEach((item) => {
        initialTasks[item.task] = item.done;
      });
    });

    if (!user) {
      setTasks(initialTasks);
      setLoading(false);
      return;
    }

    // Load progress from Supabase
    roadmapService.getProgress(user.id).then(({ data, error }) => {
      if (!error && data) {
        const dbTasks = { ...initialTasks };
        (data as any[]).forEach((row: any) => {
          dbTasks[row.milestone_key] = row.completed;
        });
        setTasks(dbTasks);
      } else {
        setTasks(initialTasks);
      }
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoadingAI(false);
      return;
    }

    const fetchRoadmapAI = async () => {
      const invalidateCache = safeGetStorageItem('ecoverse_cache_dirty', false);
      try {
        const sessionResponse = await supabase.auth.getSession();
        const token = sessionResponse.data.session?.access_token;

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            feature: 'roadmap',
            message: 'Generate personalized roadmap recommendations',
            invalidateCache,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.content);
          setAiRoadmap(parsed);
          if (invalidateCache) {
            try { localStorage.removeItem('ecoverse_cache_dirty'); } catch (_) {}
          }
        }
      } catch (err) {
        console.error('Failed to load roadmap AI recommendations:', err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchRoadmapAI();
  }, [user]);

  const allTasksKeys = Object.keys(tasks);
  const done = allTasksKeys.filter((k) => tasks[k]).length;
  const pct = allTasksKeys.length > 0 ? Math.round((done / allTasksKeys.length) * 100) : 0;

  const toggleTask = async (taskName: string) => {
    if (!user || loading) return;

    const currentDone = !!tasks[taskName];
    const nextDone = !currentDone;

    // Optimistic UI update
    const updatedTasks = { ...tasks, [taskName]: nextDone };
    setTasks(updatedTasks);

    const totalTasks = Object.keys(updatedTasks).length;
    const completedTasks = Object.values(updatedTasks).filter(Boolean).length;
    const nextPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    try {
      const { error } = await roadmapService.updateProgress(
        user.id,
        taskName,
        nextDone,
        nextPct
      );
      if (error) {
        console.error('Failed to update progress:', error);
        // Revert local state on database error
        setTasks((prev) => ({ ...prev, [taskName]: currentDone }));
      } else {
        safeSetStorageItem('ecoverse_cache_dirty', true);
        safeSetStorageItem('ecoverse_dashboard_cache_dirty', true);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      // Revert local state on exception
      setTasks((prev) => ({ ...prev, [taskName]: currentDone }));
    }
  };

  return (
    <AppShell
      title="Your Mission Roadmap"
      subtitle="A living plan tuned to you. Every checked box is a healthier planet."
    >
      {/* Progress hero */}
      <div className="glass-premium mb-6 flex flex-wrap items-center justify-between gap-5 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-aurora">
            <Flag className="h-6 w-6 text-primary-foreground" aria-hidden />
          </span>
          <div>
            <div className="text-sm text-muted-foreground">Mission progress</div>
            <div className="text-2xl font-700">
              {done} of {allTasksKeys.length} steps complete
            </div>
          </div>
        </div>
        <div className="flex-1 sm:max-w-xs">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
            <motion.div
              className="h-full rounded-full bg-aurora"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1.5 text-right text-sm font-semibold text-primary">{pct}%</div>
        </div>
      </div>

      {/* AI Roadmap Advisor Panel */}
      <div className="glass-premium mb-6 rounded-3xl p-6 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00F5A0] mb-3">
          <Sparkles className="h-4 w-4" /> ROADMAP ADVISOR
        </div>
        <h3 className="text-lg font-700">AI Personal Recommendations</h3>
        {loadingAI ? (
          <div className="flex justify-center items-center py-6">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
          </div>
        ) : aiRoadmap ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="glass-soft rounded-2xl p-4 border border-accent-cyan/5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Recommended Next Mission</div>
              <div className="mt-1 text-sm font-semibold text-[#00F5A0]">{aiRoadmap.nextMission}</div>
              <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Priority Ranking</div>
              <div className="mt-0.5 text-xs text-foreground/90 leading-relaxed">{aiRoadmap.priorityRanking}</div>
              {aiRoadmap.score && (
                <div className="mt-3 p-2 rounded-xl bg-card/60 border border-white/5 text-[10px] text-[#00F5A0] flex justify-between select-none">
                  <span>Impact: {aiRoadmap.score.impact}</span>
                  <span>Effort: {aiRoadmap.score.difficulty}</span>
                  <span>Savings: {aiRoadmap.score.reduction}</span>
                </div>
              )}
            </div>
            <div className="glass-soft rounded-2xl p-4 border border-accent-cyan/5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Weekly Action Plan</div>
                <div className="mt-1 text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{aiRoadmap.weeklyActionPlan}</div>
              </div>
              <div className="mt-3 border-t border-white/5 pt-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Motivation Summary</div>
                <div className="mt-0.5 text-xs text-muted-foreground italic">"{aiRoadmap.motivationSummary}"</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No recommendations loaded.</p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:border-l-2 before:border-dashed before:border-accent-cyan/15 sm:before:left-[23px]">
        {sections.map(([phase, items], si) => (
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: si * 0.08 }}
            className="relative pl-12 sm:pl-16"
          >
            <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-navy-deep border border-accent-cyan/15 shadow-[0_0_12px_rgba(0,229,255,0.15)] sm:h-12 sm:w-12">
              <Sparkles className="h-4 w-4 text-aurora" aria-hidden />
            </span>
            <h2 className="text-lg font-700 text-gradient inline-block">{phase}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const isDone = !!tasks[item.task];
                return (
                  <button
                    key={item.task}
                    onClick={() => toggleTask(item.task)}
                    disabled={loading}
                    className="glass flex items-start text-left w-full gap-3 rounded-2xl p-4 text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.05)] border border-accent-cyan/5 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50"
                  >
                    {isDone ? (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-aurora text-primary-foreground shadow-[0_0_10px_rgba(0,245,160,0.25)]">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-muted-foreground/30 hover:text-accent-cyan/50 transition-colors" aria-hidden />
                    )}
                    <span className={isDone ? 'text-muted-foreground line-through opacity-70 transition-all' : 'text-foreground/90 transition-all'}>
                      {item.task}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
