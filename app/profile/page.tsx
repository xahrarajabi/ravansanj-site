import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCareer, hasFull, userUnlockKeys } from "@/lib/access";
import type { TypeResult } from "@/lib/personality/scoring";
import { ResultHero, TraitBars } from "@/components/personality/ResultView";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/auth/login?next=/profile");

  const keys = await userUnlockKeys(session.userId);
  const latest = await prisma.personalitySession.findFirst({
    where: { userId: session.userId, status: "completed" },
    orderBy: { completedAt: "desc" },
  });

  let result: TypeResult | null = null;
  if (latest?.resultJson) {
    try {
      result = JSON.parse(latest.resultJson) as TypeResult;
    } catch {
      result = null;
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-black text-primary">
            روان‌سنج
          </Link>
          <nav className="flex gap-3 text-sm font-semibold">
            <Link href="/dashboard">داشبورد</Link>
            <Link href="/settings">تنظیمات</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-2xl font-black">پروفایل</h1>
        <p className="text-sm text-muted" dir="ltr">
          {session.phone}
        </p>

        {result ? (
          <div className="space-y-4">
            <ResultHero result={result} />
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <TraitBars result={result} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 text-sm text-muted shadow-sm">
            هنوز نتیجهٔ تیپ ذخیره نشده.{" "}
            <Link href="/personality" className="font-bold text-primary">
              شروع آزمون
            </Link>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={hasCareer(keys) ? `/types/${(result?.four || "intj").toLowerCase()}/careers` : "/pricing"}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold">بسته شغلی</h2>
            <p className="mt-1 text-xs text-muted">
              {hasCareer(keys) ? "فعال — مشاهده فصل‌ها" : "قفل — از قیمت‌ها باز کنید"}
            </p>
          </Link>
          <Link
            href={hasFull(keys) ? "/pricing" : "/pricing"}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold">بسته کامل</h2>
            <p className="mt-1 text-xs text-muted">
              {hasFull(keys) ? "فعال" : "قفل"}
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
