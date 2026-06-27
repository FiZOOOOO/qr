import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Users, Store, Handshake, CreditCard, TrendingUp, Zap } from "lucide-react";

export default async function AdminDashboard() {
  const [
    totalUsers, totalBusinesses, totalDealers,
    activeSubscriptions, trialSubscriptions, expiredSubscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.dealer.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "TRIAL" } }),
    prisma.subscription.count({ where: { status: "EXPIRED" } }),
  ]);

  const recentBusinesses = await prisma.business.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { subscription: true, user: { select: { email: true } } },
  });

  const stats = [
    { label: "Toplam Kullanıcı", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Toplam İşletme", value: totalBusinesses, icon: Store, color: "bg-purple-50 text-purple-600" },
    { label: "Toplam Bayi", value: totalDealers, icon: Handshake, color: "bg-amber-50 text-amber-600" },
    { label: "Aktif Abonelik", value: activeSubscriptions, icon: CreditCard, color: "bg-green-50 text-green-600" },
    { label: "Deneme Sürümü", value: trialSubscriptions, icon: TrendingUp, color: "bg-cyan-50 text-cyan-600" },
    { label: "Süresi Dolmuş", value: expiredSubscriptions, icon: Zap, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Özeti</h1>
        <p className="text-gray-500 text-sm mt-1">Fizo QR platform genel durumu</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString("tr-TR")}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Kayıtlar</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentBusinesses.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-400">{b.user.email}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                b.subscription?.status === "ACTIVE" ? "bg-green-50 text-green-600"
                : b.subscription?.status === "TRIAL" ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-500"
              }`}>
                {b.subscription?.status === "ACTIVE" ? "Aktif"
                : b.subscription?.status === "TRIAL" ? "Deneme"
                : b.subscription?.status === "EXPIRED" ? "Süresi Dolmuş"
                : "Abonelik Yok"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
