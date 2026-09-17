import {
  bandLabel,
  getBandContent,
  getCategorySections,
  getTraitLabel,
  interpretTrait,
  scoreToBand,
  type BandKey,
} from "@/lib/report-content";
import type { ScoredResult } from "@/lib/scoring";

export type TraitPayload = {
  key: string;
  label: string;
  score: number;
  interpretation: string;
  band: BandKey;
  bandLabel: string;
  title?: string;
  strengths?: string[];
  growthTips?: string[];
  dailyExercise?: string;
};

export type TipPayload = {
  trait: string;
  traitKey: string;
  exercise: string;
  why: string;
};

export type ComparisonItem = {
  trait: string;
  traitKey: string;
  self: number;
  other: number;
  gap: number;
  insight: string;
};

export type PlanDay = {
  day: number;
  title: string;
  task: string;
  traitKey?: string;
};

export type InitialPayload = {
  traits: TraitPayload[];
  summary: string;
  sections: {
    relationships: string;
    career: string;
    growth: string;
  };
  otherTraits?: { key: string; label: string; score: number }[];
};

export type DetailedPayload = InitialPayload & {
  strengths: TraitPayload[];
  weaknesses: TraitPayload[];
  tips: TipPayload[];
};

export type ComprehensivePayload = DetailedPayload & {
  comparison: ComparisonItem[];
  plan30: PlanDay[];
};

export type GrowthPathPayload = {
  generatedAt: string;
  plan30: PlanDay[];
  sourceTests: string[];
  focusTraits: { key: string; label: string; score: number }[];
};

function enrichTrait(t: {
  key: string;
  label: string;
  score: number;
  interpretation: string;
}): TraitPayload {
  const band = scoreToBand(t.score);
  const bandContent = getBandContent(t.key, t.score);
  return {
    key: t.key,
    label: t.label || getTraitLabel(t.key),
    score: t.score,
    interpretation: interpretTrait(t.key, t.score, t.label),
    band,
    bandLabel: bandLabel(band),
    title: bandContent?.title,
    strengths: bandContent?.strengths,
    growthTips: bandContent?.growthTips,
    dailyExercise: bandContent?.dailyExercise,
  };
}

export function buildInitialPayload(
  scored: ScoredResult,
  category: string
): InitialPayload {
  const traits = scored.traits.map(enrichTrait);
  return {
    traits,
    summary: scored.summary,
    sections: getCategorySections(category),
    otherTraits: scored.otherTraits,
  };
}

export function buildDetailedPayload(
  scored: ScoredResult,
  category: string
): DetailedPayload {
  const initial = buildInitialPayload(scored, category);
  const sorted = [...initial.traits].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, Math.min(3, sorted.length));
  const weaknesses = [...sorted]
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.min(3, sorted.length));

  const tips: TipPayload[] = initial.traits.map((t) => {
    const band = getBandContent(t.key, t.score);
    return {
      trait: t.label,
      traitKey: t.key,
      exercise: band?.dailyExercise || `برای تقویت «${t.label}» یک تمرین ۱۰ دقیقه‌ای روزانه تعریف کنید.`,
      why:
        band?.description ||
        t.interpretation ||
        `تمرین منظم به تقویت «${t.label}» کمک می‌کند.`,
    };
  });

  return { ...initial, strengths, weaknesses, tips };
}

function buildComparison(
  traits: TraitPayload[],
  otherTraits?: { key: string; label: string; score: number }[]
): ComparisonItem[] {
  if (!otherTraits?.length) return [];
  const otherMap = new Map(otherTraits.map((o) => [o.key, o]));
  return traits
    .filter((t) => otherMap.has(t.key))
    .map((t) => {
      const other = otherMap.get(t.key)!;
      const gap = other.score - t.score;
      let insight: string;
      if (Math.abs(gap) < 10) {
        insight = `نگاه شما و دیگران درباره «${t.label}» هم‌راستاست (اختلاف ${gap > 0 ? "+" : ""}${gap}).`;
      } else if (gap > 0) {
        insight = `دیگران «${t.label}» شما را بالاتر از خودتان می‌بینند (+${gap}). شاید مهارت واقعی‌تان را دست‌کم می‌گیرید.`;
      } else {
        insight = `خودتان «${t.label}» را بالاتر از دیگران می‌بینید (${gap}). ممکن است نقطه کوری در رفتار بیرونی وجود داشته باشد.`;
      }
      return {
        trait: t.label,
        traitKey: t.key,
        self: t.score,
        other: other.score,
        gap,
        insight,
      };
    });
}

export function buildPlan30(
  focusTraits: { key: string; label: string; score: number }[]
): PlanDay[] {
  const traits =
    focusTraits.length > 0
      ? focusTraits
      : [{ key: "habits", label: "عادت‌ها", score: 40 }];

  const plan: PlanDay[] = [];
  for (let day = 1; day <= 30; day++) {
    const t = traits[(day - 1) % traits.length];
    const band = getBandContent(t.key, t.score);
    const week = Math.ceil(day / 7);
    const labels = ["آگاهی", "تمرین", "تعمیق", "تثبیت", "جمع‌بندی"];
    const phase = labels[Math.min(week - 1, labels.length - 1)];

    plan.push({
      day,
      title: `روز ${day.toLocaleString("fa-IR")} — ${phase} «${t.label}»`,
      task:
        band?.dailyExercise ||
        `۱۰ دقیقه روی تقویت «${t.label}» تمرکز کنید و یک جمله از تجربه‌تان بنویسید.`,
      traitKey: t.key,
    });
  }
  return plan;
}

export function buildComprehensivePayload(
  scored: ScoredResult,
  category: string
): ComprehensivePayload {
  const detailed = buildDetailedPayload(scored, category);
  const comparison = buildComparison(detailed.traits, scored.otherTraits);
  const focus = [...detailed.traits]
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.min(3, detailed.traits.length));
  const plan30 = buildPlan30(focus);

  return { ...detailed, comparison, plan30 };
}

export function buildAllReportPayloads(
  scored: ScoredResult,
  test: { title: string; category: string; slug: string }
) {
  const initial = buildInitialPayload(scored, test.category);
  const detailed = buildDetailedPayload(scored, test.category);
  const comprehensive = buildComprehensivePayload(scored, test.category);
  return {
    initial,
    detailed,
    comprehensive,
    titles: {
      initial: `گزارش اولیه — ${test.title}`,
      detailed: `گزارش تفصیلی — ${test.title}`,
      comprehensive: `گزارش جامع — ${test.title}`,
    },
  };
}

export function buildGrowthPathPayload(
  sessions: {
    testSlug: string;
    testTitle: string;
    resultJson: string | null;
  }[]
): GrowthPathPayload {
  const focusMap = new Map<string, { key: string; label: string; score: number }>();
  const sourceTests: string[] = [];

  for (const s of sessions) {
    if (!s.resultJson) continue;
    sourceTests.push(s.testTitle);
    try {
      const parsed = JSON.parse(s.resultJson) as ScoredResult;
      for (const t of parsed.traits) {
        const existing = focusMap.get(t.key);
        if (!existing || t.score < existing.score) {
          focusMap.set(t.key, {
            key: t.key,
            label: t.label || getTraitLabel(t.key),
            score: t.score,
          });
        }
      }
    } catch {
      /* ignore bad json */
    }
  }

  const focusTraits = [...focusMap.values()]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  return {
    generatedAt: new Date().toISOString(),
    plan30: buildPlan30(focusTraits),
    sourceTests: [...new Set(sourceTests)],
    focusTraits,
  };
}

export const REPORT_TYPE_LABELS: Record<string, string> = {
  initial: "اولیه",
  detailed: "تفصیلی",
  comprehensive: "جامع",
  growth_path: "مسیر رشد",
};
