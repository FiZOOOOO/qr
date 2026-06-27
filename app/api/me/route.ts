import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { business: { select: { id: true, name: true, slug: true } } },
  });

  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessId: user.business?.id,
    businessName: user.business?.name,
    businessSlug: user.business?.slug,
  });
}
