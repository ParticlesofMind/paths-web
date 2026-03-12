import { createClient } from "@/lib/supabase/server";
import { ProgressPath } from "@/components/progress/ProgressPath";

interface ProgressRow {
  total_points: number;
  points_ledger: Record<string, number>;
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progressRow } = await supabase
    .from("user_progress")
    .select("total_points, points_ledger")
    .eq("user_id", user!.id)
    .single();

  const progress = progressRow as ProgressRow | null;
  const totalPoints = progress?.total_points ?? 0;

  // Compute recent points from ledger (last 7 days)
  const ledger = progress?.points_ledger ?? {};
  const today = new Date();
  let weekPoints = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const key = `${dd}${mm}${yyyy}`;
    weekPoints += ledger[key] ?? 0;
  }

  return (
    <div>
      <div className="px-6 py-4 border-b border-[#1e1e1e]">
        <h1 className="text-xl font-semibold text-white">Progress</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Your growth journey</p>
      </div>

      <div className="px-6 py-6 max-w-xl space-y-6">
        <ProgressPath totalPoints={totalPoints} />

        {/* Weekly points */}
        <div className="p-5 rounded-xl border border-[#1e1e1e] bg-[#111111]">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
            This week
          </h3>
          <p className="text-3xl font-bold text-white">
            {Math.round(weekPoints)}
            <span className="text-sm font-normal text-neutral-500 ml-2">pts</span>
          </p>
          <p className="text-sm text-neutral-600 mt-1">earned in the last 7 days</p>
        </div>

        {totalPoints === 0 && (
          <div className="p-5 rounded-xl border border-[#1e1e1e] bg-[#111111] text-center">
            <p className="text-sm text-neutral-500">
              Complete patterns in the app to earn points and level up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
