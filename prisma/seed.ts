import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LIKERT = [
  { text: "کاملاً مخالفم", score: 1 },
  { text: "مخالفم", score: 2 },
  { text: "نظری ندارم", score: 3 },
  { text: "موافقم", score: 4 },
  { text: "کاملاً موافقم", score: 5 },
];

type Q = { text: string; trait: string; perspective?: string };

async function clear() {
  await prisma.contributorResponse.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.socialProfile.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.contentUnlock.deleteMany();
  await prisma.giftCode.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.report.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.personalitySession.deleteMany();
  await prisma.extraSession.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();
  await prisma.demographicAnswer.deleteMany();
  await prisma.demographicQuestion.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.otpRateLimit.deleteMany();
  await prisma.siteContent.deleteMany();
}

async function createTest(
  slug: string,
  title: string,
  description: string,
  category: string,
  questions: Q[]
) {
  return prisma.test.create({
    data: {
      slug,
      title,
      description,
      category,
      questions: {
        create: questions.map((q, index) => ({
          order: index + 1,
          text: q.text,
          trait: q.trait,
          perspective: q.perspective || "self",
          options: { create: LIKERT.map((o) => ({ ...o })) },
        })),
      },
    },
  });
}

async function main() {
  await clear();

  // IPIP-inspired Big Five — original Persian wording
  await createTest(
    "big-five",
    "نقشه پنج‌بُعدی شخصیت",
    "بر پایه مدل پنج‌عاملی شخصیت؛ تصویر ساخت‌یافته از گشودگی، وظیفه‌شناسی، برون‌گرایی، توافق‌پذیری و ثبات هیجانی.",
    "personality",
    [
      { text: "ایده‌های تازه و تجربه‌های نو معمولاً برایم جذاب‌اند.", trait: "openness" },
      { text: "از فکر کردن درباره موضوعات انتزاعی لذت می‌برم.", trait: "openness" },
      { text: "کارها را تا تمام شدن پیگیری می‌کنم.", trait: "conscientiousness" },
      { text: "برنامه‌ریزی روزانه به من احساس کنترل می‌دهد.", trait: "conscientiousness" },
      { text: "در جمع‌های جدید به‌راحتی شروع به صحبت می‌کنم.", trait: "extraversion" },
      { text: "انرژی‌ام در کنار دیگران بیشتر می‌شود.", trait: "extraversion" },
      { text: "سعی می‌کنم با دیگران مهربان و منصف باشم.", trait: "agreeableness" },
      { text: "وقتی کسی اشتباه می‌کند، معمولاً صبور می‌مانم.", trait: "agreeableness" },
      { text: "در موقعیت‌های پرتنش معمولاً آرامش نسبی دارم.", trait: "emotional_stability" },
      { text: "نگرانی‌های روزمره کمتر خواب یا تمرکزم را مختل می‌کنند.", trait: "emotional_stability" },
      { text: "از تغییر مسیر و یادگیری مهارت جدید استقبال می‌کنم.", trait: "openness" },
      { text: "مهلت‌ها را جدی می‌گیرم و برایشان زمان می‌گذارم.", trait: "conscientiousness" },
    ]
  );

  await createTest(
    "emotion-regulation",
    "الگوی تنظیم هیجان",
    "پرسش‌هایی درباره آگاهی هیجانی، مکث قبل از واکنش و بازیابی پس از استرس.",
    "emotion",
    [
      { text: "معمولاً می‌توانم هیجان غالب لحظه‌ام را نام ببرم.", trait: "awareness" },
      { text: "وقتی عصبانی می‌شوم، پیش از واکنش چند نفس می‌کشم.", trait: "pause" },
      { text: "پس از یک روز سخت، راهی برای آرام شدن پیدا می‌کنم.", trait: "recovery" },
      { text: "احساسات ناخوشایند را انکار نمی‌کنم؛ با آن‌ها روبه‌رو می‌شوم.", trait: "awareness" },
      { text: "می‌توانم بدون سرکوب هیجان، شدت آن را کم کنم.", trait: "regulation" },
      { text: "در بحث‌های داغ، صدایم را کنترل می‌کنم.", trait: "pause" },
      { text: "خواب و تحرک بدنی را بخشی از مدیریت هیجان می‌دانم.", trait: "recovery" },
      { text: "وقتی مضطربم، می‌توانم تمرکزم را به کار برگردانم.", trait: "regulation" },
      { text: "هیجان‌های مثبت را هم آگاهانه ثبت و تقویت می‌کنم.", trait: "awareness" },
      { text: "از دیگران کمک می‌گیرم وقتی هیجانم سنگین می‌شود.", trait: "recovery" },
    ]
  );

  await createTest(
    "relationship-style",
    "سبک روابط و مرزها",
    "نگاهی به گوش‌دادن، بیان نیاز، مرزگذاری و همدلی در روابط نزدیک.",
    "relationships",
    [
      { text: "در روابط نزدیک نیازها و مرزهایم را واضح بیان می‌کنم.", trait: "boundaries" },
      { text: "وقتی مخالفم، بدون قطع حرف طرف مقابل گوش می‌دهم.", trait: "listening" },
      { text: "سعی می‌کنم دیدگاه طرف مقابل را حتی در اختلاف بفهمم.", trait: "empathy" },
      { text: "درخواست کمک کردن برایم سخت نیست.", trait: "openness_rel" },
      { text: "می‌توانم نه بگویم بدون احساس گناه شدید.", trait: "boundaries" },
      { text: "بازخورد سازنده را می‌پذیرم حتی اگر ناخوشایند باشد.", trait: "listening" },
      { text: "وقتی کسی ناراحت است، اول همدلی می‌کنم بعد راه‌حل.", trait: "empathy" },
      { text: "تعهدات رابطه‌ای‌ام را جدی می‌گیرم.", trait: "commitment" },
      { text: "در تعارض، به‌جای سرزنش، روی موضوع تمرکز می‌کنم.", trait: "conflict" },
      { text: "فضای امن برای حرف زدن طرف مقابل می‌سازم.", trait: "openness_rel" },
      // other-perspective items for 360 invites
      {
        text: "این فرد معمولاً مرزهایش را شفاف بیان می‌کند.",
        trait: "boundaries",
        perspective: "other",
      },
      {
        text: "این فرد خوب گوش می‌دهد حتی وقتی مخالف است.",
        trait: "listening",
        perspective: "other",
      },
      {
        text: "این فرد در تعارض همدل و منصف به نظر می‌رسد.",
        trait: "empathy",
        perspective: "other",
      },
      {
        text: "می‌توان به تعهدات این فرد اعتماد کرد.",
        trait: "commitment",
        perspective: "other",
      },
    ]
  );

  await createTest(
    "growth-readiness",
    "آمادگی رشد فردی",
    "سنجش استقبال از بازخورد، یادگیری پیوسته و نگاه سازنده به اشتباه.",
    "growth",
    [
      { text: "از بازخورد سازنده برای بهتر شدن استقبال می‌کنم.", trait: "feedback" },
      { text: "برای یادگیری مهارت جدید وقت می‌گذارم.", trait: "learning" },
      { text: "اشتباه را فرصت رشد می‌بینم نه فقط شکست.", trait: "mindset" },
      { text: "اهداف کوتاه‌مدت قابل‌اندازه‌گیری برای خودم می‌گذارم.", trait: "goals" },
      { text: "عادت‌هایم را مرور و اصلاح می‌کنم.", trait: "habits" },
      { text: "وقتی گیر می‌کنم، منابع یا مربی می‌جویم.", trait: "learning" },
      { text: "پیشرفت کوچک را جشن می‌گیرم تا انگیزه بماند.", trait: "mindset" },
      { text: "بازخورد منفی را شخصی‌سازی نمی‌کنم.", trait: "feedback" },
      { text: "برنامه رشد کتبی یا دیجیتال دارم.", trait: "goals" },
      { text: "محیطم را طوری می‌چینم که عادت خوب آسان‌تر شود.", trait: "habits" },
    ]
  );

  await prisma.demographicQuestion.createMany({
    data: [
      { order: 1, key: "age_range", text: "بازه سنی شما کدام است؟" },
      { order: 2, key: "gender", text: "جنسیت (اختیاری)" },
      { order: 3, key: "education", text: "آخرین مدرک تحصیلی" },
      { order: 4, key: "goal", text: "مهم‌ترین هدف شما از روان‌سنج چیست؟" },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        order: 1,
        question: "روان‌سنج دقیقاً چیست؟",
        answer:
          "روان‌سنج پلتفرم خودشناسی است: آزمون، گزارش، دعوت اطرافیان و ابزارهای رشد در یک داشبورد.",
      },
      {
        order: 2,
        question: "آیا داده‌هایم محرمانه است؟",
        answer:
          "دسترسی به حساب با موبایل شماست. اطلاعات برای ارائه گزارش و خدمات داخل روان‌سنج استفاده می‌شود.",
      },
      {
        order: 3,
        question: "تفاوت بسته رایگان و پولی چیست؟",
        answer:
          "آزمون پایه و گزارش اولیه در دسترس است. گزارش جامع، بسته مسیر و کد هدیه از طریق خرید فعال می‌شوند.",
      },
      {
        order: 4,
        question: "چطور پرداخت کنم؟",
        answer: "پرداخت از طریق درگاه زرین‌پال انجام می‌شود.",
      },
      {
        order: 5,
        question: "چطور دوست را دعوت کنم؟",
        answer:
          "از بخش دعوت ۳۶۰، شماره موبایل او را وارد کنید؛ لینک امن برای پاسخ کوتاه ارسال می‌شود.",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        slug: "comprehensive-report",
        title: "گزارش جامع",
        description: "تحلیل عمیق‌تر صفات، پیشنهادهای عملی و مقایسه با بازخورد دیگران.",
        priceToman: 149000,
        kind: "report_unlock",
        unlockKey: "comprehensive_report",
        metaJson: JSON.stringify({ unlockKey: "comprehensive_report" }),
      },
      {
        slug: "growth-path",
        title: "بسته مسیر رشد ۳۰ روزه",
        description: "برنامه تمرینی روزانه بر اساس نتیجه آزمون‌های شما.",
        priceToman: 299000,
        kind: "path_bundle",
        unlockKey: "growth_path",
        metaJson: JSON.stringify({ unlockKey: "growth_path" }),
      },
      {
        slug: "career-suite",
        title: "بسته شغلی تیپ شخصیت",
        description: "فصل‌های شغلی و محیط کار برای تیپ ۱۶گانه شما.",
        priceToman: 149000,
        kind: "personality_unlock",
        unlockKey: "career_suite",
        metaJson: JSON.stringify({ unlockKey: "career_suite" }),
      },
      {
        slug: "full-suite",
        title: "بسته کامل تیپ شخصیت",
        description: "دسترسی کامل به فصل‌های شغلی، رشد و روابط تیپ شما.",
        priceToman: 299000,
        kind: "personality_unlock",
        unlockKey: "full_suite",
        metaJson: JSON.stringify({ unlockKey: "full_suite" }),
      },
      {
        slug: "gift-report",
        title: "کد هدیه گزارش جامع",
        description: "یک کد هدیه برای فعال‌سازی گزارش جامع برای خودتان یا دیگری.",
        priceToman: 159000,
        kind: "gift",
        unlockKey: "comprehensive_report",
        metaJson: JSON.stringify({ unlockKey: "comprehensive_report" }),
      },
    ],
  });

  console.log("Seed complete: tests, FAQ, products (reports + personality), demographics");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
