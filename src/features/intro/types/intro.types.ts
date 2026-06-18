/**
 * Type definitions for the Intro feature.
 * Covers scene configuration, overlay content, progress tracking,
 * and the Zustand store's state/action contracts.
 * @module features/intro/types/intro.types
 */

/**
 * Union of all six intro scene identifiers, ordered cinematically.
 * Each string literal matches the scene's canonical route key.
 */
export type IntroSceneType =
  | 'deep-space'
  | 'earth-reveal'
  | 'carbon-reality'
  | 'climate-impact'
  | 'hope-transformation'
  | 'ecoverse-reveal';

/**
 * Content displayed in the overlay for a given scene.
 * All fields are readonly; CTA is optional and only present on
 * scenes that require user interaction.
 */
export interface IntroOverlayContent {
  /** Primary display text — bold, large headline. */
  readonly headline: string;
  /** Secondary one-liner displayed below the headline. */
  readonly subline?: string;
  /** Optional body copy for deeper narrative context. */
  readonly body?: string;
  /**
   * Optional call-to-action button descriptor.
   * `action` is a string key consumed by the interaction handler.
   */
  readonly cta?: {
    readonly label: string;
    readonly action: string;
  };
}

/**
 * Full configuration record for one intro scene.
 * Drives scroll-based scene activation, progress tracking,
 * and overlay rendering.
 */
export interface IntroSceneConfig {
  /** Canonical scene identifier. */
  readonly id: IntroSceneType;
  /** Zero-based scene order index (0–5). */
  readonly index: number;
  /** Human-readable scene title (used in accessibility labels). */
  readonly title: string;
  /** Short description of the scene's narrative purpose. */
  readonly description: string;
  /**
   * Normalized scroll progress value [0, 1] at which this scene begins.
   * Inclusive lower bound.
   */
  readonly progressStart: number;
  /**
   * Normalized scroll progress value [0, 1] at which this scene ends.
   * Exclusive upper bound (except for the final scene, which is inclusive at 1).
   */
  readonly progressEnd: number;
  /** Overlay content rendered while this scene is active. */
  readonly overlay: IntroOverlayContent;
}

/**
 * Snapshot of the current scroll-driven progress state.
 * Readonly value object — derive from the store, do not mutate directly.
 */
export interface IntroProgressState {
  /** Normalized scroll progress in [0, 1]. */
  readonly scrollProgress: number;
  /** The scene currently in view based on scroll position. */
  readonly activeScene: IntroSceneType;
}

/**
 * Mutable slice of the intro Zustand store's state.
 * Fields are mutable because Zustand's `set` writes directly to them.
 */
export interface IntroStoreState {
  /** Normalized scroll progress in [0, 1]. */
  scrollProgress: number;
  /** Currently active intro scene identifier. */
  activeScene: IntroSceneType;
  /** Whether the user's OS/browser requests reduced motion. */
  prefersReducedMotion: boolean;
  /** Whether the Three.js 3D experience is enabled (from env config). */
  is3DEnabled: boolean;
  /** True once the user has requested to skip the intro sequence. */
  skipRequested: boolean;
}

/**
 * Action methods available on the intro Zustand store.
 * Each action has a single, clearly-typed responsibility.
 */
export interface IntroStoreActions {
  /**
   * Updates the normalized scroll progress.
   * Implementations must clamp the value to [0, 1].
   */
  setScrollProgress: (progress: number) => void;
  /** Sets the currently active intro scene. */
  setActiveScene: (scene: IntroSceneType) => void;
  /** Syncs the reduced-motion accessibility preference into the store. */
  setReducedMotion: (value: boolean) => void;
  /** Syncs the 3D-enabled flag (e.g., after a capability check). */
  set3DEnabled: (value: boolean) => void;
  /**
   * Marks the intro as skipped.
   * Sets `skipRequested` to true, advances progress to 1,
   * and sets the active scene to the final scene.
   */
  requestSkipIntro: () => void;
  /** Resets the store to its initial state. */
  resetIntro: () => void;
}
