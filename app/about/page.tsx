import { LandingFooter, LandingHeader } from "@/components/landing/LandingSections";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "درباره روان‌سنج" };

export default function AboutPage() {
  return (
    <div className="page-shell soft-glow min-h-screen">
      <LandingHeader />
      <main className="mx-auto max-w-2xl px-4 py-14">
        <Card className="p-8 md:p-10">
          <h1 className="mb-4 text-2xl font-bold text-text">درباره روان‌سنج</h1>
          <p className="mb-4 text-sm leading-8 text-text-secondary md:text-base">
            روان‌سنج یک پلتفرم حرفه‌ای ارزیابی و خودشناسی برای فارسی‌زبانان است.
            آزمون‌های ساخت‌یافته، گزارش‌های قابل‌فهم، دعوت اطرافیان و ابزارهای رشد را
            در تجربه‌ای آرام و متمرکز جمع کرده‌ایم.
          </p>
          <p className="text-sm leading-8 text-text-secondary md:text-base">
            هدف ما کمک به تصمیم‌گیری آگاهانه‌تر در کار، روابط و مسیر شخصی است —
            بدون ادعای تشخیص پزشکی یا جایگزینی درمان.
          </p>
        </Card>
      </main>
      <LandingFooter />
    </div>
  );
}
