import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const dealer = await prisma.dealer.findUnique({
    where: { userId: session.user.id },
    include: {
      businesses: {
        include: { subscription: true, user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dealer) redirect("/giris");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşterilerim</h1>
          <p className="text-gray-500 text-sm mt-1">{dealer.businesses.length} müşteri</p>
        </div>
        <Link
          href="/bayi/musteri-olustur"
          className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Müşteri Oluştur
        </Link>
      </div>

      {dealer.businesses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Henüz müşteri oluşturulmamış</p>
          <Link href="/bayi/musteri-olustur" className="text-brand-600 underline">İlk müşteriyi oluştur</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">İşletme</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">E-posta</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Durum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bitiş</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Kalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dealer.businesses.map((b) => {
                const daysLeft = b.subscription
                  ? Math.max(0, Math.ceil((new Date(b.subscription.endDate).getTime() - Date.now()) / 86400000))
                  : 0;
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{b.name}</td>
                    <td className="px-5 py-4 text-gray-500">{b.user.email}</td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        b.subscription?.status === "ACTIVE" ? "success"
                        : b.subscription?.status === "TRIAL" ? "info"
                        : b.subscription?.status === "EXPIRED" ? "danger"
                        : "default"
                      }>
                        {b.subscription?.status === "ACTIVE" ? "Aktif"
                        : b.subscription?.status === "TRIAL" ? "Deneme"
                        : b.subscription?.status === "EXPIRED" ? "Süresi Dolmuş"
                        : b.subscription?.status === "CANCELLED" ? "İptal"
                        : "Abonelik Yok"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {b.subscription ? formatDate(b.subscription.endDate) : "–"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-medium ${daysLeft <= 7 ? "text-red-600" : "text-gray-900"}`}>
                        {b.subscription ? `${daysLeft} gün` : "–"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
