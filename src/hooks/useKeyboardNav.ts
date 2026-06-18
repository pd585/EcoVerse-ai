/**
 * Custom hook for keyboard navigation support.
 * Implements arrow-key navigation patterns for composite widgets.
 * @module hooks/useKeyboardNav
 */

'use client';

import { useCallback, useRef } from 'react';
import { KEYS } from '@/constants';

export interface UseKeyboardNavOptions {
  /** Orientation of the navigable list */
  readonly orientation: 'horizontal' | 'vertical';
  /** Whether navigation wraps around at the ends */
  readonly wrap?: boolean;
  /** Callback invoked when an item is activated (Enter/Space) */
  readonly onActivate?: (index: number) => void;
}

export interface UseKeyboardNavReturn {
  /** Attach to the container element's onKeyDown */
  readonly handleKeyDown: (event: React.KeyboardEvent) => void;
  /** Ref to attach to the container element */
  readonly containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Provides keyboard navigation for list-like UI patterns.
 *
 * @param itemCount - Total number of navigable items
 * @param options - Navigation configuration
 * @returns Key handler and container ref
 */
export function useKeyboardNav(
  itemCount: number,
  options: UseKeyboardNavOptions
): UseKeyboardNavReturn {
  const { orientation, wrap = true, onActivate } = options;
  const containerRef = useRef<HTMLElement | null>(null);

  const getFocusableItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        '[role="tab"], [role="menuitem"], [role="option"], button, a[href]'
      )
    ).filter((el) => !el.hasAttribute('disabled'));
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const items = getFocusableItems();
      if (items.length === 0) return;

      const currentIndex = items.indexOf(event.target as HTMLElement);
      if (currentIndex === -1) return;

      const prevKey = orientation === 'vertical' ? KEYS.ARROW_UP : KEYS.ARROW_LEFT;
      const nextKey = orientation === 'vertical' ? KEYS.ARROW_DOWN : KEYS.ARROW_RIGHT;

      let nextIndex: number | null = null;

      switch (event.key) {
        case prevKey:
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) nextIndex = wrap ? items.length - 1 : 0;
          break;
        case nextKey:
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) nextIndex = wrap ? 0 : items.length - 1;
          break;
        case KEYS.HOME:
          event.preventDefault();
          nextIndex = 0;
          break;
        case KEYS.END:
          event.preventDefault();
          nextIndex = items.length - 1;
          break;
        case KEYS.ENTER:
        case KEYS.SPACE:
          event.preventDefault();
          onActivate?.(currentIndex);
          return;
      }

      if (nextIndex !== null) {
        items[nextIndex]?.focus();
      }
    },
    [getFocusableItems, orientation, wrap, onActivate]
  );

  return { handleKeyDown, containerRef };
}
