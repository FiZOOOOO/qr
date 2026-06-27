"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Announcement { id: string; title: string; content?: string; isActive: boolean; createdAt: string; }

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/announcements");
    setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditing(null); setForm({ title: "", content: "" }); setShowModal(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setForm({ title: a.title, content: a.content ?? "" }); setShowModal(true); };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Başlık gerekli"); return; }
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/announcements/${editing.id}` : "/api/announcements", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success(editing ? "Güncellendi" : "Duyuru eklendi"); setShowModal(false); fetchItems(); }
    } catch { toast.error("Hata"); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Duyuruyu silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    toast.success("Silindi"); fetchItems();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4" />Duyuru Ekle</Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">Henüz duyuru eklenmemiş</p>
          <Button onClick={openAdd}><Plus className="w-4 h-4" />İlk Duyuruyu Ekle</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {items.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{a.title}</p>
                {a.content && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{a.content}</p>}
                <p className="text-xs text-gray-400 mt-1">{formatDate(a.createdAt)}</p>
              </div>
              <Badge variant={a.isActive ? "success" : "default"}>{a.isActive ? "Aktif" : "Pasif"}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => toggleActive(a.id, a.isActive)}>
                  {a.isActive ? "Durdur" : "Aktif Et"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(a)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteItem(a.id)}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Duyuruyu Düzenle" : "Duyuru Ekle"}>
        <div className="space-y-4">
          <Input id="annTitle" label="Başlık" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (opsiyonel)</label>
            <textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
