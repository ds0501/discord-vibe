"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ServerUserInfoProps {
  name: string;
  image: string | null;
}

export function ServerUserInfo({ name, image }: ServerUserInfoProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-[#232428] shrink-0">
      <Avatar className="shrink-0">
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback className="bg-[#5865f2] text-white text-xs font-semibold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <span className="flex-1 truncate text-sm font-medium text-white">{name}</span>
    </div>
  );
}
