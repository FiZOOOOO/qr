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

  const variants = await prisma.variantTemplate.findMany({
    where: { businessId },
    include: { options: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(variants);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { name, isRequired, isMultiple, options } = await req.json();
  if (!name) return NextResponse.json({ error: "İsim zorunlu" }, { status: 400 });

  const variant = await prisma.variantTemplate.create({
    data: {
      name, isRequired: isRequired ?? false, isMultiple: isMultiple ?? false, businessId,
      options: { create: (options ?? []).map((o: { name: string; priceAdjustment?: number }) => ({ name: o.name, priceAdjustment: o.priceAdjustment ?? 0 })) },
    },
    include: { options: true },
  });
  return NextResponse.json(variant, { status: 201 });
}
