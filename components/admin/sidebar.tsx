"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, Store, Handshake, CreditCard,
  Settings, LogOut, Zap, Shield,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "İşletmeler", href: "/admin/isletmeler", icon: Store },
  { label: "Kullanıcılar", href: "/admin/kullaniciler", icon: Users },
  { label: "Bayiler", href: "/admin/bayiler", icon: Handshake },
  { label: "Abonelikler", href: "/admin/abonelikler", icon: CreditCard },
  { label: "AI Krediler", href: "/admin/ai-kredi", icon: Zap },
  { label: "Sistem Ayarları", href: "/admin/ayarlar", icon: Settings },
];

export function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 bg-gray-900 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Fizo QR</p>
            <p className="text-gray-400 text-xs">Süper Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-brand-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-gray-800 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: "/giris" })}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
