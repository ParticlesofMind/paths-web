"use client";

import Link from "next/link";
import type { Group } from "@/types/groups";

interface GroupCardProps {
  group: Group;
  isMember: boolean;
}

export function GroupCard({ group, isMember }: GroupCardProps) {
  const memberCount = Array.isArray(group.members) ? group.members.length : 0;
  const maxMembers = group.max_members ?? 10;
  const scopeLabel = group.scope === "global" ? "Global" : group.scope === "national" ? group.region ?? "National" : "Local";

  return (
    <Link
      href={`/groups/${group.id}`}
      className="block p-5 rounded-xl border border-[#1e1e1e] bg-[#111111] hover:border-[#2e2e2e] transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-white truncate">{group.name}</span>
            {isMember && (
              <span className="shrink-0 text-[10px] font-medium text-[#4f7eff] bg-[#4f7eff]/10 px-2 py-0.5 rounded-full">
                member
              </span>
            )}
          </div>
          {group.description && (
            <p className="text-sm text-neutral-500 line-clamp-2">{group.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4f7eff]" />
          <span className="text-xs text-neutral-500">
            {memberCount}/{maxMembers} members
          </span>
        </div>
        <span className="text-xs text-neutral-600">{scopeLabel}</span>
        {group.schedule_time && (
          <span className="text-xs text-neutral-600">{group.schedule_time}</span>
        )}
      </div>

      {/* Member fill bar */}
      <div className="mt-3 h-1 rounded-full bg-[#1e1e1e] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4f7eff]"
          style={{ width: `${Math.min(100, (memberCount / maxMembers) * 100)}%` }}
        />
      </div>
    </Link>
  );
}
