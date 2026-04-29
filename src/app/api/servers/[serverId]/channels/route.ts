import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  const { serverId } = await params;

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

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "채널 이름을 입력해주세요" }, { status: 400 });
  }

  const channel = await prisma.channel.create({
    data: {
      name: name.trim().toLowerCase().replace(/\s+/g, "-"),
      serverId,
    },
  });

  return NextResponse.json(channel, { status: 201 });
}
