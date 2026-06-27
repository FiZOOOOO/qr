"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export default function NotificationSettingsPage() {
  const [telegram, setTelegram] = useState("");
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({
    newOrder: true,
    waiterCall: true,
    feedback: false,
  });

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Bildirim ayarları kaydedildi");
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bildirim Ayarları</h1>
        <p className="text-gray-500 text-sm mt-1">Sipariş ve garson çağrısı bildirimlerini yapılandırın</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Telegram Bildirimleri
        </h2>
        <Input
          id="telegramId"
          label="Telegram Chat ID veya Bot Token"
          placeholder="@kullaniciadiniz veya chat ID"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />
        <p className="text-xs text-gray-400">
          @FizoQRBot&apos;u Telegram&apos;dan açın ve /start yazın, chat ID&apos;nizi alın.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Hangi Bildirimleri Alayım?</h2>
        {[
          { key: "newOrder" as const, label: "Yeni sipariş geldiğinde", desc: "Masadan sipariş alındığında bildirim" },
          { key: "waiterCall" as const, label: "Garson çağrısında", desc: "Müşteri garson çağırdığında bildirim" },
          { key: "feedback" as const, label: "Yeni geri bildirimde", desc: "Müşteri yorum bıraktığında bildirim" },
        ].map(({ key, label, desc }) => (
          <label key={key} className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
              className={`mt-0.5 relative w-11 h-6 rounded-full transition-colors shrink-0 ${notifs[key] ? "bg-brand-600" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[key] ? "translate-x-5" : ""}`} />
            </button>
          </label>
        ))}
      </div>

      <Button onClick={save} loading={saving} size="lg">Kaydet</Button>
    </div>
  );
}
