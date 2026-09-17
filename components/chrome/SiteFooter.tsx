import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-card/50 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-7 text-muted">
            پلتفرم حرفه‌ای ارزیابی و خودشناسی روان‌شناختی — برای شناخت بهتر خود،
            روابط و مسیر رشد.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-3 font-bold text-text">آزمون‌ها</p>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/personality" className="hover:text-primary">
                  تیپ شخصیت
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary">
                  آزمون‌های تخصصی
                </Link>
              </li>
              <li>
                <Link href="/types" className="hover:text-primary">
                  دانشنامه تیپ‌ها
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-text">راهنما</p>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/about" className="hover:text-primary">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-primary">
                  مقالات
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-text">خدمات</p>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/pricing" className="hover:text-primary">
                  بسته‌ها و قیمت‌ها
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary">
                  ورود
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-line pt-6 text-center text-xs leading-6 text-muted">
        <p>
          روان‌سنج ابزاری آموزشی برای خودشناسی است و جایگزین مشاوره روانشناسی،
          روان‌پزشکی یا تشخیص و درمان پزشکی نیست.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} روان‌سنج</p>
      </div>
    </footer>
  );
}
