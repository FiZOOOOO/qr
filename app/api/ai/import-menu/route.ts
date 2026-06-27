import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function getBusinessId(userId: string) {
  const b = await prisma.business.findUnique({ where: { userId }, select: { id: true } });
  return b?.id;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id);
  if (!businessId) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const { items }: { items: { name: string; price: number; category: string; description?: string }[] } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "Ürün listesi boş" }, { status: 400 });

  const categoryMap: Record<string, string> = {};
  let catOrder = await prisma.category.count({ where: { businessId } });
  let prodOrder = await prisma.product.count({ where: { businessId } });

  for (const item of items) {
    const catName = item.category ?? "Genel";
    if (!categoryMap[catName]) {
      let cat = await prisma.category.findFirst({ where: { businessId, name: catName } });
      if (!cat) {
        cat = await prisma.category.create({
          data: { name: catName, nameEn: catName, slug: slugify(catName), isActive: true, order: catOrder++, businessId },
        });
      }
      categoryMap[catName] = cat.id;
    }

    await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        price: parseFloat(String(item.price)) || 0,
        categoryId: categoryMap[catName],
        businessId,
        isActive: true,
        order: prodOrder++,
        allergens: [],
      },
    });
  }

  return NextResponse.json({ imported: items.length });
}
