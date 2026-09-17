"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

type Payment = {
  id: string;
  amount: number;
  status: string;
  refId: string | null;
  product: { title: string } | null;
};

type Gift = { code: string; status: string };

export function SettingsClient({
  name,
  email,
  payments,
  gifts,
}: {
  name: string | null;
  email: string | null;
  payments: Payment[];
  gifts: Gift[];
}) {
  const router = useRouter();
  const search = useSearchParams();
  const payStatus = search.get("pay");
  const [giftCode, setGiftCode] = useState("");
  const [msg, setMsg] = useState("");

  async function redeem(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/gift/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: giftCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg("کد با موفقیت اعمال شد");
    setGiftCode("");
    if (data.href) {
      router.push(data.href);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <Link href="/dashboard" className="text-sm text-primary">
          داشبورد
        </Link>
      </div>
      {payStatus === "ok" ? (
        <Card className="mb-4 bg-primary/10 p-4 text-sm text-primary">
          <p className="mb-2 font-bold">پرداخت موفق بود.</p>
          {search.get("gift") === "1" ? (
            <p className="mb-3 text-xs leading-6">
              کد هدیه در همین صفحه ساخته شده است. برای فعال‌سازی گزارش، کد را
              در بخش «اعمال کد هدیه» وارد کنید.
            </p>
          ) : (
            <p className="mb-3 text-xs leading-6">
              بسته شما فعال شد. می‌توانید گزارش‌های خریداری‌شده را ببینید.
            </p>
          )}
          {search.get("gift") === "1" ? null : (
            <Link href="/reports">
              <Button className="w-full" size="md">
                مشاهده گزارش‌ها
              </Button>
            </Link>
          )}
        </Card>
      ) : null}
      {payStatus && payStatus !== "ok" ? (
        <Card className="mb-4 bg-amber-50 p-4 text-sm text-amber-800">
          وضعیت پرداخت: {payStatus}
        </Card>
      ) : null}
      <Card className="mb-4 p-6">
        <h1 className="mb-2 text-xl font-extrabold">تنظیمات</h1>
        <p className="text-sm text-text-secondary">نام: {name || "—"}</p>
        <p className="text-sm text-text-secondary">ایمیل: {email || "ثبت نشده"}</p>
      </Card>
      <Card className="mb-4 p-6">
        <h2 className="mb-3 font-bold">اعمال کد هدیه</h2>
        <form onSubmit={redeem} className="flex gap-2">
          <Input
            id="gift"
            dir="ltr"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
            placeholder="XXXX"
            className="flex-1"
          />
          <Button type="submit">اعمال</Button>
        </form>
        {msg ? <p className="mt-2 text-xs text-text-secondary">{msg}</p> : null}
        {gifts.length > 0 ? (
          <ul className="mt-4 space-y-1 text-xs">
            {gifts.map((g) => (
              <li key={g.code} dir="ltr">
                {g.code} — {g.status}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
      <Card className="p-6">
        <h2 className="mb-3 font-bold">تاریخچه پرداخت</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-text-secondary">پرداختی ثبت نشده.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="rounded-xl bg-neutral p-3">
                <p className="font-bold">{p.product?.title || "محصول"}</p>
                <p>
                  {p.amount.toLocaleString("fa-IR")} تومان — {p.status}
                </p>
                {p.refId ? (
                  <p className="text-xs" dir="ltr">
                    ref: {p.refId}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
