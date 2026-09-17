import { LandingFooter, LandingHeader } from "@/components/landing/LandingSections";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "سوالات متداول" };

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="page-shell soft-glow min-h-screen">
      <LandingHeader />
      <main className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="mb-8 text-2xl font-bold text-text md:text-3xl">سوالات متداول</h1>
        <div className="flex flex-col gap-3">
          {items.map((f) => (
            <Card key={f.id} className="p-5">
              <h2 className="mb-2 font-bold text-text">{f.question}</h2>
              <p className="text-sm leading-7 text-text-secondary">{f.answer}</p>
            </Card>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
