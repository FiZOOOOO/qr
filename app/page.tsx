import Link from "next/link";
import { QrCode, Sparkles, ChevronRight, CheckCircle2, Zap, Shield, Globe, BarChart3, Users, Phone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Fizo QR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#ozellikler" className="hover:text-gray-900 transition-colors">Özellikler</a>
            <a href="#yapay-zeka" className="hover:text-gray-900 transition-colors">Yapay Zeka</a>
            <a href="#fiyatlandirma" className="hover:text-gray-900 transition-colors">Fiyatlandırma</a>
            <a href="#bayilik" className="hover:text-gray-900 transition-colors">Bayilik</a>
            <Link href="/giris" className="hover:text-gray-900 transition-colors">Giriş Yap</Link>
            <Link
              href="/kayit"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Ücretsiz Başla
            </Link>
          </nav>
          <Link href="/kayit" className="md:hidden bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Başla
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          2026 — QR menü artık yasal zorunluluk
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Yapay Zeka Destekli{" "}
          <span className="text-brand-600">QR Menü</span> Sistemi
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Kağıt menünüzü otomatik aktarın; kalori, alerjen ve içerik tespitini yapay zeka sizin için yapsın — dakikalar içinde yayında olun.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-brand-700 transition-colors"
          >
            Ücretsiz Dene <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href="#yapay-zeka"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            Yapay Zekayı Keşfet
          </a>
        </div>
        <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 bg-gray-50 border border-gray-200 rounded-2xl px-8 py-4 text-sm">
          {[
            { label: "aktif işletme", value: "1000+" },
            { label: "kurulum süresi", value: "5 dk" },
            { label: "ücretsiz deneme", value: "7 gün" },
            { label: "WhatsApp destek", value: "7/24" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-bold text-gray-900 text-lg">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section id="yapay-zeka" className="bg-gray-50 border-y border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-semibold bg-brand-50 px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Yapay Zeka Motoru
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fotoğrafı çekin, gerisini yapay zeka halletsin
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Menü oluşturmaktan görsel üretmeye, kalori hesabından açıklama yazmaya kadar; saatler süren işleri saniyelere indirir.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Otomatik Menü Tarama",
                desc: "Kağıt menü fotoğrafını çekin veya Getir/Trendyol linkini yapıştırın; ürünler otomatik aktarılsın.",
                icon: "🔍",
              },
              {
                title: "Kalori & Alerjen Tespiti",
                desc: "AB standardı 14 alerjen otomatik işaretlenir. Kalori değerleri yapay zeka ile hesaplanır.",
                icon: "⚡",
              },
              {
                title: "Görsel Stüdyosu",
                desc: "Telefonla çektiğiniz fotoğrafları tek tıkla stüdyo kalitesine dönüştürün veya sıfırdan üretin.",
                icon: "✨",
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">İşletmenizi büyüten her şey tek panelde</h2>
            <p className="text-gray-500 text-lg">30&apos;dan fazla özellik, tek abonelikte.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: "🪑", title: "Masa Yönetimi", desc: "Masaları ekleyin, boş/dolu durumunu gerçek zamanlı görün, QR kod oluşturun." },
              { emoji: "🛍️", title: "Sipariş Yönetimi", desc: "Masadan gelen siparişleri anlık takip edin, durum güncelleyin." },
              { emoji: "📊", title: "Analitik Dashboard", desc: "Günlük müşteri sayısı, ciro ve ortalama servis süresi izleyin." },
              { emoji: "🌍", title: "Çoklu Dil", desc: "Türkçe ve İngilizce başta olmak üzere çoklu dil desteği." },
              { emoji: "🛡️", title: "Yasal Uyum", desc: "Kalori değerleri, 14 alerjen ve içerik bilgileri eksiksiz." },
              { emoji: "🔔", title: "Garson Çağrı", desc: "Müşteriler QR ile garson çağırsın, siz anında bildirim alın." },
              { emoji: "💬", title: "Geri Bildirim", desc: "Müşteri yorumları ve puanlamaları tek ekranda yönetin." },
              { emoji: "📱", title: "PWA Bildirim", desc: "Garson çağrıları ve siparişler için anlık bildirim." },
            ].map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-brand-200 hover:bg-brand-50/50 transition-colors">
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Banner */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold mb-3">Yeni Ticaret Bakanlığı yönetmeliğine %100 uyum</h2>
          <p className="text-brand-200 text-lg">
            Kalori değerleri, 14 AB standardı alerjen ve içerik bilgileri menünüzde eksiksiz yer alır.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="fiyatlandirma" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tek paket, net fiyat</h2>
          <p className="text-gray-500 text-lg mb-12">Gizli ücret yok, sürpriz yok. Tüm yapay zeka araçları dahil.</p>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md mx-auto">
            <p className="text-5xl font-bold text-gray-900 mb-1">
              2.400 <span className="text-2xl text-gray-500 font-normal">₺</span>
            </p>
            <p className="text-gray-500 mb-8">/ yıl · KDV dahil · 7 gün ücretsiz</p>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Otomatik menü oluşturma (AI)",
                "Link ile menü aktarma (Getir, Trendyol)",
                "Kalori & alerjen tespiti",
                "Masa yönetimi",
                "Sipariş ve garson çağrı sistemi",
                "Geri bildirim & analitik",
                "Çoklu dil desteği",
                "QR kod oluşturucu",
                "7/24 WhatsApp destek",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/kayit"
              className="w-full block bg-brand-600 text-white text-center py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              7 Gün Ücretsiz Dene
            </Link>
          </div>
        </div>
      </section>

      {/* Dealer */}
      <section id="bayilik" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-700 text-xs font-semibold bg-brand-50 px-3 py-1.5 rounded-full mb-6">
                Bayilik Programı
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                QR Menü Satarak <span className="text-brand-600">Kazanç Elde Edin</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Restoran ve kafelere QR menü hizmeti satın, fiyatı kendiniz belirleyin. Sınırsız müşteri, beyaz etiket panel, giriş ücreti yok.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Giriş ücreti", value: "0 ₺" },
                  { label: "Müşteri limiti", value: "Sınırsız" },
                  { label: "Panel türü", value: "Beyaz etiket" },
                  { label: "Deneme", value: "7 gün/müşteri" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="font-bold text-gray-900">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/kayit?type=dealer"
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
              >
                Bayilik Başvurusu Yap <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "👥", title: "Müşteri Oluştur", desc: "Tek tıkla işletme hesabı açın, 7 gün ücretsiz deneme başlasın." },
                { emoji: "💳", title: "Bakiye Yönetimi", desc: "Güvenli ödeme altyapısıyla bakiye yükleyin ve takip edin." },
                { emoji: "✨", title: "AI Kredi Satışı", desc: "Müşterilerinize AI görsel üretim hakkı satın ve kâr edin." },
                { emoji: "🏷️", title: "Beyaz Etiket", desc: "Müşterileriniz maliyet fiyatınızı ve Fizo QR markasını görmez." },
              ].map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="text-2xl mb-3">{f.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Hemen başlayın</h2>
          <p className="text-brand-200 text-lg mb-8">7 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors"
            >
              Ücretsiz Başla <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              WhatsApp ile Bilgi Al
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <QrCode className="w-5 h-5 text-brand-400" />
                <span className="font-bold">Fizo QR</span>
              </div>
              <p className="text-sm">Türkiye&apos;nin yapay zeka destekli QR menü sistemi</p>
            </div>
            {[
              { title: "Ürün", links: [["Özellikler", "#ozellikler"], ["Yapay Zeka", "#yapay-zeka"], ["Fiyatlandırma", "#fiyatlandirma"]] },
              { title: "Şirket", links: [["Hakkımızda", "/hakkimizda"], ["İletişim", "/iletisim"], ["Blog", "/blog"]] },
              { title: "Hesap", links: [["Giriş Yap", "/giris"], ["Ücretsiz Başla", "/kayit"], ["Bayilik", "#bayilik"]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-medium mb-3 text-sm">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            © {new Date().getFullYear()} Fizo QR. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
