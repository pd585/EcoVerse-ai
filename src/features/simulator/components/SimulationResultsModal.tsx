'use client';

import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { EcosystemWorld } from '@/components/shared/EcosystemWorld';
import { Counter } from '@/components/ui/Counter';
import { simulatorScenarios } from '@/data/eco-data';
import type { Database } from '@/types/database/database.types';

type SimulatorRun = Database['public']['Tables']['simulator_runs']['Row'];

interface SimulationResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineScore: number;
  improved: number;
  saved: number;
  pct: number;
  health: number;
  active: Set<string>;
  isClimateChampion: boolean;
  isStage5: boolean;
  isStage4: boolean;
  isStage3: boolean;
  isStage2: boolean;
  activeNarrative: string;
  loadingAI: boolean;
  aiAnalysis: {
    explanation: string;
    reductionAnalysis: string;
    tradeoffs: string;
    nextActions: string;
    score: { impact: string; difficulty: string; reduction: string };
  } | null;
  history: SimulatorRun[];
}

export default function SimulationResultsModal({
  isOpen,
  onClose,
  baselineScore,
  improved,
  saved,
  pct,
  health,
  active,
  isClimateChampion,
  isStage5,
  isStage4,
  isStage3,
  isStage2,
  activeNarrative,
  loadingAI,
  aiAnalysis,
  history,
}: SimulationResultsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 backdrop-blur-md p-4 lg:p-10">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass-premium w-[90vw] h-[85vh] rounded-[2rem] border border-accent-cyan/15 bg-[#070c1e]/98 p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_0_50px_rgba(0,229,255,0.15)] z-10"
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
            onClick={onClose}
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
                &quot;This is where your current habits are leading.&quot;
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
                &quot;{activeNarrative}&quot;
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
            onClick={onClose}
            className="rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-xs font-bold text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95 z-20"
          >
            Return to Lab
          </button>
        </div>
      </motion.div>
    </div>
  );
}
