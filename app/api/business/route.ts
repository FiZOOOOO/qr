import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    include: { settings: true, subscription: true },
  });
  if (!business) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });
  return NextResponse.json(business);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, slug, phone, email, address, sector } = await req.json();
  if (!name) return NextResponse.json({ error: "İsim zorunlu" }, { status: 400 });

  const existing = await prisma.business.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (!existing) {
    const newSlug = slug ?? slugify(name);
    const slugExists = await prisma.business.findUnique({ where: { slug: newSlug } });
    if (slugExists) return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 400 });
    const business = await prisma.business.create({
      data: { name, slug: newSlug, phone, email, address, sector, userId: session.user.id },
    });
    return NextResponse.json(business, { status: 201 });
  }

  if (slug) {
    const slugExists = await prisma.business.findFirst({
      where: { slug, NOT: { userId: session.user.id } },
    });
    if (slugExists) return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 400 });
  }

  const business = await prisma.business.update({
    where: { userId: session.user.id },
    data: { name, ...(slug ? { slug } : {}), phone, email, address, sector },
  });
  return NextResponse.json(business);
}
