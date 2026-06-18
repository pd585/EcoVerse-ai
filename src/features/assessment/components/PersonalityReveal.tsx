/**
 * Personality reveal screen — assessment results page.
 * Maps to: /assessment/results
 * @module features/assessment/components/PersonalityReveal
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import { EcosphereBackground } from '@/components/shared/EcosphereBackground';
import { RobotSeedlingIcon } from '@/components/brand';
import { safeGetStorageItem, safeSetStorageItem } from '@/lib/storage-safety';
import { Loader } from '@/components/ui/Loader';
import { ROUTES } from '@/constants/routes';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import {
  buildPersonalityProfile,
  mapAnswersToRecord,
} from '@/features/assessment/utils/personality';

const IDENTITY = {
  id: 'greenGuardian' as const,
  name: 'Green Guardian',
  emoji: '🌿',
  tagline: 'Steady, principled, and quietly powerful.',
  desc: 'You protect what matters through consistent, thoughtful action. You don\'t chase trends — you build habits that last and inspire those around you.',
  traits: ['Consistent', 'Nature-first', 'Community-minded'],
  startScore: 6.4,
};

export function PersonalityReveal() {
  const storedAnswers = useAssessmentStore((state) => state.answers);
  const [revealed, setRevealed] = useState(false);
  const [aiTagline, setAiTagline] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiResult, setAiResult] = useState<{
    strengths: string;
    weaknesses: string;
    growthOpportunities: string;
    path: string;
  } | null>(null);

  const identity = useMemo(() => {
    const answerMap = mapAnswersToRecord(storedAnswers);
    return buildPersonalityProfile(answerMap) ?? IDENTITY;
  }, [storedAnswers]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const fetchAssessmentAI = async () => {
      const invalidateCache = safeGetStorageItem('ecoverse_cache_dirty', false);
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feature: 'assessment',
            message: `Analyze assessment answers: ${JSON.stringify(storedAnswers)}`,
            invalidateCache,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.content);
          setAiTagline(parsed.tagline);
          setAiSummary(parsed.personalitySummary);
          setAiResult({
            strengths: parsed.strengths,
            weaknesses: parsed.weaknesses,
            growthOpportunities: parsed.growthOpportunities,
            path: parsed.path,
          });
          if (invalidateCache) {
            try { localStorage.removeItem('ecoverse_cache_dirty'); } catch (_) {}
          }
        }
      } catch (err) {
        console.error('Failed to load assessment AI:', err);
      }
    };

    fetchAssessmentAI();
  }, [revealed, storedAnswers]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <EcosphereBackground />
      <div className="relative z-10 px-5 py-5 sm:px-8">
        <Brand />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        {!revealed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader variant="questionnaire" label="Analyzing your choices…" size={80} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-premium relative w-full max-w-lg overflow-hidden rounded-[2rem] p-10 text-center"
          >
            <div className="absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-aurora opacity-30 blur-3xl" />
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-aurora">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Your Eco Personality
            </span>
            <motion.div
              className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-slate-900/60 border border-accent-cyan/15 shadow-[0_0_35px_rgba(0,245,160,0.25)] p-3 relative overflow-hidden group backdrop-blur-md"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.25,
                type: 'spring',
                stiffness: 180,
                damping: 14,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5A0]/10 to-[#22D3EE]/10 opacity-60 animate-pulse" />
              <RobotSeedlingIcon
                size={84}
                animated={true}
                glow={true}
                variant="hero"
                personality={identity.id}
              />
            </motion.div>
            <h1 className="mt-4 text-4xl font-700 text-gradient">{identity.name}</h1>
            <p className="mt-2 text-sm font-medium text-foreground/80">{aiTagline || identity.tagline}</p>
            <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">{aiSummary || identity.desc}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {identity.traits.map((t) => (
                <span key={t} className="glass-soft rounded-full px-4 py-1.5 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>

            {aiResult && (
              <div className="mt-6 border-t border-white/10 pt-5 text-left space-y-4 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F5A0]">Sustainability Strength</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal">{aiResult.strengths}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Sustainability Leverage Area</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal">{aiResult.weaknesses}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-semibold">Growth Opportunity</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal">{aiResult.growthOpportunities}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary font-semibold">Personalized Improvement Path</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal">{aiResult.path}</p>
                </div>
              </div>
            )}

            <div className="mt-7 glass-soft rounded-2xl px-5 py-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Your starting carbon score
              </div>
              <div className="mt-1 text-3xl font-700">
                {identity.startScore}
                <span className="ml-1 text-base font-500 text-muted-foreground">t CO₂e / yr</span>
              </div>
            </div>

            <Link
              href={ROUTES.DASHBOARD.OVERVIEW}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-aurora px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-emerald)] transition-transform hover:scale-105"
            >
              Enter mission control <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
