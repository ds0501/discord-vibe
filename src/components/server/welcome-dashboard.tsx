"use client";

import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateServerModal } from "@/components/modals/create-server-modal";

interface WelcomeDashboardProps {
  userName: string;
}

export function WelcomeDashboard({ userName }: WelcomeDashboardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center gap-6">
        {/* 아이콘 */}
        <MessageSquare size={100} className="text-zinc-500" strokeWidth={1.2} />

        {/* 인사말 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            안녕하세요, {userName}님! 👋
          </h1>
          <p className="text-sm text-zinc-400">
            왼쪽에서 서버를 선택하거나 새로운 서버를 만들어보세요.
          </p>
        </div>

        {/* 퀵 액션 */}
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white gap-2"
        >
          <Plus size={16} />
          서버 만들기
        </Button>
      </div>

      <CreateServerModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
