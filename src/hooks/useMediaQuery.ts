/**
 * Custom hook for responsive media query matching.
 * Enables components to adapt based on viewport size.
 * @module hooks/useMediaQuery
 */
'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns `true` if the media query matches, `false` otherwise
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') {
        return () => {};
      }
      const mediaQuery = window.document.defaultView 
        ? window.document.defaultView.matchMedia(query) 
        : window.matchMedia(query);
      
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    },
    () => false
  );
}
