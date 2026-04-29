import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serverId: string; channelId: string }> }
) {
  const { serverId, channelId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ADMIN 권한 검증
  const member = await prisma.member.findUnique({
    where: { userId_serverId: { userId: user.id, serverId } },
  });
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.channel.delete({
    where: { id: channelId, serverId },
  });

  return NextResponse.json({ success: true });
}
