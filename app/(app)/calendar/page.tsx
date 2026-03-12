import { createClient } from "@/lib/supabase/server";
import { toUserPattern } from "@/lib/patterns";
import { WeekView } from "@/components/calendar/WeekView";
import type { UserPatternRow } from "@/types/patterns";
import Link from "next/link";

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows, error } = await supabase
    .from("user_patterns")
    .select("*")
    .eq("user_id", user!.id);

  const patterns = (rows as UserPatternRow[] | null ?? []).map(toUserPattern);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <h1 className="text-xl font-semibold text-white">Calendar</h1>
        <Link
          href="/patterns/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f7eff] text-sm font-medium text-white hover:bg-[#3d6fee] transition"
        >
          <span className="text-base leading-none">+</span>
          Add pattern
        </Link>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Failed to load patterns.
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <WeekView patterns={patterns} />
      </div>
    </div>
  );
}
