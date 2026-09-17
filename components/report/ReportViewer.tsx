import Link from "next/link";
import type {
  ComprehensivePayload,
  DetailedPayload,
  InitialPayload,
  TraitPayload,
} from "@/lib/report-builder";
import { Button } from "@/components/ui/Button";
import { ReportHero } from "./ReportHero";
import { TraitSpectrum } from "./TraitSpectrum";
import { StrengthsWeaknesses } from "./StrengthsWeaknesses";
import { TraitTips } from "./TraitTips";
import { SelfOtherComparison } from "./SelfOtherComparison";
import { GrowthPlan30 } from "./GrowthPlan30";

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mb-3 scroll-mt-20 text-sm font-extrabold text-text">
      {children}
    </h2>
  );
}

function SectionsBlock({
  sections,
}: {
  sections: { relationships: string; career: string; growth: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <SectionTitle id="overview">در زندگی روزمره</SectionTitle>
      {[
        { title: "در روابط", body: sections.relationships },
        { title: "در کار", body: sections.career },
        { title: "در رشد فردی", body: sections.growth },
      ].map((s) => (
        <div key={s.title} className="rounded-2xl bg-neutral p-4">
          <p className="mb-1 text-sm font-bold text-text">{s.title}</p>
          <p className="text-xs leading-6 text-text-secondary">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

function OtherTraitsBlock({
  otherTraits,
}: {
  otherTraits?: { key: string; label: string; score: number }[];
}) {
  if (!otherTraits?.length) return null;
  return (
    <div className="mb-8">
      <SectionTitle id="others">نگاه دیگران</SectionTitle>
      <div className="flex flex-col gap-3">
        {otherTraits.map((t) => (
          <div key={`o-${t.key}`}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{t.label}</span>
              <span className="text-primary">{t.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-secondary/70"
                style={{ width: `${t.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeySummary({ traits }: { traits: TraitPayload[] }) {
  const ranked = [...traits].sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 3);
  const focus = [...traits].sort((a, b) => a.score - b.score)[0];
  if (!top.length) return null;

  return (
    <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <SectionTitle id="summary">خلاصه کلیدی</SectionTitle>
      <p className="mb-3 text-xs leading-6 text-text-secondary">
        در یک نگاه: قوی‌ترین ابعاد شما{" "}
        {top.map((t) => `«${t.label}»`).join("، ")} است
        {focus
          ? ` و بیشترین فرصت رشد در «${focus.label}» دیده می‌شود.`
          : "."}
      </p>
      <div className="flex flex-wrap gap-2">
        {top.map((t) => (
          <span
            key={t.key}
            className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary"
          >
            {t.label} · {t.score}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionNav({ isComprehensive }: { isComprehensive: boolean }) {
  if (!isComprehensive) return null;
  const items = [
    { href: "#summary", label: "خلاصه" },
    { href: "#scores", label: "نمرات" },
    { href: "#strengths", label: "نقاط قوت" },
    { href: "#comparison", label: "مقایسه" },
    { href: "#plan", label: "برنامه ۳۰ روزه" },
  ];
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="rounded-full bg-neutral px-3 py-1 text-[11px] font-bold text-text-secondary hover:bg-primary/10 hover:text-primary"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function ReportViewer({
  type,
  title,
  payload,
  dateLabel,
  showUpgrade,
}: {
  type: string;
  title: string;
  payload: InitialPayload | DetailedPayload | ComprehensivePayload;
  dateLabel?: string;
  showUpgrade?: boolean;
}) {
  const detailed = payload as DetailedPayload;
  const comprehensive = payload as ComprehensivePayload;
  const isDetailed = type === "detailed" || type === "comprehensive";
  const isComprehensive = type === "comprehensive";
  const hasComparison = Boolean(comprehensive.comparison?.length);

  return (
    <div>
      <ReportHero
        title={title}
        type={type}
        summary={payload.summary}
        dateLabel={dateLabel}
      />

      <SectionNav isComprehensive={isComprehensive} />

      {isComprehensive ? <KeySummary traits={payload.traits} /> : null}

      <div id="scores">
        <TraitSpectrum traits={payload.traits} />
      </div>

      {payload.sections ? <SectionsBlock sections={payload.sections} /> : null}

      {!isComprehensive || !hasComparison ? (
        <OtherTraitsBlock otherTraits={payload.otherTraits} />
      ) : null}

      {isDetailed && detailed.strengths && detailed.weaknesses ? (
        <div id="strengths">
          <StrengthsWeaknesses
            strengths={detailed.strengths}
            weaknesses={detailed.weaknesses}
          />
        </div>
      ) : null}

      {isDetailed && detailed.tips ? <TraitTips tips={detailed.tips} /> : null}

      {isComprehensive ? (
        <>
          <div id="comparison">
            <SelfOtherComparison comparison={comprehensive.comparison || []} />
          </div>
          {comprehensive.plan30 ? (
            <div id="plan">
              <GrowthPlan30 plan30={comprehensive.plan30} compact />
            </div>
          ) : null}
          <div className="mb-6">
            <Link href="/growth-path">
              <Button variant="secondary" className="w-full">
                مشاهده مسیر رشد کامل ۳۰ روزه
              </Button>
            </Link>
          </div>
        </>
      ) : null}

      {showUpgrade ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-bold text-amber-900">
            گزارش جامع را باز کنید
          </p>
          <p className="mb-3 text-xs leading-6 text-amber-800">
            مقایسه با بازخورد دیگران، خلاصه کلیدی و برنامه ۳۰ روزه در بسته گزارش
            جامع فعال می‌شود.
          </p>
          <Link href="/pricing?product=comprehensive-report">
            <Button className="w-full">مشاهده بسته‌ها</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
