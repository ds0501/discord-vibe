import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServerHeader } from "./server-header";
import { ChannelSection } from "./channel-section";
import { ServerUserInfo } from "./server-user-info";

interface ServerSidebarProps {
  serverId: string;
}

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/login");
  const user = await getUser();
  if (!user?.id) redirect("/login");

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: { some: { userId: user.id } },
    },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: {
        where: { userId: user.id },
        select: { role: true },
      },
    },
  });

  if (!server) redirect("/servers");

  const role = server.members[0]?.role ?? "GUEST";
  const name =
    [user.given_name, user.family_name].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown";

  return (
    <div className="flex flex-col h-full">
      <ServerHeader
        serverName={server.name}
        inviteCode={server.inviteCode}
        serverId={serverId}
        isAdmin={role === "ADMIN"}
      />
      <ChannelSection
        serverId={serverId}
        channels={server.channels}
        isAdmin={role === "ADMIN"}
      />
      <ServerUserInfo name={name} image={user.picture ?? null} />
    </div>
  );
}
