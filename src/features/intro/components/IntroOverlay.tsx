/**
 * Overlay renderer for the active intro scene.
 * Reads the current scene from the intro store and renders its headline,
 * subline, and optional CTA as semantic, accessible HTML.
 * No animation logic — transitions will be layered in Phase 2.
 * @module features/intro/components/IntroOverlay
 */

'use client';

import type { ReactElement } from 'react';
import { useIntroStore } from '../store/useIntroStore';
import { getSceneById } from '../utils/sceneConfig';
import { HeroSection } from './HeroSection';
import { FeatureHighlight } from './FeatureHighlight';

/**
 * Overlay component that surfaces scene-specific narrative content.
 *
 * Accessibility:
 * - The `<section>` wrapping headline/subline has `aria-live="polite"` and
 *   `aria-atomic="true"` so that screen readers announce scene changes.
 * - The CTA is rendered as a real `<button>` element.
 */
export function IntroOverlay(): ReactElement {
  const activeSceneId = useIntroStore((s) => s.activeScene);
  const requestSkipIntro = useIntroStore((s) => s.requestSkipIntro);

  const scene = getSceneById(activeSceneId);
  const { overlay } = scene;

  function handleCta(): void {
    if (overlay.cta?.action === 'start') {
      requestSkipIntro();
    }
  }

  return (
    <div
      className='pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-end pb-16'
      data-testid='intro-overlay'
    >
      {/* ── Scene announcement region (aria-live) ───────────────────────── */}
      <section
        aria-live='polite'
        aria-atomic='true'
        aria-label={`Scene: ${scene.title}`}
        className='pointer-events-auto max-w-2xl px-6 text-center text-white'
      >
        <h2 className='text-3xl font-bold leading-tight'>
          {overlay.headline}
        </h2>

        {overlay.subline && (
          <p className='mt-2 text-lg text-white/80'>
            {overlay.subline}
          </p>
        )}

        {overlay.body && (
          <p className='mt-4 text-base text-white/60'>
            {overlay.body}
          </p>
        )}

        {overlay.cta && (
          <button
            type='button'
            aria-label={overlay.cta.label}
            onClick={handleCta}
            className='mt-6 rounded-full bg-emerald-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400'
          >
            {overlay.cta.label}
          </button>
        )}
      </section>

      {/* ── Feature pillars (rendered in the ecoverse-reveal scene) ─────── */}
      {activeSceneId === 'ecoverse-reveal' && (
        <div className='pointer-events-auto mt-8 w-full max-w-3xl px-6'>
          <FeatureHighlight />
        </div>
      )}

      {/* ── Brand / tagline hero (rendered from the start) ──────────────── */}
      <div className='pointer-events-none absolute top-0 left-0 right-0'>
        <HeroSection />
      </div>
    </div>
  );
}
