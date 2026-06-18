/**
 * Assessment question wizard (carbon footprint onboarding flow).
 * Maps to: /assessment/questions
 * @module features/assessment/components/QuestionWizard
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import { EcosphereBackground } from '@/components/shared/EcosphereBackground';
import { onboardingQuestions } from '@/data/eco-data';
import { safeSetStorageItem } from '@/lib/storage-safety';
import { ROUTES } from '@/constants/routes';
import type { AssessmentAnswer } from '@/types';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import {
  buildPersonalityProfile,
  mapAnswersToRecord,
} from '@/features/assessment/utils/personality';
import { useAuth } from '@/components/layout/AuthProvider';
import { carbonService } from '@/features/dashboard/services/carbon.service';
import { profileService } from '@/features/auth/services/profile.service';

export function QuestionWizard() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const storedAnswers = useAssessmentStore((state) => state.answers);
  const addAnswer = useAssessmentStore((state) => state.addAnswer);
  const setResult = useAssessmentStore((state) => state.setResult);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() =>
    mapAnswersToRecord(storedAnswers)
  );
  const q = onboardingQuestions[step];
  const total = onboardingQuestions.length;
  const progress = ((step + (answers[q.key] != null ? 1 : 0)) / total) * 100;

  const choose = (i: number) => {
    const nextAnswers = { ...answers, [q.key]: i };
    setAnswers(nextAnswers);
    addAnswer({ questionId: q.key as unknown as AssessmentAnswer['questionId'], value: i });

    setTimeout(() => {
      if (step < total - 1) {
        setStep((s) => s + 1);
        return;
      }

      const profile = buildPersonalityProfile(nextAnswers);
      if (profile) {
        setResult(profile.result);
        if (user) {
          Promise.all([
            carbonService.recordEmissionChange(
              user.id,
              profile.startScore,
              profile.result.totalCarbonKg / 1000
            ),
            profileService.updateProfile(user.id, {
              avatar_url: profile.id,
            }),
          ]).then(() => {
            safeSetStorageItem('ecoverse_cache_dirty', true);
            safeSetStorageItem('ecoverse_dashboard_cache_dirty', true);
            refreshProfile();
          }).catch((err) => {
            console.error('Error saving onboarding data:', err);
          });
        }
      }

      router.push(ROUTES.ASSESSMENT.RESULTS);
    }, 320);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <EcosphereBackground />
      <div className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <span className="text-sm text-muted-foreground">
          {step + 1} <span className="opacity-50">/ {total}</span>
        </span>
      </div>

      {/* progress bar */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 sm:px-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
          <motion.div
            className="h-full rounded-full bg-aurora"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8 text-center">
              <div className="text-5xl">{q.icon}</div>
              <h1 className="mt-5 text-2xl font-700 sm:text-3xl">{q.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no wrong answers — just your honest starting point.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.key] === i;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(i)}
                    className={`glass flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-[var(--glow-emerald)] ${
                      selected ? 'ring-2 ring-primary' : ''
                    }`}
                    aria-pressed={selected}
                  >
                    {opt}
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
                        selected
                          ? 'border-primary bg-aurora text-primary-foreground'
                          : 'border-border'
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              {answers[q.key] != null && (
                <button
                  onClick={() => choose(answers[q.key]!)}
                  className="inline-flex items-center gap-2 rounded-full bg-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  {step < total - 1 ? 'Next' : 'Reveal my identity'}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
