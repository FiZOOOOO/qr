import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Users, TrendingUp, Clock, BellRing,
  MessageSquare, Table2, AlertCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    include: {
      subscription: true,
      orders: {
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
      waiterCalls: {
        where: { status: "PENDING" },
        include: { table: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      feedbacks: {
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      tables: true,
    },
  });

  if (!business) redirect("/kurulum");

  const todayOrders = business.orders;
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = todayOrders.filter((o) => o.status === "PENDING" || o.status === "PREPARING");
  const emptyTables = business.tables.filter((t) => t.status === "EMPTY").length;
  const occupiedTables = business.tables.filter((t) => t.status === "OCCUPIED").length;

  const avgRating =
    business.feedbacks.length > 0
      ? business.feedbacks.reduce((s, f) => s + f.rating, 0) / business.feedbacks.length
      : 0;

  const daysLeft = business.subscription
    ? Math.max(0, Math.ceil((new Date(business.subscription.endDate).getTime() - Date.now()) / 86400000))
    : 0;

  const stats = [
    { label: "Bugünkü Sipariş", value: todayOrders.length.toString(), icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Bugünkü Ciro", value: formatPrice(todayRevenue), icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Bekleyen Sipariş", value: pendingOrders.length.toString(), icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Garson Çağrısı", value: business.waiterCalls.length.toString(), icon: BellRing, color: "text-red-600 bg-red-50" },
    { label: "Boş / Dolu Masa", value: `${emptyTables} / ${occupiedTables}`, icon: Table2, color: "text-brand-600 bg-brand-50" },
    { label: "Ortalama Puan", value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "–", icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Subscription alert */}
      {business.subscription && daysLeft <= 7 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            Üyeliğiniz <strong>{daysLeft} gün</strong> sonra sona eriyor.{" "}
            <a href="/panel/abonelik" className="underline font-medium">Şimdi yenile</a>
          </span>
        </div>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gösterge Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Bugünkü Siparişler</h2>
            <a href="/panel/siparisler" className="text-xs text-brand-600 hover:text-brand-700">Tümünü gör →</a>
          </div>
          {todayOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Bugün henüz sipariş yok
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todayOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-gray-400 text-xs">{order.items.length} ürün · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                    <Badge
                      variant={
                        order.status === "DELIVERED" ? "success"
                          : order.status === "CANCELLED" ? "danger"
                          : order.status === "READY" ? "info"
                          : "warning"
                      }
                    >
                      {order.status === "PENDING" ? "Bekliyor"
                        : order.status === "PREPARING" ? "Hazırlanıyor"
                        : order.status === "READY" ? "Hazır"
                        : order.status === "DELIVERED" ? "Teslim"
                        : "İptal"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Waiter calls + feedbacks */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Garson Çağrıları</h2>
              <a href="/panel/garson-cagrilari" className="text-xs text-brand-600">Tümünü gör →</a>
            </div>
            {business.waiterCalls.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                <BellRing className="w-6 h-6 mx-auto mb-2 opacity-30" />
                Bekleyen çağrı yok
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {business.waiterCalls.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-medium">{c.table ? `Masa ${c.table.number}` : "Bilinmeyen Masa"}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{formatDate(c.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Son Yorumlar</h2>
              <a href="/panel/geri-bildirimler" className="text-xs text-brand-600">Tümünü gör →</a>
            </div>
            {business.feedbacks.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30" />
                Henüz geri bildirim yok
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {business.feedbacks.map((f) => (
                  <div key={f.id} className="px-5 py-3">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < f.rating ? "text-amber-400" : "text-gray-200"}>★</span>
                      ))}
                      <span className="text-xs text-gray-400 ml-2">{formatDate(f.createdAt)}</span>
                    </div>
                    {f.comment && <p className="text-sm text-gray-700 truncate">{f.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
