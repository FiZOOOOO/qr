import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default async function IsletmelerPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: true,
      user: { select: { email: true, name: true } },
      dealer: { select: { id: true } },
      _count: { select: { categories: true, products: true, orders: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İşletmeler</h1>
          <p className="text-gray-500 text-sm mt-1">{businesses.length} işletme kayıtlı</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">İşletme</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">E-posta</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Abonelik</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bayi</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Ürün</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Kayıt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {businesses.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-400">/menu/{b.slug}</p>
                  </td>
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
                      : "Yok"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{b.dealer ? "Bayi" : "Direkt"}</td>
                  <td className="px-5 py-4 text-gray-500">{b._count.products}</td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
