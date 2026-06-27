"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Store, ArrowRight } from "lucide-react";

const sectors = [
  "Restoran", "Kafe", "Fast Food", "Pizza", "Döner", "Burger",
  "Tatlıcı", "Pastane", "Balık", "Et Ürünleri", "Vejetaryen / Vegan",
  "Kahvaltı", "Börek", "Pide / Lahmacun", "Bar / Pub", "Diğer",
];

export default function KurulumPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", phone: "", email: "", sector: "Restoran",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.value;
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "name" ? { slug: slugify(v) } : {}),
    }));
  };

  const submit = async () => {
    if (!form.name) { toast.error("İşletme adı zorunlu"); return; }
    if (!form.slug) { toast.error("Menü linki zorunlu"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("İşletme oluşturuldu! Panele yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/panel"), 1000);
      } else {
        toast.error(data.error ?? "Hata oluştu");
      }
    } catch { toast.error("Hata"); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">İşletmenizi Kurun</h1>
          <p className="text-gray-500 mt-2">QR menünüzü oluşturmak için işletme bilgilerinizi girin</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <Input
            id="name"
            label="İşletme Adı *"
            placeholder="Tost Hub Cafe"
            value={form.name}
            onChange={set("name")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menü Linki *</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
              <span className="bg-gray-50 border-r border-gray-300 px-3 text-gray-400 text-sm py-2 whitespace-nowrap">
                fizomenu.com/menu/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                placeholder="tost-hub-cafe"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
            <select
              value={form.sector}
              onChange={set("sector")}
              className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {sectors.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <Input id="phone" label="Telefon" type="tel" value={form.phone} onChange={set("phone")} />
          <Input id="email" label="İşletme E-posta" type="email" value={form.email} onChange={set("email")} />
        </div>

        <Button
          className="w-full mt-4"
          size="lg"
          loading={saving}
          onClick={submit}
        >
          Kurulumu Tamamla
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
