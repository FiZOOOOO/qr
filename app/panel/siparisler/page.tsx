"use client";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingBag, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OrderItem { id: string; quantity: number; price: number; product: { name: string }; notes?: string; }
interface Order {
  id: string; orderNumber: string; status: string; total: number;
  note?: string; createdAt: string; updatedAt: string;
  table?: { number: number } | null; items: OrderItem[];
}

const STATUS_FLOW: Record<string, string> = {
  PENDING: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PREPARING: "Hazırlanıyor",
  READY: "Hazır",
  DELIVERED: "Teslim",
  CANCELLED: "İptal",
};

const STATUS_VARIANTS: Record<string, "warning" | "info" | "success" | "default" | "danger"> = {
  PENDING: "warning",
  PREPARING: "info",
  READY: "success",
  DELIVERED: "default",
  CANCELLED: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ACTIVE");

  const fetchOrders = useCallback(async () => {
    const res = await fetch(`/api/orders?filter=${filter}`);
    setOrders(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast.success("Sipariş durumu güncellendi");
    fetchOrders();
  };

  const tabs = [
    { key: "ACTIVE", label: "Aktif" },
    { key: "ALL", label: "Tümü" },
    { key: "DELIVERED", label: "Teslim" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
        <Button variant="ghost" size="sm" onClick={fetchOrders}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              filter === t.key
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Sipariş bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{order.orderNumber}</span>
                    {order.table && (
                      <span className="text-sm text-gray-500">· Masa {order.table.number}</span>
                    )}
                    <Badge variant={STATUS_VARIANTS[order.status]}>
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</span>
              </div>

              <div className="space-y-1 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.product.name}
                      {item.notes && <span className="text-gray-400 ml-1">({item.notes})</span>}
                    </span>
                    <span className="text-gray-500">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {order.note && (
                <p className="text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-lg mb-4">
                  Not: {order.note}
                </p>
              )}

              {STATUS_FLOW[order.status] && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, STATUS_FLOW[order.status])}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {order.status === "PENDING" ? "Hazırlamaya Başla"
                      : order.status === "PREPARING" ? "Hazır İşaretle"
                      : "Teslim Et"}
                  </Button>
                  {order.status === "PENDING" && (
                    <Button size="sm" variant="danger" onClick={() => updateStatus(order.id, "CANCELLED")}>
                      İptal Et
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
