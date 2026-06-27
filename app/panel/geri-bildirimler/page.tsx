"use client";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Ban } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Feedback { id: string; rating: number; comment?: string; createdAt: string; isBlocked: boolean; tableId?: string; }

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    const res = await fetch("/api/feedbacks");
    setFeedbacks(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  const toggleBlock = async (id: string, current: boolean) => {
    await fetch(`/api/feedbacks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !current }),
    });
    toast.success(current ? "Engel kaldırıldı" : "Engellendi");
    fetchFeedbacks();
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : "–";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geri Bildirimler</h1>
          <p className="text-gray-500 text-sm mt-1">Ortalama puan: {avgRating} · {feedbacks.length} yorum</p>
        </div>
      </div>

      {/* Rating summary */}
      <div className="grid grid-cols-5 gap-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = feedbacks.filter((f) => f.rating === star).length;
          const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
          return (
            <div key={star} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl mb-1">{"★".repeat(star)}</div>
              <p className="text-lg font-bold text-gray-900">{count}</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Henüz geri bildirim yok</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {feedbacks.map((f) => (
            <div key={f.id} className={`px-5 py-4 ${f.isBlocked ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
                    <span className="text-xs text-gray-400">{formatDate(f.createdAt)}</span>
                    {f.isBlocked && <Badge variant="danger">Engellenmiş</Badge>}
                  </div>
                  {f.comment && <p className="text-sm text-gray-700">{f.comment}</p>}
                </div>
                <Button
                  size="sm"
                  variant={f.isBlocked ? "secondary" : "ghost"}
                  onClick={() => toggleBlock(f.id, f.isBlocked)}
                >
                  <Ban className="w-3.5 h-3.5" />
                  {f.isBlocked ? "Engeli Kaldır" : "Engelle"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
