"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, Upload, Link, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface ScannedItem { name: string; price: number; category: string; description?: string; }

export default function AIScanPage() {
  const [mode, setMode] = useState<"image" | "link">("image");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScannedItem[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const scan = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === "image" && file) {
        const fd = new FormData();
        fd.append("image", file);
        res = await fetch("/api/ai/scan-menu", { method: "POST", body: fd });
      } else if (mode === "link" && url) {
        res = await fetch("/api/ai/scan-menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } else {
        toast.error("Lütfen fotoğraf veya link girin");
        setLoading(false);
        return;
      }
      const data = await res!.json();
      if (data.items) setResults(data.items);
      else toast.error("Menü taranamadı");
    } catch { toast.error("Hata oluştu"); }
    finally { setLoading(false); }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/ai/import-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: results }),
      });
      const data = await res.json();
      toast.success(`${data.count} ürün menünüze eklendi`);
      setResults([]);
    } catch { toast.error("Hata oluştu"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Menü Tarama</h1>
        <p className="text-gray-500 text-sm mt-1">Kağıt menünüzü veya link üzerinden menünüzü taratın</p>
      </div>

      {/* Mode selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("image")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${mode === "image" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <Upload className="w-4 h-4" />
            Fotoğraf Yükle
          </button>
          <button
            onClick={() => setMode("link")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${mode === "link" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <Link className="w-4 h-4" />
            Link ile Aktar
          </button>
        </div>

        {mode === "image" ? (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              {file ? (
                <p className="text-sm font-medium text-brand-600">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">Fotoğraf seçmek için tıklayın</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP desteklenir</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              id="menuUrl"
              label="Menü Linki"
              placeholder="https://getir.com/restaurant/... veya başka bir QR menü linki"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-gray-400">Getir, Trendyol Yemek ve diğer platformlardan link yapıştırabilirsiniz</p>
          </div>
        )}

        <Button onClick={scan} loading={loading} className="w-full">
          <ScanLine className="w-4 h-4" />
          {loading ? "Taranıyor..." : "AI ile Tara"}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h2 className="font-semibold text-gray-900">{results.length} ürün bulundu</h2>
            </div>
            <Button onClick={saveAll} loading={saving}>
              <CheckCircle className="w-4 h-4" />
              Tümünü Ekle
            </Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.category}</p>
                </div>
                <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
