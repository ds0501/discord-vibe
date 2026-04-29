"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateServerModal } from "@/components/modals/create-server-modal";

export function NavigationAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="서버 추가"
        className="group flex items-center"
      >
        <div className="mx-3 flex h-12 w-12 items-center justify-center rounded-3xl bg-[#313338] text-[#23a55a] transition-all group-hover:rounded-2xl group-hover:bg-[#23a55a] group-hover:text-white">
          <Plus size={25} strokeWidth={2} />
        </div>
      </button>

      <CreateServerModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
