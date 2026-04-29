import { ReactNode } from "react";
import { ServerSidebar } from "@/components/server/server-sidebar";

interface ServerLayoutProps {
  children: ReactNode;
  params: Promise<{ serverId: string }>;
}

export default async function ServerLayout({ children, params }: ServerLayoutProps) {
  const { serverId } = await params;

  return (
    <div className="flex h-full w-full">
      {/* 채널 사이드바 */}
      <aside className="hidden md:flex flex-col w-60 h-full bg-[#2b2d31] shrink-0">
        <ServerSidebar serverId={serverId} />
      </aside>

      {/* 채팅 영역 */}
      <main className="flex-1 flex flex-col h-full bg-[#313338] overflow-hidden">
        {children}
      </main>
    </div>
  );
}
