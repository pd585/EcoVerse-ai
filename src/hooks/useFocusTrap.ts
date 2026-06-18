/**
 * Custom hook for trapping focus within a container.
 * Essential for accessible modal dialogs and overlays.
 * @module hooks/useFocusTrap
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { KEYS } from '@/constants';

export interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active */
  readonly enabled: boolean;
  /** Element to return focus to when the trap is deactivated */
  readonly returnFocusTo?: HTMLElement | null;
}

/**
 * Traps keyboard focus within a container element.
 * Used for modals, dialogs, and overlays to meet WCAG 2.1 requirements.
 *
 * @param options - Trap configuration
 * @returns Ref to attach to the container element
 */
export function useFocusTrap(options: UseFocusTrapOptions) {
  const { enabled, returnFocusTo } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== KEYS.TAB) return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    // Focus first element when trap activates
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0]?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus when trap deactivates
      returnFocusTo?.focus();
    };
  }, [enabled, getFocusableElements, returnFocusTo]);

  return containerRef;
}
