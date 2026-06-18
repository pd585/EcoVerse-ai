/**
 * Skip-to-content link for keyboard navigation.
 * @module components/shared/SkipLink
 */

import { SKIP_TARGETS } from '@/constants';

export interface SkipLinkProps {
  /** Target element ID to skip to */
  readonly targetId?: string;
  /** Link text */
  readonly label?: string;
  /** Custom className */
  readonly className?: string;
}

/**
 * Renders a visually hidden link that becomes visible on focus.
 * Allows keyboard users to skip repetitive navigation and jump to main content.
 */
export function SkipLink({
  targetId = SKIP_TARGETS.MAIN_CONTENT,
  label = 'Skip to main content',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      // Visually hidden until focused — styles to be applied via CSS
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      onFocus={(e) => {
        // Make visible on focus
        e.currentTarget.style.position = 'fixed';
        e.currentTarget.style.left = '1rem';
        e.currentTarget.style.top = '1rem';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.overflow = 'visible';
        e.currentTarget.style.zIndex = '9999';
      }}
      onBlur={(e) => {
        // Re-hide on blur
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-9999px';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
        e.currentTarget.style.overflow = 'hidden';
      }}
    >
      {label}
    </a>
  );
}
