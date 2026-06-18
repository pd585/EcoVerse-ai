/**
 * Custom hook to detect user's reduced-motion preference.
 * Components should use this to disable or simplify animations.
 * @module hooks/useReducedMotion
 */

'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Returns `true` if the user has requested reduced motion
 * via their OS or browser accessibility settings.
 *
 * @returns Whether reduced motion is preferred
 *
 * @example
 * ```tsx
 * const prefersReduced = useReducedMotion();
 * const animationDuration = prefersReduced ? 0 : 300;
 * ```
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
