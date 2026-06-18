/**
 * Hook that derives the active scene from scroll progress and synchronises
 * it into the intro store. Also wires the reduced-motion preference.
 * @module features/intro/hooks/useSceneManager
 */

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIntroStore } from '../store/useIntroStore';
import { getSceneByProgress } from '../utils/sceneConfig';
import type { IntroSceneConfig } from '../types/intro.types';

/**
 * Reads `scrollProgress` from the intro store, derives the correct
 * {@link IntroSceneConfig} using {@link getSceneByProgress}, and calls
 * `setActiveScene` only when the derived scene id differs from the currently
 * stored one (preventing redundant store writes on every scroll tick).
 *
 * Also reads the OS/browser reduced-motion preference via `useReducedMotion`
 * and pushes changes into the store via `setReducedMotion`.
 *
 * @returns The {@link IntroSceneConfig} that is currently active.
 */
export function useSceneManager(): IntroSceneConfig {
  const scrollProgress = useIntroStore((s) => s.scrollProgress);
  const activeSceneId = useIntroStore((s) => s.activeScene);
  const setActiveScene = useIntroStore((s) => s.setActiveScene);
  const setReducedMotion = useIntroStore((s) => s.setReducedMotion);

  const prefersReducedMotion = useReducedMotion();

  // Track the previous scene id to avoid redundant setActiveScene calls.
  const prevSceneIdRef = useRef<string>(activeSceneId);

  // Derive the current scene config from scroll progress (pure, no side effects).
  const activeSceneConfig = getSceneByProgress(scrollProgress);

  // Synchronise derived scene into the store only when it changes.
  useEffect(() => {
    if (activeSceneConfig.id !== prevSceneIdRef.current) {
      prevSceneIdRef.current = activeSceneConfig.id;
      setActiveScene(activeSceneConfig.id);
    }
  }, [activeSceneConfig.id, setActiveScene]);

  // Synchronise reduced-motion preference into the store whenever it changes.
  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion, setReducedMotion]);

  return activeSceneConfig;
}
