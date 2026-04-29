"use client";

import { useState } from "react";
import { Copy, Check, Pencil } from "lucide-react";
import { EditServerModal } from "@/components/modals/edit-server-modal";

interface ServerHeaderProps {
  serverName: string;
  inviteCode: string;
  serverId: string;
  isAdmin: boolean;
}

export function ServerHeader({
  serverName,
  inviteCode,
  serverId,
  isAdmin,
}: ServerHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  function copyInviteLink() {
    const url = `${window.location.origin}/invite/${inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="flex items-center justify-between h-12 px-4 border-b border-[#1e1f22] shadow-sm shrink-0">
        <span className="font-semibold text-white truncate flex-1 text-left">
          {serverName}
        </span>

        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {/* 서버 이름 편집 (ADMIN 전용) */}
          {isAdmin && (
            <button
              onClick={() => setEditOpen(true)}
              title="서버 이름 수정"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}

          {/* 초대 링크 복사 */}
          <button
            onClick={copyInviteLink}
            title={copied ? "복사됨!" : "초대 링크 복사"}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      <EditServerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        serverId={serverId}
        currentName={serverName}
      />
    </>
  );
}
