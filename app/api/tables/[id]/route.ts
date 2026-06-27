import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getBusinessId(userId: string) {
  const b = await prisma.business.findUnique({ where: { userId }, select: { id: true } });
  return b?.id;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { id } = await params;
  const data = await req.json();
  const result = await prisma.table.updateMany({ where: { id, businessId }, data });
  if (result.count === 0) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  const table = await prisma.table.findUnique({ where: { id } });
  return NextResponse.json(table);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { id } = await params;
  await prisma.table.deleteMany({ where: { id, businessId } });
  return NextResponse.json({ ok: true });
}
