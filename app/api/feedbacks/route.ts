import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getBusinessId(userId: string) {
  const b = await prisma.business.findUnique({ where: { userId }, select: { id: true } });
  return b?.id;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const feedbacks = await prisma.feedback.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(feedbacks);
}
