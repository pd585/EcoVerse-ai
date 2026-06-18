/**
 * Accessibility constants and ARIA helpers.
 * @module constants/accessibility
 */

/** Standard ARIA live region politeness levels */
export const ARIA_LIVE = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
  OFF: 'off',
} as const;

/** Common ARIA roles used across the application */
export const ARIA_ROLES = {
  ALERT: 'alert',
  BANNER: 'banner',
  BUTTON: 'button',
  DIALOG: 'dialog',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  SEARCH: 'search',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  PROGRESSBAR: 'progressbar',
  STATUS: 'status',
} as const;

/** Keyboard key constants for navigation handlers */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/** Focus visible outline styles (class names) */
export const FOCUS_STYLES = {
  DEFAULT: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
  INSET: 'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500',
  RING: 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
} as const;

/** Skip link target IDs */
export const SKIP_TARGETS = {
  MAIN_CONTENT: 'main-content',
  NAVIGATION: 'main-navigation',
  SEARCH: 'search-input',
} as const;
