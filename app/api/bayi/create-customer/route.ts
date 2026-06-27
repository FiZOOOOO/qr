import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import bcrypt from "bcryptjs";

function randomPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  if (session.user.role !== "DEALER") return NextResponse.json({ error: "Sadece bayiler" }, { status: 403 });

  const dealer = await prisma.dealer.findUnique({
    where: { userId: session.user.id },
    select: { id: true, balance: true, level: true },
  });
  if (!dealer) return NextResponse.json({ error: "Bayi bulunamadı" }, { status: 404 });

  const { businessName, ownerName, email, phone, durationMonths } = await req.json();
  if (!businessName || !email) return NextResponse.json({ error: "İşletme adı ve e-posta zorunlu" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 400 });

  const tempPassword = randomPassword();
  const hashed = await bcrypt.hash(tempPassword, 10);

  const slug = slugify(businessName);
  const slugExists = await prisma.business.findUnique({ where: { slug } });
  const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

  const months = parseInt(String(durationMonths ?? 12));
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);
  const subEnd = new Date();
  subEnd.setMonth(subEnd.getMonth() + months);

  await prisma.user.create({
    data: {
      name: ownerName ?? businessName,
      email,
      password: hashed,
      role: "BUSINESS",
      business: {
        create: {
          name: businessName,
          slug: finalSlug,
          phone,
          dealerId: dealer.id,
          subscription: {
            create: {
              status: "TRIAL",
              startDate: new Date(),
              endDate: trialEnd,
              plan: "STANDARD",
              price: 0,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ tempPassword, email, businessName });
}
