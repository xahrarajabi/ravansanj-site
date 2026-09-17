export type ExtraQuestion = { id: string; text: string; trait: string };

export const EXTRA_TESTS: {
  slug: string;
  title: string;
  description: string;
  questions: ExtraQuestion[];
}[] = [
  {
    slug: "work-values",
    title: "ارزش‌های کاری",
    description: "ده سؤال کوتاه درباره آنچه در کار به تو انرژی می‌دهد.",
    questions: [
      { id: "w1", trait: "autonomy", text: "آزادی انتخاب روش کار برایم مهم‌تر از دستور دقیق است." },
      { id: "w2", trait: "mastery", text: "دیدن پیشرفت مهارتم بیشتر از عنوان شغلی کیف می‌دهد." },
      { id: "w3", trait: "impact", text: "اثر کارم روی آدم واقعی باید قابل‌دیدن باشد." },
      { id: "w4", trait: "stability", text: "پیش‌بینی‌پذیری درآمد و نقش، آرامشم را نگه می‌دارد." },
      { id: "w5", trait: "people", text: "کیفیت همکاران مهم‌تر از برند سازمان است." },
      { id: "w6", trait: "learning", text: "اگر چیزی برای یاد گرفتن نباشد، زود خسته می‌شوم." },
      { id: "w7", trait: "autonomy", text: "کنترل تقویم شخصی‌ام بخشی از احترام شغلی است." },
      { id: "w8", trait: "impact", text: "کار صرفاً تزئینی بدون مسئله واقعی حوصله‌ام را سر می‌برد." },
      { id: "w9", trait: "stability", text: "تغییر مکرر اولویت‌ها انرژی‌ام را می‌گیرد." },
      { id: "w10", trait: "people", text: "بازخورد صادقانه همکاران برایم سوخت است." },
    ],
  },
  {
    slug: "stress-style",
    title: "سبک استرس",
    description: "نگاهی کوتاه به واکنش تو زیر فشار — برای خودشناسی، نه تشخیص.",
    questions: [
      { id: "s1", trait: "withdraw", text: "زیر فشار ترجیح می‌دهم تنها فکر کنم." },
      { id: "s2", trait: "talk", text: "زیر فشار باید با کسی حرف بزنم تا آرام شوم." },
      { id: "s3", trait: "control", text: "وقتی کنترل از دست می‌رود، اضطرابم بالا می‌رود." },
      { id: "s4", trait: "body", text: "استرس را اول در بدن حس می‌کنم (خواب، شانه، معده)." },
      { id: "s5", trait: "action", text: "فشار را با انجام دادن کار اضافی خالی می‌کنم." },
      { id: "s6", trait: "withdraw", text: "پیام ندادن در روز سخت برایم روش مراقبت است." },
      { id: "s7", trait: "talk", text: "تعریف کردن ماجرا نصف حل مسئله است." },
      { id: "s8", trait: "control", text: "لیست و برنامه، حتی کوتاه، حالم را بهتر می‌کند." },
    ],
  },
];

export function extraBySlug(slug: string) {
  return EXTRA_TESTS.find((t) => t.slug === slug);
}
