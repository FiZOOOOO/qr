import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default async function AICreditsPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");
  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  const credits = business?.subscription?.aiCredits ?? 0;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Görsel Kredisi</h1>
        <p className="text-gray-500 text-sm mt-1">Yapay zeka ile ürün görseli oluşturmak için kredi kullanın</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-brand-600" />
        </div>
        <p className="text-5xl font-bold text-gray-900 mb-1">{credits}</p>
        <p className="text-gray-500">Mevcut AI Kredisi</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">AI Kredisi Nedir?</h2>
        <ul className="space-y-2.5">
          {[
            "Her 1 kredi ile 1 ürün görseli oluşturabilirsiniz",
            "Amatör fotoğrafı stüdyo kalitesine yükseltir",
            "Hiç görsel yoksa sıfırdan üretir",
            "Yükleme yoktur, işlem saniyeler içinde tamamlanır",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800">
        Daha fazla kredi satın almak için{" "}
        <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="underline font-medium">
          WhatsApp
        </a>{" "}
        üzerinden iletişime geçin.
      </div>
    </div>
  );
}
