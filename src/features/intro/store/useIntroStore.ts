/**
 * Zustand store for the Intro feature.
 * Tracks scroll progress, active scene, accessibility preferences,
 * 3D capability, and skip state across the intro experience.
 * @module features/intro/store/useIntroStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { env } from '@/lib/config/env';
import { DEFAULT_SCENE_ID } from '../utils/sceneConfig';
import type { IntroStoreState, IntroStoreActions } from '../types/intro.types';

/**
 * Computes a fresh initial state for the intro store.
 * Called both at store creation and on `resetIntro` so that
 * `is3DEnabled` always reflects the current env value at reset time.
 */
function makeInitialState(): IntroStoreState {
  return {
    scrollProgress: 0,
    activeScene: DEFAULT_SCENE_ID,
    prefersReducedMotion: false,
    is3DEnabled: env.NEXT_PUBLIC_ENABLE_3D,
    skipRequested: false,
  };
}

/**
 * Intro feature store.
 * Holds all scroll-driven and accessibility-driven state for the intro experience.
 *
 * State flow:
 *   scroll event → useScrollProgress → setScrollProgress (clamped)
 *   scrollProgress change → useSceneManager → setActiveScene
 *   OS preference change → useSceneManager → setReducedMotion
 *
 * DevTools label: 'EcoVerse/Intro'
 */
export const useIntroStore = create<IntroStoreState & IntroStoreActions>()(
  devtools(
    (set) => ({
      ...makeInitialState(),

      /**
       * Updates normalized scroll progress.
       * Clamps the incoming value to [0, 1] before storing.
       */
      setScrollProgress: (progress) =>
        set(
          { scrollProgress: Math.min(1, Math.max(0, progress)) },
          false,
          'setScrollProgress'
        ),

      /** Sets the currently active intro scene. */
      setActiveScene: (scene) =>
        set({ activeScene: scene }, false, 'setActiveScene'),

      /** Syncs the OS/browser reduced-motion preference into the store. */
      setReducedMotion: (value) =>
        set({ prefersReducedMotion: value }, false, 'setReducedMotion'),

      /** Syncs the 3D-enabled capability flag (e.g. after a WebGL check). */
      set3DEnabled: (value) =>
        set({ is3DEnabled: value }, false, 'set3DEnabled'),

      /**
       * Marks the intro as skipped.
       * Advances scroll progress to 1 and sets the active scene to the
       * final scene so downstream consumers can react immediately.
       */
      requestSkipIntro: () =>
        set(
          {
            skipRequested: true,
            scrollProgress: 1,
            activeScene: 'ecoverse-reveal',
          },
          false,
          'requestSkipIntro'
        ),

      /**
       * Resets the store to a freshly-computed initial state.
       * `is3DEnabled` is re-read from `env` at reset time.
       */
      resetIntro: () => set(makeInitialState(), false, 'resetIntro'),
    }),
    { name: 'EcoVerse/Intro' }
  )
);
