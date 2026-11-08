# particlesofmind.com

The public website for Paths, the iOS app. It shows the app off; it is not a web
version of it. Served at particlesofmind.com.

## Stack

- Astro 6, static output: routing, layout and the build
- React 19 for every component (`.tsx`), rendered to HTML at build time
- Tailwind CSS 4
- No backend

Read `MISSION.md` before adding content.

## Layout of the repo

```
MISSION.md                 what the site is for and what it may say
reference/                 the app's product documents (generated, npm run sync)
media/shots.json           which screenshots and recordings exist
media/stills/              full-resolution screenshots from iPhone, iPad and Watch
scripts/                   sync-from-app.mjs, capture-media.mjs
public/fonts/              Jost (generated)
public/media/              web-sized screenshots, recordings (generated)
public/app/                the app's icons, calendar backgrounds, badges (generated)
src/content/               the site's facts: loop, archetypes, methods, plans, site
src/content/app-store.json approved App Store copy (generated)
src/data/media.json        manifest of captured media (generated)
src/data/app-art.json      the app's patterns, backgrounds and badges (generated)
src/styles/app-tokens.css  the app's design tokens (generated)
src/styles/site.css        the site's own tokens: font and colours
src/styles/device.css      the iPhone, iPad and Watch bodies around each capture
src/components/            AppScreen, AppClip, Device, Avatar, AppIcon, PatternChips,
                           DownloadLink
src/components/sections/   one component per page section
src/layouts/Layout.astro   document shell
src/pages/                 index, privacy, terms, support, invite
```

Components take colour and type from `site.css` through Tailwind (`text-ink`,
`bg-paper`, `text-ink-60`, `bg-sage`), never from raw values.

## How it connects to the app

The app lives in a separate repo, checked out beside this one:

```
~/Paths        iOS app (ParticlesofMind/Paths)
~/paths-web    this site (ParticlesofMind/paths-web)
```

`Paths/Paths-All.code-workspace` opens both in one editor window. Two commands
carry things across; both need only the app repo at `../Paths`
(or `PATHS_IOS_DIR`).

`npm run sync` copies the design tokens, the Jost fonts, the app mark, the app's
artwork (pattern icons, calendar backgrounds, badges, read through `src/lib/art.ts`), the
App Store copy and the product documents. Run it after any of those change.

`npm run media` captures every screenshot and screen recording from the app:
iPhone shots on the physical iPhone, iPad and Apple Watch shots in the
simulators (the user's decision; no iPad or Watch is connected). Nothing is
mocked up by hand.

```
media/shots.json                 what to capture: stills and clips, by id
scripts/capture-media.mjs        npm run media
  -> xcodebuild test, scheme PathsWebsiteMedia, in ../Paths
     PathsMediaUITests/WebsiteMediaTests.swift launches each scenario on the
     iPhone (or the iPad Pro 13-inch simulator), takes the screenshot, and
     records each clip
  -> Watch: xcodebuild build, scheme PathsWatch; simctl launches it on the
     Apple Watch Series 11 (46mm) simulator with -VisualAuditScenario, whose
     sample schedule lives in PathsWatch/WatchVisualAudit.swift, and simctl
     takes the screenshot
  -> media/stills/<id>.png                 full-resolution screenshots
  -> public/media/stills/<id>-480.webp     web sizes (480 and 960 wide)
  -> public/media/clips/<id>.mp4 + .jpg    trimmed recordings and posters
  -> src/data/media.json                   sizes, capture time, app commit
src/components/AppScreen.tsx     <AppScreen id="schedule" alt="..." />
src/components/AppClip.tsx       <AppClip id="progress-world" label="..." />
```

## Updating the media

The iPhone must be connected and unlocked for iPhone shots. iPad and Watch
shots boot their simulators themselves; `PATHS_IPAD_SIMULATOR_ID` and
`PATHS_WATCH_SIMULATOR_ID` pick a different simulator.

```bash
npm run media                    # recapture everything
npm run media -- schedule feed   # only these ids
npm run media -- --no-build      # reuse the last build of the app
npm run media -- --variants      # no capture: rebuild web sizes from media/stills
npm run media -- --draft         # trial run while writing a clip; see below
```

Pages reference media by id, so a recapture updates the site with no other edit.

`AppScreen` and `AppClip` show each capture on a device body drawn in CSS 3D
(`Device.tsx`, `device.css`): an iPhone, an iPad Pro (upright or turned, to match the capture) or an Apple Watch,
chosen by the shot's `device`. The body is hardware only; the screen is always a
real capture. `tilt` is `left`, `right` or `flat`.

## Adding a shot

Add an entry to `media/shots.json`, then `npm run media -- <id>`.

- `scenario` is a `VisualAuditScenario` raw value from
  `Paths/Models/Flows/ContentView.swift` in the app repo. A screen the app cannot
  yet open directly needs a new case there.
- `settle` is the seconds to wait before capturing. Progress needs about 10.
- `dark: true` captures in dark mode.
- `arguments` passes extra launch arguments to the app.
- `trim: true` on a still cuts off the status bar and the plain background, leaving
  only the artwork. The archetype avatars use it.
- `device` is `iphone` (the default), `ipad` or `watch`. Clips are iPhone only.
  Watch `scenario` values start with `watch.`; `watch.today` is the only one.
- `orientation: "landscape"` turns the device before launch. iPhone and iPad only.
- A clip adds `steps`: `wait`, `tap`, `drag`, `type`, `swipeUp`, `swipeDown`,
  `swipeLeft`, `swipeRight` and `snapshot`, each with optional `target`
  (accessibility identifier or label) and `seconds`. `at` (for `tap` and `drag`)
  and `to` (for `drag`) are points inside the target as fractions, `[0.5, 0.5]`
  being its centre; `type` types `text`. `snapshot` records the screen and its
  accessibility tree, for finding targets.
- `"{session}"` in `arguments` becomes a new id on every run. The method clips
  pass `["-VisualAuditSessionID", "{session}"]` so each starts empty instead of
  restoring the last capture.
- Write a clip with a draft run: put it in a separate shot list and run
  `PATHS_MEDIA_SHOTS=<that file> npm run media -- --draft`. Recordings, and the
  screens and trees of `snapshot` steps, land in `.media-cache/draft`; the site's
  media stay as they are.
- A clip removed from `media/shots.json` leaves the site on the next capture. `trimStart` and `trimEnd` adjust the cut, in seconds.
- At most 12 clips per run.

## Development

```bash
npm install
npm run sync     # after tokens, fonts, App Store copy or product docs change
npm run dev
npm run check    # types
npm run build
```
