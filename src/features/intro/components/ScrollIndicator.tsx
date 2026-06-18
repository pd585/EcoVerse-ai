/**
 * Scroll indicator cue displayed at the start of the intro experience.
 * Guides the user to scroll down to advance through the narrative.
 * No animation logic — motion will be layered in Phase 2.
 * @module features/intro/components/ScrollIndicator
 */

import type { ReactElement } from 'react';

/**
 * Presentational scroll cue component.
 *
 * Accessibility:
 * - Outer wrapper uses `role="presentation"` because the visual chevron
 *   is decorative; the inner `<span>` provides a screen-reader-visible label.
 * - The component does not intercept keyboard events; scrolling itself is
 *   already natively accessible.
 */
export function ScrollIndicator(): ReactElement {
  return (
    <div
      role='presentation'
      className='pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2'
      data-testid='scroll-indicator'
    >
      {/* Screen-reader label */}
      <span className='sr-only'>Scroll down to continue</span>

      {/* Visual chevron (decorative) */}
      <div
        aria-hidden='true'
        className='flex flex-col items-center gap-1 text-white/60'
      >
        <span className='text-xs font-medium uppercase tracking-widest'>
          Scroll
        </span>

        {/* Simple CSS chevron — no SVG dependency, no animation yet */}
        <div className='h-6 w-px bg-white/40' />
        <div
          className='h-3 w-3 rotate-45 border-b-2 border-r-2 border-white/40'
          style={{ marginTop: '-6px' }}
        />
      </div>
    </div>
  );
}
