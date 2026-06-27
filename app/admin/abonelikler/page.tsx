import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AboneliklerPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      business: { select: { name: true, slug: true } },
    },
  });

  const statusLabel: Record<string, string> = {
    TRIAL: "Deneme", ACTIVE: "Aktif", EXPIRED: "Süresi Dolmuş", CANCELLED: "İptal",
  };
  const statusVariant: Record<string, "info" | "success" | "danger" | "default"> = {
    TRIAL: "info", ACTIVE: "success", EXPIRED: "danger", CANCELLED: "default",
  };

  const totalRevenue = subscriptions.filter(s => s.status === "ACTIVE").reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abonelikler</h1>
          <p className="text-gray-500 text-sm mt-1">{subscriptions.length} abonelik</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-right">
          <p className="text-xs text-green-600 font-medium">Aktif Abonelik Geliri</p>
          <p className="text-xl font-bold text-green-700">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">İşletme</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Durum</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Fiyat</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Başlangıç</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bitiş</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscriptions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{s.business.name}</p>
                  <p className="text-xs text-gray-400">/menu/{s.business.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariant[s.status] ?? "default"}>
                    {statusLabel[s.status] ?? s.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-gray-500">{s.plan}</td>
                <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(s.price)}</td>
                <td className="px-5 py-4 text-gray-500">{formatDate(s.startDate)}</td>
                <td className="px-5 py-4 text-gray-500">{formatDate(s.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
