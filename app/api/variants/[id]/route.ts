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
  const { name, isRequired, isMultiple, options } = await req.json();

  await prisma.variantTemplate.updateMany({ where: { id, businessId }, data: { name, isRequired, isMultiple } });

  if (options) {
    await prisma.variantOption.deleteMany({ where: { templateId: id } });
    await prisma.variantOption.createMany({
      data: options.map((o: { name: string; priceAdjustment?: number }) => ({
        templateId: id, name: o.name, priceAdjustment: o.priceAdjustment ?? 0,
      })),
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { id } = await params;
  await prisma.variantTemplate.deleteMany({ where: { id, businessId } });
  return NextResponse.json({ ok: true });
}
