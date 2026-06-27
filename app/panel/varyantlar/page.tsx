"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, Layers, X } from "lucide-react";
import { toast } from "sonner";

interface VariantOption { name: string; price: number; }
interface VariantTemplate { id: string; name: string; required: boolean; multiple: boolean; options: VariantOption[]; }

export default function VariantsPage() {
  const [templates, setTemplates] = useState<VariantTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", required: false, multiple: false,
    options: [{ name: "", price: 0 }] as VariantOption[],
  });

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/variants");
    setTemplates(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const addOption = () => setForm((f) => ({ ...f, options: [...f.options, { name: "", price: 0 }] }));
  const removeOption = (i: number) => setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  const setOption = (i: number, key: "name" | "price", val: string | number) =>
    setForm((f) => ({ ...f, options: f.options.map((o, idx) => idx === i ? { ...o, [key]: val } : o) }));

  const save = async () => {
    if (!form.name.trim()) { toast.error("Şablon adı gerekli"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("Şablon eklendi"); setShowModal(false); fetchTemplates(); }
    } catch { toast.error("Hata"); }
    finally { setSaving(false); }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Şablonu silmek istiyor musunuz?")) return;
    await fetch(`/api/variants/${id}`, { method: "DELETE" });
    toast.success("Silindi"); fetchTemplates();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Varyant Şablonları</h1>
        <Button onClick={() => { setForm({ name: "", required: false, multiple: false, options: [{ name: "", price: 0 }] }); setShowModal(true); }}>
          <Plus className="w-4 h-4" />Şablon Ekle
        </Button>
      </div>
      <p className="text-gray-500 text-sm -mt-4">Boyut, sos seçimi gibi seçenekleri şablon olarak oluşturun, ürünlere atayın.</p>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20">
          <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">Henüz varyant şablonu eklenmemiş</p>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-xs text-gray-400">
                    {t.required ? "Zorunlu" : "Opsiyonel"} · {t.multiple ? "Çoklu seçim" : "Tek seçim"}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteTemplate(t.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.options.map((o, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg">
                    {o.name}{o.price > 0 ? ` (+${o.price}₺)` : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Varyant Şablonu Ekle" size="md">
        <div className="space-y-4">
          <Input id="vName" label="Şablon Adı" placeholder="Boyut Seçimi, Sos Seçimi..." value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.required} onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))} className="rounded" />
              Zorunlu
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.multiple} onChange={(e) => setForm((f) => ({ ...f, multiple: e.target.checked }))} className="rounded" />
              Çoklu Seçim
            </label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Seçenekler</label>
              <Button size="sm" variant="ghost" onClick={addOption}><Plus className="w-3.5 h-3.5" />Seçenek Ekle</Button>
            </div>
            <div className="space-y-2">
              {form.options.map((o, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={o.name}
                    onChange={(e) => setOption(i, "name", e.target.value)}
                    placeholder="Seçenek adı"
                    className="flex-1 h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    value={o.price}
                    onChange={(e) => setOption(i, "price", parseFloat(e.target.value) || 0)}
                    placeholder="+Fiyat"
                    className="w-24 h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {form.options.length > 1 && (
                    <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
            <Button className="flex-1" loading={saving} onClick={save}>Ekle</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
