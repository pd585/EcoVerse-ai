/**
 * Theme constants for consistent styling.
 * These complement Tailwind CSS configuration.
 * @module constants/theme
 */

export const THEME = {
  colors: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    accent: {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      amber: '#f59e0b',
      rose: '#f43f5e',
    },
    earth: {
      ocean: '#1e40af',
      land: '#15803d',
      atmosphere: '#60a5fa',
      glow: '#34d399',
    },
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
      glacial: 1000,
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  spacing: {
    containerPadding: '1rem',
    sectionGap: '4rem',
    cardGap: '1.5rem',
  },
} as const;

export type ThemeColors = typeof THEME.colors;
