import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/archive/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      thresholds: {
        statements: 90,
        functions: 90,
        branches: 80,
        lines: 90,
      },
      include: [
        'src/features/assessment/utils/personality.ts',
        'src/features/coach/services/coach.service.ts',
        'src/features/dashboard/services/carbon.service.ts',
        'src/features/simulator/services/simulator.service.ts',
        'src/lib/storage-safety.ts',
        'src/lib/security.ts',
        'src/lib/ai/guardrails.ts',
        'src/lib/ai/systemPrompt.ts',
        'src/lib/rateLimit.ts',
        'src/middleware.ts',
      ],
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
