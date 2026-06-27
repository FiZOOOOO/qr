import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { UserX } from "lucide-react";

export default async function BlockedPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");
  const business = await prisma.business.findUnique({ where: { userId: session.user.id } });
  if (!business) redirect("/panel");

  const blocked = await prisma.feedback.findMany({
    where: { businessId: business.id, isBlocked: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Engellenenler</h1>
        <p className="text-gray-500 text-sm mt-1">Geri bildirim yazmaktan engellenen kullanıcılar</p>
      </div>

      {blocked.length === 0 ? (
        <div className="text-center py-20">
          <UserX className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Engellenmiş kullanıcı yok</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {blocked.map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-4">
              <UserX className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{b.clientIp ?? "Bilinmeyen IP"}</p>
                {b.comment && <p className="text-xs text-gray-500 mt-0.5">&quot;{b.comment}&quot;</p>}
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(b.createdAt)}</p>
              </div>
              <form action={`/api/feedbacks/${b.id}/unblock`} method="POST">
                <button type="submit" className="text-xs text-brand-600 hover:text-brand-700 underline">
                  Engeli Kaldır
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
