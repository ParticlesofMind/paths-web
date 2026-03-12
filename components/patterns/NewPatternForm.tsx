"use client";

import { useState } from "react";
import { createPattern } from "@/app/(app)/patterns/actions";
import { METHOD_LABELS, ARCHETYPE_LABELS, PATTERN_COLORS } from "@/lib/constants";
import type { Method, Archetype } from "@/types/patterns";

const METHODS: Method[] = [
  "takeNotesMethod",
  "readBooksMethod",
  "learnWithAlfredMethod",
  "takePictureMethod",
  "registerAudioMethod",
  "wakeUpMethod",
  "trackMotionMethod",
  "countPushupsMethod",
  "playGamesMethod",
];

const ARCHETYPES: Archetype[] = [
  "athlete",
  "artist",
  "culinarian",
  "explorer",
  "mannequin",
  "universalist",
];

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function NewPatternForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("blue");

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    selectedDays.forEach((day) => fd.append("selectedDays", day));
    fd.set("color", selectedColor);
    const result = await createPattern(fd);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
          Pattern name *
        </label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-[#4f7eff] focus:outline-none focus:ring-1 focus:ring-[#4f7eff] transition"
          placeholder="Morning run"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
          Method *
        </label>
        <select
          name="method"
          required
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white focus:border-[#4f7eff] focus:outline-none focus:ring-1 focus:ring-[#4f7eff] transition"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {METHOD_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
          Archetype *
        </label>
        <select
          name="archetype"
          required
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white focus:border-[#4f7eff] focus:outline-none focus:ring-1 focus:ring-[#4f7eff] transition"
        >
          {ARCHETYPES.map((a) => (
            <option key={a} value={a}>
              {ARCHETYPE_LABELS[a]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
            Start time *
          </label>
          <input
            name="startTime"
            type="time"
            required
            defaultValue="07:00"
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white focus:border-[#4f7eff] focus:outline-none focus:ring-1 focus:ring-[#4f7eff] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
            End time *
          </label>
          <input
            name="endTime"
            type="time"
            required
            defaultValue="08:00"
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-sm text-white focus:border-[#4f7eff] focus:outline-none focus:ring-1 focus:ring-[#4f7eff] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
          Days
        </label>
        <div className="flex gap-2 flex-wrap">
          {WEEKDAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  active
                    ? "bg-[#4f7eff]/20 border-[#4f7eff] text-[#4f7eff]"
                    : "bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400 hover:border-neutral-500"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {PATTERN_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedColor(c.value)}
              className={`w-7 h-7 rounded-full ${c.bg} transition ring-2 ring-offset-2 ring-offset-[#0a0a0a] ${
                selectedColor === c.value ? c.ring : "ring-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#4f7eff] px-4 py-3 text-sm font-medium text-white hover:bg-[#3d6fee] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Creating…" : "Create pattern"}
      </button>
    </form>
  );
}
