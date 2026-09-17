import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = { title: "تنظیمات" };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const payments = await prisma.payment.findMany({
    where: { userId: session.userId },
    include: { product: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  const gifts = await prisma.giftCode.findMany({
    where: { ownerId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-bg">
      <Suspense>
        <SettingsClient
          name={user?.name || null}
          email={user?.email || null}
          payments={payments}
          gifts={gifts}
        />
      </Suspense>
    </div>
  );
}
