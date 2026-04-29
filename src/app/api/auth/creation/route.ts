import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL!));
  }

  const name = [user.given_name, user.family_name].filter(Boolean).join(" ") || null;

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email ?? "",
      name: name ?? undefined,
      image: user.picture ?? undefined,
    },
    create: {
      id: user.id,
      email: user.email ?? "",
      name,
      image: user.picture ?? null,
    },
  });

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL!));
}
