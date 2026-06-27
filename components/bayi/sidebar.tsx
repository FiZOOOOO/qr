"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Plus, CreditCard, Sparkles, FileText, LogOut, QrCode } from "lucide-react";

const menuItems = [
  { label: "Gösterge Paneli", href: "/bayi", icon: LayoutDashboard, exact: true },
  { label: "Müşterilerim", href: "/bayi/musteriler", icon: Users },
  { label: "Müşteri Oluştur", href: "/bayi/musteri-olustur", icon: Plus },
  { label: "Bakiye & Ödeme", href: "/bayi/bakiye", icon: CreditCard },
  { label: "AI Kredi Yönetimi", href: "/bayi/ai-kredi", icon: Sparkles },
  { label: "Evrak & Sözleşme", href: "/bayi/evraklar", icon: FileText },
];

export function BayiSidebar({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Fizo QR</p>
            <p className="text-xs text-brand-600 font-medium">Bayi Paneli</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-gray-400">Giriş yapıldı:</p>
          <p className="text-sm font-medium text-gray-700 truncate">{name}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/giris" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
