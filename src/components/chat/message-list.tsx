"use client";

import { useEffect, useRef } from "react";
import { Hash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageItem } from "./message-item";
import type { MessageWithUser } from "@/types/message";

interface MessageListProps {
  messages: MessageWithUser[];
  isLoading: boolean;
  currentUserId: string;
  canDelete: (messageUserId: string) => boolean;
  onDelete: (messageId: string) => Promise<void>;
}

function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 px-2 py-2">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function MessageList({
  messages,
  isLoading,
  currentUserId,
  canDelete,
  onDelete,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isLoading || messages.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
    } else {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      if (isNearBottom) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      {/* 스켈레톤 로딩 */}
      {isLoading && (
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 빈 채널 안내 */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 pb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700/50">
            <Hash size={28} className="text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">환영합니다!</p>
            <p className="text-sm text-zinc-400 mt-1">
              이 채널의 첫 메시지를 보내보세요.
            </p>
          </div>
        </div>
      )}

      {/* 메시지 목록 */}
      {!isLoading && messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwn={message.userId === currentUserId}
          canDelete={canDelete(message.userId)}
          onDelete={() => onDelete(message.id)}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
