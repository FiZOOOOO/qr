"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Settings {
  logoUrl?: string; coverUrl?: string; primaryColor: string;
  welcomeMessage?: string; showCalories: boolean; showAllergens: boolean;
  currency: string; defaultLanguage: string; googleRatingUrl?: string;
  whatsappNumber?: string; instagram?: string; facebook?: string;
  sector: string; address?: string; phone?: string; email?: string; openHours?: string;
  enableOrdering: boolean; enableWaiterCall: boolean; enableFeedback: boolean;
}

const SECTORS = [
  { value: "restaurant", label: "Restoran" },
  { value: "cafe", label: "Kafe" },
  { value: "hotel", label: "Otel" },
  { value: "bar", label: "Bar" },
  { value: "bakery", label: "Fırın / Pastane" },
  { value: "other", label: "Diğer" },
];

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success("Ayarlar kaydedildi");
      else toast.error("Hata oluştu");
    } catch { toast.error("Hata oluştu"); }
    finally { setSaving(false); }
  };

  const set = (key: keyof Settings) => (value: unknown) =>
    setSettings((s) => s ? { ...s, [key]: value } : s);

  if (!settings) return <div className="py-20 text-center text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Ayarlar</h1>
        <p className="text-gray-500 text-sm mt-1">İşletmenizin temel bilgilerini yönetin</p>
      </div>

      {/* Sector */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Sektör</h2>
        <div className="grid grid-cols-3 gap-3">
          {SECTORS.map((s) => (
            <button
              key={s.value}
              onClick={() => set("sector")(s.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                settings.sector === s.value
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">İletişim Bilgileri</h2>
        <Input id="phone" label="Telefon" type="tel" value={settings.phone ?? ""} onChange={(e) => set("phone")(e.target.value)} />
        <Input id="email" label="E-posta" type="email" value={settings.email ?? ""} onChange={(e) => set("email")(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
          <textarea rows={2} value={settings.address ?? ""} onChange={(e) => set("address")(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <Input id="hours" label="Çalışma Saatleri" placeholder="09:00 - 22:00" value={settings.openHours ?? ""} onChange={(e) => set("openHours")(e.target.value)} />
      </section>

      {/* Social */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Sosyal Medya & Entegrasyonlar</h2>
        <Input id="whatsapp" label="WhatsApp Numarası" placeholder="905001234567" value={settings.whatsappNumber ?? ""} onChange={(e) => set("whatsappNumber")(e.target.value)} />
        <Input id="instagram" label="Instagram" placeholder="@kullanici" value={settings.instagram ?? ""} onChange={(e) => set("instagram")(e.target.value)} />
        <Input id="facebook" label="Facebook" value={settings.facebook ?? ""} onChange={(e) => set("facebook")(e.target.value)} />
        <Input id="googleRating" label="Google Puan Linki" placeholder="https://g.page/..." value={settings.googleRatingUrl ?? ""} onChange={(e) => set("googleRatingUrl")(e.target.value)} />
      </section>

      {/* Menu options */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Menü Seçenekleri</h2>
        {[
          { key: "showCalories" as const, label: "Kalori bilgilerini göster" },
          { key: "showAllergens" as const, label: "Alerjen bilgilerini göster" },
          { key: "enableOrdering" as const, label: "QR menüden sipariş almayı etkinleştir" },
          { key: "enableWaiterCall" as const, label: "Garson çağrı özelliğini etkinleştir" },
          { key: "enableFeedback" as const, label: "Geri bildirim özelliğini etkinleştir" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">{label}</span>
            <button
              type="button"
              onClick={() => set(key)(!settings[key])}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings[key] ? "bg-brand-600" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? "translate-x-5.5 left-0.5" : "left-0.5"}`} />
            </button>
          </label>
        ))}
      </section>

      {/* Brand color */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Marka Rengi</h2>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => set("primaryColor")(e.target.value)}
            className="w-12 h-12 rounded-xl border border-gray-300 cursor-pointer"
          />
          <Input
            id="color"
            value={settings.primaryColor}
            onChange={(e) => set("primaryColor")(e.target.value)}
            className="max-w-[140px]"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} loading={saving} size="lg">Kaydet</Button>
      </div>
    </div>
  );
}
