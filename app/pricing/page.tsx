import Link from "next/link";
import {
  LandingFooter,
  LandingHeader,
} from "@/components/landing/LandingSections";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getUnlockKeyFromProduct,
  hasCareer,
  hasFull,
  hrefForUnlockKey,
  userUnlockKeys,
  UNLOCK_KEYS,
} from "@/lib/access";

export const metadata = { title: "بسته‌ها و قیمت‌ها" };

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{
    unlock?: string;
    from?: string;
    product?: string;
  }>;
}) {
  const params = await searchParams;
  const highlightSlug =
    params.product ||
    (params.unlock === "comprehensive" ? "comprehensive-report" : "") ||
    (params.unlock === "growth_path" ? "growth-path" : "");
  const from = params.from || "";

  const session = await getSession();
  const unlockKeys = session ? await userUnlockKeys(session.userId) : new Set<string>();

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { priceToman: "asc" },
  });

  return (
    <div className="page-shell soft-glow min-h-screen">
      <LandingHeader loggedIn={Boolean(session)} />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="mb-2 text-center text-2xl font-bold text-text md:text-3xl">
          بسته‌ها و قیمت‌ها
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-7 text-text-secondary">
          آزمون پایه رایگان است. برای گزارش جامع، مسیر رشد و عمق شغلی می‌توانید
          بسته تهیه کنید. پرداخت امن از طریق زرین‌پال.
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const unlockKey = getUnlockKeyFromProduct(p);
            let owned = false;
            if (p.kind !== "gift" && unlockKey) {
              if (unlockKey === UNLOCK_KEYS.careerSuite) owned = hasCareer(unlockKeys);
              else if (unlockKey === UNLOCK_KEYS.fullSuite) owned = hasFull(unlockKeys);
              else owned = unlockKeys.has(unlockKey);
            }
            const checkoutQuery = new URLSearchParams({ product: p.slug });
            if (from) checkoutQuery.set("from", from);
            const highlighted = highlightSlug === p.slug;
            return (
              <Card
                key={p.id}
                className={`flex flex-col p-6 transition hover:-translate-y-0.5 ${
                  highlighted ? "border-primary ring-2 ring-primary/30" : ""
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-text">{p.title}</h2>
                  {owned ? <Badge tone="success">فعال</Badge> : <Badge tone="primary">پولی</Badge>}
                </div>
                <p className="mb-5 flex-1 text-sm leading-7 text-text-secondary">
                  {p.description}
                </p>
                <p className="mb-5 text-2xl font-bold text-primary">
                  {p.priceToman.toLocaleString("fa-IR")}{" "}
                  <span className="text-sm font-semibold text-muted">تومان</span>
                </p>
                {owned && unlockKey ? (
                  <Link href={hrefForUnlockKey(unlockKey)}>
                    <Button className="w-full" variant="secondary">
                      مشاهده محتوا
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/pricing/checkout?${checkoutQuery.toString()}`}>
                    <Button className="w-full">پرداخت امن</Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
