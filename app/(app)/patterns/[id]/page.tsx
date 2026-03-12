import { createClient } from "@/lib/supabase/server";
import { toUserPattern } from "@/lib/patterns";
import { METHOD_ICONS, METHOD_LABELS, ARCHETYPE_LABELS, colorToBg } from "@/lib/constants";
import { WEEKDAY_SHORT } from "@/lib/patterns";
import { deletePattern } from "../actions";
import type { UserPatternRow } from "@/types/patterns";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatternDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row } = await supabase
    .from("user_patterns")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!row) notFound();

  const pattern = toUserPattern(row as UserPatternRow);
  const completedCount = pattern.instances.filter((inst) =>
    Object.values(inst.dates ?? {}).some((d) => d.didIt)
  ).length;
  const totalInstances = pattern.instances.length;

  return (
    <div>
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1e1e1e]">
        <Link
          href="/patterns"
          className="text-neutral-500 hover:text-neutral-200 transition text-sm"
        >
          ← Patterns
        </Link>
        <h1 className="text-xl font-semibold text-white truncate">{pattern.name}</h1>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-xl">
        {/* Pattern overview */}
        <div className="p-5 rounded-xl border border-[#1e1e1e] bg-[#111111] flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorToBg(pattern.color)} bg-opacity-20`}
          >
            {METHOD_ICONS[pattern.method] ?? "✦"}
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{pattern.name}</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {METHOD_LABELS[pattern.method]} · {ARCHETYPE_LABELS[pattern.archetype]}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="p-5 rounded-xl border border-[#1e1e1e] bg-[#111111]">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
            Schedule
          </h3>
          <div className="flex gap-2 mb-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => {
                const active = pattern.selectedDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      active
                        ? `${colorToBg(pattern.color)} bg-opacity-80 text-white`
                        : "bg-[#1a1a1a] text-neutral-600"
                    }`}
                  >
                    {WEEKDAY_SHORT[day]?.slice(0, 2)}
                  </div>
                );
              }
            )}
          </div>
          <p className="text-sm text-neutral-400">
            {pattern.timeSlot.startTime} – {pattern.timeSlot.endTime}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <p className="text-xs text-neutral-600 uppercase tracking-wider mb-1">
              Completions
            </p>
            <p className="text-2xl font-semibold text-white">{completedCount}</p>
          </div>
          <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <p className="text-xs text-neutral-600 uppercase tracking-wider mb-1">
              Total instances
            </p>
            <p className="text-2xl font-semibold text-white">{totalInstances}</p>
          </div>
        </div>

        {/* Delete */}
        <form
          action={async () => {
            "use server";
            await deletePattern(id);
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition"
          >
            Delete pattern
          </button>
        </form>
      </div>
    </div>
  );
}
