import { getTraitLabel, interpretTrait } from "@/lib/report-content";

export const TRAIT_LABELS: Record<string, string> = {
  openness: "گشودگی به تجربه",
  conscientiousness: "وظیفه‌شناسی",
  extraversion: "برون‌گرایی",
  agreeableness: "توافق‌پذیری",
  emotional_stability: "ثبات هیجانی",
  awareness: "آگاهی هیجانی",
  pause: "مکث پیش از واکنش",
  recovery: "بازیابی",
  regulation: "تنظیم هیجان",
  boundaries: "مرزگذاری",
  listening: "گوش‌دادن",
  empathy: "همدلی",
  openness_rel: "گشودگی رابطه‌ای",
  commitment: "تعهد",
  conflict: "مدیریت تعارض",
  feedback: "پذیرش بازخورد",
  learning: "یادگیری",
  mindset: "ذهنیت رشد",
  goals: "هدف‌گذاری",
  habits: "عادت‌ها",
  self_awareness: "خودآگاهی",
  relationships: "روابط",
  emotion: "هیجان",
  growth: "رشد",
};

export type ScoredResult = {
  traits: { key: string; label: string; score: number; interpretation: string }[];
  summary: string;
  otherTraits?: { key: string; label: string; score: number }[];
};

export function computeResult(
  answers: { trait: string; score: number }[],
  otherAnswers?: { trait: string; score: number }[]
): ScoredResult {
  const buckets: Record<string, { sum: number; count: number }> = {};
  for (const a of answers) {
    if (!buckets[a.trait]) buckets[a.trait] = { sum: 0, count: 0 };
    buckets[a.trait].sum += a.score;
    buckets[a.trait].count += 1;
  }

  const traits = Object.entries(buckets).map(([key, { sum, count }]) => {
    const avg = count ? sum / count : 0;
    const score = Math.round(avg * 20);
    const label = getTraitLabel(key) || TRAIT_LABELS[key] || key;
    return {
      key,
      label,
      score,
      interpretation: interpretTrait(key, score, label),
    };
  });
  traits.sort((a, b) => b.score - a.score);

  let otherTraits: ScoredResult["otherTraits"];
  if (otherAnswers?.length) {
    const ob: Record<string, { sum: number; count: number }> = {};
    for (const a of otherAnswers) {
      if (!ob[a.trait]) ob[a.trait] = { sum: 0, count: 0 };
      ob[a.trait].sum += a.score;
      ob[a.trait].count += 1;
    }
    otherTraits = Object.entries(ob).map(([key, { sum, count }]) => ({
      key,
      label: getTraitLabel(key) || TRAIT_LABELS[key] || key,
      score: Math.round((count ? sum / count : 0) * 20),
    }));
  }

  const top = traits[0];
  const low = traits[traits.length - 1];
  const summary =
    traits.length > 1
      ? `قوی‌ترین بُعد شما «${top.label}» و بُعد نیازمند توجه «${low.label}» است. از این نقشه برای انتخاب تمرین‌های بعدی استفاده کنید.`
      : "نتیجه آزمون شما آماده است.";

  return { traits, summary, otherTraits };
}
