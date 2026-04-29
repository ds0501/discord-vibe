import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NavigationItem } from "./navigation-item";
import { NavigationAction } from "./navigation-action";
import { NavigationUserInfo } from "./navigation-user-info";

export async function NavigationSidebar() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/login");
  const user = await getUser();
  if (!user?.id) redirect("/login");

  const servers = await prisma.server.findMany({
    where: { members: { some: { userId: user.id } } },
    orderBy: { createdAt: "asc" },
  });

  const name =
    [user.given_name, user.family_name].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown";

  return (
    <div className="flex flex-col h-full">
      {/* 스크롤 가능한 서버 목록 영역 */}
      <div className="flex flex-col items-center gap-3 py-3 flex-1 overflow-y-auto">
        <NavigationAction />
        <div className="h-px w-10 bg-zinc-700 rounded-full shrink-0" />
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            name={server.name}
            imageUrl={server.imageUrl}
          />
        ))}
      </div>

      {/* 하단 고정: 유저 아바타 + 로그아웃 */}
      <NavigationUserInfo name={name} image={user.picture ?? null} />
    </div>
  );
}
