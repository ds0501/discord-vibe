import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChatArea } from "@/components/chat/chat-area";
import { MemberSidebar } from "@/components/member/member-sidebar";

interface ChannelPageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { serverId, channelId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/login");
  const user = await getUser();
  if (!user?.id) redirect("/login");

  const [member, channel, server, channels] = await Promise.all([
    prisma.member.findUnique({
      where: { userId_serverId: { userId: user.id, serverId } },
    }),
    prisma.channel.findUnique({
      where: { id: channelId, serverId },
    }),
    prisma.server.findUnique({
      where: { id: serverId },
      select: { name: true },
    }),
    prisma.channel.findMany({
      where: { serverId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!member) redirect("/servers");
  if (!channel || !server) redirect(`/servers/${serverId}`);

  const name =
    [user.given_name, user.family_name].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown";

  return (
    <div className="flex h-full overflow-hidden">
      <ChatArea
        channelId={channelId}
        serverId={serverId}
        channelName={channel.name}
        serverName={server.name}
        channels={channels}
        currentUser={{
          id: user.id,
          name,
          image: user.picture ?? null,
          role: member.role,
        }}
      />

      <MemberSidebar
        serverId={serverId}
        currentUserId={user.id}
        isAdmin={member.role === "ADMIN"}
      />
    </div>
  );
}
