import type { Method, Section, Archetype } from "@/types/patterns";

export const METHOD_LABELS: Record<Method, string> = {
  takePictureMethod: "Take Picture",
  registerAudioMethod: "Register Audio",
  takeNotesMethod: "Take Notes",
  wakeUpMethod: "Wake Up",
  trackMotionMethod: "Track Motion",
  countPushupsMethod: "Count Pushups",
  playGamesMethod: "Play Games",
  readBooksMethod: "Read Books",
  learnWithAlfredMethod: "Learn with Alfred",
  undefined: "Custom",
};

export const METHOD_ICONS: Record<Method, string> = {
  takePictureMethod: "📷",
  registerAudioMethod: "🎙",
  takeNotesMethod: "📝",
  wakeUpMethod: "⏰",
  trackMotionMethod: "🏃",
  countPushupsMethod: "💪",
  playGamesMethod: "♟",
  readBooksMethod: "📖",
  learnWithAlfredMethod: "🧠",
  undefined: "✦",
};

export const SECTION_LABELS: Record<Section, string> = {
  skills: "Skills",
  wellness: "Wellness",
  housekeeping: "Housekeeping",
  experience: "Experience",
};

export const SECTION_COLORS: Record<Section, string> = {
  skills: "bg-blue-500/20 text-blue-300",
  wellness: "bg-green-500/20 text-green-300",
  housekeeping: "bg-orange-500/20 text-orange-300",
  experience: "bg-purple-500/20 text-purple-300",
};

export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  athlete: "Athlete",
  artist: "Artist",
  culinarian: "Culinarian",
  explorer: "Explorer",
  mannequin: "Mannequin",
  universalist: "Universalist",
};

export const PATTERN_COLORS = [
  { value: "blue", bg: "bg-blue-500", ring: "ring-blue-500" },
  { value: "green", bg: "bg-green-500", ring: "ring-green-500" },
  { value: "purple", bg: "bg-purple-500", ring: "ring-purple-500" },
  { value: "orange", bg: "bg-orange-500", ring: "ring-orange-500" },
  { value: "red", bg: "bg-red-500", ring: "ring-red-500" },
  { value: "pink", bg: "bg-pink-500", ring: "ring-pink-500" },
  { value: "teal", bg: "bg-teal-500", ring: "ring-teal-500" },
  { value: "yellow", bg: "bg-yellow-500", ring: "ring-yellow-500" },
  { value: "indigo", bg: "bg-indigo-500", ring: "ring-indigo-500" },
  { value: "cyan", bg: "bg-cyan-500", ring: "ring-cyan-500" },
];

export function colorToBg(color: string): string {
  const found = PATTERN_COLORS.find((c) => c.value === color);
  return found?.bg ?? "bg-neutral-500";
}

export function colorToRing(color: string): string {
  const found = PATTERN_COLORS.find((c) => c.value === color);
  return found?.ring ?? "ring-neutral-500";
}
