/**
 * Sustainability Simulator page component.
 * @module features/simulator/components/SimulatorPage
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Counter } from '@/components/ui/Counter';
import { EcosystemWorld } from '@/components/shared/EcosystemWorld';
import { carbonScore as mockCarbonScore, simulatorScenarios } from '@/data/eco-data';
import { useAuth } from '@/components/layout/AuthProvider';
import { simulatorService } from '../services/simulator.service';
import { supabase } from '@/lib/supabase';
import { safeSetStorageItem } from '@/lib/storage-safety';

// Custom Elegant Leaf SVG accent integrated on the first 'i' in Sustainability
const LeafIcon = () => (
  <span className="relative inline-block mx-[0.02em] text-[#00F5A0]">
    i
    <svg
      className="absolute -top-1.5 -right-0.5 h-[9px] w-[9px] text-[#00F5A0] fill-current drop-shadow-[0_0_5px_rgba(0,245,160,0.8)]"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M17 8C8 10 4 19 4 19S13 19 17 14C19 11.5 20 8 20 8s-3.5 1-3 0z" />
    </svg>
  </span>
);

// Space Grotesk title with slow animated shimmery gradient text fill
const CustomTitle = () => (
  <span
    className="font-display font-bold tracking-tight bg-gradient-to-r from-accent-emerald via-accent-cyan via-sky-400 to-accent-emerald bg-[length:300%_auto] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,245,160,0.12)]"
    style={{ animation: 'ecojump-shimmer 7s linear infinite' }}
  >
    Susta<LeafIcon />nability Simulator
  </span>
);

const NARRATIVES: Record<string, string> = {
  transit: 'Cleaner mobility is reducing urban emissions.',
  diet: 'Plant-based choices are restoring ecosystem balance.',
  solar: 'Renewable energy is strengthening atmospheric health.',
  flights: 'Smarter travel is reducing planetary stress.',
  home: 'Efficiency improvements are lowering environmental load.',
};

export function SimulatorPage() {
  const { user, carbonProfile } = useAuth();
  const [active, setActive] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastToggled, setLastToggled] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const [aiAnalysis, setAiAnalysis] = useState<{
    explanation: string;
    reductionAnalysis: string;
    tradeoffs: string;
    nextActions: string;
    score: { impact: string; difficulty: string; reduction: string };
  } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const baselineScore = carbonProfile?.carbon_score != null ? Number(carbonProfile.carbon_score) : mockCarbonScore.value;

  const fetchHistory = async () => {
    if (user) {
      const { data, error } = await simulatorService.getHistory(user.id);
      if (!error && data) {
        setHistory(data);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const toggle = (id: string) => {
    setIsTransitioning(true);
    setLastToggled(id);
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500); // 1.5s cinematic transition
  };

  const handleCompareOpen = async () => {
    setIsCompareOpen(true);
    setAiAnalysis(null);
    if (user && active.size > 0) {
      const scenarioNames = Array.from(active)
        .map((id) => simulatorScenarios.find((s) => s.id === id)?.title)
        .filter(Boolean)
        .join(', ');

      setLoadingAI(true);

      await simulatorService.saveHistory(
        user.id,
        scenarioNames,
        baselineScore,
        improved,
        saved
      );

      safeSetStorageItem('ecoverse_dashboard_cache_dirty', true);

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
            feature: 'simulator',
            message: `Analyze simulation run: baseline score is ${baselineScore} t, improved score is ${improved} t, saved score is ${saved} t. Enabled actions: ${scenarioNames}.`,
            invalidateCache: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.content);
          setAiAnalysis(parsed);
        }
      } catch (err) {
        console.error('Failed to load simulation AI analysis:', err);
      } finally {
        setLoadingAI(false);
        fetchHistory();
      }
    }
  };

  const saved = useMemo(
    () =>
      simulatorScenarios
        .filter((s) => active.has(s.id))
        .reduce((sum, s) => sum + s.perYear, 0),
    [active],
  );

  const improved = Math.max(0, +(baselineScore - saved).toFixed(1));
  const pct = Math.round((saved / baselineScore) * 100);
  const health = Math.min(100, 45 + pct * 1.45);

  const isClimateChampion = active.size === 5;
  const isStage5 = health > 80;
  const isStage4 = health > 60 && health <= 80;
  const isStage3 = health > 40 && health <= 60;
  const isStage2 = health > 20 && health <= 40;

  // Dynamic context-aware narrative based on active selections
  const activeNarrative = useMemo(() => {
    if (active.size === 0) {
      return 'Toggle choices to see your future timeline emerge.';
    }
    if (isClimateChampion) {
      return 'Climate Champion Achieved! Your future planet is fully restored.';
    }
    if (lastToggled && active.has(lastToggled)) {
      return NARRATIVES[lastToggled] || '';
    }
    const firstActive = Array.from(active)[0];
    return NARRATIVES[firstActive] || '';
  }, [active, lastToggled, isClimateChampion]);

  const resetAll = () => {
    setIsTransitioning(true);
    setLastToggled(null);
    setActive(new Set());
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <AppShell
      title={<CustomTitle />}
      subtitle="Step into the lab. Toggle future choices and watch two timelines diverge."
    >
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Scenario controls */}
        <div className="glass-premium rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-700">
              <Sparkles className="h-5 w-5 text-aurora" aria-hidden /> What happens if I…
            </h2>
            {active.size > 0 && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {simulatorScenarios.map((s) => {
              const on = active.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    on
                      ? 'border-primary bg-primary/10 shadow-[var(--glow-emerald)]'
                      : 'border-border/60 bg-card/30 hover:border-primary/40'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{s.title}</span>
                    <span className="block text-xs text-muted-foreground">{s.blurb}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-700 text-primary">−{s.perYear}t</span>
                    <span
                      className={`mt-1 grid h-5 w-5 place-items-center justify-self-end rounded-full border ${
                        on ? 'border-primary bg-aurora text-primary-foreground' : 'border-border'
                      }`}
                    >
                      {on && <Check className="h-3 w-3" aria-hidden />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison */}
        <div className="grid gap-5 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <TimelineCard label="Current future" tone="muted" score={baselineScore} health={45} />
            <TimelineCard
              label="Improved future"
              tone="bright"
              score={improved}
              health={health}
              transitioning={isTransitioning}
              narrative={activeNarrative}
              activeActions={active}
            />
          </div>

          <motion.div
            layout
            className="glass-premium flex flex-wrap items-center justify-between gap-6 rounded-3xl p-6"
          >
            <div className="flex gap-8 flex-wrap items-center">
              <div>
                <div className="text-sm text-muted-foreground">Annual savings</div>
                <div className="mt-1 text-4xl font-700 text-gradient">
                  <Counter value={saved} decimals={1} suffix="t" /> CO₂e
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Footprint cut</div>
                <div className="mt-1 text-4xl font-700">
                  <Counter value={pct} suffix="%" />
                </div>
              </div>
            </div>

            {/* 🌍 Compare Futures Button */}
            <button
              type="button"
              onClick={handleCompareOpen}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-emerald to-accent-cyan px-5 py-3 text-sm font-bold text-navy-deep shadow-[0_0_20px_rgba(0,245,160,0.25)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>🌍</span> Compare Futures
            </button>

            <p className="w-full text-sm text-muted-foreground">
              {saved === 0
                ? 'Toggle a scenario to see your brighter timeline emerge. 🌍'
                : `That's like planting roughly ${Math.round(saved * 45)} trees every year. Keep going — your planet is healing.`}
            </p>
          </motion.div>

          {/* Climate Champion Pulser Badge */}
          <AnimatePresence>
            {isClimateChampion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass border border-accent-emerald/20 bg-accent-emerald/5 p-4 rounded-3xl text-center select-none shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent-emerald font-bold block mb-1">
                  ★ Accomplishment Unlocked ★
                </span>
                <h3 className="text-base font-bold bg-gradient-to-r from-accent-emerald via-accent-cyan to-accent-emerald bg-clip-text text-transparent animate-pulse">
                  Climate Champion Achieved
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Compare Futures Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 backdrop-blur-md p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-premium w-[90vw] h-[85vh] rounded-[2rem] border border-accent-cyan/15 bg-[#070c1e]/98 p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_0_50px_rgba(0,229,255,0.15)]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <span>🔬</span> Future Impact Lab
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compare your current baseline future with your simulated improved timeline side-by-side.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Panels Layout */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2 overflow-y-auto pr-1 scrollbar-thin">
                
                {/* Left Side: Current Future (lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5 relative overflow-hidden min-h-[300px]">
                  <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Baseline Future
                  </div>
                  <EcosystemWorld size={170} state="stressed" />
                  <div className="mt-5">
                    <div className="text-3xl font-bold text-foreground">
                      {baselineScore} <span className="text-sm font-semibold text-muted-foreground">t CO₂e/yr</span>
                    </div>
                    <div className="mt-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                      Planet Under Stress
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground max-w-[240px] mx-auto italic">
                      "This is where your current habits are leading."
                    </p>
                  </div>
                </div>

                {/* Center: Improved Future (lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-accent-cyan/[0.02] rounded-3xl border border-accent-cyan/10 relative overflow-hidden min-h-[300px]">
                  <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                    Simulated Future
                  </div>
                  <EcosystemWorld size={170} state="healthy" health={health} activeActions={active} />
                  <div className="mt-5">
                    <div className="text-3xl font-bold text-accent-emerald">
                      {improved} <span className="text-sm font-semibold text-muted-foreground">t CO₂e/yr</span>
                    </div>
                    <div className="mt-2 text-xs font-bold text-accent-emerald uppercase tracking-wider">
                      {isClimateChampion
                        ? 'Climate Champion Achieved'
                        : `Stage ${isStage5 ? 5 : isStage4 ? 4 : isStage3 ? 3 : isStage2 ? 2 : 1} — ${isStage5 ? 'Climate Champion' : isStage4 ? 'Thriving' : isStage3 ? 'Growing' : isStage2 ? 'Recovering' : 'Critical'}`}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-accent-cyan/90 font-medium italic max-w-[240px] mx-auto">
                      "{activeNarrative}"
                    </p>
                  </div>
                </div>

                {/* Right Side: Impact Summary & Metrics (lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                  {/* Additional Metrics Panel */}
                  <div className="glass-soft p-5 rounded-2xl border border-white/5 space-y-4 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Key Impact Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Planet Health
                        </span>
                        <span className="text-lg font-bold text-accent-emerald">
                          <Counter value={health} suffix="%" />
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Annual Saved
                        </span>
                        <span className="text-lg font-bold text-accent-cyan">
                          <Counter value={saved} decimals={1} suffix="t" />
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Footprint Cut
                        </span>
                        <span className="text-lg font-bold text-foreground">
                          <Counter value={pct} suffix="%" />
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Tree Equivalent
                        </span>
                        <span className="text-lg font-bold text-accent-emerald">
                          <Counter value={Math.round(saved * 45)} suffix=" 🌳" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary Panel (Checklist) */}
                  <div className="glass-soft p-5 rounded-2xl border border-white/5 flex-1 flex flex-col justify-between text-left min-h-[180px]">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Implemented Actions
                      </h4>
                      <div className="space-y-2">
                        {simulatorScenarios.map((s) => {
                          const on = active.has(s.id);
                          if (!on) return null;
                          return (
                            <div key={s.id} className="flex items-center gap-2 text-xs font-semibold text-accent-emerald">
                              <span className="text-xs">✓</span> {s.title}
                            </div>
                          );
                        })}
                        {active.size === 0 && (
                          <div className="text-xs italic text-muted-foreground">No actions currently enabled.</div>
                        )}
                      </div>
                    </div>

                    {/* AI Simulation Report */}
                    <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left select-none min-h-[140px] flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-cyan mb-2">
                        <Sparkles className="h-3.5 w-3.5" /> AI Simulation Report
                      </div>
                      {loadingAI ? (
                        <div className="flex justify-center items-center py-4">
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
                        </div>
                      ) : aiAnalysis ? (
                        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Explanation</span>
                            <p className="text-[11px] text-foreground/90 leading-relaxed">{aiAnalysis.explanation}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Reduction Impact</span>
                            <p className="text-[11px] text-foreground/90 leading-relaxed">{aiAnalysis.reductionAnalysis}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Tradeoffs</span>
                            <p className="text-[11px] text-foreground/90 leading-relaxed">{aiAnalysis.tradeoffs}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Next Actions</span>
                            <p className="text-[11px] text-foreground/90 leading-relaxed">{aiAnalysis.nextActions}</p>
                            {aiAnalysis.score && (
                              <div className="mt-1.5 p-1.5 rounded-lg bg-card/60 border border-white/5 text-[9px] text-[#00F5A0] flex justify-between">
                                <span>Impact: {aiAnalysis.score.impact}</span>
                                <span>Effort: {aiAnalysis.score.difficulty}</span>
                                <span>Savings: {aiAnalysis.score.reduction}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground/60 leading-normal italic">
                          Click Compare Futures to trigger AI impact report generation.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Simulation History Panel */}
                  <div className="glass-soft p-5 rounded-2xl border border-white/5 flex flex-col text-left max-h-[200px] overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Simulation History
                    </h4>
                    {history.length === 0 ? (
                      <p className="text-xs text-muted-foreground/60 italic">No simulation runs recorded yet.</p>
                    ) : (
                      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                        {history.slice(0, 5).map((h) => (
                          <div key={h.id} className="text-[11px] border-b border-white/5 pb-1.5 last:border-0">
                            <div className="flex justify-between font-semibold text-foreground/90">
                              <span className="truncate max-w-[120px]">{h.scenario_name || 'Custom Run'}</span>
                              <span className="text-accent-emerald">-{h.score_change}t</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {h.footprint_before}t → {h.footprint_after}t · {new Date(h.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Modal footer Close */}
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-xs font-bold text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Return to Lab
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

// ─── TimelineCard ─────────────────────────────────────────────────────────────

function TimelineCard({
  label,
  tone,
  score,
  health,
  transitioning = false,
  narrative = '',
  activeActions,
}: {
  label: string;
  tone: 'muted' | 'bright';
  score: number;
  health: number;
  transitioning?: boolean;
  narrative?: string;
  activeActions?: Set<string>;
}) {
  const bright = tone === 'bright';
  return (
    <div
      className={`glass-premium relative overflow-hidden rounded-3xl p-6 text-center ${
        bright ? 'ring-1 ring-primary/40' : ''
      }`}
    >
      {bright && <div className="absolute inset-0 bg-emerald/10" aria-hidden />}
      <div className="relative h-full flex flex-col justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-4 grid place-items-center">
            <div className={bright ? '' : 'opacity-60 saturate-50'}>
              <EcosystemWorld
                size={140}
                className={bright ? 'animate-float' : ''}
                state={bright ? 'healthy' : 'stressed'}
                health={health}
                transitioning={transitioning}
                activeActions={activeActions}
              />
            </div>
          </div>
          <div className="mt-4 text-3xl font-700">
            <Counter value={score} decimals={1} />{' '}
            <span className="text-sm font-500 text-muted-foreground">t</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            Planet health
          </div>
          <div className="mx-auto mt-1.5 h-2 w-40 overflow-hidden rounded-full bg-secondary/60">
            <motion.div
              className={`h-full rounded-full ${bright ? 'bg-aurora' : 'bg-muted-foreground/50'}`}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Dynamic narrative feed under improved planet */}
        {bright && narrative && (
          <div className="mt-5 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={narrative}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-accent-emerald font-semibold leading-relaxed"
              >
                {narrative}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
