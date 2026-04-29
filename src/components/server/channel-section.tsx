"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ServerChannel } from "./server-channel";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";

interface Channel {
  id: string;
  name: string;
}

interface ChannelSectionProps {
  serverId: string;
  channels: Channel[];
  isAdmin: boolean;
}

export function ChannelSection({ serverId, channels, isAdmin }: ChannelSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between px-4 py-1 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          채널
        </span>
        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            title="채널 추가"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* 채널 목록 */}
      <div className="space-y-0.5 px-2">
        {channels.map((channel) => (
          <ServerChannel
            key={channel.id}
            channel={channel}
            serverId={serverId}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {isAdmin && (
        <CreateChannelModal
          open={open}
          onClose={() => setOpen(false)}
          serverId={serverId}
        />
      )}
    </div>
  );
}
