import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitesClient } from "@/components/invites/InvitesClient";

export const metadata = { title: "دعوت ۳۶۰" };

export default async function InvitesPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const tests = await prisma.test.findMany({
    where: { questions: { some: { perspective: "other" } } },
    select: { slug: true, title: true },
  });

  return (
    <div className="min-h-screen bg-bg">
      <InvitesClient tests={tests.length ? tests : [{ slug: "relationship-style", title: "سبک روابط" }]} />
    </div>
  );
}
