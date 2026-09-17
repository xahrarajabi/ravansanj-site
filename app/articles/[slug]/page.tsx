import Link from "next/link";
import { notFound } from "next/navigation";
import { articleBySlug } from "@/lib/personality/articles";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-black text-primary">
            روان‌سنج
          </Link>
          <Link href="/articles" className="text-sm text-muted">
            همه مقالات
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-black leading-relaxed">{article.title}</h1>
        {article.body.map((p) => (
          <p key={p} className="leading-8 text-muted">
            {p}
          </p>
        ))}
      </article>
    </div>
  );
}
