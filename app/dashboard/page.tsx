import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = { title: "داشبورد" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.onboardedAt) redirect("/onboarding");

  const tests = await prisma.test.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      questions: { where: { perspective: "self" }, select: { id: true } },
    },
    orderBy: { title: "asc" },
  });

  const sessions = await prisma.testSession.findMany({
    where: { userId: session.userId },
    include: {
      test: { select: { slug: true, title: true, description: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { startedAt: "desc" },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DashboardClient
      name={user.name}
      phone={session.phone}
      tests={tests.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        description: t.description,
        category: t.category,
        questionCount: t.questions.length,
      }))}
      sessions={sessions.map((s) => ({
        id: s.id,
        status: s.status,
        answerCount: s._count.answers,
        completedAt: s.completedAt?.toISOString() ?? null,
        startedAt: s.startedAt.toISOString(),
        test: s.test,
      }))}
      notifications={notifications}
      unread={unread}
    />
  );
}
