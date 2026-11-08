# particlesofmind.com

Public website for the Paths iOS app. Read `MISSION.md` (what the site may say)
and `ARCHITECTURE.md` (how it is built) first.

- Components are React (`.tsx`). Astro files are only pages, the layout and
  page-level shells.
- The typeface is Jost, the same as the app. Colour and type come from `src/styles/site.css`
  through Tailwind tokens (`text-ink`, `bg-paper`); no raw colour values in
  components.
- Facts live in `src/content/`, and every claim traces to `reference/` or the
  App Store copy. Do not invent copy, numbers, prices or testimonials.
- Generated files are not edited by hand: `reference/`, `public/fonts/`,
  `public/media/`, `public/app/`, `src/data/app-art.json`, `media/stills/`, `src/data/media.json`,
  `src/styles/app-tokens.css`, `src/content/app-store.json`. Use `npm run sync`
  and `npm run media`.
- Screenshots and recordings come only from `npm run media`. Do not mock up app
  screens in HTML. Reference them by id through `AppScreen` and `AppClip`.
- The app repo is at `../Paths`. Its `CLAUDE.md` applies to anything run there:
  physical iPhone only, never a simulator. One exception, the user's decision of
  2026-10-05: `npm run media` captures iPad and Apple Watch shots in the
  simulators, because no iPad or Watch is connected. iPhone shots stay on the
  physical iPhone.
