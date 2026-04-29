import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase";

type Params = { params: Promise<{ serverId: string; channelId: string }> };

// 최근 50개 메시지 조회
export async function GET(_req: NextRequest, { params }: Params) {
  const { serverId, channelId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { userId_serverId: { userId: user.id, serverId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { channelId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json(messages);
}

// 메시지 전송
export async function POST(req: NextRequest, { params }: Params) {
  const { serverId, channelId } = await params;

  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { userId_serverId: { userId: user.id, serverId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const content = (formData.get("content") as string | null) ?? "";
  const imageFile = formData.get("image") as File | null;

  if (!content.trim() && (!imageFile || imageFile.size === 0)) {
    return NextResponse.json({ error: "메시지 내용을 입력하거나 이미지를 첨부해주세요." }, { status: 400 });
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const supabase = createServerSupabaseClient();
    const ext = imageFile.name.split(".").pop() ?? "png";
    const fileName = `${nanoid()}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("message-attachments")
      .upload(fileName, arrayBuffer, { contentType: imageFile.type });

    if (error) {
      console.error("[IMAGE_UPLOAD_ERROR]", error.message);
      return NextResponse.json(
        { error: `이미지 업로드 실패: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from("message-attachments")
      .getPublicUrl(data.path);
    imageUrl = publicUrl;
  }

  const message = await prisma.message.create({
    data: { content, imageUrl, userId: user.id, channelId },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}
