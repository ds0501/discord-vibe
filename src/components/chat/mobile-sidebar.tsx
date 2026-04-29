"use client";

import { useRouter } from "next/navigation";
import { Menu, Hash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  serverId: string;
  channelId: string;
  serverName: string;
  channels: { id: string; name: string }[];
}

export function MobileSidebar({
  serverId,
  channelId,
  serverName,
  channels,
}: MobileSidebarProps) {
  const router = useRouter();

  return (
    <Sheet>
      {/* @base-ui Sheet: asChild 없이 직접 사용 */}
      <SheetTrigger
        className="md:hidden text-zinc-400 hover:text-white transition-colors shrink-0 flex items-center justify-center"
        title="채널 목록"
      >
        <Menu size={20} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-72 bg-[#2b2d31] border-r border-[#1e1f22] gap-0"
        showCloseButton={false}
      >
        {/* 서버 이름 헤더 */}
        <div className="flex items-center h-12 px-4 border-b border-[#1e1f22] shrink-0">
          <span className="font-semibold text-white truncate">{serverName}</span>
        </div>

        {/* 채널 목록 */}
        <div className="px-2 py-3 space-y-0.5 overflow-y-auto flex-1">
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            채널
          </p>
          {channels.map((ch) => (
            <SheetClose
              key={ch.id}
              onClick={() =>
                router.push(`/servers/${serverId}/channels/${ch.id}`)
              }
              className={cn(
                "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                ch.id === channelId
                  ? "bg-zinc-700/70 text-white"
                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
              )}
            >
              <Hash size={15} className="shrink-0" />
              <span className="truncate text-left">{ch.name}</span>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
