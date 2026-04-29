import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

export default async function ServerPage({ params }: ServerPageProps) {
  const { serverId } = await params;

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
      channels: { orderBy: { createdAt: "asc" }, take: 1 },
    },
  });

  if (!server) redirect("/servers");

  const firstChannel = server.channels[0];
  if (firstChannel) {
    redirect(`/servers/${serverId}/channels/${firstChannel.id}`);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-zinc-400 text-sm">채널이 없습니다.</p>
    </div>
  );
}
