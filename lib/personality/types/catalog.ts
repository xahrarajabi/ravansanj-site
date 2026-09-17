export type SpectrumKey = "energy" | "mind" | "nature" | "tactics" | "identity";
export type RoleKey = "analysts" | "diplomats" | "sentinels" | "explorers";
export type ChapterKey =
  | "intro"
  | "strengths"
  | "relationships"
  | "friends"
  | "parents"
  | "careers"
  | "workplace"
  | "conclusion";

export const ROLE_META: Record<
  RoleKey,
  { title: string; color: string; blurb: string; letters: string }
> = {
  analysts: {
    title: "تحلیل‌گران",
    color: "#88619A",
    letters: "NT",
    blurb:
      "تیپ‌هایی که شهود و منطق را با هم دارند؛ مستقل، کنجکاو و علاقه‌مند به الگو و ایده.",
  },
  diplomats: {
    title: "همدلان",
    color: "#33A474",
    letters: "NF",
    blurb:
      "تیپ‌هایی که شهود را با ارزش‌های انسانی گره می‌زنند؛ معنا، رشد و پیوند برایشان مهم است.",
  },
  sentinels: {
    title: "استواران",
    color: "#4298B4",
    letters: "SJ",
    blurb:
      "تیپ‌هایی که مشاهده و ساختار را ترجیح می‌دهند؛ مسئولیت، ثبات و خدمت عملی.",
  },
  explorers: {
    title: "جویندگان",
    color: "#E4AE3A",
    letters: "SP",
    blurb:
      "تیپ‌هایی که مشاهده را با انعطاف همراه می‌کنند؛ مهارت، لحظه حال و آزادی عمل.",
  },
};

export const SPECTRA: {
  key: SpectrumKey;
  left: { letter: string; label: string };
  right: { letter: string; label: string };
  title: string;
  color: string;
}[] = [
  {
    key: "energy",
    title: "انرژی",
    color: "#33A474",
    left: { letter: "E", label: "برون‌گرا" },
    right: { letter: "I", label: "درون‌گرا" },
  },
  {
    key: "mind",
    title: "ذهن",
    color: "#E4AE3A",
    left: { letter: "N", label: "شهودی" },
    right: { letter: "S", label: "مشاهده‌گر" },
  },
  {
    key: "nature",
    title: "ماهیت",
    color: "#4298B4",
    left: { letter: "T", label: "منطقی" },
    right: { letter: "F", label: "احساسی" },
  },
  {
    key: "tactics",
    title: "تاکتیک",
    color: "#88619A",
    left: { letter: "J", label: "ساختارگرا" },
    right: { letter: "P", label: "انعطاف‌پذیر" },
  },
  {
    key: "identity",
    title: "هویت",
    color: "#F25E62",
    left: { letter: "A", label: "پایدار" },
    right: { letter: "T", label: "حساس" },
  },
];

export const CHAPTERS: { key: ChapterKey; slug: string; title: string }[] = [
  { key: "intro", slug: "", title: "معرفی" },
  { key: "strengths", slug: "strengths", title: "نقاط قوت و رشد" },
  { key: "relationships", slug: "relationships", title: "روابط" },
  { key: "friends", slug: "friends", title: "دوستی" },
  { key: "parents", slug: "parents", title: "خانواده" },
  { key: "careers", slug: "careers", title: "مسیر شغلی" },
  { key: "workplace", slug: "workplace", title: "محیط کار" },
  { key: "conclusion", slug: "conclusion", title: "جمع‌بندی" },
];

export type TypeDef = {
  code: string;
  nickname: string;
  role: RoleKey;
  hook: string;
};

export const TYPES: TypeDef[] = [
  {
    code: "INTJ",
    nickname: "نقشه‌کش",
    role: "analysts",
    hook: "با سکوت و دقت، آینده را طراحی می‌کند و از میان شلوغی، مسیر روشن می‌سازد.",
  },
  {
    code: "INTP",
    nickname: "پرسشگر",
    role: "analysts",
    hook: "ایده‌ها را باز می‌کند، فرض‌ها را می‌آزماید و تا به منطق نرسد آرام نمی‌گیرد.",
  },
  {
    code: "ENTJ",
    nickname: "پیش‌برنده",
    role: "analysts",
    hook: "هدف را می‌بیند، منابع را می‌چیند و جمع را به سمت نتیجه حرکت می‌دهد.",
  },
  {
    code: "ENTP",
    nickname: "ایده‌زن",
    role: "analysts",
    hook: "از بحث زنده انرژی می‌گیرد و هر مسئله را به آزمایشگاهی برای فکر تبدیل می‌کند.",
  },
  {
    code: "INFJ",
    nickname: "ژرف‌بین",
    role: "diplomats",
    hook: "معنای پنهان آدم‌ها و موقعیت‌ها را حس می‌کند و برای رشد دیگران نقشه می‌کشد.",
  },
  {
    code: "INFP",
    nickname: "ارزش‌جو",
    role: "diplomats",
    hook: "جهان درونی غنی دارد و تصمیم‌هایش را با قطب‌نمای ارزش‌های شخصی می‌سنجد.",
  },
  {
    code: "ENFJ",
    nickname: "پیوندساز",
    role: "diplomats",
    hook: "افراد را دور یک هدف انسانی جمع می‌کند و به رشد جمع جان می‌دهد.",
  },
  {
    code: "ENFP",
    nickname: "الهام‌بخش",
    role: "diplomats",
    hook: "امکان‌های تازه را می‌بیند و با گرما و کنجکاوی، دیگران را با خود همراه می‌کند.",
  },
  {
    code: "ISTJ",
    nickname: "استوار",
    role: "sentinels",
    hook: "تعهد را جدی می‌گیرد، جزئیات را از قلم نمی‌اندازد و ثبات می‌سازد.",
  },
  {
    code: "ISFJ",
    nickname: "نگاهبان",
    role: "sentinels",
    hook: "نیاز دیگران را پیش از بیان می‌بیند و با دقت آرام از فضا مراقبت می‌کند.",
  },
  {
    code: "ESTJ",
    nickname: "نظم‌آور",
    role: "sentinels",
    hook: "ساختار می‌دهد، تصمیم می‌گیرد و کار را تا خط پایان پیش می‌برد.",
  },
  {
    code: "ESFJ",
    nickname: "گره‌گشا",
    role: "sentinels",
    hook: "هماهنگی جمع برایش مهم است و با حضور گرم، فضا را قابل‌اتکا می‌کند.",
  },
  {
    code: "ISTP",
    nickname: "چیره‌دست",
    role: "explorers",
    hook: "با دست و ذهن آرام، مسئله را باز می‌کند و راه‌حل عملی پیدا می‌کند.",
  },
  {
    code: "ISFP",
    nickname: "حس‌نواز",
    role: "explorers",
    hook: "زیبایی و اصالت لحظه را پاس می‌دارد و با ملایمت مرز خود را حفظ می‌کند.",
  },
  {
    code: "ESTP",
    nickname: "میدان‌دار",
    role: "explorers",
    hook: "در لحظه وارد عمل می‌شود، ریسک حساب‌شده می‌کند و فضا را زنده نگه می‌دارد.",
  },
  {
    code: "ESFP",
    nickname: "شادی‌آور",
    role: "explorers",
    hook: "انرژی جمع را بالا می‌برد و تجربه را به خاطره تبدیل می‌کند.",
  },
];

export const TYPE_BY_CODE = Object.fromEntries(TYPES.map((t) => [t.code, t]));

export function roleOf(code: string): RoleKey {
  const t = TYPE_BY_CODE[code.slice(0, 4)];
  return t?.role ?? "analysts";
}

export function strategyLabel(energy: "E" | "I", identity: "A" | "T") {
  if (energy === "E" && identity === "A") return "تسلط اجتماعی";
  if (energy === "E" && identity === "T") return "پیوند پویا";
  if (energy === "I" && identity === "A") return "استقلال استوار";
  return "رشد پیوسته";
}

export function strategyBlurb(energy: "E" | "I", identity: "A" | "T") {
  if (energy === "E" && identity === "A")
    return "در جمع راحت حرف می‌زند، نظر می‌دهد و معمولاً اعتمادبه‌نفس پایداری دارد.";
  if (energy === "E" && identity === "T")
    return "ارتباط را می‌جوید اما نسبت به بازخورد و نوسان جمع حساس‌تر است.";
  if (energy === "I" && identity === "A")
    return "مستقل پیش می‌رود، کمتر نگران قضاوت دیگران است و ریتم درونی خودش را حفظ می‌کند.";
  return "درون‌گرا و دقیق است و رشد را با بازبینی مداوم خود دنبال می‌کند.";
}
