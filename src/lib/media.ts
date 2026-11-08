// Typed access to src/data/media.json, which `npm run media` writes.

import type { DeviceModel } from "../components/Device";
import manifest from "../data/media.json";

export interface Still {
  /** The hardware the capture was taken on, and the body the site draws round it. */
  device?: DeviceModel;
  width: number;
  height: number;
  variants: { width: number; file: string }[];
  capturedAt?: string;
  appCommit?: string;
}

export interface Clip {
  file: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
  capturedAt: string;
  appCommit?: string;
}

const stills = manifest.stills as Record<string, Still>;
const clips = manifest.clips as Record<string, Clip>;

const missing = (kind: string, id: string) =>
  new Error(`No ${kind} "${id}". Add it to media/shots.json and run: npm run media -- ${id}`);

/** Fails the build when a page asks for a screenshot that was never captured. */
export function still(id: string): Still {
  const found = stills[id];
  if (!found) throw missing("still", id);
  return found;
}

export function clip(id: string): Clip {
  const found = clips[id];
  if (!found) throw missing("clip", id);
  return found;
}

/** A recapture keeps its URL, so the capture time busts the cache. */
export const versioned = (file: string, capturedAt?: string) =>
  capturedAt ? `${file}?v=${encodeURIComponent(capturedAt)}` : file;
