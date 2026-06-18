/**
 * Brand hero section displayed throughout the intro experience.
 * Shows the application name and tagline in the primary viewport area.
 * Accepts optional overlay content to enrich the display for specific scenes.
 * No animation logic — visual transitions are deferred to Phase 2.
 * @module features/intro/components/HeroSection
 */

import type { ReactElement } from 'react';
import { APP_CONFIG } from '@/constants/config';
import type { IntroOverlayContent } from '../types/intro.types';

/** Props accepted by the HeroSection component. */
export interface HeroSectionProps {
  /**
   * Optional overlay content to display beneath the brand mark.
   * When omitted, only the application name and tagline are shown.
   */
  readonly overlayContent?: IntroOverlayContent;
}

/**
 * Top-of-viewport hero area with brand identity and optional scene copy.
 *
 * Accessibility:
 * - Uses a semantic `<header>` for the brand mark.
 * - `<h1>` identifies the application by name — only one `<h1>` should
 *   exist in the document at a time; IntroPage must not add another.
 */
export function HeroSection({ overlayContent }: HeroSectionProps): ReactElement {
  return (
    <header
      className='flex flex-col items-center pt-10 text-center text-white'
      aria-label='EcoVerse AI brand'
    >
      <h1 className='text-4xl font-extrabold tracking-tight'>
        {APP_CONFIG.name}
      </h1>

      <p className='mt-2 text-lg font-medium text-white/70'>
        {APP_CONFIG.tagline}
      </p>

      {/* Optional scene-specific headline injected by parent overlays */}
      {overlayContent?.headline && (
        <p
          aria-hidden='true'
          className='mt-4 max-w-xl text-base text-white/50'
        >
          {overlayContent.headline}
        </p>
      )}
    </header>
  );
}
