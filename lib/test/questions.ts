import type { SpectrumKey } from "@/lib/types/catalog";

export type TestQuestion = {
  id: string;
  text: string;
  spectrum: SpectrumKey;
  /** If true, agreement pushes toward the right pole (I/S/F/P/T). */
  reverse: boolean;
};

export const TEST_QUESTIONS: TestQuestion[] = [
  { id: "e1", spectrum: "energy", reverse: false, text: "بعد از یک جمع شلوغ، معمولاً هنوز انرژی دارم نه خستگی." },
  { id: "e2", spectrum: "energy", reverse: false, text: "شروع صحبت با افراد جدید برایم نسبتاً آسان است." },
  { id: "e3", spectrum: "energy", reverse: true, text: "برای بازیابی تمرکز، به تنهایی و سکوت نیاز دارم." },
  { id: "e4", spectrum: "energy", reverse: false, text: "فکر کردن با صدای بلند کنار دیگران به من کمک می‌کند." },
  { id: "e5", spectrum: "energy", reverse: true, text: "ترجیح می‌دهم قبل از حرف زدن، مدتی در ذهن خودم جمع‌بندی کنم." },
  { id: "e6", spectrum: "energy", reverse: false, text: "در مهمانی، معمولاً چند گفتگوی موازی را جلو می‌برم." },
  { id: "e7", spectrum: "energy", reverse: true, text: "تقویم خلوت و زمان بی‌وقفه برای خودم برایم حیاتی است." },
  { id: "e8", spectrum: "energy", reverse: false, text: "وقتی ایده‌ای دارم، دوست دارم سریع با کسی در میان بگذارمش." },
  { id: "e9", spectrum: "energy", reverse: true, text: "پیام ندادن چندروزه برایم طبیعی است و ناراحت نمی‌شوم." },
  { id: "e10", spectrum: "energy", reverse: false, text: "کار گروهی پرتحرک حوصله‌ام را بیشتر از کار انفرادی سر می‌برد." },
  { id: "e11", spectrum: "energy", reverse: true, text: "در جمع بزرگ، بیشتر گوش می‌دهم تا مرکز توجه باشم." },
  { id: "e12", spectrum: "energy", reverse: false, text: "آشنایی تصادفی در صف یا سفر معمولاً برایم جذاب است." },

  { id: "m1", spectrum: "mind", reverse: false, text: "بیشتر به الگو و معنای پشت رویدادها فکر می‌کنم تا جزئیات سطحی." },
  { id: "m2", spectrum: "mind", reverse: true, text: "واقعیت ملموس و تجربه مستقیم برایم قابل‌اعتمادتر از نظریه است." },
  { id: "m3", spectrum: "mind", reverse: false, text: "از فکر کردن به سناریوهای آینده و امکان‌های دور لذت می‌برم." },
  { id: "m4", spectrum: "mind", reverse: true, text: "دستورالعمل دقیق و قدم‌به‌قدم را به آزادی تفسیر ترجیح می‌دهم." },
  { id: "m5", spectrum: "mind", reverse: false, text: "استعاره‌ها و ایده‌های انتزاعی برایم روشن و زنده هستند." },
  { id: "m6", spectrum: "mind", reverse: true, text: "وقتی چیزی را ندیده یا لمس نکرده باشم، سخت قانع می‌شوم." },
  { id: "m7", spectrum: "mind", reverse: false, text: "در بحث، سریع به ارتباط میان موضوعات به‌ظاهر نامربوط می‌رسم." },
  { id: "m8", spectrum: "mind", reverse: true, text: "حافظه جزئیات روزمره (ساعت، مسیر، قیمت) معمولاً قوی است." },
  { id: "m9", spectrum: "mind", reverse: false, text: "تغییر روش کار اگر ایده تازه‌ای در آن باشد برایم هیجان‌انگیز است." },
  { id: "m10", spectrum: "mind", reverse: true, text: "روش آزموده و آشنا را به آزمایش پرریسک ترجیح می‌دهم." },
  { id: "m11", spectrum: "mind", reverse: false, text: "سؤالات «چرا این‌طور است؟» ذهنم را بیشتر از «چطور انجام شود؟» درگیر می‌کند." },
  { id: "m12", spectrum: "mind", reverse: true, text: "در یادگیری، مثال عینی و تمرین عملی از توضیح مفهومی برایم مفیدتر است." },

  { id: "n1", spectrum: "nature", reverse: false, text: "در تصمیم سخت، اول منطق و پیامد را می‌سنجم بعد احساسات افراد." },
  { id: "n2", spectrum: "nature", reverse: true, text: "اگر کسی ناراحت شود، حتی اگر حق با من باشد، مکث می‌کنم." },
  { id: "n3", spectrum: "nature", reverse: false, text: "نقد صریح را مهربان‌تر از تعارف مبهم می‌دانم." },
  { id: "n4", spectrum: "nature", reverse: true, text: "هماهنگی جمع برایم مهم‌تر از برنده شدن در بحث است." },
  { id: "n5", spectrum: "nature", reverse: false, text: "می‌توانم بدون درگیر شدن عاطفی، یک مسئله را کالبدشکافی کنم." },
  { id: "n6", spectrum: "nature", reverse: true, text: "فضای احساسی اتاق را زود حس می‌کنم و روی تصمیمم اثر می‌گذارد." },
  { id: "n7", spectrum: "nature", reverse: false, text: "عدالت برایم یعنی قاعده یکسان، نه استثنای دلسوزانه." },
  { id: "n8", spectrum: "nature", reverse: true, text: "وقتی کسی آسیب دیده، اول همدلی می‌کنم بعد راه‌حل." },
  { id: "n9", spectrum: "nature", reverse: false, text: "در تعارض، جدا کردن موضوع از شخص برایم نسبتاً آسان است." },
  { id: "n10", spectrum: "nature", reverse: true, text: "تعریف و تأیید کلامی دیگران انرژی‌ام را نگه می‌دارد." },
  { id: "n11", spectrum: "nature", reverse: false, text: "ترجیح می‌دهم تصمیم را با داده بگیرم حتی اگر محبوب نباشد." },
  { id: "n12", spectrum: "nature", reverse: true, text: "ارزش‌های انسانی افراد درگیر، وزن سنگینی در قضاوتم دارد." },

  { id: "t1", spectrum: "tactics", reverse: false, text: "لیست کار و مهلت مشخص به من احساس کنترل می‌دهد." },
  { id: "t2", spectrum: "tactics", reverse: true, text: "اگر برنامه ناگهان عوض شود، معمولاً سریع خودم را تطبیق می‌دهم." },
  { id: "t3", spectrum: "tactics", reverse: false, text: "دوست دارم تصمیم را ببندم و پرونده را تمام کنم." },
  { id: "t4", spectrum: "tactics", reverse: true, text: "باز نگه داشتن گزینه‌ها تا لحظه آخر برایم طبیعی است." },
  { id: "t5", spectrum: "tactics", reverse: false, text: "بی‌نظمی محیط کار تمرکزم را کم می‌کند." },
  { id: "t6", spectrum: "tactics", reverse: true, text: "کار را اغلب نزدیک موعد و با جهش نهایی تمام می‌کنم." },
  { id: "t7", spectrum: "tactics", reverse: false, text: "سفر را از قبل با جزئیات می‌چینم." },
  { id: "t8", spectrum: "tactics", reverse: true, text: "بهتر کار می‌کنم وقتی فضا برای بداهه باقی مانده باشد." },
  { id: "t9", spectrum: "tactics", reverse: false, text: "قوانین روشن را به improvise دائمی ترجیح می‌دهم." },
  { id: "t10", spectrum: "tactics", reverse: true, text: "شروع چند پروژه موازی بدون اتمام همه، برایم عادی است." },
  { id: "t11", spectrum: "tactics", reverse: false, text: "تقویم هفتگی‌ام معمولاً پر و از قبل مشخص است." },
  { id: "t12", spectrum: "tactics", reverse: true, text: "اگر ایده بهتری وسط کار بیاید، مسیر را عوض می‌کنم." },

  { id: "i1", spectrum: "identity", reverse: false, text: "بعد از اشتباه، نسبتاً سریع به کار برمی‌گردم و خودم را نمی‌کوبم." },
  { id: "i2", spectrum: "identity", reverse: true, text: "بازخورد منفی مدتی ذهنم را مشغول می‌کند." },
  { id: "i3", spectrum: "identity", reverse: false, text: "در موقعیت پرفشار معمولاً آرامش نسبی دارم." },
  { id: "i4", spectrum: "identity", reverse: true, text: "اغلب نگرانم کارم به اندازه کافی خوب نباشد." },
  { id: "i5", spectrum: "identity", reverse: false, text: "مقایسه خودم با دیگران کمتر حالم را خراب می‌کند." },
  { id: "i6", spectrum: "identity", reverse: true, text: "موفقیت دیگران گاهی حس عقب‌ماندن به من می‌دهد." },
  { id: "i7", spectrum: "identity", reverse: false, text: "تصمیم گرفته‌شده را کمتر دوم‌باره زیر سؤال می‌برم." },
  { id: "i8", spectrum: "identity", reverse: true, text: "قبل از ارسال کار، بارها بازبینی می‌کنم که چیزی از قلم نیفتد." },
  { id: "i9", spectrum: "identity", reverse: false, text: "تعریف دیگران خوشحال می‌کند اما برای ادامه کار ضروری نیست." },
  { id: "i10", spectrum: "identity", reverse: true, text: "نوسان خلق و انرژی‌ام در طول هفته کاملاً محسوس است." },
  { id: "i11", spectrum: "identity", reverse: false, text: "ریسک حساب‌شده را بدون اضطراب زیاد می‌پذیرم." },
  { id: "i12", spectrum: "identity", reverse: true, text: "اگر برنامه طبق میل پیش نرود، فشار درونی‌ام بالا می‌رود." },
];
