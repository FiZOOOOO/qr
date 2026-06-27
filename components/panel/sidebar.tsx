"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderOpen, Package, Layers, ScanLine,
  Palette, FileText, QrCode, ShoppingBag, BellRing, MessageSquare,
  UserX, Table2, Settings, CreditCard, Sparkles, Bell, Megaphone,
  LogOut, ExternalLink, ChevronRight,
} from "lucide-react";

const menuGroups = [
  {
    label: "Menü Yönetimi",
    items: [
      { label: "Kategoriler", href: "/panel/kategoriler", icon: FolderOpen },
      { label: "Ürünler", href: "/panel/urunler", icon: Package },
      { label: "Varyant Şablonları", href: "/panel/varyantlar", icon: Layers },
      { label: "AI Menü Tarama", href: "/panel/ai-tarama", icon: ScanLine, badge: "AI" },
      { label: "Menü Tasarımı", href: "/panel/menu-tasarimi", icon: Palette },
      { label: "Menü Bilgileri", href: "/panel/menu-bilgileri", icon: FileText },
      { label: "QR Kod Oluşturucu", href: "/panel/qr-kod", icon: QrCode },
    ],
  },
  {
    label: "Sipariş & Etkileşim",
    items: [
      { label: "Siparişler", href: "/panel/siparisler", icon: ShoppingBag },
      { label: "Garson Çağrıları", href: "/panel/garson-cagrilari", icon: BellRing },
      { label: "Geri Bildirimler", href: "/panel/geri-bildirimler", icon: MessageSquare },
      { label: "Masa Yönetimi", href: "/panel/masalar", icon: Table2 },
      { label: "Engellenenler", href: "/panel/engellenenler", icon: UserX },
    ],
  },
  {
    label: "Hesap & Ayarlar",
    items: [
      { label: "Genel Ayarlar", href: "/panel/genel-ayarlar", icon: Settings },
      { label: "Üyelik Paketim", href: "/panel/abonelik", icon: CreditCard },
      { label: "AI Görsel Kredisi", href: "/panel/ai-kredi", icon: Sparkles },
      { label: "Bildirim Ayarları", href: "/panel/bildirim-ayarlari", icon: Bell },
      { label: "Duyurular", href: "/panel/duyurular", icon: Megaphone },
    ],
  },
];

interface SidebarProps {
  businessName: string;
  businessSlug: string;
}

export function PanelSidebar({ businessName, businessSlug }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">Fizo QR</p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">{businessName}</p>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="px-3 pt-3 pb-2">
        <Link
          href="/panel"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/panel"
              ? "bg-brand-50 text-brand-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          Gösterge Paneli
        </Link>
      </div>

      {/* Menu Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-brand-600 text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        <Link
          href={`/menu/${businessSlug}`}
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-600 font-medium hover:bg-brand-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Menüyü Gör
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/giris" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
