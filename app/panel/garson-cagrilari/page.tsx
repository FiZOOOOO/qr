"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellRing, CheckCircle, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface WaiterCall {
  id: string; status: "PENDING" | "ANSWERED"; createdAt: string;
  table?: { number: number } | null;
}

export default function WaiterCallsPage() {
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    const res = await fetch("/api/waiter-calls");
    setCalls(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 5000);
    return () => clearInterval(interval);
  }, [fetchCalls]);

  const answer = async (id: string) => {
    await fetch(`/api/waiter-calls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ANSWERED" }),
    });
    toast.success("Çağrı yanıtlandı olarak işaretlendi");
    fetchCalls();
  };

  const pending = calls.filter((c) => c.status === "PENDING");
  const answered = calls.filter((c) => c.status === "ANSWERED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Garson Çağrıları</h1>
          {pending.length > 0 && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {pending.length} bekleyen çağrı!
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={fetchCalls}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : calls.length === 0 ? (
        <div className="text-center py-20">
          <BellRing className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Bekleyen garson çağrısı yok</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Bekleyen ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((call) => (
                  <div key={call.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <BellRing className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="font-bold text-gray-900 text-lg">{call.table ? `Masa ${call.table.number}` : "Bilinmeyen"}</span>
                        <Badge variant="danger">Bekliyor</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(call.createdAt)}</p>
                    </div>
                    <Button onClick={() => answer(call.id)} size="sm">
                      <CheckCircle className="w-4 h-4" />
                      Yanıtla
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {answered.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-3">Yanıtlanan ({answered.length})</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {answered.slice(0, 20).map((call) => (
                  <div key={call.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-gray-700">{call.table ? `Masa ${call.table.number}` : "Bilinmeyen"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">{formatDate(call.createdAt)}</span>
                      <Badge variant="success">Yanıtlandı</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
