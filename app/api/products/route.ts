import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const categoryId = searchParams.get("categoryId");

  const products = await prisma.product.findMany({
    where: { businessId, ...(categoryId ? { categoryId } : {}) },
    orderBy: { order: "asc" },
    include: { category: { select: { id: true, name: true } } },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const body = await req.json();
  const { name, nameEn, description, descriptionEn, price, categoryId, image, calories, allergens, isActive } = body;
  if (!name || !price || !categoryId) return NextResponse.json({ error: "İsim, fiyat ve kategori zorunlu" }, { status: 400 });

  const count = await prisma.product.count({ where: { businessId } });
  const product = await prisma.product.create({
    data: {
      name, nameEn, description, descriptionEn,
      price: parseFloat(String(price)),
      categoryId, image, calories: calories ? parseInt(String(calories)) : null,
      allergens: allergens ?? [],
      isActive: isActive ?? true,
      order: count,
      businessId,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
