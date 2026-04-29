"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { ImageIcon, Send, X } from "lucide-react";

interface MessageInputProps {
  channelName: string;
  onSend: (content: string, image: File | null) => Promise<void>;
  onTyping: () => void;
}

export function MessageInput({ channelName, onSend, onTyping }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSend() {
    if ((!content.trim() && !imageFile) || sending) return;
    setSending(true);
    try {
      await onSend(content.trim(), imageFile);
      // 성공 시만 입력 초기화
      setContent("");
      removeImage();
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch {
      // 에러는 ChatArea에서 Toast로 처리 — 입력 내용 유지
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onTyping();
  }

  const canSend = (!!content.trim() || !!imageFile) && !sending;

  return (
    <div className="space-y-2">
      {/* 이미지 미리보기 */}
      {previewUrl && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
          <Image src={previewUrl} alt="첨부 미리보기" fill className="object-cover" />
          <button
            onClick={removeImage}
            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* 입력 바 */}
      <div className="flex items-end gap-2 bg-[#383a40] rounded-lg px-3 py-2.5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="이미지 첨부"
          className="shrink-0 text-zinc-400 hover:text-white transition-colors mb-0.5"
        >
          <ImageIcon size={20} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`#${channelName}에 메시지 보내기`}
          rows={1}
          disabled={sending}
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 outline-none resize-none max-h-40 leading-5 disabled:opacity-70"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          title="전송 (Enter)"
          className="shrink-0 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
