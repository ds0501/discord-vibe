"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

interface NavigationUserInfoProps {
  name: string;
  image: string | null;
}

export function NavigationUserInfo({ name, image }: NavigationUserInfoProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3 shrink-0 border-t border-zinc-700/50">
      {/* 아바타 */}
      <div
        className="relative h-10 w-10 rounded-full overflow-hidden"
        title={name}
      >
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[#5865f2] text-white text-sm font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* 로그아웃 */}
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
