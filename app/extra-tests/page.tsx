import Link from "next/link";
import { EXTRA_TESTS } from "@/lib/personality/extra-tests";

export default function ExtraTestsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-black text-primary">
            روان‌سنج
          </Link>
          <Link href="/personality" className="text-sm font-bold text-primary">
            آزمون اصلی
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-black">آزمون‌های کوتاه اضافی</h1>
        <p className="text-sm text-muted">رایگان — برای خودشناسی سریع، نه تشخیص.</p>
        {EXTRA_TESTS.map((t) => (
          <div key={t.slug} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-bold">{t.title}</h2>
            <p className="mt-2 text-sm text-muted leading-7">{t.description}</p>
            <p className="mt-3 text-xs text-muted">
              {t.questions.length} سؤال — رابط تعاملی کامل در نسخه بعدی؛ فعلاً محتوای آزمون آماده است.
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
