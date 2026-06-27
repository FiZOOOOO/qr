"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Table2 } from "lucide-react";

export default function QRCodePage() {
  const [slug, setSlug] = useState("");
  const [tables, setTables] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string>("menu");

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => setSlug(d.businessSlug ?? ""));
    fetch("/api/tables").then((r) => r.json()).then(setTables);
  }, []);

  const menuUrl = `${window.location.origin}/menu/${slug}`;
  const targetUrl = selected === "menu" ? menuUrl : `${menuUrl}?masa=${selected}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}&bgcolor=ffffff&color=7C3AED`;

  const download = () => {
    const a = document.createElement("a");
    a.href = qrApiUrl;
    a.download = `qr-${selected === "menu" ? "menu" : selected}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Kod Oluşturucu</h1>
        <p className="text-gray-500 text-sm mt-1">Menü veya masa başına QR kod oluşturun ve indirin</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: selection */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">QR Kodu Nereye Bağlansın?</h2>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selected === "menu" ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <input type="radio" value="menu" checked={selected === "menu"} onChange={() => setSelected("menu")} className="text-brand-600" />
                <QrCode className="w-4 h-4 text-brand-600" />
                <div>
                  <p className="font-medium text-sm">Ana Menü</p>
                  <p className="text-xs text-gray-500">Tüm menüye genel bağlantı</p>
                </div>
              </label>
              {tables.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selected === t.id ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input type="radio" value={t.id} checked={selected === t.id} onChange={() => setSelected(t.id)} className="text-brand-600" />
                  <Table2 className="w-4 h-4 text-brand-600" />
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">Masa özel QR kod</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Bağlantı URL&apos;si</h2>
            <p className="text-sm text-brand-600 break-all font-mono">{targetUrl}</p>
          </div>
        </div>

        {/* Right: QR preview */}
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {slug ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrApiUrl} alt="QR Kod" width={300} height={300} className="rounded-xl" />
            ) : (
              <div className="w-72 h-72 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm">Yükleniyor...</p>
              </div>
            )}
          </div>
          <Button onClick={download} size="lg" disabled={!slug}>
            <Download className="w-4 h-4" />
            QR Kodu İndir (PNG)
          </Button>
          <p className="text-xs text-gray-400 text-center">
            QR kodu masanıza, girişe veya vitrine yerleştirin.<br />
            Müşteriler taratarak menünüze ulaşabilir.
          </p>
        </div>
      </div>
    </div>
  );
}
