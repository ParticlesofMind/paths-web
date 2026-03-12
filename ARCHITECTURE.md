# Paths Web

The web platform version of Paths — full feature parity with the iOS app, served in a browser.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (shared with iOS app)
- **Auth**: Supabase Auth (Apple Sign-In + email)

## Project structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Landing / home
  auth/               # Sign-in, sign-up, callback routes
  calendar/           # Pattern calendar view
  groups/             # Social groups
  profile/            # User profile and settings
  progress/           # Progress and levels
  api/                # Route handlers
components/
  layout/             # AppShell, Header, Sidebar, BottomNav
  ui/                 # Design system primitives (Button, Card, Badge…)
  calendar/           # Calendar grid, pattern slots, day view
  patterns/           # Pattern cards, pattern creation, scheduling
  methods/            # Web-adapted method components
  auth/               # Sign-in form, Apple sign-in button
lib/
  supabase/
    client.ts         # Browser Supabase client
    server.ts         # Server-side Supabase client (RSC / Route Handlers)
  hooks/              # Shared React hooks
types/                # Shared TypeScript types (mirrors iOS models)
```

## Getting started

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

## Relationship to other products

- Shares the same Supabase project as **Paths iOS**
- The database schema is managed from `../Paths/supabase/migrations/`
- See the full ecosystem overview at `../Paths/ARCHITECTURE.md`
