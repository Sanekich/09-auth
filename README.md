# NoteHub — Homework 09

Authenticated NoteHub application built with Next.js App Router, TypeScript, Axios, TanStack Query, CSS Modules, and cookie-based authentication.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

For local development, `.env.local` should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The application calls its own `/api` route handlers. Those handlers forward requests and authentication cookies to the authenticated NoteHub backend at `https://notehub-api.goit.study`.

## Build

```bash
npm run format
npm run build
npm start
```

## Routes

Public:

- `/` — home page
- `/sign-in` — login
- `/sign-up` — registration

Protected:

- `/notes/filter/all` — all notes
- `/notes/filter/:tag` — filtered notes
- `/notes/:id` — note details
- `/notes/action/create` — create note
- `/profile` — current user profile
- `/profile/edit` — edit profile

## Architecture

- `app/api` contains the provided Next.js proxy route handlers.
- `lib/api/api.ts` contains the shared Axios instance with `withCredentials: true`.
- `lib/api/clientApi.ts` contains browser/client functions.
- `lib/api/serverApi.ts` contains server functions that forward request cookies.
- `proxy.ts` and `middleware.ts` protect `/notes` and `/profile`.
- Route groups keep authentication routes and private routes in separate layouts without changing public URLs.
- TanStack Query manages client request state and cache invalidation.
- CSS Modules provide component-scoped styles.

## Vercel

Set this production environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

Redeploy after changing the variable. Then test registration, login, notes, profile, logout, and direct detail-page navigation on the production URL.
