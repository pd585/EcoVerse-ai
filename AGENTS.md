<!-- BEGIN:nextjs-agent-rules -->
# 🌿 EcoVerse AI — Agent Conventions & Guidelines

This repository represents a production-hardened, feature-complete PromptWars finalist submission. Any editing task must respect and preserve existing performance, testing, and security configurations.

## 🚀 Project Status
- **Build Status**: Production builds (`npm run build`) compile cleanly using Next.js 16.2.7 and React 19.2.4.
- **Linting Status**: 0 ESLint errors, 0 ESLint warnings.
- **Unit Testing**: 64 passing tests with >95% statements and >85% branches coverage.
- **E2E Testing**: 18/18 Playwright tests passing on Chromium, Firefox, and WebKit.
- **Security**: Distributed rate limiting (Upstash Redis + sliding window local fallback) is fully active in `middleware.ts` and `src/lib/rateLimit.ts`.

---

## 🛠️ Essential Development Rules

### 1. Zero-Regression Policy
Do not modify core feature mechanics or database schemas. All changes must be fully validated. If code changes are made, immediately execute the validation command stack:
```bash
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
```

### 2. Testing Constraints
- **Unit Tests**: Coverage must remain above **90% Statements** and **80% Branches**. Never add assertion-free or dummy placeholder tests.
- **E2E Tests**: Use stable role-based selectors (`page.getByRole('textbox', { name: '...' })` or `data-testid`) instead of fragile CSS selectors or dynamic placeholders.

### 3. Hydration & SSR Safety
- Avoid referencing browser-specific variables during initial hydration. Wrap local storage accesses in safe parsing utilities (`safeGetStorageItem` in `src/lib/storage-safety.ts`).
- Heavy elements like Three.js simulators or markdown chats must be lazy-loaded with `{ ssr: false }` to prevent SSR mismatch errors.

### 4. Rate Limit Controls
- Middleware rate limiting applies to `/api/:path*`.
- When testing locally without Upstash credentials, verify the local sliding-window fallback functions correctly without throwing uncaught exceptions.
<!-- END:nextjs-agent-rules -->
