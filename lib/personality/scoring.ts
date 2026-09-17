import { SPECTRA, TYPE_BY_CODE, strategyLabel, type SpectrumKey } from "@/lib/personality/types/catalog";
import { TEST_QUESTIONS } from "@/lib/test/questions";

export type SpectrumScore = {
  key: SpectrumKey;
  title: string;
  color: string;
  left: { letter: string; label: string };
  right: { letter: string; label: string };
  /** 0–100 toward the left pole. */
  leftPercent: number;
  letter: string;
  blurb: string;
};

export type TypeResult = {
  typeCode: string;
  four: string;
  identity: "A" | "T";
  nickname: string;
  role: string;
  strategy: string;
  hook: string;
  spectra: SpectrumScore[];
  summary: string;
};

const BLURBS: Record<SpectrumKey, { left: string; right: string }> = {
  energy: {
    left: "احتمالاً از تعامل اجتماعی انرژی می‌گیری و اشتیاق را راحت‌تر بروز می‌دهی.",
    right: "احتمالاً برای بازیابی به خلوت نیاز داری و قبل از حرف، در ذهن جمع‌بندی می‌کنی.",
  },
  mind: {
    left: "احتمالاً به معنا، الگو و امکان‌های دور توجه داری و تخیل فعالی داری.",
    right: "احتمالاً به واقعیت ملموس، تجربه و جزئیات قابل‌مشاهده تکیه می‌کنی.",
  },
  nature: {
    left: "احتمالاً عینیت و کارایی را جلوتر از هماهنگی احساسی می‌گذاری.",
    right: "احتمالاً حال افراد و ارزش‌های انسانی وزن سنگینی در تصمیم‌هایت دارند.",
  },
  tactics: {
    left: "احتمالاً ساختار، مهلت و بستن تصمیم به تو حس کنترل می‌دهد.",
    right: "احتمالاً انعطاف، بداهه و باز نگه داشتن گزینه‌ها برایت طبیعی‌تر است.",
  },
  identity: {
    left: "احتمالاً پایدارتر، کم‌نگرانی‌تر و مقاوم‌تر در برابر فشار بیرونی هستی.",
    right: "احتمالاً حساس‌تر به بازخورد هستی و خودت را مدام بازبینی می‌کنی.",
  },
};

export function scoreAnswers(answers: Record<string, number>): TypeResult {
  const buckets: Record<SpectrumKey, number[]> = {
    energy: [],
    mind: [],
    nature: [],
    tactics: [],
    identity: [],
  };

  for (const q of TEST_QUESTIONS) {
    const raw = answers[q.id];
    if (typeof raw !== "number" || raw < 1 || raw > 7) continue;
    const towardLeft = q.reverse ? 8 - raw : raw;
    buckets[q.spectrum].push(towardLeft);
  }

  const spectra: SpectrumScore[] = SPECTRA.map((s) => {
    const vals = buckets[s.key];
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 4;
    const leftPercent = Math.round(((avg - 1) / 6) * 100);
    const letter = leftPercent >= 50 ? s.left.letter : s.right.letter;
    return {
      key: s.key,
      title: s.title,
      color: s.color,
      left: s.left,
      right: s.right,
      leftPercent,
      letter,
      blurb: leftPercent >= 50 ? BLURBS[s.key].left : BLURBS[s.key].right,
    };
  });

  const letterOf = (key: SpectrumKey) =>
    spectra.find((x) => x.key === key)!.letter;

  const e = letterOf("energy") as "E" | "I";
  const n = letterOf("mind");
  const t = letterOf("nature");
  const j = letterOf("tactics");
  const identity = letterOf("identity") as "A" | "T";
  const code4 = `${e}${n}${t}${j}`;
  const def = TYPE_BY_CODE[code4];
  const typeCode = `${code4}-${identity}`;

  return {
    typeCode,
    four: code4,
    identity,
    nickname: def?.nickname ?? code4,
    role: def?.role ?? "analysts",
    strategy: strategyLabel(e, identity),
    hook: def?.hook ?? "نقشه‌ای ساخت‌یافته از ترجیح‌های پایدار تو.",
    spectra,
    summary: code4,
  };
}

export function parseResult(json: string | null): TypeResult | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as TypeResult;
  } catch {
    return null;
  }
}
