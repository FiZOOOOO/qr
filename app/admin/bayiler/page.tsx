import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const levelLabels: Record<string, string> = {
  LEVEL_1: "Standart", LEVEL_2: "Gümüş", LEVEL_3: "Altın", LEVEL_4: "Platin",
};

export default async function BayilerPage() {
  const dealers = await prisma.dealer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { businesses: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bayiler</h1>
        <p className="text-gray-500 text-sm mt-1">{dealers.length} bayi kayıtlı</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bayi</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">E-posta</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Seviye</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bakiye</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">AI Kredi</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Müşteri</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dealers.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{d.user.name ?? "–"}</td>
                <td className="px-5 py-4 text-gray-500">{d.user.email}</td>
                <td className="px-5 py-4">
                  <Badge variant="brand">{levelLabels[d.level] ?? d.level}</Badge>
                </td>
                <td className="px-5 py-4 text-gray-900 font-medium">{formatPrice(d.balance)}</td>
                <td className="px-5 py-4 text-gray-500">{d.aiCredits}</td>
                <td className="px-5 py-4 text-gray-500">{d._count.businesses}</td>
                <td className="px-5 py-4 text-gray-500">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
