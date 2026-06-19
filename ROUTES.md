# 🌿 EcoVerse AI — Route Structure Documentation

This document maps out the Next.js App Router folder structure, centralized application routes, and middleware/rate-limiting guardrails defined in the EcoVerse AI frontend architecture.

## Centralized Frontend Routes

Application routes are centrally defined in `src/constants/routes.ts` to prevent magic strings and enforce type safety.

| Constant Name | Route Path | Feature Module | Description |
| :--- | :--- | :--- | :--- |
| `ROUTES.HOME` | `/` | `intro` | Landing / Intro experience |
| `ROUTES.AUTH.LOGIN` | `/auth/login` | `auth` | User login page |
| `ROUTES.AUTH.REGISTER` | `/auth/register` | `auth` | User registration page |
| `ROUTES.AUTH.FORGOT_PASSWORD` | `/auth/forgot-password` | `auth` | Password recovery page |
| `ROUTES.ASSESSMENT.ROOT` | `/assessment` | `assessment` | Footprint assessment landing |
| `ROUTES.ASSESSMENT.QUESTIONS` | `/assessment/questions` | `assessment` | Assessment step wizard |
| `ROUTES.ASSESSMENT.RESULTS` | `/assessment/results` | `assessment` | Carbon footprint score & breakdown |
| `ROUTES.DASHBOARD.ROOT` | `/dashboard` | `dashboard` | Dashboard root path |
| `ROUTES.DASHBOARD.OVERVIEW` | `/dashboard/overview` | `dashboard` | Metrics overview & summary card deck |
| `ROUTES.DASHBOARD.ANALYTICS` | `/dashboard/analytics` | `dashboard` | Detailed carbon graphs & breakdown |
| `ROUTES.LEARN.ROOT` | `/learn` | `learn` | Educational content directory |
| `ROUTES.LEARN.MODULE(id)` | `/learn/[id]` | `learn` | Dynamic route for learning modules |
| `ROUTES.LEARN.CONTENT(moduleId, contentId)` | `/learn/[moduleId]/[contentId]` | `learn` | Dynamic nested route for articles/lessons |
| `ROUTES.SIMULATOR.ROOT` | `/simulator` | `simulator` | Future impact 3D simulation canvas |
| `ROUTES.SIMULATOR.SCENARIO(id)` | `/simulator/[id]` | `simulator` | Dynamic simulation scenario route |
| `ROUTES.COACH.ROOT` | `/coach` | `coach` | AI Chat Coach interface |
| `ROUTES.COACH.CONVERSATION(id)` | `/coach/[id]` | `coach` | Specific conversational chat log thread |
| `ROUTES.ROADMAP.ROOT` | `/roadmap` | `roadmap` | User's action plan / milestones list |
| `ROUTES.ROADMAP.MILESTONE(id)` | `/roadmap/[id]` | `roadmap` | Action detail and completion guidelines |

---

## Centralized API Routes

All server-side endpoints are located inside `src/app/api` and handle structured validations.

| Route Endpoint | HTTP Method | Protected | Feature Module | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/ai/chat` | `POST` | Yes | `coach` / `dashboard` | LLM Proxy for Coach replies and carbon recommendations. Protected via bearer tokens. |

---

## Route Guarding & Middleware (Implemented)

Authentication session states are managed using Supabase client cookies. Protection boundaries are enforced as follows:

*   **Public Routes**: `/`, `/auth/*`
    *   Accessible by unauthenticated users.
*   **Protected Routes**: `/dashboard/*`, `/assessment/*`, `/learn/*`, `/simulator/*`, `/coach/*`, `/roadmap/*`
    *   Access is governed by authentication session states. Users without session cookies are automatically redirected to `/auth/login`.

### Distributed Rate Limiting

The application uses Next.js Edge Middleware (`middleware.ts`) to intercept all requests matching `/api/:path*`. Rate limits are checked via **Upstash Redis** (with an in-memory sliding-window bucket algorithm fallback if Redis is unavailable).

*   **Authentication API (`/api/auth/*`)**:
    *   Limit: 5 requests / 15 minutes per IP.
*   **AI Chat API (`/api/ai/*`)**:
    *   Limit: 10 requests / minute per user identifier (JWT user ID) or IP fallback.
*   **General API (`/api/*`)**:
    *   Limit: 60 requests / minute per user/IP.

If a rate limit is exceeded, the server returns a `429 Too Many Requests` status, with standard `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Reset` headers.

---

## Next.js App Router Directory Structure

The Next.js App Router folders inside `src/app` align with the routing map:

```
src/app/
├── layout.tsx                      # Root Layout (AuthProvider, Theme)
├── page.tsx                        # Home / Intro Page
├── globals.css                     # Global styles
├── api/
│   └── ai/
│       └── chat/
│           └── route.ts            # POST /api/ai/chat
├── auth/
│   ├── layout.tsx                  # Auth sub-layout
│   ├── login/
│   │   └── page.tsx                # /auth/login
│   ├── register/
│   │   └── page.tsx                # /auth/register
│   └── forgot-password/
│       └── page.tsx                # /auth/forgot-password
├── assessment/
│   ├── layout.tsx                  # Assessment wizard layout
│   ├── page.tsx                    # /assessment
│   ├── questions/
│   │   └── page.tsx                # /assessment/questions
│   └── results/
│       └── page.tsx                # /assessment/results
├── dashboard/
│   ├── layout.tsx                  # Dashboard sidebar & topnav layout
│   ├── page.tsx                    # Redirects to /dashboard/overview
│   ├── overview/
│   │   └── page.tsx                # /dashboard/overview
│   └── analytics/
│       └── page.tsx                # /dashboard/analytics
├── learn/
│   ├── page.tsx                    # /learn
│   ├── [moduleId]/
│   │   ├── page.tsx                # /learn/[moduleId]
│   │   └── [contentId]/
│   │       └── page.tsx            # /learn/[moduleId]/[contentId]
│   └── layout.tsx
├── simulator/
│   ├── page.tsx                    # /simulator
│   ├── [scenarioId]/
│   │   └── page.tsx                # /simulator/[scenarioId]
│   └── layout.tsx
├── coach/
│   ├── page.tsx                    # /coach
│   ├── [conversationId]/
│   │   └── page.tsx                # /coach/[conversationId]
│   └── layout.tsx
└── roadmap/
    ├── page.tsx                    # /roadmap
    ├── [milestoneId]/
    │   └── page.tsx                # /roadmap/[milestoneId]
    └── layout.tsx
```
