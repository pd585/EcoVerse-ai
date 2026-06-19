# 🌿 EcoVerse AI Developer Guide — CLAUDE.md

## 🚀 Key Commands

### Development
```bash
npm run dev           # Start Next.js development server on port 3000
```

### Production Build & Execution
```bash
npm run build         # Validate TypeScript and compile application (uses Turbopack in production mode)
npm run start         # Start Next.js production server
```

### Code Quality & Formatting
```bash
npm run lint          # Run ESLint validation checks (0 errors, 0 warnings enforced)
```

### Testing Suite
```bash
npm run test          # Execute unit & integration tests using Vitest
npm run test:coverage # Generate Vitest line/statement/branch code coverage reports
npm run test:e2e      # Run Playwright E2E browser tests (Chromium, Firefox, WebKit)
```

---

## 🏗️ Architecture & Stack References

- **Framework**: Next.js 16.2.7 (App Router), React 19.2.4, TypeScript, Zustand (State Management)
- **Database & Auth**: Supabase PostgreSQL and GoTrue Authentication
- **Graphics Engine**: Three.js & React Three Fiber (Renders responsive 3D ecosystem in `/simulator`)
- **Rate Limiting**: Upstash Redis (`@upstash/redis` and `@upstash/ratelimit`) edge middleware with an in-memory sliding-window bucket algorithm fallback.
- **Testing Tools**: Vitest & React Testing Library (Unit), Playwright (End-to-End)

---

## 🔒 Verification & Compliance Metrics

- **ESLint Checks**: Strict configuration requiring 0 errors and 0 warnings.
- **Unit Coverage Minimums**:
  - Statements: **95.67%** (Required: >90%)
  - Branches: **86.40%** (Required: >80%)
  - Functions: **97.50%** (Required: >90%)
  - Lines: **96.48%** (Required: >90%)
- **Browser Compatibility**: Playwright E2E suite verifies 18/18 scenarios pass across **Chromium**, **Firefox**, and **WebKit**.

---

## 📝 Coding Guidelines & Conventions

1. **Hydration Safety**:
   - Browser-only globals (`localStorage`, `window`) must be wrapped in hydration safety checks (e.g. `useEffect` or safe helpers like `safeGetStorageItem` / `safeSetStorageItem`).
   - Heavy elements (e.g. R3F Canvas, Chat Client) must be lazy-loaded with `{ ssr: false }` to avoid Next.js SSR mismatch warnings.

2. **Supabase Singleton Usage**:
   - Always import `supabase` from `@/lib/supabase` (the globally cached type-safe singleton). Do not instantiate new clients inside feature modules.

3. **Performance First**:
   - Combine concurrent backend fetches into a single `Promise.all` request inside page components.
   - Cache expensive AI data and insight generation outputs (e.g., carbon insights, roadmap recommendations) locally with a **24-hour expiration window** (TTL).
   - Invalidate cache entries by marking the cache keys dirty (`isDirty`) on user updates.

4. **Security & Validation**:
   - Wrap all API routes (`/api/*`) in strict Zod validation schemas.
   - Ensure all input text fields strip HTML tags and apply prompt injection filters prior to sending data to LLM proxies.
