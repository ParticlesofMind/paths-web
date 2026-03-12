import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Group, GroupMember } from "@/types/groups";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: groupData } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!groupData) notFound();

  const group = groupData as Group;
  const members: GroupMember[] = Array.isArray(group.members) ? group.members : [];
  const isMember = members.some((m) => m.user_id === user!.id);
  const scheduleDays: string[] = Array.isArray(group.schedule_days) ? group.schedule_days : [];

  const scopeLabel =
    group.scope === "global"
      ? "Global"
      : group.scope === "national"
      ? group.region ?? "National"
      : "Local";

  return (
    <div>
      <div className="px-6 py-4 border-b border-[#1e1e1e]">
        <Link href="/groups" className="text-xs text-neutral-500 hover:text-white transition-colors mb-3 inline-block">
          Back to groups
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-neutral-500 mt-1">{group.description}</p>
            )}
          </div>
          {isMember && (
            <span className="text-xs font-medium text-[#4f7eff] bg-[#4f7eff]/10 px-3 py-1 rounded-full">
              member
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6 max-w-xl space-y-6">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <p className="text-xs text-neutral-500 mb-1">Scope</p>
            <p className="text-sm font-medium text-white">{scopeLabel}</p>
          </div>
          <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
            <p className="text-xs text-neutral-500 mb-1">Members</p>
            <p className="text-sm font-medium text-white">
              {members.length}/{group.max_members ?? 10}
            </p>
          </div>
          {group.schedule_time && (
            <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
              <p className="text-xs text-neutral-500 mb-1">Meeting time</p>
              <p className="text-sm font-medium text-white">{group.schedule_time}</p>
            </div>
          )}
          {scheduleDays.length > 0 && (
            <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111]">
              <p className="text-xs text-neutral-500 mb-1">Schedule</p>
              <p className="text-sm font-medium text-white">{scheduleDays.join(", ")}</p>
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
            Members
          </h2>
          {members.length === 0 ? (
            <p className="text-sm text-neutral-600 py-4">No members yet.</p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#1e1e1e] bg-[#111111]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-semibold text-neutral-400">
                    {member.display_name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.display_name ?? member.user_id.slice(0, 8)}
                    </p>
                    {member.role && member.role !== "member" && (
                      <p className="text-xs text-neutral-500">{member.role}</p>
                    )}
                  </div>
                  {member.user_id === user!.id && (
                    <span className="ml-auto text-[10px] text-neutral-600">you</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
