"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SiteHeader } from "@/components/chrome/SiteHeader";

type TestInfo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  questionCount: number;
};

type SessionInfo = {
  id: string;
  status: string;
  answerCount: number;
  completedAt: string | null;
  startedAt: string;
  test: { slug: string; title: string; description: string };
};

type Notif = { id: string; title: string; body: string; href: string | null; read: boolean };

const CATEGORY_LABEL: Record<string, string> = {
  personality: "شخصیت",
  emotion: "هیجان",
  relationships: "روابط",
  growth: "رشد",
  general: "عمومی",
};

function estimateMinutes(count: number) {
  return Math.max(3, Math.round(count * 0.45));
}

export function DashboardClient({
  name,
  phone,
  tests,
  sessions,
  notifications,
  unread,
}: {
  name: string | null;
  phone: string;
  tests: TestInfo[];
  sessions: SessionInfo[];
  notifications: Notif[];
  unread: number;
}) {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);

  async function startTest(slug: string) {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/participation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      router.push(`/test/${slug}?session=${data.data.sessionId}`);
    } catch {
      setLoadingSlug(null);
      alert("شروع آزمون ممکن نشد.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function markRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="page-shell soft-glow">
      <SiteHeader loggedIn compact />
      <div className="border-b border-line/60 bg-card/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <p className="text-sm text-muted">فضای شخصی ارزیابی</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-xl border border-line bg-card px-3 py-2 text-sm font-bold text-text-secondary hover:bg-primary-soft"
              onClick={() => setShowNotifs((v) => !v)}
            >
              اعلان‌ها
              {unread > 0 ? (
                <span className="absolute -top-1 -start-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {unread}
                </span>
              ) : null}
            </button>
            <Button variant="ghost" size="sm" onClick={logout}>
              خروج
            </Button>
          </div>
        </div>
      </div>

      {showNotifs ? (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">اعلان‌ها</h2>
              <button type="button" className="text-xs text-primary" onClick={markRead}>
                همه خوانده شد
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-text-secondary">اعلانی نیست.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`rounded-2xl p-3 text-sm ${n.read ? "bg-neutral" : "bg-primary-soft"}`}
                  >
                    <p className="font-bold">{n.title}</p>
                    <p className="text-text-secondary">{n.body}</p>
                    {n.href ? (
                      <Link href={n.href} className="text-xs font-bold text-primary">
                        مشاهده
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Card className="mb-8 p-6 md:p-8">
          <h1 className="mb-1 text-2xl font-bold text-text">
            سلام{name ? ` ${name}` : ""}
          </h1>
          <p className="mb-5 text-sm text-text-secondary">
            <span dir="ltr">{phone}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              ["/personality", "آزمون تیپ"],
              ["/invites", "دعوت ۳۶۰"],
              ["/reports", "گزارش‌ها"],
              ["/growth-path", "مسیر رشد"],
              ["/social", "اجتماعی"],
              ["/chat", "پشتیبانی"],
              ["/settings", "تنظیمات"],
              ["/pricing", "بسته‌ها"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                <Button variant="secondary" size="sm">
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </Card>

        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text">کاتالوگ آزمون‌ها</h2>
            <p className="text-sm text-muted">آزمون‌های تخصصی پس از ورود</p>
          </div>
          <Link href="/personality" className="text-sm font-bold text-primary">
            آزمون رایگان تیپ
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {tests.map((test) => {
            const inProgress = sessions.find(
              (s) => s.test.slug === test.slug && s.status === "in_progress"
            );
            const completedSessions = sessions
              .filter((s) => s.test.slug === test.slug && s.status === "completed")
              .sort((a, b) => {
                const aTime = a.completedAt || a.startedAt;
                const bTime = b.completedAt || b.startedAt;
                return new Date(bTime).getTime() - new Date(aTime).getTime();
              });
            const completed = completedSessions[0];
            const minutes = estimateMinutes(test.questionCount);

            return (
              <Card
                key={test.id}
                className="flex flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Badge tone="primary">
                    {CATEGORY_LABEL[test.category] || test.category}
                  </Badge>
                  <Badge tone="success">رایگان</Badge>
                </div>
                <div className="mb-4 flex h-24 items-center justify-center rounded-2xl bg-primary-soft">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary" aria-hidden>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-text">{test.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-7 text-text-secondary">
                  {test.description}
                </p>
                <p className="mb-4 text-xs font-semibold text-muted">
                  {test.questionCount} سؤال · حدود {minutes} دقیقه
                  {inProgress ? ` · در حال انجام (${inProgress.answerCount})` : ""}
                  {completed && !inProgress ? " · تکمیل‌شده" : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => startTest(test.slug)}
                    disabled={loadingSlug === test.slug}
                  >
                    {loadingSlug === test.slug
                      ? "..."
                      : inProgress
                        ? "ادامه آزمون"
                        : completed
                          ? "شروع مجدد"
                          : "شروع تست"}
                  </Button>
                  {completed ? (
                    <Link href={`/result/${completed.id}`}>
                      <Button variant="secondary">نتیجه</Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
