"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", businessName: "", phone: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Kayıt başarısız.");
      } else {
        toast.success("Hesabınız oluşturuldu! 7 gün ücretsiz deneme başladı.");
        router.push("/giris");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-brand-600" />
            <span className="font-bold text-xl">Fizo QR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ücretsiz Başla</h1>
          <p className="text-gray-500 mt-1">7 gün ücretsiz, kredi kartı gerekmez.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Adınız Soyadınız"
              placeholder="Ahmet Yılmaz"
              value={form.name}
              onChange={set("name")}
              required
            />
            <Input
              id="businessName"
              label="İşletme Adı"
              placeholder="Tost Hub Cafe"
              value={form.businessName}
              onChange={set("businessName")}
              required
            />
            <Input
              id="email"
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              value={form.email}
              onChange={set("email")}
              required
            />
            <Input
              id="phone"
              label="Telefon"
              type="tel"
              placeholder="0532 000 00 00"
              value={form.phone}
              onChange={set("phone")}
            />
            <Input
              id="password"
              label="Şifre"
              type="password"
              placeholder="En az 8 karakter"
              value={form.password}
              onChange={set("password")}
              minLength={8}
              required
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Ücretsiz Hesap Oluştur
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Kaydolarak{" "}
            <Link href="/gizlilik" className="underline">Gizlilik Politikası</Link>
            {" "}ve{" "}
            <Link href="/kullanim-kosullari" className="underline">Kullanım Koşulları</Link>
            {"'nı kabul etmiş olursunuz."}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-brand-600 font-medium hover:text-brand-700">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
