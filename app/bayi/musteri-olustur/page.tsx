"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle, Users } from "lucide-react";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ name: string; email: string; password: string } | null>(null);
  const [form, setForm] = useState({
    businessName: "", ownerName: "", email: "", phone: "",
    durationMonths: "12",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async () => {
    if (!form.businessName || !form.email) { toast.error("İşletme adı ve e-posta zorunlu"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/bayi/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ name: form.businessName, email: form.email, password: data.tempPassword });
        toast.success("Müşteri hesabı oluşturuldu");
      } else {
        toast.error(data.error ?? "Hata oluştu");
      }
    } catch { toast.error("Hata"); }
    finally { setSaving(false); }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Müşteri Hesabı Oluşturuldu</h2>
          <p className="text-gray-500 mb-6">Müşteriniz aşağıdaki bilgilerle giriş yapabilir:</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">İşletme:</span>
              <span className="font-medium">{success.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">E-posta:</span>
              <span className="font-medium">{success.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Geçici Şifre:</span>
              <span className="font-mono font-bold text-brand-600">{success.password}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giriş URL:</span>
              <span className="text-brand-600">{window.location.origin}/giris</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/bayi/musteriler")}>
              Müşteri Listesi
            </Button>
            <Button className="flex-1" onClick={() => setSuccess(null)}>
              Yeni Müşteri
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Müşteri Oluştur</h1>
        <p className="text-gray-500 text-sm mt-1">Yeni bir işletme hesabı açın, bakiyenizden düşülür</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Input id="bizName" label="İşletme Adı*" placeholder="Tost Hub Cafe" value={form.businessName} onChange={set("businessName")} />
        <Input id="ownerName" label="Yetkili Adı Soyadı" placeholder="Ahmet Yılmaz" value={form.ownerName} onChange={set("ownerName")} />
        <Input id="email" label="E-posta*" type="email" placeholder="cafe@email.com" value={form.email} onChange={set("email")} />
        <Input id="phone" label="Telefon" type="tel" value={form.phone} onChange={set("phone")} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Üyelik Süresi</label>
          <select
            value={form.durationMonths}
            onChange={set("durationMonths")}
            className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="1">1 Ay</option>
            <option value="3">3 Ay</option>
            <option value="6">6 Ay</option>
            <option value="12">12 Ay (1 Yıl)</option>
          </select>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800 flex items-start gap-3">
        <Users className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">7 gün ücretsiz deneme başlar</p>
          <p className="text-brand-600">Bakiyenizden düşüm, deneme süresi bitiminde yapılır.</p>
        </div>
      </div>

      <Button className="w-full" size="lg" loading={saving} onClick={create}>
        Hesabı Oluştur
      </Button>
    </div>
  );
}
