import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MemberRole } from "@prisma/client";

type Params = { params: Promise<{ serverId: string; memberId: string }> };

// 멤버 역할 변경 (ADMIN 전용)
export async function PATCH(req: NextRequest, { params }: Params) {
  const { serverId, memberId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 요청자가 ADMIN인지 확인
  const requester = await prisma.member.findUnique({
    where: { userId_serverId: { userId: user.id, serverId } },
  });
  if (!requester || requester.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = await prisma.member.findUnique({
    where: { id: memberId, serverId },
  });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 본인 및 다른 ADMIN 역할 변경 불가
  if (target.userId === user.id || target.role === "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json();
  if (!["MODERATOR", "GUEST"].includes(role)) {
    return NextResponse.json({ error: "유효하지 않은 역할입니다." }, { status: 400 });
  }

  const updated = await prisma.member.update({
    where: { id: memberId },
    data: { role: role as MemberRole },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(updated);
}
