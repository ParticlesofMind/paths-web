import type { UserPattern } from "@/types/patterns";
import { METHOD_ICONS, METHOD_LABELS, SECTION_COLORS, colorToBg, ARCHETYPE_LABELS } from "@/lib/constants";
import { WEEKDAY_SHORT } from "@/lib/patterns";
import Link from "next/link";

interface PatternCardProps {
  pattern: UserPattern;
}

const SECTION_MAP: Record<string, keyof typeof SECTION_COLORS> = {
  skills: "skills",
  wellness: "wellness",
  housekeeping: "housekeeping",
  experience: "experience",
};

export function PatternCard({ pattern }: PatternCardProps) {
  const sectionKey = SECTION_MAP[pattern.archetype] ?? "skills";

  const completedInstances = pattern.instances.filter((inst) =>
    Object.values(inst.dates ?? {}).some((d) => d.didIt)
  ).length;

  return (
    <Link
      href={`/patterns/${pattern.id}`}
      className="group flex flex-col gap-3 p-4 rounded-xl border border-[#1e1e1e] bg-[#111111] hover:border-[#2a2a2a] hover:bg-[#141414] transition"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${colorToBg(pattern.color)} bg-opacity-20`}
        >
          {METHOD_ICONS[pattern.method] ?? "✦"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{pattern.name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {METHOD_LABELS[pattern.method]} · {ARCHETYPE_LABELS[pattern.archetype]}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            SECTION_COLORS[sectionKey]
          }`}
        >
          {sectionKey}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
          (day) => {
            const active = pattern.selectedDays.includes(day);
            return (
              <span
                key={day}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition ${
                  active
                    ? `${colorToBg(pattern.color)} bg-opacity-80 text-white`
                    : "bg-[#1a1a1a] text-neutral-600"
                }`}
              >
                {WEEKDAY_SHORT[day]?.slice(0, 2)}
              </span>
            );
          }
        )}
        <span className="ml-auto text-xs text-neutral-600">
          {pattern.timeSlot.startTime}
        </span>
      </div>

      {completedInstances > 0 && (
        <div className="text-xs text-neutral-600">
          {completedInstances} completion{completedInstances !== 1 ? "s" : ""}
        </div>
      )}
    </Link>
  );
}
