"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Hash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { TypingIndicator } from "./typing-indicator";
import { MobileSidebar } from "./mobile-sidebar";
import type { MessageWithUser, TypingUser, CurrentUser } from "@/types/message";

interface ChatAreaProps {
  channelId: string;
  serverId: string;
  channelName: string;
  currentUser: CurrentUser;
  // 모바일 Sheet용
  serverName?: string;
  channels?: { id: string; name: string }[];
}

// postgres_changes INSERT/UPDATE payload 형태
interface RawMessage {
  id: string;
  content: string;
  imageUrl: string | null;
  deleted: boolean;
  userId: string;
  channelId: string;
  createdAt: string;
}

export function ChatArea({ channelId, serverId, channelName, currentUser, serverName, channels }: ChatAreaProps) {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const realtimeRef = useRef<RealtimeChannel | null>(null);
  // userId → user 정보 캐시 (postgres_changes 페이로드엔 유저 정보가 없어서 필요)
  const usersCache = useRef(new Map<string, { id: string; name: string | null; image: string | null }>());
  const typingTimers = useRef(new Map<string, NodeJS.Timeout>());
  const lastTypingSent = useRef(0);

  // ── 초기 메시지 로드 ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetch(`/api/servers/${serverId}/channels/${channelId}/messages`)
      .then((r) => r.json())
      .then((data: MessageWithUser[]) => {
        setMessages(data);
        data.forEach((m) => usersCache.current.set(m.userId, m.user));
        setLoading(false);
      });
  }, [channelId, serverId]);

  // ── Supabase Realtime 구독 ────────────────────────────────────────
  useEffect(() => {
    const ch = supabase
      .channel(`chat:${channelId}`)
      // 메시지 INSERT (postgres_changes)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `channelId=eq.${channelId}`,
        },
        (payload) => {
          const row = payload.new as RawMessage;
          const user = usersCache.current.get(row.userId) ?? { id: row.userId, name: null, image: null };
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev; // 중복 제거
            return [...prev, { ...row, user }];
          });
        }
      )
      // 메시지 UPDATE — 소프트 삭제 반영 (postgres_changes)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Message",
          filter: `channelId=eq.${channelId}`,
        },
        (payload) => {
          const row = payload.new as { id: string; deleted: boolean };
          setMessages((prev) =>
            prev.map((m) => (m.id === row.id ? { ...m, deleted: row.deleted } : m))
          );
        }
      )
      // 타이핑 알림 (Broadcast)
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (!payload || payload.userId === currentUser.id) return;

        const existingTimer = typingTimers.current.get(payload.userId);
        if (existingTimer) clearTimeout(existingTimer);

        setTypingUsers((prev) => [
          ...prev.filter((u) => u.userId !== payload.userId),
          { userId: payload.userId, name: payload.name },
        ]);

        const timer = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== payload.userId));
          typingTimers.current.delete(payload.userId);
        }, 3000);
        typingTimers.current.set(payload.userId, timer);
      })
      .subscribe();

    realtimeRef.current = ch;

    return () => {
      typingTimers.current.forEach((t) => clearTimeout(t));
      supabase.removeChannel(ch);
    };
  }, [channelId, currentUser.id]);

  // ── 타이핑 브로드캐스트 (2초 쓰로틀) ────────────────────────────
  const sendTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSent.current < 2000) return;
    lastTypingSent.current = now;
    realtimeRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUser.id, name: currentUser.name },
    });
  }, [currentUser.id, currentUser.name]);

  // ── 메시지 전송 ──────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string, imageFile: File | null): Promise<void> => {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(
        `/api/servers/${serverId}/channels/${channelId}/messages`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "메시지 전송에 실패했습니다.");
        throw new Error(data.error); // MessageInput이 내용을 지우지 않도록 throw
      }

      const message: MessageWithUser = await res.json();
      usersCache.current.set(message.userId, message.user);
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    },
    [channelId, serverId]
  );

  // ── 메시지 삭제 ──────────────────────────────────────────────────
  const deleteMessage = useCallback(
    async (messageId: string) => {
      await fetch(
        `/api/servers/${serverId}/channels/${channelId}/messages/${messageId}`,
        { method: "DELETE" }
      );
      // 낙관적 업데이트 (postgres_changes UPDATE도 뒤따라 옴)
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, deleted: true } : m))
      );
    },
    [channelId, serverId]
  );

  const canDelete = useCallback(
    (messageUserId: string) =>
      messageUserId === currentUser.id ||
      currentUser.role === "ADMIN" ||
      currentUser.role === "MODERATOR",
    [currentUser.id, currentUser.role]
  );

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* 채널 헤더 */}
      <div className="flex items-center h-12 px-4 border-b border-[#1e1f22] shadow-sm shrink-0 gap-2">
        {/* 모바일 햄버거 */}
        {channels && serverName && (
          <MobileSidebar
            serverId={serverId}
            channelId={channelId}
            serverName={serverName}
            channels={channels}
          />
        )}
        <Hash size={18} className="text-zinc-400 shrink-0" />
        <span className="font-semibold text-white text-sm truncate">{channelName}</span>
      </div>

      {/* 메시지 목록 (Skeleton 포함) */}
      <MessageList
        messages={messages}
        isLoading={loading}
        currentUserId={currentUser.id}
        canDelete={canDelete}
        onDelete={deleteMessage}
      />

      {/* 타이핑 알림 + 입력창 */}
      <div className="shrink-0 px-4 pb-6">
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput
          channelName={channelName}
          onSend={sendMessage}
          onTyping={sendTyping}
        />
      </div>
    </div>
  );
}
