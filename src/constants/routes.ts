/**
 * Application route constants.
 * Centralized route definitions to prevent magic strings.
 * @module constants/routes
 */

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  ASSESSMENT: {
    ROOT: '/assessment',
    QUESTIONS: '/assessment/questions',
    RESULTS: '/assessment/results',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    OVERVIEW: '/dashboard/overview',
    ANALYTICS: '/dashboard/analytics',
  },
  LEARN: {
    ROOT: '/learn',
    MODULE: (id: string) => `/learn/${id}` as const,
    CONTENT: (moduleId: string, contentId: string) => `/learn/${moduleId}/${contentId}` as const,
  },
  SIMULATOR: {
    ROOT: '/simulator',
    SCENARIO: (id: string) => `/simulator/${id}` as const,
  },
  COACH: {
    ROOT: '/coach',
    CONVERSATION: (id: string) => `/coach/${id}` as const,
  },
  ROADMAP: {
    ROOT: '/roadmap',
    MILESTONE: (id: string) => `/roadmap/${id}` as const,
  },
  PROFILE: '/profile',
} as const;

/** Type-safe route type */
export type AppRoute = typeof ROUTES;
