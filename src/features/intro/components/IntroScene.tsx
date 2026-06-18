/**
 * Bridge component between the scroll system and the Three.js scene.
 * Phase 1: Placeholder only — no Three.js primitives are imported or rendered.
 *
 * TODO (Phase 2):
 *   - Import and mount the R3F <Canvas> here.
 *   - Wire `scrollContainerRef` to `useScrollProgress`.
 *   - Call `useSceneManager` to drive scene transitions.
 *   - This file must remain 'use client' and must be loaded via
 *     `next/dynamic({ ssr: false })` from IntroPage to keep Three.js
 *     out of the server bundle.
 *
 * @module features/intro/components/IntroScene
 */

'use client';

import type { ReactElement, RefObject } from 'react';

/** Props accepted by the IntroScene component. */
export interface IntroSceneProps {
  /**
   * Ref to the tall scroll container that drives progress calculations.
   * Forwarded to `useScrollProgress` in Phase 2.
   */
  readonly scrollContainerRef: RefObject<HTMLElement | null>;
}

/**
 * Placeholder bridge for the 3D intro scene canvas.
 * Renders an accessible region marker so assistive technology can identify
 * the canvas area before it is populated.
 *
 * In Phase 2 this component will host the R3F `<Canvas>` and call:
 *   - `useScrollProgress(scrollContainerRef)` to feed scroll data into the store.
 *   - `useSceneManager()` to derive the active scene and dispatch transitions.
 *
 * @param props - {@link IntroSceneProps}
 */
export function IntroScene({ scrollContainerRef: _scrollContainerRef }: IntroSceneProps): ReactElement {
  return (
    <div
      role='region'
      aria-label='3D intro scene — loading'
      aria-busy='true'
      className='h-screen w-full bg-black'
      data-testid='intro-scene'
    >
      {/* Three.js Canvas will be mounted here in Phase 2. */}
    </div>
  );
}
