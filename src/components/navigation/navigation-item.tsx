"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string | null;
}

export function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
  const router = useRouter();
  const params = useParams();
  const isActive = params?.serverId === id;

  return (
    <button
      onClick={() => router.push(`/servers/${id}`)}
      title={name}
      className="group relative flex items-center"
    >
      {/* Active / hover indicator bar */}
      <div
        className={cn(
          "absolute left-0 w-1 rounded-r-full bg-white transition-all duration-200",
          isActive
            ? "h-9"
            : "h-2 scale-y-0 group-hover:scale-y-100 group-hover:h-5"
        )}
      />

      <div
        className={cn(
          "relative mx-3 flex h-12 w-12 overflow-hidden transition-all duration-200",
          isActive
            ? "rounded-2xl"
            : "rounded-3xl group-hover:rounded-2xl"
        )}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[#5865f2] text-white font-semibold text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </button>
  );
}
