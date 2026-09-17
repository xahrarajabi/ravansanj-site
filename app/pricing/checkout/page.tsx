"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function CheckoutInner() {
  const search = useSearchParams();
  const router = useRouter();
  const product = search.get("product") || "";
  const from = search.get("from") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ownedHref, setOwnedHref] = useState("");

  async function pay() {
    setLoading(true);
    setError("");
    setOwnedHref("");
    try {
      const returnTo =
        product === "growth-path"
          ? "/growth-path"
          : from
            ? `/reports/${from}`
            : product === "comprehensive-report"
              ? "/reports"
              : undefined;
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: product, returnTo }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError(data.error || "این بسته قبلاً خریداری شده است");
        setOwnedHref(data.href || "/reports");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "خطا");
      window.location.href = data.data.paymentUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
      setLoading(false);
    }
  }

  if (!product) {
    return (
      <Card className="p-6">
        <p>محصولی انتخاب نشده.</p>
        <Link href="/pricing">
          <Button className="mt-4">بازگشت</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <p className="mb-1 text-xs font-bold text-primary">پرداخت امن</p>
      <h1 className="mb-2 text-xl font-bold text-text">تکمیل خرید</h1>
      <p className="mb-4 text-sm text-text-secondary">
        محصول: <span dir="ltr" className="font-semibold text-text">{product}</span>
      </p>
      {product === "gift-report" ? (
        <p className="mb-4 text-xs leading-6 text-text-secondary">
          این بسته یک کد هدیه می‌سازد. برای فعال‌سازی گزارش، کد را در تنظیمات
          اعمال کنید.
        </p>
      ) : (
        <p className="mb-4 rounded-2xl bg-primary-soft px-3 py-2 text-xs leading-6 text-text-secondary">
          اتصال امن به درگاه زرین‌پال. مبلغ نهایی پس از تأیید سمت سرور فعال می‌شود.
        </p>
      )}
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      {ownedHref ? (
        <Link href={ownedHref} className="mb-3 block">
          <Button variant="secondary" className="w-full">
            مشاهده محتوای خریداری‌شده
          </Button>
        </Link>
      ) : null}
      <div className="flex gap-2">
        <Button onClick={pay} disabled={loading || Boolean(ownedHref)} className="flex-1">
          {loading ? "..." : "پرداخت امن"}
        </Button>
        <Button variant="secondary" onClick={() => router.push("/pricing")}>
          انصراف
        </Button>
      </div>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <div className="page-shell soft-glow mx-auto flex min-h-screen max-w-md flex-col px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
      <Suspense>
        <CheckoutInner />
      </Suspense>
    </div>
  );
}
