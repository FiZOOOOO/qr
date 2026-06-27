import { prisma } from "@/lib/prisma";
import { Zap } from "lucide-react";

export default async function AdminAiKrediPage() {
  const dealers = await prisma.dealer.findMany({
    select: { id: true, aiCredits: true, user: { select: { name: true, email: true } } },
    orderBy: { aiCredits: "desc" },
  });

  const totalCredits = dealers.reduce((s, d) => s + d.aiCredits, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Kredi Yönetimi</h1>
        <p className="text-gray-500 text-sm mt-1">Bayi AI kredi durumları</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-sm text-gray-500">Toplam Dağıtılan Kredi</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalCredits.toLocaleString("tr-TR")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm text-gray-500">Aktif Bayi</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dealers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Bayi</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">E-posta</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">AI Kredi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dealers.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{d.user.name ?? "–"}</td>
                <td className="px-5 py-4 text-gray-500">{d.user.email}</td>
                <td className="px-5 py-4 text-right">
                  <span className="font-bold text-brand-600">{d.aiCredits.toLocaleString("tr-TR")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
