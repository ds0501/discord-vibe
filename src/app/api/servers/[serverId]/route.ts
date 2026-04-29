import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ serverId: string }> };

// 서버 이름 수정 (ADMIN 전용)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { serverId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { userId_serverId: { userId: user.id, serverId } },
  });
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "서버 이름을 입력해주세요" }, { status: 400 });
  }

  const server = await prisma.server.update({
    where: { id: serverId },
    data: { name: name.trim() },
  });

  return NextResponse.json(server);
}
