import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BayiSidebar } from "@/components/bayi/sidebar";

export default async function BayiLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { dealer: true },
  });

  if (!user || user.role !== "DEALER") redirect("/giris");

  return (
    <div className="min-h-screen bg-gray-50">
      <BayiSidebar name={user.name} />
      <div className="pl-60 min-h-screen flex flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
