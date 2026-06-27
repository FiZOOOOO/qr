import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicMenu } from "./public-menu";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { settings: true },
  });
  if (!business) return { title: "Menü Bulunamadı" };
  return {
    title: `${business.name} Menü`,
    description: `${business.name} QR menüsü`,
  };
}

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      settings: true,
      categories: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          products: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      subscription: true,
      announcements: { where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!business) notFound();

  // Check subscription
  if (business.subscription?.status === "EXPIRED" || business.subscription?.status === "CANCELLED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">😔</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Menü Geçici Olarak Kapalı</h1>
          <p className="text-gray-500">Bu menü şu an aktif değil.</p>
        </div>
      </div>
    );
  }

  return (
    <PublicMenu
      business={{
        id: business.id,
        name: business.name,
        slug: business.slug,
        settings: business.settings,
        categories: business.categories as any,
        announcements: business.announcements,
      }}
    />
  );
}
