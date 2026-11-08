// Typed access to src/data/app-art.json, which `npm run sync` writes from the
// app: its ready-made patterns, calendar backgrounds and badges.

import art from "../data/app-art.json";

export interface Pattern {
  name: string;
  /** An icon in public/app/icons, shown through `AppIcon`. */
  icon: string;
  /** A method id from src/content/methods.ts. */
  method: string;
  /** An archetype id, or `shared` for patterns every archetype has. */
  archetype: string;
}

export type PlanId = "free" | "plus" | "max";

const patterns = art.patterns as Pattern[];

export const patternsForMethod = (method: string) => patterns.filter((pattern) => pattern.method === method);

export const patternsForArchetype = (archetype: string) => patterns.filter((pattern) => pattern.archetype === archetype);

/** The calendar backgrounds a plan adds to the ones below it. */
export const backgroundsForPlan = (plan: PlanId) =>
  art.backgrounds
    .filter((background) => background.plan === plan)
    .map((background) => ({ id: background.id, file: `/app/backgrounds/${background.id}.svg` }));

export interface Badge {
  /** Its place along the Progress road, 1 to 15. */
  number: number;
  /** The artwork alone, without the title and stars of the app's badge card. */
  file: string;
  width: number;
  height: number;
  name: string;
  /** What earning the badge means, in the app's words. */
  meaning: string;
  /** The kind of work the badge asks for; each family has three badges. */
  family: string;
  /** 1 to 3 within its family. */
  tier: number;
}

/** The fifteen badges along the Progress road, in road order. */
export const badges = art.badges as Badge[];

/** The badges by family, families in the order the road first meets them, each in tier order. */
export const badgeFamilies = [...new Set(badges.map((badge) => badge.family))].map((family) => ({
  family,
  badges: badges.filter((badge) => badge.family === family).sort((a, b) => a.tier - b.tier),
}));
