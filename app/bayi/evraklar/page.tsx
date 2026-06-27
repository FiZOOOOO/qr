"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, FileCheck, Clock, XCircle } from "lucide-react";

const docs = [
  { key: "identity", label: "Kimlik Fotokopisi", desc: "T.C. kimlik kartı veya pasaport" },
  { key: "tax", label: "Vergi Levhası", desc: "Güncel vergi levhası" },
  { key: "signature", label: "İmza Sirküleri", desc: "Noter tasdikli imza sirküleri" },
  { key: "bank", label: "Banka IBAN Belgesi", desc: "IBAN bilgilerini içeren belge" },
];

export default function EvraklarPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const upload = async (key: string, file: File) => {
    setUploading(key);
    await new Promise((r) => setTimeout(r, 1500));
    setUploaded((u) => ({ ...u, [key]: true }));
    setUploading(null);
    toast.success("Evrak yüklendi, incelemeye alındı");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evrak Yönetimi</h1>
        <p className="text-gray-500 text-sm mt-1">Bayilik sözleşmesi için gerekli evrakları yükleyin</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        Tüm evraklar yüklendikten sonra ekibimiz 1-2 iş günü içinde inceleyerek size bilgi verecektir.
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.key} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{doc.label}</p>
                  {uploaded[doc.key] ? (
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> İncelemede
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{doc.desc}</p>
              </div>
              <label className="shrink-0">
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => e.target.files?.[0] && upload(doc.key, e.target.files[0])}
                />
                <Button
                  size="sm"
                  variant={uploaded[doc.key] ? "outline" : "primary"}
                  loading={uploading === doc.key}
                  onClick={(e) => e.currentTarget.parentElement?.querySelector("input")?.click()}
                >
                  {uploaded[doc.key] ? (
                    <><FileCheck className="w-4 h-4 mr-1" /> Tekrar Yükle</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-1" /> Yükle</>
                  )}
                </Button>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
