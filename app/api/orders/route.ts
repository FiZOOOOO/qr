import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

async function getBusinessId(userId: string) {
  const b = await prisma.business.findUnique({ where: { userId }, select: { id: true } });
  return b?.id;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const orders = await prisma.order.findMany({
    where: { businessId, ...(status ? { status: status as any } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: { select: { name: true } } } },
      table: { select: { number: true } },
    },
  });
  return NextResponse.json(orders);
}
