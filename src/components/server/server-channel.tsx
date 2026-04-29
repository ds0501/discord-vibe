"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Hash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerChannelProps {
  channel: { id: string; name: string };
  serverId: string;
  isAdmin: boolean;
}

export function ServerChannel({ channel, serverId, isAdmin }: ServerChannelProps) {
  const params = useParams();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isActive = params?.channelId === channel.id;

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`#${channel.name} 채널을 삭제할까요?`)) return;
    setDeleting(true);
    await fetch(`/api/servers/${serverId}/channels/${channel.id}`, {
      method: "DELETE",
    });
    router.push(`/servers/${serverId}`);
    router.refresh();
  }

  return (
    <button
      onClick={() => router.push(`/servers/${serverId}/channels/${channel.id}`)}
      disabled={deleting}
      className={cn(
        "group w-full flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-zinc-700/70 text-white"
          : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200",
        deleting && "opacity-50 cursor-not-allowed"
      )}
    >
      <Hash size={16} className="shrink-0" />
      <span className="truncate flex-1 text-left">{channel.name}</span>
      {isAdmin && (
        <Trash2
          size={14}
          onClick={handleDelete}
          className={cn(
            "shrink-0 transition-all",
            "opacity-0 group-hover:opacity-100",
            "text-zinc-400 hover:text-red-400"
          )}
        />
      )}
    </button>
  );
}
