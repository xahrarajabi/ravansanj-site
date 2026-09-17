import Link from "next/link";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PersonalityLandingPage() {
  return (
    <div className="page-shell soft-glow flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-14 text-center">
        <p className="mb-3 text-sm font-bold text-primary">آزمون رایگان شخصیت</p>
        <h1 className="mb-4 text-3xl font-bold leading-relaxed text-text md:text-4xl">
          تیپ شخصیتی‌تان را بشناسید
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-8 text-text-secondary">
          حدود ۶۰ سؤال کوتاه، بدون نیاز به ورود. نتیجهٔ ۱۶ تیپ با نمودار ترجیح‌ها —
          زبانی آرام و حرفه‌ای برای خودشناسی.
        </p>
        <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/personality/test">
            <Button size="lg">شروع آزمون رایگان</Button>
          </Link>
          <Link href="/types">
            <Button size="lg" variant="secondary">
              دانشنامه ۱۶ تیپ
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 text-right md:grid-cols-3">
          {[
            { t: "مهمان‌محور", d: "بدون ثبت‌نام شروع کنید؛ بعداً حساب بسازید." },
            { t: "نتیجهٔ فوری", d: "تیپ، طیف‌ها و پیشنهادهای کاربردی." },
            { t: "عمق بیشتر", d: "فصل‌های شغلی و مسیر رشد با بستهٔ پولی." },
          ].map((x) => (
            <Card key={x.t} className="p-5">
              <h2 className="mb-2 font-bold text-text">{x.t}</h2>
              <p className="text-sm leading-7 text-muted">{x.d}</p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
