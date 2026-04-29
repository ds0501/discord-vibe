import { prisma } from "@/lib/prisma";
import { MemberList } from "./member-list";

interface MemberSidebarProps {
  serverId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export async function MemberSidebar({
  serverId,
  currentUserId,
  isAdmin,
}: MemberSidebarProps) {
  const members = await prisma.member.findMany({
    where: { serverId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  // Prisma 타입을 클라이언트로 넘길 직렬화 가능한 형태로 변환
  const serialized = members.map((m) => ({
    id: m.id,
    role: m.role as "ADMIN" | "MODERATOR" | "GUEST",
    userId: m.userId,
    user: m.user,
  }));

  return (
    <aside className="hidden lg:flex flex-col w-60 h-full bg-[#2b2d31] shrink-0">
      <MemberList
        serverId={serverId}
        members={serialized}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </aside>
  );
}
