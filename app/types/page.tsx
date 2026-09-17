import Link from "next/link";
import { ROLE_META, TYPES } from "@/lib/personality/types/catalog";
import { TypeAvatar } from "@/components/ui/TypeAvatar";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";

export default function TypesIndexPage() {
  return (
    <div className="page-shell soft-glow flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-text">۱۶ تیپ شخصیتی</h1>
        <p className="mb-8 text-muted">دانشنامهٔ کوتاه تیپ‌ها — برای آشنایی و مقایسه.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => {
            const role = ROLE_META[t.role];
            return (
              <Link
                key={t.code}
                href={`/types/${t.code.toLowerCase()}`}
                className="rounded-[var(--radius)] border border-line bg-card p-4 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-primary/35"
              >
                <TypeAvatar code={t.code} role={t.role} size={64} />
                <p className="mt-3 text-xs font-bold" style={{ color: role.color }}>
                  {role.title}
                </p>
                <h2 className="font-bold text-text">
                  {t.nickname}{" "}
                  <span className="text-sm text-muted">({t.code})</span>
                </h2>
                <p className="mt-2 line-clamp-3 text-xs leading-6 text-muted">{t.hook}</p>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
