"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("E-posta veya şifre hatalı.");
      } else {
        const meRes = await fetch("/api/me");
        const me = await meRes.json();
        if (me.role === "SUPER_ADMIN") router.push("/admin");
        else if (me.role === "DEALER") router.push("/bayi");
        else router.push("/panel");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - brand */}
      <div className="hidden lg:flex w-1/2 bg-brand-600 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">Fizo QR</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Yapay Zeka Destekli QR Menü Sistemi
          </h1>
          <p className="text-brand-200 text-lg">
            Restoranınızın dijital menüsünü dakikalar içinde oluşturun. Kalori, alerjen ve sipariş yönetimi tek panelde.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: "1000+", desc: "Aktif işletme" },
              { label: "5 dk", desc: "Kurulum süresi" },
              { label: "7 gün", desc: "Ücretsiz deneme" },
              { label: "7/24", desc: "WhatsApp destek" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{s.label}</p>
                <p className="text-brand-200 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <QrCode className="w-6 h-6 text-brand-600" />
            <span className="font-bold text-xl">Fizo QR</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Giriş Yap</h2>
          <p className="text-gray-500 mb-8">Hesabınıza erişin</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div className="relative">
              <Input
                id="password"
                label="Şifre"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Giriş Yap
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-brand-600 font-medium hover:text-brand-700">
              Ücretsiz Başla
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
