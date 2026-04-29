import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ serverId: string; channelId: string; messageId: string }>;
};

// 메시지 소프트 삭제 (본인 또는 ADMIN/MODERATOR)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { serverId, channelId, messageId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [member, message] = await Promise.all([
    prisma.member.findUnique({
      where: { userId_serverId: { userId: user.id, serverId } },
    }),
    prisma.message.findUnique({
      where: { id: messageId, channelId },
    }),
  ]);

  if (!member || !message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = message.userId === user.id;
  const isPrivileged = member.role === "ADMIN" || member.role === "MODERATOR";
  if (!isOwner && !isPrivileged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { deleted: true },
  });

  return NextResponse.json(updated);
}
