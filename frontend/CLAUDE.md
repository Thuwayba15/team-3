# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint

# Playwright E2E tests
npx playwright test                        # Run all tests (auto-starts dev server)
npx playwright test tests/example.spec.ts  # Run a single test file
npx playwright test --grep "test name"     # Run tests matching a pattern
npx playwright show-report                 # Open HTML test report
```

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · Ant Design 6 · antd-style · Axios · Playwright

**Environment variable:**
- `NEXT_PUBLIC_API_BASE_URL` — Backend API base URL (default: `https://localhost:44311`, see `.env.local`)

### Route Structure

Route groups divide the app into three areas:

- `src/app/(auth)/` — Unauthenticated pages (`/login`, `/register`)
- `src/app/(dashboard)/` — Protected pages; wrapped by `DashboardLayout` which guards auth and injects the sidebar/header
- `src/app/page.tsx` — Public landing page

Protected routes are organized by role: `/admin/`, `/parent/`, `/student/`, `/tutor/`.

### Auth

`AuthProvider` (`src/providers/auth/`) uses a Context + useReducer pattern. On mount it calls `/api/TokenAuth/Me` to rehydrate the session from an HttpOnly cookie. The resolved role (priority: admin > tutor > parent > student) is stored in context and in `localStorage`.

`withRole` HOC (`src/components/hoc/withRole.tsx`) wraps page components to enforce role-based access.

### API Layer

- `src/lib/api/client.ts` — Centralized Axios instance; sets `NEXT_PUBLIC_API_BASE_URL` as base URL and injects the `Abp-TenantId` header on every request.
- `src/constants/api.ts` — All endpoint path constants.
- `src/services/` — One module per domain (auth, parent, sessions, users). Responses handle both raw and ABP envelope format `{ result: T }`.

### Navigation

`src/config/navigation.ts` defines `NAVIGATION_BY_ROLE`, mapping each role to its sidebar items. `AppSidebar` reads this config; the active item is derived from the current pathname.

### Styling

Components co-locate styles using `antd-style`'s `createStyles` hook (returns a `useStyles` hook). The global Ant Design theme (primary teal `#0f766e`) is defined in `src/theme/themeConfig.ts`.

### Testing

Playwright tests live in `tests/`. The config auto-starts the dev server on port 3000. Tests check visible UI elements by role/text — they require the app to be reachable and do not mock the backend. Skipped test suites use `test.describe.skip(...)`.
