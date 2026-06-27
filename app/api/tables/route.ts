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

  const tables = await prisma.table.findMany({ where: { businessId }, orderBy: { number: "asc" } });
  return NextResponse.json(tables);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { number, capacity } = await req.json();
  if (!number) return NextResponse.json({ error: "Masa numarası zorunlu" }, { status: 400 });

  const existing = await prisma.table.findFirst({ where: { businessId, number } });
  if (existing) return NextResponse.json({ error: "Bu masa numarası zaten var" }, { status: 400 });

  const table = await prisma.table.create({
    data: { number, capacity: capacity ?? 4, businessId },
  });
  return NextResponse.json(table, { status: 201 });
}
