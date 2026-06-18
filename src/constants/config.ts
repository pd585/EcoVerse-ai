/**
 * Application-wide configuration constants.
 * @module constants/config
 */

export const APP_CONFIG = {
  name: 'EcoVerse AI',
  tagline: 'See the Future Your Choices Create.',
  description: 'AI-powered sustainability platform that helps users understand, simulate, and reduce their carbon footprint.',
  version: '0.1.0',
  
  api: {
    timeout: 30_000,
    retryCount: 3,
    retryDelay: 1_000,
  },

  assessment: {
    maxQuestions: 30,
    minQuestionsForResult: 10,
  },

  simulator: {
    maxScenarios: 10,
    defaultHorizon: '10y' as const,
  },

  coach: {
    maxConversationLength: 50,
    defaultPersonality: 'encouraging' as const,
  },

  three: {
    maxFps: 60,
    defaultPixelRatio: 1.5,
    enableShadows: true,
  },

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
