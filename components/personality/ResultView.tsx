import Link from "next/link";
import { ROLE_META, type RoleKey } from "@/lib/personality/types/catalog";
import { TypeAvatar } from "@/components/ui/TypeAvatar";
import type { TypeResult } from "@/lib/personality/scoring";
import { typeChapterNav } from "@/lib/personality/types/chapters";
import { Card } from "@/components/ui/Card";

export function TraitBars({
  result,
  selected,
  onSelect,
}: {
  result: TypeResult;
  selected?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      {result.spectra.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onSelect?.(s.key)}
          className={`block w-full text-right transition ${selected === s.key ? "opacity-100" : "opacity-90"}`}
        >
          <div className="mb-1.5 flex justify-between text-xs font-bold text-text">
            <span>{s.left.label}</span>
            <span>{s.right.label}</span>
          </div>
          <div className="relative h-2.5 rounded-full bg-neutral">
            <div
              className="absolute inset-y-0 rounded-full bg-primary/80"
              style={{
                width: `${s.leftPercent}%`,
                insetInlineStart: 0,
              }}
            />
            <span
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow"
              style={{ insetInlineStart: `calc(${s.leftPercent}% - 8px)` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted">
            {s.leftPercent}٪ {s.leftPercent >= 50 ? s.left.label : s.right.label}
          </p>
        </button>
      ))}
    </div>
  );
}

export function ResultHero({ result }: { result: TypeResult }) {
  const role = result.role as RoleKey;
  const color = ROLE_META[role]?.color ?? "#6B9EC4";
  return (
    <Card className="p-6 md:flex md:items-center md:gap-8 md:p-8">
      <TypeAvatar code={result.four} role={role} />
      <div>
        <p className="text-sm font-bold" style={{ color }}>
          {ROLE_META[role]?.title}
        </p>
        <h1 className="text-3xl font-bold text-text">
          {result.nickname}{" "}
          <span className="text-xl text-muted">({result.typeCode})</span>
        </h1>
        <p className="mt-3 max-w-xl leading-8 text-muted">{result.hook}</p>
        <p className="mt-2 text-sm text-muted">استراتژی: {result.strategy}</p>
      </div>
    </Card>
  );
}

export function ChapterStrip({ code }: { code: string }) {
  const nav = typeChapterNav(code);
  return (
    <div className="flex flex-wrap gap-2">
      {nav.map((c) => (
        <Link
          key={c.key}
          href={c.href}
          className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-text transition hover:border-primary hover:bg-primary-soft"
        >
          {c.title}
        </Link>
      ))}
    </div>
  );
}

export function UnlockBar() {
  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-[var(--header-bg)] px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm font-semibold text-text">
          لایهٔ رایگان همین بود. عمق شغلی و رابطه با بستهٔ پولی باز می‌شود.
        </p>
        <Link
          href="/pricing"
          className="shrink-0 rounded-2xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-white"
        >
          مشاهده بسته‌ها
        </Link>
      </div>
    </div>
  );
}

export function ResultView({ result }: { result: TypeResult }) {
  const four = result.four || result.typeCode.slice(0, 4);
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 pb-28">
      <div>
        <p className="mb-2 text-sm font-bold text-primary">گزارش ارزیابی</p>
        <ResultHero result={result} />
      </div>
      <Card className="p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-text">طیف‌های ترجیح</h2>
        <TraitBars result={result} />
        <p className="mt-5 text-sm leading-7 text-muted">{result.summary}</p>
      </Card>
      <section>
        <h2 className="mb-3 text-lg font-bold text-text">ادامهٔ مطالعه دربارهٔ تیپ شما</h2>
        <ChapterStrip code={four} />
      </section>
      <UnlockBar />
    </div>
  );
}
