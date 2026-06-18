/**
 * Accessible icon wrapper component.
 * Ensures icons are properly hidden from or exposed to screen readers.
 * @module components/shared/AccessibleIcon
 */

import type { ReactNode } from 'react';

export interface AccessibleIconProps {
  /** The icon element to render */
  readonly children: ReactNode;
  /** Accessible label — if provided, the icon is announced; if omitted, it is hidden */
  readonly label?: string;
  /** Custom className */
  readonly className?: string;
}

/**
 * Wraps an icon with proper ARIA attributes.
 * - When `label` is provided: icon is announced with that label.
 * - When `label` is omitted: icon is decorative and hidden from assistive technology.
 */
export function AccessibleIcon({ children, label, className }: AccessibleIconProps) {
  if (label) {
    return (
      <span role="img" aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={className}>
      {children}
    </span>
  );
}
