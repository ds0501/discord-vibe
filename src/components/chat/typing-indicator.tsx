"use client";

import type { TypingUser } from "@/types/message";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return <div className="h-5" />;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0].name}님이 입력 중...`
      : typingUsers.length === 2
      ? `${typingUsers[0].name}님과 ${typingUsers[1].name}님이 입력 중...`
      : `${typingUsers.length}명이 입력 중...`;

  return (
    <div className="h-5 flex items-center gap-1.5">
      <div className="flex gap-0.5 items-end">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1 h-1 rounded-full bg-zinc-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-400">{text}</span>
    </div>
  );
}
