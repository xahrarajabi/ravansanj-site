import Link from "next/link";
import { ARTICLES } from "@/lib/personality/articles";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-black text-primary">
            روان‌سنج
          </Link>
          <Link href="/personality" className="text-sm font-bold text-primary">
            آزمون
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-black">مقالات</h1>
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="block rounded-2xl bg-white p-5 shadow-sm"
          >
            <h2 className="font-bold">{a.title}</h2>
            <p className="mt-2 text-sm text-muted leading-7">{a.excerpt}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
