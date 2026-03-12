import { createClient } from "@/lib/supabase/server";
import { toUserPattern } from "@/lib/patterns";
import { PatternCard } from "@/components/patterns/PatternCard";
import type { UserPatternRow } from "@/types/patterns";
import Link from "next/link";

export default async function PatternsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("user_patterns")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const patterns = (rows as UserPatternRow[] | null ?? []).map(toUserPattern);

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <div>
          <h1 className="text-xl font-semibold text-white">Patterns</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {patterns.length} active pattern{patterns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/patterns/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f7eff] text-sm font-medium text-white hover:bg-[#3d6fee] transition"
        >
          <span className="text-base leading-none">+</span>
          New pattern
        </Link>
      </div>

      <div className="px-6 py-6">
        {patterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-3xl mb-4">
              ◈
            </div>
            <h3 className="text-base font-medium text-neutral-300 mb-2">No patterns yet</h3>
            <p className="text-sm text-neutral-600 mb-6 max-w-xs">
              Patterns are recurring habits you schedule across the week.
            </p>
            <Link
              href="/patterns/new"
              className="px-5 py-2.5 rounded-lg bg-[#4f7eff] text-sm font-medium text-white hover:bg-[#3d6fee] transition"
            >
              Create your first pattern
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
