"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavigationUserInfoProps {
  name: string;
  image: string | null;
}

export function NavigationUserInfo({ name, image }: NavigationUserInfoProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3 shrink-0 border-t border-zinc-700/50">
      <Avatar size="lg" title={name}>
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback className="bg-[#5865f2] text-white text-sm font-semibold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <a
        href="/api/auth/logout"
        title="로그아웃"
        className="text-zinc-500 hover:text-red-400 transition-colors"
      >
        <LogOut size={14} />
      </a>
    </div>
  );
}
