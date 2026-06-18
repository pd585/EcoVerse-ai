/**
 * Custom hook for responsive media query matching.
 * Enables components to adapt based on viewport size.
 * @module hooks/useMediaQuery
 */

'use client';

import { useState, useEffect } from 'react';

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
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
