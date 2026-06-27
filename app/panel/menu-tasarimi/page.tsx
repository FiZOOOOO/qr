"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Palette } from "lucide-react";

const LAYOUTS = [
  { key: "grid", label: "Yan Yana", desc: "2 sütun, görselli" },
  { key: "list", label: "Alt Alta", desc: "Tek sütun, detaylı" },
  { key: "noimage", label: "Resimsiz Liste", desc: "Minimal görünüm" },
];

export default function MenuDesignPage() {
  const [color, setColor] = useState("#7C3AED");
  const [layout, setLayout] = useState("grid");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d.primaryColor) setColor(d.primaryColor);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor: color, menuLayout: layout }),
      });
      if (res.ok) toast.success("Tasarım kaydedildi");
    } catch { toast.error("Hata"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menü Tasarımı</h1>
        <p className="text-gray-500 text-sm mt-1">Müşterilerinizin gördüğü menünün görünümünü özelleştirin</p>
      </div>

      {/* Color */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Renk Teması
        </h2>
        <div className="flex items-center gap-6">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-16 rounded-xl border border-gray-300 cursor-pointer"
          />
          <div>
            <p className="font-medium text-gray-900">{color}</p>
            <p className="text-sm text-gray-500">Menü başlıkları, butonlar ve vurgular</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {["#7C3AED", "#2563EB", "#059669", "#DC2626", "#D97706", "#EC4899"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Ürün Listeleme Görünümü</h2>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLayout(l.key)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${layout === l.key ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className={`font-medium text-sm ${layout === l.key ? "text-brand-700" : "text-gray-900"}`}>{l.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Önizleme</h2>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="h-12 flex items-center px-4 text-white text-sm font-semibold" style={{ backgroundColor: color }}>
            Fizo QR Menü
          </div>
          <div className="p-4 bg-gray-50">
            <div className={`grid gap-3 ${layout === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
              {["Kasap Burger", "Patates Kızartması"].map((item) => (
                <div key={item} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
                  {layout !== "noimage" && (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{item}</p>
                    <p className="text-xs font-bold" style={{ color }}>₺220</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={save} loading={saving} size="lg">Tasarımı Kaydet</Button>
    </div>
  );
}
