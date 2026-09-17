import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REPORT_TYPE_LABELS } from "@/lib/report-builder";
import {
  isReportEntitled,
  syncUnlocksForUser,
  UNLOCK_KEYS,
  userUnlockKeys,
} from "@/lib/access";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "گزارش‌ها" };

const TYPE_ORDER: Record<string, number> = {
  initial: 1,
  detailed: 2,
  comprehensive: 3,
  growth_path: 4,
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ pay?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const { pay } = await searchParams;
  const unlockKeys = await userUnlockKeys(session.userId);

  if (unlockKeys.has(UNLOCK_KEYS.comprehensive)) {
    await syncUnlocksForUser(session.userId, UNLOCK_KEYS.comprehensive);
  }
  if (unlockKeys.has(UNLOCK_KEYS.growthPath)) {
    await syncUnlocksForUser(session.userId, UNLOCK_KEYS.growthPath);
  }

  const reports = await prisma.report.findMany({
    where: { userId: session.userId },
    include: {
      session: {
        include: { test: { select: { id: true, slug: true, title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const latestSessionByTest = new Map<string, string>();
  for (const r of reports) {
    if (!r.sessionId || !r.session?.test) continue;
    const testId = r.session.test.id;
    if (!latestSessionByTest.has(testId)) {
      latestSessionByTest.set(testId, r.sessionId);
    }
  }

  const seenType = new Set<string>();
  const filtered = reports.filter((r) => {
    if (r.type === "growth_path") {
      const key = "growth_path";
      if (seenType.has(key)) return false;
      seenType.add(key);
      return true;
    }
    if (!r.sessionId || !r.session?.test) return false;
    if (latestSessionByTest.get(r.session.test.id) !== r.sessionId) return false;
    const key = `${r.sessionId}:${r.type}`;
    if (seenType.has(key)) return false;
    seenType.add(key);
    return true;
  });

  const groups = new Map<
    string,
    { label: string; createdAt: Date; items: typeof filtered }
  >();

  for (const r of filtered) {
    const groupKey = r.sessionId || `type:${r.type}`;
    if (!groups.has(groupKey)) {
      const label =
        r.type === "growth_path"
          ? "مسیر رشد"
          : r.session?.test.title ||
            r.title.replace(/^گزارش (اولیه|تفصیلی|جامع) — /, "");
      groups.set(groupKey, {
        label,
        createdAt: r.createdAt,
        items: [],
      });
    }
    groups.get(groupKey)!.items.push(r);
  }

  for (const g of groups.values()) {
    g.items.sort(
      (a, b) => (TYPE_ORDER[a.type] || 99) - (TYPE_ORDER[b.type] || 99)
    );
  }

  const groupList = [...groups.entries()].sort(
    (a, b) => b[1].createdAt.getTime() - a[1].createdAt.getTime()
  );

  const ownsComprehensive = unlockKeys.has(UNLOCK_KEYS.comprehensive);

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-bg px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/growth-path" className="text-sm text-primary">
            مسیر رشد
          </Link>
          <Link href="/dashboard" className="text-sm text-primary">
            داشبورد
          </Link>
        </div>
      </div>
      <h1 className="mb-4 text-xl font-extrabold">گزارش‌های من</h1>
      {pay === "ok" ? (
        <Card className="mb-4 bg-primary/10 p-4 text-sm text-primary">
          پرداخت موفق بود. گزارش‌های خریداری‌شده اکنون در دسترس هستند.
        </Card>
      ) : null}
      <div className="flex flex-col gap-4">
        {groupList.length === 0 ? (
          <Card className="p-6 text-sm text-text-secondary">
            {ownsComprehensive ? (
              <>
                <p className="mb-3 font-bold text-text">
                  بسته گزارش جامع فعال است.
                </p>
                <p className="mb-4 leading-7">
                  پس از تکمیل یک آزمون، گزارش جامع شما اینجا نمایش داده می‌شود.
                </p>
                <Link href="/dashboard">
                  <Button>شروع آزمون</Button>
                </Link>
              </>
            ) : (
              "هنوز گزارشی ندارید."
            )}
          </Card>
        ) : (
          groupList.map(([key, group]) => (
            <Card key={key} className="p-5">
              <h2 className="mb-1 font-extrabold text-text">{group.label}</h2>
              <p className="mb-4 text-xs text-gray-400">
                {group.createdAt.toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex flex-col gap-3">
                {group.items.map((r) => {
                  const typeFa = REPORT_TYPE_LABELS[r.type] || r.type;
                  const entitled = isReportEntitled(r, unlockKeys);
                  const unlockHref =
                    r.type === "growth_path"
                      ? `/pricing?product=growth-path&from=${r.id}`
                      : `/pricing?product=comprehensive-report&from=${r.id}`;
                  return (
                    <div
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-neutral px-3 py-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-primary">
                          گزارش {typeFa}
                        </p>
                        <p className="text-sm text-text-secondary">{r.title}</p>
                      </div>
                      {entitled ? (
                        <Link
                          href={
                            r.type === "growth_path"
                              ? "/growth-path"
                              : `/reports/${r.id}`
                          }
                        >
                          <Button variant="secondary">مشاهده</Button>
                        </Link>
                      ) : (
                        <Link href={unlockHref}>
                          <Button>باز کردن</Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
