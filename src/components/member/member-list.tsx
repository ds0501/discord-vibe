"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MemberItem } from "./member-item";

interface Member {
  id: string;
  role: "ADMIN" | "MODERATOR" | "GUEST";
  userId: string;
  user: { id: string; name: string | null; image: string | null };
}

interface MemberListProps {
  serverId: string;
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
}

const ROLE_SECTIONS = [
  { role: "ADMIN", label: "관리자" },
  { role: "MODERATOR", label: "운영자" },
  { role: "GUEST", label: "멤버" },
] as const;

export function MemberList({
  serverId,
  members,
  currentUserId,
  isAdmin,
}: MemberListProps) {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  // Supabase Presence 구독
  useEffect(() => {
    const ch = supabase
      .channel(`presence:server:${serverId}`, {
        config: { presence: { key: currentUserId } },
      })
      .on("presence", { event: "sync" }, () => {
        const state = ch.presenceState<{ userId: string }>();
        const ids = new Set(
          Object.values(state)
            .flat()
            .map((p) => p.userId)
        );
        setOnlineUserIds(ids);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await ch.track({ userId: currentUserId });
        }
      });

    return () => {
      supabase.removeChannel(ch);
    };
  }, [serverId, currentUserId]);

  const grouped = ROLE_SECTIONS.map(({ role, label }) => ({
    role,
    label,
    members: members.filter((m) => m.role === role),
  })).filter((g) => g.members.length > 0);

  const onlineCount = members.filter((m) => onlineUserIds.has(m.userId)).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* 헤더 */}
      <div className="px-3 py-3 border-b border-[#1e1f22]">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          멤버 목록{" "}
          <span className="text-emerald-400 normal-case">
            ({onlineCount}명 온라인)
          </span>
        </p>
      </div>

      {/* 역할별 섹션 */}
      <div className="px-2 py-2 space-y-4">
        {grouped.map(({ role, label, members: roleMembers }) => (
          <div key={role}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              {label} — {roleMembers.length}
            </p>
            <div className="space-y-0.5">
              {roleMembers.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  serverId={serverId}
                  isOnline={onlineUserIds.has(member.userId)}
                  isAdmin={isAdmin}
                  isCurrentUser={member.userId === currentUserId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
