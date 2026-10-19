# NoteHub — homework 07

Next.js App Router routing extension for NoteHub.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_NOTEHUB_TOKEN` in `.env.local`.

Routes:

- `/` — home page
- `/notes/filter/all` — all notes
- `/notes/filter/Work` — notes filtered by tag
- `/notes/[id]` — note details

The project includes catch-all tag filtering, parallel sidebar and modal routes, intercepting note preview routes, server-side TanStack Query prefetching, client hydration, CSS Modules, and TypeScript.

## Build

```bash
npm run build
npm start
```
