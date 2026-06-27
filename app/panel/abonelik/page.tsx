import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  const sub = business?.subscription;
  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000)) : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Üyelik Paketim</h1>
        <p className="text-gray-500 text-sm mt-1">Abonelik durumunuzu yönetin</p>
      </div>

      {sub ? (
        <>
          {/* Current plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">Fizo QR Standard</h2>
                <p className="text-gray-500 text-sm">Tüm özellikler dahil</p>
              </div>
              <Badge
                variant={
                  sub.status === "ACTIVE" ? "success"
                  : sub.status === "TRIAL" ? "info"
                  : sub.status === "EXPIRED" ? "danger"
                  : "default"
                }
              >
                {sub.status === "ACTIVE" ? "Aktif"
                  : sub.status === "TRIAL" ? "Deneme"
                  : sub.status === "EXPIRED" ? "Süresi Dolmuş"
                  : "İptal"}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Başlangıç</p>
                <p className="font-medium text-gray-900 text-sm">{formatDate(sub.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Bitiş</p>
                <p className="font-medium text-gray-900 text-sm">{formatDate(sub.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Kalan</p>
                <p className={`font-bold text-lg ${daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}>
                  {daysLeft} gün
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">AI Görsel Kredisi</p>
              <p className="font-bold text-2xl text-gray-900">{sub.aiCredits} kredi</p>
            </div>
          </div>

          {daysLeft <= 30 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Üyeliğiniz {daysLeft} gün içinde sona erecek
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Sürenizi uzatmak için iletişime geçin.
                </p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Dahil Olan Özellikler</h2>
            <ul className="space-y-2.5">
              {[
                "Sınırsız kategori ve ürün",
                "Otomatik AI menü tarama",
                "Kalori & alerjen tespiti",
                "Masa yönetimi",
                "Sipariş ve garson çağrı sistemi",
                "Geri bildirim yönetimi",
                "Çoklu dil desteği (TR/EN)",
                "QR kod oluşturucu",
                "7/24 WhatsApp destek",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">Aktif abonelik bulunamadı</p>
          <Link
            href="/#fiyatlandirma"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Paket Satın Al
          </Link>
        </div>
      )}

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800">
        Abonelik yenileme veya yükseltme için{" "}
        <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="underline font-medium">
          WhatsApp
        </a>{" "}
        üzerinden iletişime geçebilirsiniz.
      </div>
    </div>
  );
}
