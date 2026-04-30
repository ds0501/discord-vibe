"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { MessageWithUser } from "@/types/message";

interface MessageItemProps {
  message: MessageWithUser;
  isOwn: boolean;
  canDelete: boolean;
  onDelete: () => Promise<void>;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageItem({ message, isOwn, canDelete, onDelete }: MessageItemProps) {
  const name = message.user.name ?? "Unknown";

  return (
    <div className="group flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-700/20">
      {/* 아바타 */}
      <Avatar className="size-9 mt-0.5 shrink-0">
        <AvatarImage src={message.user.image ?? undefined} alt={name} />
        <AvatarFallback delay={0} className="bg-[#5865f2] text-white text-sm font-semibold">
          {(name?.charAt(0) || "?").toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className={cn("text-sm font-semibold", isOwn ? "text-[#5865f2]" : "text-white")}>
            {name}
          </span>
          <span className="text-[11px] text-zinc-500">{formatTime(message.createdAt)}</span>
        </div>

        {message.deleted ? (
          <p className="text-sm text-zinc-500 italic">이 메시지는 삭제되었습니다.</p>
        ) : (
          <>
            {message.content && (
              <p className="text-sm text-zinc-200 break-words whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.imageUrl && (
              <div className="mt-2 relative h-48 max-w-xs rounded-lg overflow-hidden">
                <Image src={message.imageUrl} alt="첨부 이미지" fill className="object-cover" />
              </div>
            )}
          </>
        )}
      </div>

      {/* 삭제 버튼 */}
      {canDelete && !message.deleted && (
        <button
          onClick={onDelete}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-all mt-0.5"
          title="메시지 삭제"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
