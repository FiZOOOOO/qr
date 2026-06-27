import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { rating, comment, clientIp } = await req.json();

  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Geçersiz puan" }, { status: 400 });

  const business = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
  if (!business) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

  const feedback = await prisma.feedback.create({
    data: { businessId: business.id, rating: parseInt(String(rating)), comment: comment ?? null, clientIp: clientIp ?? null },
  });

  return NextResponse.json({ id: feedback.id });
}
