"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function SistemAyarlariPage() {
  const [form, setForm] = useState({
    appName: "Fizo QR",
    supportPhone: "",
    supportEmail: "",
    trialDays: "7",
    defaultPlanPrice: "2400",
    iyzicoPosMode: "sandbox",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => toast.success("Ayarlar kaydedildi");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="text-gray-500 text-sm mt-1">Platform genel yapılandırması</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-600" />
          Genel
        </h2>
        <Input id="appName" label="Platform Adı" value={form.appName} onChange={set("appName")} />
        <Input id="supportPhone" label="Destek Telefon" type="tel" value={form.supportPhone} onChange={set("supportPhone")} />
        <Input id="supportEmail" label="Destek E-posta" type="email" value={form.supportEmail} onChange={set("supportEmail")} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Abonelik Varsayılanları</h2>
        <Input id="trialDays" label="Deneme Süresi (gün)" type="number" value={form.trialDays} onChange={set("trialDays")} />
        <Input id="price" label="Standart Plan Fiyatı (₺/yıl)" type="number" value={form.defaultPlanPrice} onChange={set("defaultPlanPrice")} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">iyzico Ödeme</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mod</label>
          <select
            value={form.iyzicoPosMode}
            onChange={set("iyzicoPosMode")}
            className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="sandbox">Sandbox (Test)</option>
            <option value="production">Production (Canlı)</option>
          </select>
        </div>
      </div>

      <Button onClick={save} className="w-full" size="lg">
        Ayarları Kaydet
      </Button>
    </div>
  );
}
