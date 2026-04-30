"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Shield, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberItemProps {
  member: {
    id: string;
    role: "ADMIN" | "MODERATOR" | "GUEST";
    userId: string;
    user: { id: string; name: string | null; image: string | null };
  };
  serverId: string;
  isOnline: boolean;
  isAdmin: boolean;
  isCurrentUser: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  MODERATOR: "운영자",
  GUEST: "멤버",
};

const ROLE_ICONS = {
  ADMIN: <Shield size={12} className="text-[#5865f2]" />,
  MODERATOR: <ShieldCheck size={12} className="text-emerald-400" />,
  GUEST: null,
};

export function MemberItem({ member, serverId, isOnline, isAdmin, isCurrentUser }: MemberItemProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const canChangeRole = isAdmin && !isCurrentUser && member.role !== "ADMIN";
  const name = member.user.name ?? "Unknown";
  const fallbackText = (name?.trim() ? name.charAt(0) : "?").toUpperCase();

  async function handleRoleChange(newRole: "MODERATOR" | "GUEST") {
    setLoading(true);
    await fetch(`/api/servers/${serverId}/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => canChangeRole && setOpen((v) => !v)}
        disabled={loading}
        className={cn(
          "w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
          "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200",
          canChangeRole ? "cursor-pointer" : "cursor-default",
          loading && "opacity-50"
        )}
      >
        {/* 아바타 + 온라인 표시 */}
        <div className="relative shrink-0">
          <Avatar className="h-8 w-8 overflow-hidden">
            <AvatarImage src={member.user.image ?? undefined} alt={name} />
            <AvatarFallback delay={0} className="bg-[#5865f2] text-white text-xs font-semibold flex items-center justify-center">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#2b2d31]",
              isOnline ? "bg-emerald-500" : "bg-zinc-500"
            )}
          />
        </div>

        {/* 이름 + 역할 아이콘 */}
        <div className="flex-1 min-w-0 flex items-center gap-1">
          <span className="truncate text-left">{name}</span>
          {ROLE_ICONS[member.role]}
        </div>

        {canChangeRole && (
          <ChevronDown
            size={13}
            className={cn("shrink-0 transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {/* 역할 변경 드롭다운 */}
      {open && canChangeRole && (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-md bg-[#111214] border border-zinc-800 shadow-xl py-1 overflow-hidden">
          {(["MODERATOR", "GUEST"] as const)
            .filter((r) => r !== member.role)
            .map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-left"
              >
                {ROLE_ICONS[role]}
                <span>{ROLE_LABELS[role]}로 변경</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
