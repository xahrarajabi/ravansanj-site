import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { GrowthPathPayload } from "@/lib/report-builder";
import { upsertGrowthPathReport } from "@/lib/report-persist";
import { GrowthPlan30 } from "@/components/report/GrowthPlan30";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "مسیر رشد ۳۰ روزه" };

export default async function GrowthPathPage({
  searchParams,
}: {
  searchParams: Promise<{ pay?: string }>;
}) {
  const auth = await getSession();
  if (!auth) redirect("/auth/login");
  const { pay } = await searchParams;

  const unlock = await prisma.contentUnlock.findUnique({
    where: {
      userId_key: { userId: auth.userId, key: "growth_path" },
    },
  });

  if (!unlock) {
    return (
      <div className="min-h-screen bg-bg">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
            <Logo />
            <Link href="/dashboard" className="text-sm font-bold text-primary">
              داشبورد
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-4 py-8">
          <Card className="p-6 md:p-8">
            <h1 className="mb-2 text-xl font-extrabold text-text">
              مسیر رشد ۳۰ روزه
            </h1>
            <p className="mb-6 text-sm leading-7 text-text-secondary">
              این بسته قفل است. با خرید «بسته مسیر رشد ۳۰ روزه» برنامه تمرینی روزانه
              بر اساس نتایج آزمون‌های شما فعال می‌شود.
            </p>
            <Link href="/pricing?product=growth-path">
              <Button className="w-full" size="lg">
                مشاهده بسته‌ها
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const report = await upsertGrowthPathReport(auth.userId);
  let payload: GrowthPathPayload;
  try {
    payload = JSON.parse(report.payloadJson) as GrowthPathPayload;
  } catch {
    payload = {
      generatedAt: new Date().toISOString(),
      plan30: [],
      sourceTests: [],
      focusTraits: [],
    };
  }

  const dateLabel = new Date(payload.generatedAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
          <Logo />
          <Link href="/dashboard" className="text-sm font-bold text-primary">
            داشبورد
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-8">
        <Card className="p-6 md:p-8">
          {pay === "ok" ? (
            <p className="mb-4 rounded-xl bg-primary/10 p-3 text-sm text-primary">
              پرداخت موفق بود. مسیر رشد شما فعال است.
            </p>
          ) : null}
          <p className="mb-1 text-xs font-semibold text-primary">مسیر رشد</p>
          <h1 className="mb-2 text-xl font-extrabold text-text">
            برنامه ۳۰ روزه شخصی‌سازی‌شده
          </h1>
          <p className="mb-2 text-xs text-gray-400">به‌روزرسانی: {dateLabel}</p>
          {payload.sourceTests.length ? (
            <p className="mb-4 text-sm leading-7 text-text-secondary">
              بر اساس نتایج: {payload.sourceTests.join("، ")}
            </p>
          ) : (
            <p className="mb-4 text-sm leading-7 text-text-secondary">
              هنوز آزمون تکمیل‌شده‌ای ندارید. پس از انجام آزمون، این برنامه غنی‌تر
              می‌شود.
            </p>
          )}

          {payload.focusTraits.length ? (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-extrabold text-text">
                تمرکز این ماه
              </h2>
              <div className="flex flex-wrap gap-2">
                {payload.focusTraits.map((t) => (
                  <span
                    key={t.key}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900"
                  >
                    {t.label} · {t.score}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <GrowthPlan30 plan30={payload.plan30} />

          <div className="flex flex-col gap-2">
            <Link href="/reports">
              <Button variant="secondary" className="w-full">
                گزارش‌ها
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
