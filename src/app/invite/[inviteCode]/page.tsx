import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface InvitePageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { inviteCode } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/login");
  const user = await getUser();
  if (!user?.id) redirect("/login");

  const server = await prisma.server.findUnique({
    where: { inviteCode },
    include: { members: { where: { userId: user.id } } },
  });

  // 존재하지 않는 초대 코드
  if (!server) redirect("/servers");

  // 이미 멤버면 바로 서버로
  if (server.members.length > 0) {
    redirect(`/servers/${server.id}`);
  }

  // GUEST로 등록
  await prisma.member.create({
    data: { userId: user.id, serverId: server.id, role: "GUEST" },
  });

  redirect(`/servers/${server.id}`);
}
