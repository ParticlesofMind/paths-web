"use client";

import { useState } from "react";
import { getWeekDates, WEEKDAY_SHORT, dateToWeekday, patternsForDay, formatDateKey } from "@/lib/patterns";
import { colorToBg, METHOD_ICONS } from "@/lib/constants";
import type { UserPattern } from "@/types/patterns";

interface WeekViewProps {
  patterns: UserPattern[];
  initialDate?: Date;
}

function PatternSlot({ pattern, dateKey }: { pattern: UserPattern; dateKey: string }) {
  const didIt = pattern.instances.some(
    (inst) => inst.dates?.[dateKey]?.didIt === true
  );

  return (
    <div
      className={`mb-1 px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-default select-none border ${
        didIt
          ? "border-transparent opacity-60"
          : "border-transparent"
      } ${colorToBg(pattern.color)} bg-opacity-20`}
      title={`${pattern.name} · ${pattern.timeSlot.startTime}–${pattern.timeSlot.endTime}`}
    >
      <span className="shrink-0">{METHOD_ICONS[pattern.method] ?? "✦"}</span>
      <span className="truncate">{pattern.name}</span>
      {didIt && <span className="ml-auto shrink-0 text-green-400">✓</span>}
    </div>
  );
}

export function WeekView({ patterns, initialDate }: WeekViewProps) {
  const [anchor, setAnchor] = useState(initialDate ?? new Date());
  const week = getWeekDates(anchor);
  const today = new Date();

  function prevWeek() {
    const d = new Date(anchor);
    d.setDate(d.getDate() - 7);
    setAnchor(d);
  }

  function nextWeek() {
    const d = new Date(anchor);
    d.setDate(d.getDate() + 7);
    setAnchor(d);
  }

  function goToday() {
    setAnchor(new Date());
  }

  const monthLabel = anchor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">{monthLabel}</h2>
          <button
            onClick={goToday}
            className="text-xs px-2.5 py-1 rounded-md border border-[#2a2a2a] text-neutral-400 hover:text-white hover:border-neutral-500 transition"
          >
            Today
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prevWeek}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition"
          >
            ←
          </button>
          <button
            onClick={nextWeek}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition"
          >
            →
          </button>
        </div>
      </div>

      {/* Day columns */}
      <div className="flex-1 grid grid-cols-7 divide-x divide-[#1e1e1e] overflow-y-auto">
        {week.map((date) => {
          const weekday = dateToWeekday(date);
          const dayPatterns = patternsForDay(patterns, weekday);
          const dateKey = formatDateKey(date);
          const isToday =
            date.toDateString() === today.toDateString();

          return (
            <div key={date.toISOString()} className="flex flex-col min-h-[320px]">
              {/* Day header */}
              <div
                className={`px-2 py-3 text-center border-b border-[#1e1e1e] ${
                  isToday ? "bg-[#4f7eff]/5" : ""
                }`}
              >
                <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  {WEEKDAY_SHORT[weekday]}
                </div>
                <div
                  className={`mt-1 text-sm font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday
                      ? "bg-[#4f7eff] text-white"
                      : "text-neutral-300"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>

              {/* Pattern slots */}
              <div className="flex-1 p-1.5 space-y-0.5">
                {dayPatterns.length === 0 ? (
                  <div className="text-center pt-4 text-xs text-neutral-700">—</div>
                ) : (
                  dayPatterns.map((p) => (
                    <PatternSlot key={p.id} pattern={p} dateKey={dateKey} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
