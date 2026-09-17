import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  ComprehensivePayload,
  DetailedPayload,
  InitialPayload,
} from "@/lib/report-builder";
import { canAccessReport, unlockKeyForReportType } from "@/lib/access";
import { ReportViewer } from "@/components/report/ReportViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "مشاهده گزارش" };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const auth = await getSession();
  if (!auth) redirect("/auth/login");

  const { reportId } = await params;
  const report = await prisma.report.findFirst({
    where: { id: reportId, userId: auth.userId },
  });

  if (!report) notFound();

  const allowed = await canAccessReport(auth.userId, report);
  if (!allowed) {
    const unlock = unlockKeyForReportType(report.type);
    const product =
      unlock === "growth_path" ? "growth-path" : "comprehensive-report";
    redirect(`/pricing?product=${product}&from=${report.id}`);
  }

  let payload: InitialPayload | DetailedPayload | ComprehensivePayload;
  try {
    payload = JSON.parse(report.payloadJson);
  } catch {
    notFound();
  }

  const dateLabel = new Date(report.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
          <Logo />
          <Link href="/reports" className="text-sm font-bold text-primary">
            همه گزارش‌ها
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-8">
        <Card className="p-6 md:p-8">
          <ReportViewer
            type={report.type}
            title={report.title}
            payload={payload}
            dateLabel={dateLabel}
            showUpgrade={report.type !== "comprehensive"}
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
