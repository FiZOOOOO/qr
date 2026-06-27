"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MenuInfoPage() {
  const [form, setForm] = useState({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => {
      setForm({ name: d.businessName ?? "", slug: d.businessSlug ?? "" });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Menü bilgileri güncellendi");
      else toast.error("Hata oluştu");
    } catch { toast.error("Hata oluştu"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menü Bilgileri</h1>
        <p className="text-gray-500 text-sm mt-1">İşletme adı ve menü URL&apos;sini yönetin</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Input
          id="bizName"
          label="İşletme Adı"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <div>
          <Input
            id="bizSlug"
            label="Menü URL'si"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
          />
          <p className="text-xs text-gray-400 mt-1">
            Menü linkiniz: <span className="text-brand-600">fizoqur.com/menu/{form.slug}</span>
          </p>
        </div>
        <Button onClick={save} loading={saving}>Kaydet</Button>
      </div>
    </div>
  );
}
