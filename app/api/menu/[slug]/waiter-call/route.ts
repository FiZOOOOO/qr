import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { tableId } = await req.json().catch(() => ({}));

  const business = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
  if (!business) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  await prisma.waiterCall.create({
    data: { businessId: business.id, tableId: tableId ?? null, status: "PENDING" },
  });

  return NextResponse.json({ ok: true });
}
