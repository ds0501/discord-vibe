"use client";

import Image from "next/image";

interface ServerUserInfoProps {
  name: string;
  image: string | null;
}

export function ServerUserInfo({ name, image }: ServerUserInfoProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-[#232428] shrink-0">
      {/* 아바타 */}
      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[#5865f2] text-white text-xs font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* 이름 */}
      <span className="flex-1 truncate text-sm font-medium text-white">{name}</span>
    </div>
  );
}
