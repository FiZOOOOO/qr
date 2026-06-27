"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Plus, QrCode, Trash2, RefreshCw, Table2 } from "lucide-react";
import { toast } from "sonner";

interface Table {
  id: string;
  number: number;
  status: "EMPTY" | "OCCUPIED";
  capacity: number;
  qrCode?: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ number: "", capacity: "4" });

  const fetchTables = useCallback(async () => {
    const res = await fetch("/api/tables");
    const data = await res.json();
    setTables(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  const addTable = async () => {
    if (!form.number.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: parseInt(form.number), capacity: parseInt(form.capacity) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Masa eklendi");
        setShowModal(false);
        setForm({ number: "", capacity: "4" });
        fetchTables();
      } else {
        toast.error(data.error ?? "Hata oluştu");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setAdding(false);
    }
  };

  const deleteTable = async (id: string) => {
    if (!confirm("Bu masayı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    toast.success("Masa silindi");
    fetchTables();
  };

  const toggleStatus = async (id: string, current: "EMPTY" | "OCCUPIED") => {
    await fetch(`/api/tables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: current === "EMPTY" ? "OCCUPIED" : "EMPTY" }),
    });
    fetchTables();
  };

  const emptyCount = tables.filter((t) => t.status === "EMPTY").length;
  const occupiedCount = tables.filter((t) => t.status === "OCCUPIED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Masa Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">
            {emptyCount} boş · {occupiedCount} dolu · {tables.length} toplam
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchTables}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Masa Ekle
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{tables.length}</p>
          <p className="text-sm text-gray-500">Toplam Masa</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{emptyCount}</p>
          <p className="text-sm text-green-600">Boş Masa</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{occupiedCount}</p>
          <p className="text-sm text-red-600">Dolu Masa</p>
        </div>
      </div>

      {/* Tables grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-20">
          <Table2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Henüz masa eklenmemiş</p>
          <Button className="mt-4" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            İlk Masayı Ekle
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`rounded-xl border-2 p-5 transition-all ${
                table.status === "EMPTY"
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Masa {table.number}</h3>
                  <p className="text-xs text-gray-500">{table.capacity} kişilik</p>
                </div>
                <Badge variant={table.status === "EMPTY" ? "success" : "danger"}>
                  {table.status === "EMPTY" ? "Boş" : "Dolu"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant={table.status === "EMPTY" ? "danger" : "secondary"}
                  className="flex-1 text-xs"
                  onClick={() => toggleStatus(table.id, table.status)}
                >
                  {table.status === "EMPTY" ? "Dolu İşaretle" : "Boş İşaretle"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTable(table.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Masa Ekle">
        <div className="space-y-4">
          <Input
            id="tableNumber"
            label="Masa Numarası"
            type="number"
            placeholder="Örn: 1, 2, 3..."
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && addTable()}
          />
          <Input
            id="tableCapacity"
            label="Kapasite (Kişi sayısı)"
            type="number"
            min="1"
            max="50"
            value={form.capacity}
            onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              İptal
            </Button>
            <Button className="flex-1" loading={adding} onClick={addTable}>
              Ekle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
