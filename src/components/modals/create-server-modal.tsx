"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface CreateServerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateServerModal({ open, onClose }: CreateServerModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name.trim());
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("/api/servers", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      return;
    }

    router.push(`/servers/${data.id}`);
    router.refresh();
    handleClose();
  }

  function handleClose() {
    setName("");
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-md mx-4 rounded-lg bg-[#313338] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold text-white">서버 만들기</h2>
            <p className="mt-1 text-sm text-zinc-400">
              서버에 이름과 아이콘을 지정해주세요.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-600 hover:border-[#5865f2] transition-colors overflow-hidden bg-[#1e1f22]"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="서버 이미지 미리보기"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-[#5865f2] transition-colors">
                  <Upload size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    업로드
                  </span>
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Server Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-400">
              서버 이름 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="나의 서버"
              maxLength={100}
              autoFocus
              className="w-full rounded-md bg-[#1e1f22] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-[#5865f2] transition"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Actions */}
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
