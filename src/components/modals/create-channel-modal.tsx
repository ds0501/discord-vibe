"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Hash, X } from "lucide-react";

interface CreateChannelModalProps {
  open: boolean;
  onClose: () => void;
  serverId: string;
}

export function CreateChannelModal({ open, onClose, serverId }: CreateChannelModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/servers/${serverId}/channels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      return;
    }

    router.push(`/servers/${serverId}/channels/${data.id}`);
    router.refresh();
    handleClose();
  }

  function handleClose() {
    setName("");
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-md mx-4 rounded-lg bg-[#313338] shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold text-white">채널 만들기</h2>
            <p className="mt-1 text-sm text-zinc-400">채널 이름을 입력하세요.</p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-400">
              채널 이름
            </label>
            <div className="flex items-center gap-2 rounded-md bg-[#1e1f22] px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#5865f2]">
              <Hash size={15} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="새-채널"
                maxLength={100}
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="px-5 py-2 rounded-sm bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "만드는 중…" : "만들기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
