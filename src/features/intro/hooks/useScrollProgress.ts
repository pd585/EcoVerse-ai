/**
 * Hook that calculates normalized scroll progress for a tall pinned container
 * and writes it to the intro store via setScrollProgress.
 * Handles SSR guard, passive listeners, and rAF throttling.
 * @module features/intro/hooks/useScrollProgress
 */

'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useIntroStore } from '../store/useIntroStore';

/**
 * Attaches a scroll listener to `targetRef` (or the window when the element
 * itself does not scroll internally) and pushes a normalized progress value
 * [0, 1] into the intro store on every frame.
 *
 * Progress is calculated as:
 *   `scrolled / scrollableDistance`
 * where `scrollableDistance = element.scrollHeight - element.clientHeight`.
 *
 * If the element is not scrollable (e.g. a pinned full-viewport section whose
 * parent scrolls), the hook falls back to tracking `window.scrollY` relative
 * to the element's total height minus the viewport height.
 *
 * The listener is passive and rAF-throttled to avoid blocking the main thread.
 * Cleanup cancels any pending animation frame and removes the event listener.
 *
 * @param targetRef - Ref to the scrollable container element.
 */
export function useScrollProgress(
  targetRef: RefObject<HTMLElement | null>
): void {
  const setScrollProgress = useIntroStore((s) => s.setScrollProgress);

  // Holds the pending rAF handle so we can cancel it on cleanup.
  const rafHandleRef = useRef<number>(0);

  useEffect(() => {
    // SSR guard — window is not available on the server.
    if (typeof window === 'undefined') return;

    const element = targetRef.current;

    /**
     * Computes normalized progress from the element's scroll geometry.
     * Prefers internal element scroll; falls back to window-relative position.
     */
    function computeProgress(): number {
      if (!element) return 0;

      const scrollableDistance = element.scrollHeight - element.clientHeight;

      if (scrollableDistance > 0) {
        // Element scrolls internally (overflow-y: scroll / auto).
        return Math.min(1, Math.max(0, element.scrollTop / scrollableDistance));
      }

      // Fallback: element is a pinned/sticky container; track window scroll
      // relative to the element's total height minus the viewport height.
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const windowScrollable = element.scrollHeight - window.innerHeight;

      if (windowScrollable <= 0) return 0;

      const scrolled = window.scrollY - elementTop;
      return Math.min(1, Math.max(0, scrolled / windowScrollable));
    }

    /** Schedules a progress update on the next animation frame. */
    function scheduleUpdate(): void {
      if (rafHandleRef.current) return; // Already pending.
      rafHandleRef.current = window.requestAnimationFrame(() => {
        rafHandleRef.current = 0;
        setScrollProgress(computeProgress());
      });
    }

    // Determine the scroll target: element itself, or window as fallback.
    const scrollTarget: EventTarget =
      element && element.scrollHeight > element.clientHeight ? element : window;

    // Write the initial progress value synchronously on mount.
    setScrollProgress(computeProgress());

    scrollTarget.addEventListener('scroll', scheduleUpdate, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', scheduleUpdate);
      if (rafHandleRef.current) {
        window.cancelAnimationFrame(rafHandleRef.current);
        rafHandleRef.current = 0;
      }
    };
    // targetRef.current is intentionally excluded: the ref object is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setScrollProgress]);
}
