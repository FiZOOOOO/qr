import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function KullaniciarPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      business: { select: { name: true } },
      dealer: { select: { level: true } },
    },
  });

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: "Süper Admin",
    DEALER: "Bayi",
    BUSINESS: "İşletme",
  };
  const roleBadge: Record<string, "brand" | "warning" | "default"> = {
    SUPER_ADMIN: "brand",
    DEALER: "warning",
    BUSINESS: "default",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} kullanıcı kayıtlı</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Ad</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">E-posta</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Rol</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">İşletme / Seviye</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{u.name ?? "–"}</td>
                <td className="px-5 py-4 text-gray-500">{u.email}</td>
                <td className="px-5 py-4">
                  <Badge variant={roleBadge[u.role] ?? "default"}>{roleLabel[u.role] ?? u.role}</Badge>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {u.business?.name ?? (u.dealer ? `Seviye ${u.dealer.level.replace("LEVEL_", "")}` : "–")}
                </td>
                <td className="px-5 py-4 text-gray-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
