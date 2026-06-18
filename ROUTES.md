# EcoVerse AI — Route Structure Documentation

This document maps out the Next.js App Router folder structure and centralized application routes defined in the EcoVerse AI frontend architecture.

## Centralized Routes Configuration

Application routes are centrally defined in `src/constants/routes.ts` to prevent magic strings and enforce type-safety.

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

## Next.js App Router Directory Structure

The Next.js App Router folders inside `src/app` should align with the routing map as follows:

```
src/app/
├── layout.tsx                      # Root Layout
├── page.tsx                        # Home / Intro Page
├── globals.css                     # Global styles
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

## Route Guarding & Middleware (Future Architecture)
- **Public Routes**: `/`, `/auth/*`
- **Protected Routes**: `/dashboard/*`, `/assessment/*`, `/learn/*`, `/simulator/*`, `/coach/*`, `/roadmap/*`
  - Access is governed by authentication session states. Users without session cookies are automatically redirected to `/auth/login`.
