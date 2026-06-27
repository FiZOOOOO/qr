"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, GripVertical, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  nameEn?: string;
  order: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", nameEn: "" });

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => { setEditing(null); setForm({ name: "", nameEn: "" }); setShowModal(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, nameEn: cat.nameEn ?? "" }); setShowModal(true); };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Kategori adı gerekli"); return; }
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing ? "Kategori güncellendi" : "Kategori eklendi");
        setShowModal(false);
        fetchCategories();
      }
    } catch { toast.error("Hata oluştu"); }
    finally { setSaving(false); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    toast.success("Kategori silindi");
    fetchCategories();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} kategori</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Kategori Ekle
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">Henüz kategori eklenmemiş</p>
          <Button onClick={openAdd}><Plus className="w-4 h-4" />İlk Kategoriyi Ekle</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-4">
              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  {cat.nameEn && <span className="text-gray-400 text-sm">({cat.nameEn})</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{cat._count?.products ?? 0} ürün</p>
              </div>
              <Badge variant={cat.isActive ? "success" : "default"}>
                {cat.isActive ? "Aktif" : "Pasif"}
              </Badge>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => toggleActive(cat.id, cat.isActive)}>
                  {cat.isActive ? "Durdur" : "Aktif Et"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteCategory(cat.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Kategoriyi Düzenle" : "Kategori Ekle"}
      >
        <div className="space-y-4">
          <Input
            id="catName"
            label="Kategori Adı (Türkçe)"
            placeholder="Örn: Ana Yemekler"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            id="catNameEn"
            label="Kategori Adı (İngilizce) — Opsiyonel"
            placeholder="Örn: Main Dishes"
            value={form.nameEn}
            onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
            <Button className="flex-1" loading={saving} onClick={save}>
              {editing ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
