/**
 * Static configuration and pure helpers for the intro scene sequence.
 * Defines all six scenes with scroll-progress ranges, titles, and overlay copy.
 * Contains NO visual, Three.js, or DOM logic.
 * @module features/intro/utils/sceneConfig
 */

import type { IntroSceneConfig, IntroSceneType } from '../types/intro.types';

/**
 * The default scene shown at scroll position 0.
 * Must match the `id` of the first entry in INTRO_SCENES.
 */
export const DEFAULT_SCENE_ID: IntroSceneType = 'deep-space';

/**
 * Ordered, immutable configuration array for every intro scene.
 * Scroll-progress ranges are contiguous and cover [0, 1] exactly:
 *   deep-space          0.00 – 0.12
 *   earth-reveal        0.12 – 0.30
 *   carbon-reality      0.30 – 0.50
 *   climate-impact      0.50 – 0.66
 *   hope-transformation 0.66 – 0.85
 *   ecoverse-reveal     0.85 – 1.00
 */
export const INTRO_SCENES: readonly IntroSceneConfig[] = [
  {
    id: 'deep-space',
    index: 0,
    title: 'Deep Space',
    description: 'The journey begins in the silence of deep space before Earth comes into view.',
    progressStart: 0.0,
    progressEnd: 0.12,
    overlay: {
      headline: 'In the vastness of space…',
      subline: 'one planet holds the answer.',
      body: 'From billions of kilometres away, a pale blue dot drifts in the dark — fragile, irreplaceable, alive.',
    },
  },
  {
    id: 'earth-reveal',
    index: 1,
    title: 'Earth Revealed',
    description: 'Earth emerges in full detail — oceans, continents, and the thin veil of the atmosphere.',
    progressStart: 0.12,
    progressEnd: 0.3,
    overlay: {
      headline: 'Our home, revealed.',
      subline: 'Four billion years of balance — breathtaking and breakable.',
      body: 'Every ocean current, every forest canopy, every breath of wind is part of a system humanity has changed forever.',
    },
  },
  {
    id: 'carbon-reality',
    index: 2,
    title: 'The Carbon Reality',
    description: 'Data visualises the invisible — carbon emissions accumulating in the atmosphere.',
    progressStart: 0.3,
    progressEnd: 0.5,
    overlay: {
      headline: 'The invisible weight.',
      subline: 'Carbon emissions we cannot see are reshaping the world we live in.',
      body: 'Since the industrial revolution, humanity has added over 2.4 trillion tonnes of CO₂ to the atmosphere. The consequences are already here.',
    },
  },
  {
    id: 'climate-impact',
    index: 3,
    title: 'Climate Impact',
    description: 'The cascading effects of climate change play out across ecosystems and communities.',
    progressStart: 0.5,
    progressEnd: 0.66,
    overlay: {
      headline: 'The cost of inaction.',
      subline: 'Glaciers retreat. Seas rise. Extreme weather accelerates.',
      body: 'Every fraction of a degree matters. The gap between 1.5 °C and 2 °C means millions of lives and entire ecosystems.',
    },
  },
  {
    id: 'hope-transformation',
    index: 4,
    title: 'Hope & Transformation',
    description: 'A pivot toward possibility — renewable energy, restoration, and human ingenuity.',
    progressStart: 0.66,
    progressEnd: 0.85,
    overlay: {
      headline: 'But we can change the story.',
      subline: 'The same ingenuity that caused this crisis can solve it.',
      body: 'Renewable energy is now the cheapest in history. Forests are being restored. Entire economies are reimagining what growth means.',
    },
  },
  {
    id: 'ecoverse-reveal',
    index: 5,
    title: 'EcoVerse Revealed',
    description: 'The EcoVerse AI platform is introduced as the tool for the user\'s personal climate journey.',
    progressStart: 0.85,
    progressEnd: 1.0,
    overlay: {
      headline: 'See the Future Your Choices Create.',
      subline: 'EcoVerse AI turns your decisions into data — and your data into impact.',
      body: 'Understand your footprint. Simulate futures. Act with purpose. Your journey starts now.',
      cta: {
        label: 'Begin Your Journey',
        action: 'start',
      },
    },
  },
] as const;

/**
 * Returns the {@link IntroSceneConfig} whose progress window contains the given value.
 * Progress is clamped to [0, 1] before lookup. The final scene is inclusive at 1.
 *
 * @param progress - Raw scroll progress, any number (will be clamped).
 * @returns The matching scene config.
 *
 * @example
 * ```ts
 * getSceneByProgress(0.0);  // deep-space
 * getSceneByProgress(0.5);  // climate-impact
 * getSceneByProgress(1.0);  // ecoverse-reveal
 * ```
 */
export function getSceneByProgress(progress: number): IntroSceneConfig {
  const clamped = Math.min(1, Math.max(0, progress));

  // Walk scenes; return the first whose range contains clamped progress.
  // The last scene catches the boundary at exactly 1 via the fallback.
  for (let i = 0; i < INTRO_SCENES.length - 1; i++) {
    const scene = INTRO_SCENES[i];
    if (clamped >= scene.progressStart && clamped < scene.progressEnd) {
      return scene;
    }
  }

  // Final scene: inclusive at 1.
  return INTRO_SCENES[INTRO_SCENES.length - 1];
}

/**
 * Looks up a scene by its string identifier.
 * Throws a descriptive error if the id is not found (guards against typos at call sites).
 *
 * @param id - The {@link IntroSceneType} to look up.
 * @returns The matching {@link IntroSceneConfig}.
 */
export function getSceneById(id: IntroSceneType): IntroSceneConfig {
  const found = INTRO_SCENES.find((scene) => scene.id === id);
  if (!found) {
    throw new Error(`[sceneConfig] No scene found for id: "${id}"`);
  }
  return found;
}
