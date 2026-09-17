import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestFlow } from "@/components/test/TestFlow";
import { SiteHeader } from "@/components/chrome/SiteHeader";

export const metadata = {
  title: "آزمون",
};

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const auth = await getSession();
  if (!auth) redirect("/auth/login");

  const { slug } = await params;
  const { session: sessionId } = await searchParams;

  const test = await prisma.test.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { score: "asc" } } },
      },
    },
  });

  if (!test) notFound();

  let testSession = sessionId
    ? await prisma.testSession.findFirst({
        where: { id: sessionId, userId: auth.userId, testId: test.id },
        include: { answers: true },
      })
    : null;

  if (!testSession) {
    testSession = await prisma.testSession.findFirst({
      where: {
        userId: auth.userId,
        testId: test.id,
        status: "in_progress",
      },
      include: { answers: true },
    });
  }

  if (!testSession) {
    testSession = await prisma.testSession.create({
      data: {
        userId: auth.userId,
        testId: test.id,
        status: "in_progress",
      },
      include: { answers: true },
    });
  }

  if (testSession.status === "completed") {
    redirect(`/result/${testSession.id}`);
  }

  const initialAnswers = Object.fromEntries(
    testSession.answers.map((a) => [a.questionId, a.optionId])
  );

  return (
    <div className="page-shell soft-glow min-h-screen">
      <SiteHeader loggedIn compact />
      <main className="px-4 py-8">
        <TestFlow
          sessionId={testSession.id}
          slug={test.slug}
          title={test.title}
          questions={test.questions.filter((q) => q.perspective === "self")}
          initialAnswers={initialAnswers}
        />
      </main>
    </div>
  );
}
