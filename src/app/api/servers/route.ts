import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const name = (formData.get("name") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!name) {
    return NextResponse.json({ error: "서버 이름을 입력해주세요" }, { status: 400 });
  }

  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const supabase = createServerSupabaseClient();
    const ext = imageFile.name.split(".").pop();
    const fileName = `${nanoid()}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("server-images")
      .upload(fileName, arrayBuffer, { contentType: imageFile.type });

    if (!error && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("server-images").getPublicUrl(data.path);
      imageUrl = publicUrl;
    }
  }

  // 트랜잭션: 서버 + ADMIN 멤버 + 기본 채널 동시 생성
  const server = await prisma.server.create({
    data: {
      name,
      imageUrl,
      inviteCode: nanoid(10),
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: "ADMIN" },
      },
      channels: {
        create: { name: "일반" },
      },
    },
  });

  return NextResponse.json(server, { status: 201 });
}
