/**
 * Root entry component for the Intro feature.
 * Composes the scroll container, scene canvas placeholder, overlay, and
 * skip control into the full-viewport intro experience.
 *
 * IntroScene will be loaded via:
 *   `next/dynamic(() => import('./IntroScene'), { ssr: false })`
 * once the Three.js rendering layer is implemented in Phase 2.
 * For Phase 1 a static placeholder `<div>` occupies the canvas region.
 *
 * @module features/intro/components/IntroPage
 */

'use client';

import { useRef } from 'react';
import type { ReactElement } from 'react';
import { useIntroStore } from '../store/useIntroStore';
import { IntroOverlay } from './IntroOverlay';
import { ScrollIndicator } from './ScrollIndicator';

/** Props accepted by the IntroPage component. */
export interface IntroPageProps {
  /**
   * Optional callback invoked after the user triggers "Begin Your Journey"
   * or the skip control. Consumers (e.g. the app router) can use this to
   * navigate away from the intro route.
   */
  readonly onComplete?: () => void;
}

/**
 * Root component for the Intro feature.
 * Owns the top-level scroll container and composes all sub-sections.
 *
 * Accessibility:
 * - `<main>` landmark with a descriptive aria-label.
 * - Skip intro button is keyboard-accessible and always visible.
 * - Scroll container exposes aria-label for assistive technology.
 *
 * @param props - {@link IntroPageProps}
 */
export function IntroPage({ onComplete }: IntroPageProps): ReactElement {
  const requestSkipIntro = useIntroStore((s) => s.requestSkipIntro);

  /** Ref forwarded to the tall scroll container that drives progress. */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleSkip(): void {
    requestSkipIntro();
    onComplete?.();
  }

  return (
    <main
      aria-label='EcoVerse AI intro experience'
      className='relative w-full overflow-hidden'
    >
      {/* ── Skip Intro control ──────────────────────────────────────────── */}
      <button
        type='button'
        aria-label='Skip intro and go directly to the app'
        onClick={handleSkip}
        className='fixed top-4 right-4 z-50 rounded-md bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-sm transition-opacity hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      >
        Skip Intro
      </button>

      {/* ── Tall scroll container (drives useScrollProgress in Phase 2) ─── */}
      {/*
       * TODO (Phase 2): attach scrollContainerRef to useScrollProgress once
       * IntroScene is wired. The ref is already established here so
       * IntroScene can receive it as a prop.
       */}
      <div
        ref={scrollContainerRef}
        aria-label='Intro scroll sequence'
        className='relative'
      >
        {/* ── 3D Scene canvas region (Phase 2: replace with dynamic IntroScene) */}
        {/*
         * PHASE 2 NOTE:
         * Replace the placeholder below with:
         *   const IntroScene = dynamic(() => import('./IntroScene'), { ssr: false });
         *   <IntroScene scrollContainerRef={scrollContainerRef} />
         * IntroScene must NOT be imported statically to keep Three.js out of the
         * server bundle.
         */}
        <div
          aria-hidden='true'
          className='sticky top-0 h-screen w-full bg-black'
          data-testid='intro-scene-placeholder'
        />

        {/* ── Overlay: scene-driven headlines and body copy ─────────────── */}
        <IntroOverlay />

        {/* ── Scroll cue shown before the user has scrolled ─────────────── */}
        <ScrollIndicator />
      </div>
    </main>
  );
}
