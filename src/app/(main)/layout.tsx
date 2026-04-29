import { ReactNode } from "react";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      {/* 최좌측 서버 아이콘 사이드바 (72px 고정) */}
      <aside className="hidden md:flex flex-col w-[72px] h-full bg-[#1e1f22] shrink-0 fixed inset-y-0 left-0 z-30">
        <NavigationSidebar />
      </aside>

      {/* 나머지 콘텐츠 영역 */}
      <main className="md:pl-[72px] h-full w-full flex">
        {children}
      </main>
    </div>
  );
}
