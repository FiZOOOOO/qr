import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { Users, CreditCard, Sparkles, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function BayiDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const dealer = await prisma.dealer.findUnique({
    where: { userId: session.user.id },
    include: {
      businesses: {
        include: { subscription: true, user: true },
        orderBy: { createdAt: "desc" },
      },
      transactions: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!dealer) redirect("/giris");

  const activeCount = dealer.businesses.filter((b) => b.subscription?.status === "ACTIVE").length;
  const trialCount = dealer.businesses.filter((b) => b.subscription?.status === "TRIAL").length;
  const expiringSoon = dealer.businesses.filter((b) => {
    if (!b.subscription) return false;
    const days = Math.ceil((new Date(b.subscription.endDate).getTime() - Date.now()) / 86400000);
    return days > 0 && days <= 7;
  });

  const LEVEL_PRICES: Record<string, number> = {
    LEVEL_1: 2400, LEVEL_2: 2000, LEVEL_3: 1750, LEVEL_4: 1500,
  };
  const costPerClient = LEVEL_PRICES[dealer.level];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bayi Gösterge Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">
          Seviye: <span className="font-medium text-brand-600">{dealer.level.replace("_", " ")} — {formatPrice(costPerClient)}/müşteri/yıl</span>
        </p>
      </div>

      {/* Expiring soon alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{expiringSoon.length} müşterinizin</strong> aboneliği 7 gün içinde sona eriyor.{" "}
            <Link href="/bayi/musteriler" className="underline">Görüntüle →</Link>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Bakiye", value: formatPrice(dealer.balance), icon: CreditCard, color: "text-green-600 bg-green-50" },
          { label: "AI Kredisi", value: dealer.aiCredits.toString(), icon: Sparkles, color: "text-brand-600 bg-brand-50" },
          { label: "Toplam Müşteri", value: dealer.businesses.length.toString(), icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Aktif Müşteri", value: activeCount.toString(), icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent clients */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Son Müşteriler</h2>
            <Link href="/bayi/musteriler" className="text-xs text-brand-600">Tümünü gör →</Link>
          </div>
          {dealer.businesses.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Henüz müşteri yok</p>
              <Link href="/bayi/musteri-olustur" className="text-brand-600 text-sm underline mt-1 block">
                İlk müşteriyi oluştur →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dealer.businesses.slice(0, 6).map((b) => {
                const daysLeft = b.subscription
                  ? Math.max(0, Math.ceil((new Date(b.subscription.endDate).getTime() - Date.now()) / 86400000))
                  : 0;
                return (
                  <div key={b.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.user.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        b.subscription?.status === "ACTIVE" ? "success"
                        : b.subscription?.status === "TRIAL" ? "info"
                        : "danger"
                      }>
                        {b.subscription?.status === "ACTIVE" ? "Aktif"
                        : b.subscription?.status === "TRIAL" ? "Deneme"
                        : "Süresi Dolmuş"}
                      </Badge>
                      {b.subscription && <p className="text-xs text-gray-400 mt-0.5">{daysLeft} gün kaldı</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Son İşlemler</h2>
          </div>
          {dealer.transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              İşlem bulunamadı
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dealer.transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.note ?? t.type}</p>
                    <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                  </div>
                  <span className={`font-semibold text-sm ${t.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {t.amount >= 0 ? "+" : ""}{formatPrice(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
