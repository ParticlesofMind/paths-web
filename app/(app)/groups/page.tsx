import { createClient } from "@/lib/supabase/server";
import { GroupCard } from "@/components/groups/GroupCard";
import Link from "next/link";
import type { Group } from "@/types/groups";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  const allGroups = (groups as Group[]) ?? [];

  const myGroups = allGroups.filter((g) => {
    if (!g.members) return false;
    const members = Array.isArray(g.members) ? g.members : [];
    return members.some((m: { user_id: string }) => m.user_id === user!.id);
  });

  const otherGroups = allGroups.filter((g) => {
    if (!g.members) return true;
    const members = Array.isArray(g.members) ? g.members : [];
    return !members.some((m: { user_id: string }) => m.user_id === user!.id);
  });

  return (
    <div>
      <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Groups</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Train together</p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl space-y-8">
        {allGroups.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-neutral-500 text-sm">No groups available yet.</p>
          </div>
        )}

        {myGroups.length > 0 && (
          <section>
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
              My groups
            </h2>
            <div className="space-y-3">
              {myGroups.map((group) => (
                <GroupCard key={group.id} group={group} isMember={true} />
              ))}
            </div>
          </section>
        )}

        {otherGroups.length > 0 && (
          <section>
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
              {myGroups.length > 0 ? "Explore" : "All groups"}
            </h2>
            <div className="space-y-3">
              {otherGroups.map((group) => (
                <GroupCard key={group.id} group={group} isMember={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
