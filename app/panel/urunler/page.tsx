"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Category { id: string; name: string; }
interface Product {
  id: string; name: string; nameEn?: string; description?: string;
  price: number; image?: string; calories?: number; allergens: string[];
  isActive: boolean; categoryId: string; category: { name: string };
}

const ALLERGENS = ["Glüten", "Yumurta", "Süt", "Soya", "Fıstık", "Balık", "Kabuklu Deniz Ürünleri", "Susam", "Hardal", "Kereviz", "Acı Bakla", "Yumuşakça"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [form, setForm] = useState({
    name: "", nameEn: "", description: "", price: "", categoryId: "",
    calories: "", allergens: [] as string[], ingredients: "",
  });

  const fetchAll = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
    setProducts(await pRes.json());
    setCategories(await cRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", nameEn: "", description: "", price: "", categoryId: categories[0]?.id ?? "", calories: "", allergens: [], ingredients: "" });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, nameEn: p.nameEn ?? "", description: p.description ?? "", price: p.price.toString(), categoryId: p.categoryId, calories: p.calories?.toString() ?? "", allergens: p.allergens, ingredients: "" });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name || !form.price || !form.categoryId) { toast.error("Ad, fiyat ve kategori zorunlu"); return; }
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), calories: form.calories ? parseInt(form.calories) : undefined }),
      });
      if (res.ok) { toast.success(editing ? "Ürün güncellendi" : "Ürün eklendi"); setShowModal(false); fetchAll(); }
    } catch { toast.error("Hata oluştu"); }
    finally { setSaving(false); }
  };

  const generateAI = async () => {
    if (!form.name) { toast.error("Önce ürün adını girin"); return; }
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/product-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, ingredients: form.ingredients }),
      });
      const data = await res.json();
      setForm((f) => ({
        ...f,
        description: data.description ?? f.description,
        calories: data.calories?.toString() ?? f.calories,
        allergens: data.allergens ?? f.allergens,
      }));
      toast.success("AI bilgileri dolduruldu");
    } catch { toast.error("AI hatası"); }
    finally { setAiLoading(false); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Ürünü silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Ürün silindi"); fetchAll();
  };

  const toggleAllergen = (a: string) =>
    setForm((f) => ({ ...f, allergens: f.allergens.includes(a) ? f.allergens.filter((x) => x !== a) : [...f.allergens, a] }));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} ürün</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4" />Ürün Ekle</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">{search || filterCat !== "all" ? "Ürün bulunamadı" : "Henüz ürün eklenmemiş"}</p>
          {!search && filterCat === "all" && <Button onClick={openAdd}><Plus className="w-4 h-4" />İlk Ürünü Ekle</Button>}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4">
              {p.image ? (
                <Image src={p.image} alt={p.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category.name} · {p.calories ? `${p.calories} kcal` : "Kalori yok"}</p>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(p.price)}</span>
              <Badge variant={p.isActive ? "success" : "default"}>{p.isActive ? "Aktif" : "Pasif"}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Ürünü Düzenle" : "Ürün Ekle"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="pName" label="Ürün Adı (TR)*" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input id="pNameEn" label="Ürün Adı (EN)" value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="pPrice" label="Fiyat (₺)*" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori*</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Ürün açıklaması..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="pCal" label="Kalori (kcal)" type="number" value={form.calories} onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))} />
            <Input id="pIng" label="İçerikler (AI için)" placeholder="Un, yumurta, süt..." value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Alerjenler</label>
              <Button size="sm" variant="secondary" loading={aiLoading} onClick={generateAI}>
                <Sparkles className="w-3.5 h-3.5" />
                AI ile Doldur
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    form.allergens.includes(a)
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-brand-300"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
            <Button className="flex-1" loading={saving} onClick={save}>{editing ? "Güncelle" : "Ekle"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
