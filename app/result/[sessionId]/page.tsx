import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  ComprehensivePayload,
  DetailedPayload,
  InitialPayload,
} from "@/lib/report-builder";
import { buildInitialPayload } from "@/lib/report-builder";
import type { ScoredResult } from "@/lib/scoring";
import { ReportViewer } from "@/components/report/ReportViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "نتیجه آزمون",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const auth = await getSession();
  if (!auth) redirect("/auth/login");

  const { sessionId } = await params;
  const testSession = await prisma.testSession.findFirst({
    where: { id: sessionId, userId: auth.userId },
    include: { test: true },
  });

  if (!testSession) notFound();
  if (testSession.status !== "completed" || !testSession.resultJson) {
    redirect(`/test/${testSession.test.slug}?session=${testSession.id}`);
  }

  const initialReport = await prisma.report.findFirst({
    where: { sessionId, userId: auth.userId, type: "initial" },
    orderBy: { createdAt: "desc" },
  });

  if (initialReport) {
    redirect(`/reports/${initialReport.id}`);
  }

  // Fallback if report row missing (legacy sessions)
  let payload: InitialPayload | DetailedPayload | ComprehensivePayload;
  try {
    const scored = JSON.parse(testSession.resultJson) as ScoredResult;
    const parsed = JSON.parse(testSession.resultJson);
    if (parsed.traits?.[0]?.band) {
      payload = parsed as InitialPayload;
    } else {
      payload = buildInitialPayload(scored, testSession.test.category);
    }
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center px-4">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-8">
        <Card className="p-6 md:p-8">
          <ReportViewer
            type="initial"
            title={testSession.test.title}
            payload={payload}
            showUpgrade
          />
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/reports">
              <Button variant="secondary" className="w-full">
                همه گزارش‌ها
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                بازگشت به داشبورد
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
