import Link from "next/link";
import {
  TYPE_BY_CODE,
  ROLE_META,
  type ChapterKey,
} from "@/lib/personality/types/catalog";
import { chapterParagraphs, typeChapterNav } from "@/lib/personality/types/chapters";
import { TypeAvatar } from "@/components/ui/TypeAvatar";
import { canViewPaidChapter, PAID_CHAPTERS } from "@/lib/access";
import { Card } from "@/components/ui/Card";

export function TypeChapterView({
  code,
  chapter,
  unlockKeys,
}: {
  code: string;
  chapter: ChapterKey;
  unlockKeys: Set<string>;
}) {
  const t = TYPE_BY_CODE[code];
  if (!t) return null;
  const nav = typeChapterNav(code);
  const role = ROLE_META[t.role];
  const entitled = canViewPaidChapter(chapter, unlockKeys);
  const paras = entitled
    ? chapterParagraphs(code, chapter)
    : [
        "این فصل بخشی از بستهٔ شغلی / کامل است.",
        "پس از خرید و ورود به حساب، متن کامل اینجا نمایش داده می‌شود.",
      ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <TypeAvatar code={t.code} role={t.role} size={88} />
        <div>
          <p className="text-xs font-bold" style={{ color: role.color }}>
            {role.title}
          </p>
          <h1 className="text-2xl font-bold text-text">
            {t.nickname} <span className="text-muted">({t.code})</span>
          </h1>
        </div>
      </div>
      <nav className="mb-8 flex flex-wrap gap-2">
        {nav.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              c.key === chapter
                ? "bg-primary text-white"
                : "border border-line bg-card text-text hover:border-primary/40"
            }`}
          >
            {c.title}
            {PAID_CHAPTERS.has(c.key) && !canViewPaidChapter(c.key, unlockKeys)
              ? " · قفل"
              : ""}
          </Link>
        ))}
      </nav>
      <Card className="space-y-4 p-6 leading-8 md:p-8">
        {paras.map((p) => (
          <p key={p} className="text-text-secondary">
            {p}
          </p>
        ))}
        {!entitled ? (
          <Link
            href="/pricing"
            className="mt-2 inline-flex rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            مشاهده بسته‌ها
          </Link>
        ) : null}
      </Card>
      <div className="mt-6 flex gap-3">
        <Link
          href="/personality"
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-white"
        >
          شروع آزمون
        </Link>
        <Link
          href="/pricing"
          className="rounded-2xl border border-line px-4 py-2 text-sm font-bold text-text"
        >
          بسته شغلی
        </Link>
      </div>
    </div>
  );
}
