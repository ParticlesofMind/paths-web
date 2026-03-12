import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { ARCHETYPE_LABELS } from "@/lib/constants";
import type { Archetype } from "@/types/patterns";

interface ProfileRow {
  display_name: string | null;
  archetype: Archetype | null;
  avatar_url: string | null;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, archetype, avatar_url")
    .eq("id", user.id)
    .single();

  const p = profile as ProfileRow | null;
  const initial = (p?.display_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const archetypeLabel = p?.archetype ? ARCHETYPE_LABELS[p.archetype] : null;

  return (
    <div>
      <div className="px-6 py-4 border-b border-[#1e1e1e]">
        <h1 className="text-xl font-semibold text-white">Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Your account</p>
      </div>

      <div className="px-6 py-6 max-w-sm space-y-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center text-2xl font-bold text-white">
            {initial}
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {p?.display_name ?? "Paths user"}
            </p>
            <p className="text-sm text-neutral-500">{user.email}</p>
            {archetypeLabel && (
              <p className="text-xs text-[#4f7eff] mt-0.5">{archetypeLabel}</p>
            )}
          </div>
        </div>

        {/* Account details */}
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] divide-y divide-[#1e1e1e]">
          <div className="px-4 py-3">
            <p className="text-xs text-neutral-500 mb-0.5">Email</p>
            <p className="text-sm text-white">{user.email}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-neutral-500 mb-0.5">User ID</p>
            <p className="text-sm text-neutral-400 font-mono">{user.id.slice(0, 16)}...</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-neutral-500 mb-0.5">Member since</p>
            <p className="text-sm text-white">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-xl border border-[#1e1e1e] bg-[#111111] text-sm font-medium text-neutral-400 hover:text-white hover:border-[#2e2e2e] transition-colors text-left"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
