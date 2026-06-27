import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { items, tableId, note } = await req.json();

  if (!items?.length) return NextResponse.json({ error: "Sepet boş" }, { status: 400 });

  const business = await prisma.business.findUnique({
    where: { slug },
    include: { subscription: true },
  });
  if (!business) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  if (business.subscription?.status === "EXPIRED" || business.subscription?.status === "CANCELLED") {
    return NextResponse.json({ error: "Bu menü aktif değil" }, { status: 403 });
  }

  const total = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      businessId: business.id,
      tableId: tableId ?? null,
      note: note ?? null,
      status: "PENDING",
      total,
      items: {
        create: items.map((i: { productId: string; quantity: number; price: number }) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
  });

  return NextResponse.json({ orderNumber: order.orderNumber });
}
