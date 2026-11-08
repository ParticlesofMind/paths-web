# Mission

What this site is for, what it may say, and where each fact comes from. Read
this before writing copy or adding a section. When the app changes, run
`npm run sync` and check this file against `reference/`.

## What the site is for

particlesofmind.com shows Paths to someone who has not installed it, and gets
them to the App Store. It also hosts the pages the app and the App Store
listing link to.

It is not a web version of the app, and it has no accounts.

## What Paths is

> Paths is an iOS application for keeping promises to yourself through
> scheduled, proof-based patterns.

Source: `reference/PATHS_APPLICATION_DOCUMENTATION.md`, section 1.

- A pattern is a promise with a time, a method, and proof.
- Progress is earned through behavior, not self-description.
- It is not a habit tracker that reminds you. You schedule, show up in the
  window, produce proof, publish it, and reflect.

The loop, in the user's order: choose an archetype, schedule patterns, perform
the method at the scheduled time, publish the proof, earn points and badges,
get feedback from friends, reflect with Arete.

## Voice

Practical, reflective, quietly demanding. Grounded and specific, a little
severe in the right places: show up, prove it, reflect, continue. Never a
motivational-quote app. No hype, no exclamation marks, no invented statistics
or testimonials.

The approved public wording is the App Store copy in
`src/content/app-store.json`. Site copy may go further than it only where a
reference document supports the claim.

## Look

- Typeface: Jost, the same as the app.
- Minimal: ink on paper, structure from type, spacing and alignment.
- Colours: one light theme, set in `src/styles/site.css`: a warm off-white
  page, white cards, and the app's light palette (ink, mist, sage, clay, ochre,
  fjord). No dark theme. In the app, colour is information, never decoration
  (`reference/Paths_Design_Guide.md`, sections 1 and 2).
- Every picture of the app is a real capture: from the iPhone, and from the
  iPad and Apple Watch simulators. Nothing is mocked up.

Styling is deliberately unfinished: the pages are structure and content only.

## What the site shows

| Subject | Content file | Source |
| --- | --- | --- |
| The loop: plan, record, progress, accountability | `src/content/loop.ts` | App Store description |
| What the app is, and each section's introduction | `src/content/home.ts` | `PATHS_APPLICATION_DOCUMENTATION.md`, sections 1, 2 and 4; `POINTS_SYSTEM.md` |
| Five archetypes and their five worlds each | `src/content/archetypes.ts` | `ARETE_GREEK_ARCHETYPE_FRAMEWORK.md`; levels as built in the app |
| Nine methods and the proof each leaves | `src/content/methods.ts` | `METHODS_OVERVIEW.md`, less Learn with Arete |
| Progress: one road, 5 levels, 15 badges per archetype | `sections/Progress.tsx` | `ARCHETYPE_LEVEL_ENVIRONMENTS.md`, "Shared structure"; badge names, families and meanings from the app's `Levels.swift` via `npm run sync` |
| Free, Plus and Max | `src/content/plans.ts` | `SUBSCRIPTIONS_AND_PROMOTIONS.md`, "Implemented access" |
| Arete | not on the site yet | `AretePersona.md` |

The Progress worlds are the most distinctive thing in the app and the strongest
material the site has.

## What the site must not say

- Prices. Storefront prices are not verified.
- Advanced Arete as a reason to buy Max. It is deferred.
- Learn with Arete as a method. The app retired it (the user, 2026-10-05);
  `METHODS_OVERVIEW.md` predates that.
- Groups. They are outside the current release.
- That the app is available, until `appStoreUrl` in `src/content/site.ts` is set.
- Arete as a general assistant, chatbot or coach. She is the pursuit of
  excellence inside Paths and speaks only about the user's own practice.
- Anything about third-party advertising: there is none.
- The level names in `ARCHETYPE_LEVEL_ENVIRONMENTS.md` for Athlete, Artist,
  Culinarian and Mannequin. Those were proposals; the built worlds are the ones
  in `src/content/archetypes.ts`.

## Pages the app depends on

These block App Store submission; the app's metadata still holds placeholders
for the first three (`reference/02-infrastructure-and-compliance.md`,
`reference/01-product-and-scope.md`).

| Page | State |
| --- | --- |
| `/privacy` | Not written |
| `/terms` | Not written |
| `/support` | Not written |
| `/invite` | Not built. Must be an HTTPS link that survives installation and keeps the referral token; today's `paths://` links work only with the app installed. |

## Open decisions

- Hosting. The domain's DNS is at Squarespace and still shows its parking page.
- Demo content for captures: Schedule and Feed are empty, Profile shows a real
  account name, and every capture carries the phone's real status bar.
