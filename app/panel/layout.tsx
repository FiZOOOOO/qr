import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PanelSidebar } from "@/components/panel/sidebar";
import { PanelHeader } from "@/components/panel/header";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || user.role === "DEALER" || user.role === "SUPER_ADMIN") {
    redirect("/giris");
  }

  if (!user.business) redirect("/kurulum");

  return (
    <div className="min-h-screen bg-gray-50">
      <PanelSidebar
        businessName={user.business.name}
        businessSlug={user.business.slug}
      />
      <div className="pl-64 min-h-screen flex flex-col">
        <PanelHeader userName={user.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
