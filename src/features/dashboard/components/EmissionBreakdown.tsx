'use client';

/**
 * Interactive sustainability intelligence component.
 * Transforms static percentage display into detailed, interactive dashboard view.
 * @module features/dashboard/components/EmissionBreakdown
 */

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import {
  buildPersonalityProfile,
  mapAnswersToRecord,
} from '@/features/assessment/utils/personality';
import { emissionBreakdown } from '@/data/eco-data';
import { cn } from '@/lib/utils';

// Personality-specific recommendation overrides per category
const PERSONALITY_INSIGHTS: Record<string, Record<string, string>> = {
  Transport: {
    greenGuardian: 'Protecting natural ecosystems through reduced transport emissions aligns strongly with your sustainability profile.',
    futureBuilder: 'Smart mobility solutions can significantly improve your long-term impact.',
    climateChampion: 'Transport transformation creates some of the largest climate gains available.',
    natureProtector: 'Lowering vehicle usage directly shields local wildlife habitats from pollution.',
    communityCatalyst: 'Carpooling and sharing rides strengthens neighborhood bonds and reduces emissions.',
  },
  Energy: {
    greenGuardian: 'Conserving household energy through mindful habits is a core Guardian practice.',
    futureBuilder: 'Smart home integrations and solar battery systems are key to your tech-forward impact.',
    climateChampion: 'Decarbonizing your power source is one of the most absolute carbon cuts you can achieve.',
    natureProtector: 'Transitioning to clean grid options prevents high-impact resource extraction.',
    communityCatalyst: 'Organizing community clean energy signups expands green grid capacity for everyone.',
  },
  Food: {
    greenGuardian: 'Choosing locally sourced, organic produce respects and guards soil biology.',
    futureBuilder: 'Exploring cellular agriculture and high-efficiency greenhouse foods aligns with your outlook.',
    climateChampion: 'Shifting to plant-based days delivers rapid, massive reductions in your personal carbon footprint.',
    natureProtector: 'A lower-meat diet preserves forests and wild grasslands from agricultural clearing.',
    communityCatalyst: 'Starting a community garden or sharing plant-based recipes amplifies food impact.',
  },
  Shopping: {
    greenGuardian: 'Prioritizing durability and repairing assets guards resources from excessive consumption cycles.',
    futureBuilder: 'Supporting circular economies and product-as-a-service models shapes a smarter future.',
    climateChampion: 'Rejecting fast-fashion and high-emission consumer goods cuts waste footprint at the root.',
    natureProtector: 'Choosing biodegradable or minimal packaging protects oceans from non-recyclable waste.',
    communityCatalyst: 'Hosting swap meets or tool libraries helps your local community bypass commercial waste.',
  },
};

const CATEGORY_STYLES: Record<
  string,
  {
    hoverBg: string;
    hoverGlow: string;
    hoverBorder: string;
    textColor: string;
  }
> = {
  Transport: {
    hoverBg: 'hover:bg-[#00E5FF]/5',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]',
    hoverBorder: 'hover:border-[#00E5FF]/20',
    textColor: 'text-[#00E5FF]',
  },
  Energy: {
    hoverBg: 'hover:bg-[#FFD54F]/5',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(255,213,79,0.12)]',
    hoverBorder: 'hover:border-[#FFD54F]/20',
    textColor: 'text-[#FFD54F]',
  },
  Food: {
    hoverBg: 'hover:bg-[#34D399]/5',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]',
    hoverBorder: 'hover:border-[#34D399]/20',
    textColor: 'text-[#34D399]',
  },
  Shopping: {
    hoverBg: 'hover:bg-[#A78BFA]/5',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(167,139,250,0.12)]',
    hoverBorder: 'hover:border-[#A78BFA]/20',
    textColor: 'text-[#A78BFA]',
  },
};

export const EmissionBreakdown = memo(function EmissionBreakdown() {
  const [earthTooltipOpen, setEarthTooltipOpen] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const earthRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fetch personality from active assessment store
  const storedAnswers = useAssessmentStore((state) => state.answers);
  
  const personalityProfile = useMemo(() => {
    const answerMap = mapAnswersToRecord(storedAnswers);
    return buildPersonalityProfile(answerMap);
  }, [storedAnswers]);

  const activePersonality = useMemo(() => {
    return personalityProfile?.id ?? 'greenGuardian';
  }, [personalityProfile]);

  const personalityName = useMemo(() => {
    return personalityProfile?.name ?? 'Green Guardian';
  }, [personalityProfile]);

  // Click outside listener for Earth Tooltip
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (earthRef.current && !earthRef.current.contains(event.target as Node)) {
        setEarthTooltipOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside listener for Category Insight Popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveInsight(null);
      }
    }
    if (activeInsight) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeInsight]);

  // Current category data structure mapping
  const activeCategory = useMemo(() => {
    return emissionBreakdown.find((e) => e.label === activeInsight);
  }, [activeInsight]);

  // Personalization text lookup
  const personalityRec = useMemo(() => {
    if (!activeInsight) return '';
    return PERSONALITY_INSIGHTS[activeInsight]?.[activePersonality] ?? '';
  }, [activeInsight, activePersonality]);

  return (
    <div className="glass rounded-3xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <h2 className="font-700 text-foreground text-lg leading-tight">
            Emission Breakdown
          </h2>
          <span
            ref={earthRef}
            onClick={() => setEarthTooltipOpen((prev) => !prev)}
            onMouseEnter={() => setEarthTooltipOpen(true)}
            onMouseLeave={() => setEarthTooltipOpen(false)}
            className="inline-block cursor-pointer select-none text-lg transition-all duration-300 hover:rotate-12 hover:scale-110 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
          >
            🌍
          </span>
        </div>

        {/* Earth Popover Tooltip */}
        <AnimatePresence>
          {earthTooltipOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 top-8 z-30 w-72 rounded-xl border border-accent-cyan/15 bg-navy-deep/95 p-4 shadow-[0_0_20px_rgba(0,229,255,0.18)] backdrop-blur-xl"
            >
              <h4 className="text-xs font-semibold text-accent-emerald mb-1">
                Understand your footprint
              </h4>
              <p className="text-[11px] leading-relaxed text-foreground/80">
                Your emissions are distributed across transportation, energy, food, and shopping.
                Explore each category to discover personalized reduction opportunities.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category List ─────────────────────────────────────────────────── */}
      <div className="mt-5 space-y-3.5 flex-1">
        {emissionBreakdown.map((e) => {
          const styles = CATEGORY_STYLES[e.label] ?? {
            hoverBg: 'hover:bg-white/5',
            hoverGlow: '',
            hoverBorder: 'hover:border-white/10',
            textColor: 'text-foreground',
          };

          return (
            <div
              key={e.label}
              onClick={() => setActiveInsight(e.label)}
              className={cn(
                'group relative flex flex-col rounded-2xl border border-transparent p-3.5 transition-all duration-300 cursor-pointer hover:scale-[1.015]',
                styles.hoverBg,
                styles.hoverGlow,
                styles.hoverBorder
              )}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className={cn('text-lg transition-transform duration-300 group-hover:scale-110', styles.textColor)}>
                    {e.icon}
                  </span>
                  <span className={cn('font-semibold transition-colors duration-300', styles.textColor)}>
                    {e.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('font-bold', styles.textColor)}>{e.value}%</span>
                  <button
                    type="button"
                    className="p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setActiveInsight(e.label);
                    }}
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: e.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${e.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Category Detail Popover (Zero Layout Shift Overlay) ──────────── */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 z-20 flex flex-col justify-between rounded-3xl border border-accent-cyan/15 bg-navy-deep/98 p-6 shadow-[0_0_30px_rgba(0,229,255,0.12)] backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-700 flex items-center gap-2" style={{ color: activeCategory.color }}>
                <span>{activeCategory.icon}</span>
                <span>{activeCategory.label} Impact</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveInsight(null)}
                className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-sm scrollbar-thin">
              <p className="text-foreground/90 leading-relaxed font-semibold">
                {activeCategory.insight.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-soft rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5 font-medium">
                    Biggest Contributor
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate" title={activeCategory.insight.contributor}>
                    {activeCategory.insight.contributor}
                  </span>
                </div>

                <div className="glass-soft rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5 font-medium">
                    Potential Reduction
                  </span>
                  <span className="font-bold text-accent-emerald text-xs block">
                    {activeCategory.insight.reduction}
                  </span>
                </div>
              </div>

              <div className="glass-soft rounded-xl p-3.5 border border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">
                  Recommended Action
                </span>
                <p className="font-medium text-foreground text-xs leading-relaxed">
                  {activeCategory.insight.action}
                </p>
              </div>

              {personalityRec && (
                <div className="glass-soft rounded-xl p-3.5 border border-accent-cyan/15 bg-accent-cyan/5">
                  <span className="text-[10px] uppercase tracking-wider text-accent-cyan block mb-1 font-semibold">
                    {personalityName} Profile Insight
                  </span>
                  <p className="italic text-foreground/80 text-[11px] leading-relaxed">
                    "{personalityRec}"
                  </p>
                </div>
              )}
            </div>

            {/* CTA Close Button */}
            <button
              type="button"
              onClick={() => setActiveInsight(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-foreground transition-all duration-300 cursor-pointer text-center text-muted-foreground active:scale-[0.98]"
            >
              Return to Breakdown
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
